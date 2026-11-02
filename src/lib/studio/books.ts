import { getAll, getDirection, getOne, pagesOf, put, saveFile, uid, readImageSize, remove } from "./db";
import type { Book, BookPage, Character, PageStatus } from "./types";

export function characterBlock(c: Character) {
  const parts = [
    ["Apparence", c.physique],
    ["Vêtements", c.vetements],
    ["Accessoires", c.accessoires],
    ["Couleurs", c.couleurs],
    ["Invariants à respecter", c.invariants],
  ].filter(([, v]) => v && v !== "À compléter");
  return parts.length ? `${c.name} — ${parts.map(([k, v]) => `${k} : ${v}`).join(" ; ")}` : c.name;
}

/** Compose le prompt d'une page : direction artistique + collection + personnages + consignes + corrections. */
export async function composePrompt(book: Book, page: Pick<BookPage, "theme" | "notes">, includeCorrections = true) {
  const dir = await getDirection();
  const col = book.collectionId ? await getOne("collections", book.collectionId) : undefined;
  const chars = (await getAll("characters")).filter((c) => book.characterIds.includes(c.id));
  const corrections = includeCorrections
    ? page.notes.filter((n) => n.kind === "correction").map((n) => `- ${n.text}`)
    : [];
  return [
    `Page de livre de coloriage : ${page.theme || "sujet à préciser"}.`,
    `Style : ${dir.style}`,
    `Trait : ${dir.trait}`,
    dir.regles && `Règles : ${dir.regles}`,
    col && `Collection « ${col.name} » : ${col.univers}`,
    book.univers && `Univers : ${book.univers}`,
    chars.length > 0 && `Personnages : ${chars.map(characterBlock).join(" | ")}`,
    book.consignes && `Consignes du livre : ${book.consignes}`,
    corrections.length > 0 && `Corrections demandées :\n${corrections.join("\n")}`,
    dir.interdits && `À éviter : ${dir.interdits}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function createBook(book: Omit<Book, "id" | "createdAt">) {
  const b: Book = { ...book, id: uid(), createdAt: Date.now() };
  await put("books", b);
  for (let i = 0; i < b.pageCount; i++) {
    const page: BookPage = {
      id: uid(),
      bookId: b.id,
      order: i,
      theme: "",
      prompt: "",
      status: "a_generer",
      versions: [],
      notes: [],
      history: [{ at: Date.now(), action: "Page créée" }],
    };
    page.prompt = await composePrompt(b, page);
    await put("pages", page);
  }
  return b;
}

export async function deleteBook(bookId: string) {
  for (const p of await pagesOf(bookId)) await remove("pages", p.id);
  await remove("books", bookId);
}

export async function importVersion(book: Book, page: BookPage, file: File) {
  const size = await readImageSize(file);
  const stored = await saveFile({
    id: uid(),
    name: file.name,
    mime: file.type || "image/png",
    kind: "original",
    blob: file,
    size: file.size,
    widthPx: size.width,
    heightPx: size.height,
    bookId: book.id,
    pageId: page.id,
    collectionId: book.collectionId,
    createdAt: Date.now(),
  });
  const version = {
    id: uid(),
    fileId: stored.id,
    widthPx: size.width,
    heightPx: size.height,
    prompt: page.prompt,
    createdAt: Date.now(),
  };
  const next: BookPage = {
    ...page,
    versions: [...page.versions, version],
    validatedVersionId: undefined,
    status: "a_verifier",
    history: [
      ...page.history,
      { at: Date.now(), action: `Version ${page.versions.length + 1} importée (${file.name})`, versionId: version.id },
    ],
  };
  await put("pages", next);
  return next;
}

export async function setStatus(page: BookPage, status: PageStatus, versionId?: string, note?: string) {
  const labels: Record<PageStatus, string> = {
    a_generer: "Régénération demandée",
    a_verifier: "Remise à vérifier",
    validee: "Validée",
    a_corriger: "Correction demandée",
    refusee: "Refusée",
  };
  const notes = [...page.notes];
  if (note?.trim()) {
    notes.push({
      id: uid(),
      at: Date.now(),
      kind: status === "a_corriger" || status === "a_generer" ? "correction" : "commentaire",
      text: note.trim(),
      versionId,
    });
  }
  const next: BookPage = {
    ...page,
    status,
    notes,
    validatedVersionId: status === "validee" ? versionId : undefined,
    history: [...page.history, { at: Date.now(), action: labels[status], versionId }],
  };
  await put("pages", next);
  return next;
}

export async function addComment(page: BookPage, text: string, versionId?: string) {
  await put("pages", {
    ...page,
    notes: [...page.notes, { id: uid(), at: Date.now(), kind: "commentaire", text, versionId }],
  });
}

export async function movePage(bookId: string, pageId: string, dir: -1 | 1) {
  const pages = await pagesOf(bookId);
  const i = pages.findIndex((p) => p.id === pageId);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= pages.length) return;
  const a = pages[i]!;
  const b = pages[j]!;
  await put("pages", { ...a, order: b.order });
  await put("pages", { ...b, order: a.order });
}

export function bookProgress(pages: BookPage[]) {
  const total = pages.length;
  const count = (s: PageStatus) => pages.filter((p) => p.status === s).length;
  const validated = count("validee");
  return {
    total,
    validated,
    toReview: count("a_verifier"),
    toFix: count("a_corriger"),
    toGenerate: count("a_generer"),
    refused: count("refusee"),
    pct: total ? Math.round((validated / total) * 100) : 0,
    complete: total > 0 && validated === total,
  };
}
