import type { Book, BookFormat, FormatKind, PrinterProfile } from "./types";

export const MM_PER_INCH = 25.4;
export const MIN_DPI = 300;
export const WARN_DPI = 200;

export const FORMAT_PRESETS: Record<Exclude<FormatKind, "perso">, { label: string; widthMm: number; heightMm: number }> = {
  carre: { label: "Carré 21,59 × 21,59 cm (8,5 × 8,5 po)", widthMm: 215.9, heightMm: 215.9 },
  a4: { label: "A4 21 × 29,7 cm", widthMm: 210, heightMm: 297 },
  a5: { label: "A5 14,8 × 21 cm", widthMm: 148, heightMm: 210 },
};

/** Zone (en mm) dans laquelle l'illustration est placée sur la page imprimée. */
export function placementBox(book: Pick<Book, "format" | "bleedMm" | "safeMarginMm" | "placement">) {
  const { widthMm, heightMm } = book.format;
  if (book.placement === "fond_perdu") {
    return { widthMm: widthMm + 2 * book.bleedMm, heightMm: heightMm + 2 * book.bleedMm };
  }
  return { widthMm: widthMm - 2 * book.safeMarginMm, heightMm: heightMm - 2 * book.safeMarginMm };
}

export type ResolutionLevel = "ok" | "faible" | "insuffisante";

export interface ResolutionCheck {
  effectiveDpi: number;
  level: ResolutionLevel;
  requiredPx: { width: number; height: number };
  /** écart de proportions entre l'image et la zone, en % */
  ratioGapPct: number;
  placedMm: { width: number; height: number };
  scalePct: number;
}

/**
 * Résolution effective : pixels réels / taille physique imprimée après
 * redimensionnement (l'image est ajustée pour tenir dans la zone sans être rognée).
 * Les métadonnées DPI du fichier sont volontairement ignorées.
 */
export function checkResolution(
  widthPx: number,
  heightPx: number,
  box: { widthMm: number; heightMm: number },
): ResolutionCheck {
  const boxWIn = box.widthMm / MM_PER_INCH;
  const boxHIn = box.heightMm / MM_PER_INCH;
  // pouces par pixel une fois ajustée (contain)
  const inPerPx = Math.min(boxWIn / widthPx, boxHIn / heightPx);
  const effectiveDpi = Math.floor(1 / inPerPx);
  const placedW = widthPx * inPerPx * MM_PER_INCH;
  const placedH = heightPx * inPerPx * MM_PER_INCH;
  const imgRatio = widthPx / heightPx;
  const boxRatio = box.widthMm / box.heightMm;
  const ratioGapPct = Math.round((Math.abs(imgRatio - boxRatio) / boxRatio) * 1000) / 10;
  const level: ResolutionLevel =
    effectiveDpi >= MIN_DPI ? "ok" : effectiveDpi >= WARN_DPI ? "faible" : "insuffisante";
  // facteur d'agrandissement par rapport à une impression native à 300 ppp
  const scalePct = Math.round((MIN_DPI / effectiveDpi) * 100);
  return {
    effectiveDpi,
    level,
    requiredPx: { width: Math.ceil(boxWIn * MIN_DPI), height: Math.ceil(boxHIn * MIN_DPI) },
    ratioGapPct,
    placedMm: { width: Math.round(placedW * 10) / 10, height: Math.round(placedH * 10) / 10 },
    scalePct,
  };
}

export function formatFromKind(kind: FormatKind, custom?: { widthMm: number; heightMm: number }): BookFormat {
  if (kind === "perso") return { kind, widthMm: custom?.widthMm ?? 200, heightMm: custom?.heightMm ?? 200 };
  const p = FORMAT_PRESETS[kind];
  return { kind, widthMm: p.widthMm, heightMm: p.heightMm };
}

/**
 * Gabarit de couverture (1re + dos + 4e), calculé à partir du profil prestataire.
 * La conformité n'est affirmée que si le profil est marqué comme vérifié.
 */
export function coverTemplate(
  book: Pick<Book, "format" | "pageCount">,
  printer: PrinterProfile,
  paperId: string,
) {
  const paper = printer.papers.find((p) => p.id === paperId) ?? printer.papers[0];
  const spineMm = Math.round(book.pageCount * paper.mmPerPage * 100) / 100;
  const widthMm = 2 * book.format.widthMm + spineMm + 2 * printer.bleedMm;
  const heightMm = book.format.heightMm + 2 * printer.bleedMm;
  return {
    spineMm,
    widthMm: Math.round(widthMm * 100) / 100,
    heightMm: Math.round(heightMm * 100) / 100,
    bleedMm: printer.bleedMm,
    safeMarginMm: printer.safeMarginMm,
    paperLabel: paper.label,
    conforme: printer.verified,
  };
}

export const PRINTERS: PrinterProfile[] = [
  {
    id: "generique",
    name: "Profil générique (à vérifier)",
    bleedMm: 3.175,
    safeMarginMm: 6.35,
    papers: [
      { id: "blanc", label: "Papier blanc (valeur indicative 0,0572 mm/page)", mmPerPage: 0.0572 },
      { id: "creme", label: "Papier crème (valeur indicative 0,0635 mm/page)", mmPerPage: 0.0635 },
    ],
    verified: false,
    notes:
      "Valeurs indicatives inspirées des pratiques courantes. Elles doivent être comparées à la documentation officielle du prestataire avant toute commande.",
  },
];
