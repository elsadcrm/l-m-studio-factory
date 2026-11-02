export type PageStatus = "a_generer" | "a_verifier" | "validee" | "a_corriger" | "refusee";

export const STATUS_LABEL: Record<PageStatus, string> = {
  a_generer: "À générer",
  a_verifier: "À vérifier",
  validee: "Validée",
  a_corriger: "À corriger",
  refusee: "Refusée",
};

export type FormatKind = "carre" | "a4" | "a5" | "perso";

export interface BookFormat {
  kind: FormatKind;
  widthMm: number;
  heightMm: number;
}

export interface DirectionArtistique {
  id: "direction";
  style: string;
  trait: string;
  palette: string;
  regles: string;
  interdits: string;
  updatedAt: number;
}

export interface Collection {
  id: string;
  name: string;
  univers: string;
  couleur: "rose" | "peach" | "lavender" | "butter" | "sage";
  createdAt: number;
}

export interface Character {
  id: string;
  name: string;
  physique: string;
  personnalite: string;
  vetements: string;
  accessoires: string;
  couleurs: string;
  invariants: string;
  expressions: string;
  poses: string;
  referenceFileIds: string[];
  createdAt: number;
}

export interface Book {
  id: string;
  title: string;
  collectionId: string;
  univers: string;
  pageCount: number;
  format: BookFormat;
  contentType: string;
  consignes: string;
  characterIds: string[];
  bleedMm: number;
  safeMarginMm: number;
  placement: "fond_perdu" | "marges";
  printerId: string;
  createdAt: number;
}

export interface PageVersion {
  id: string;
  fileId: string;
  widthPx: number;
  heightPx: number;
  prompt: string;
  createdAt: number;
}

export interface PageNote {
  id: string;
  at: number;
  kind: "commentaire" | "correction";
  text: string;
  versionId?: string;
}

export interface PageEvent {
  at: number;
  action: string;
  versionId?: string;
}

export interface BookPage {
  id: string;
  bookId: string;
  order: number;
  theme: string;
  prompt: string;
  status: PageStatus;
  versions: PageVersion[];
  validatedVersionId?: string;
  notes: PageNote[];
  history: PageEvent[];
}

export type FileKind =
  | "original"
  | "page"
  | "couverture"
  | "pdf"
  | "fabricant"
  | "reference";

export const FILE_KIND_LABEL: Record<FileKind, string> = {
  original: "Image originale",
  page: "Page de livre",
  couverture: "Couverture",
  pdf: "PDF terminé",
  fabricant: "Fichier fabricant",
  reference: "Référence graphique",
};

export interface StoredFile {
  id: string;
  name: string;
  mime: string;
  kind: FileKind;
  blob: Blob;
  size: number;
  widthPx?: number;
  heightPx?: number;
  bookId?: string;
  pageId?: string;
  collectionId?: string;
  characterId?: string;
  createdAt: number;
}

export interface PrinterProfile {
  id: string;
  name: string;
  bleedMm: number;
  safeMarginMm: number;
  /** épaisseur d'une feuille (2 pages) ou par page, en mm, selon le papier */
  papers: { id: string; label: string; mmPerPage: number }[];
  verified: boolean;
  notes: string;
}
