import { PDFDocument } from "pdf-lib";
import { getOne, saveFile, uid } from "./db";
import { checkResolution, MM_PER_INCH, placementBox } from "./print";
import type { Book, BookPage } from "./types";

const PT_PER_MM = 72 / MM_PER_INCH;

export interface AssemblyIssue {
  pageNumber: number;
  message: string;
  blocking: boolean;
}

/** Contrôles avant assemblage. Aucune page non validée n'est jamais intégrée. */
export function preflight(book: Book, pages: BookPage[]): AssemblyIssue[] {
  const issues: AssemblyIssue[] = [];
  const box = placementBox(book);
  pages.forEach((p, i) => {
    const n = i + 1;
    const v = p.versions.find((x) => x.id === p.validatedVersionId);
    if (p.status !== "validee" || !v) {
      issues.push({ pageNumber: n, message: "Page non validée", blocking: true });
      return;
    }
    const r = checkResolution(v.widthPx, v.heightPx, box);
    if (r.level === "insuffisante")
      issues.push({ pageNumber: n, message: `Résolution insuffisante (${r.effectiveDpi} ppp)`, blocking: true });
    else if (r.level === "faible")
      issues.push({ pageNumber: n, message: `Résolution faible (${r.effectiveDpi} ppp, 300 conseillés)`, blocking: false });
    if (r.ratioGapPct > 2)
      issues.push({
        pageNumber: n,
        message: `Proportions différentes du format (${r.ratioGapPct} %) : des bandes blanches apparaîtront`,
        blocking: false,
      });
  });
  return issues;
}

async function toEmbeddable(blob: Blob): Promise<{ bytes: Uint8Array; kind: "png" | "jpg" }> {
  if (blob.type === "image/png") return { bytes: new Uint8Array(await blob.arrayBuffer()), kind: "png" };
  if (blob.type === "image/jpeg") return { bytes: new Uint8Array(await blob.arrayBuffer()), kind: "jpg" };
  const bmp = await createImageBitmap(blob);
  const c = document.createElement("canvas");
  c.width = bmp.width;
  c.height = bmp.height;
  c.getContext("2d")!.drawImage(bmp, 0, 0);
  const png = await new Promise<Blob>((r) => c.toBlob((b) => r(b!), "image/png"));
  return { bytes: new Uint8Array(await png.arrayBuffer()), kind: "png" };
}

/** Génère le PDF intérieur : format + fond perdu, pages dans l'ordre, versions validées uniquement. */
export async function assembleInterior(book: Book, pages: BookPage[]) {
  if (preflight(book, pages).some((i) => i.blocking)) throw new Error("Des contrôles bloquants ne sont pas résolus.");
  const pdf = await PDFDocument.create();
  pdf.setTitle(book.title);
  pdf.setCreator("L&M Studio Factory");
  pdf.setProducer("L&M Studio Factory");
  const bleed = book.bleedMm * PT_PER_MM;
  const trimW = book.format.widthMm * PT_PER_MM;
  const trimH = book.format.heightMm * PT_PER_MM;
  const pageW = trimW + 2 * bleed;
  const pageH = trimH + 2 * bleed;
  const box = placementBox(book);
  const boxW = box.widthMm * PT_PER_MM;
  const boxH = box.heightMm * PT_PER_MM;

  for (const p of pages) {
    const v = p.versions.find((x) => x.id === p.validatedVersionId)!;
    const f = await getOne("files", v.fileId);
    if (!f) throw new Error(`Fichier manquant pour la page ${p.order + 1}`);
    const { bytes, kind } = await toEmbeddable(f.blob);
    const img = kind === "png" ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
    const page = pdf.addPage([pageW, pageH]);
    page.setBleedBox(0, 0, pageW, pageH);
    page.setTrimBox(bleed, bleed, trimW, trimH);
    const scale = Math.min(boxW / img.width, boxH / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    page.drawImage(img, { x: (pageW - w) / 2, y: (pageH - h) / 2, width: w, height: h });
  }
  const bytes = await pdf.save();
  const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
  const name = `${book.title.replace(/[^\p{L}\p{N}]+/gu, "_")}_interieur.pdf`;
  await saveFile({
    id: uid(),
    name,
    mime: "application/pdf",
    kind: "pdf",
    blob,
    size: blob.size,
    bookId: book.id,
    collectionId: book.collectionId,
    createdAt: Date.now(),
  });
  return { blob, name };
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}
