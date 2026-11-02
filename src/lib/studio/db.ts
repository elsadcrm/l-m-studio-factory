import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import { useEffect, useState } from "react";
import type {
  Book,
  BookPage,
  Character,
  Collection,
  DirectionArtistique,
  StoredFile,
} from "./types";

/**
 * Stockage local (IndexedDB du navigateur) : gratuit, hors ligne, sans fournisseur.
 * Toutes les lectures/écritures passent par ce module : il pourra être remplacé
 * par un stockage en ligne sans toucher aux écrans.
 */
interface StudioDB extends DBSchema {
  meta: { key: string; value: DirectionArtistique | { id: string; value: unknown } };
  collections: { key: string; value: Collection };
  characters: { key: string; value: Character };
  books: { key: string; value: Book };
  pages: { key: string; value: BookPage; indexes: { byBook: string } };
  files: { key: string; value: StoredFile; indexes: { byBook: string } };
}

export type StoreName = "collections" | "characters" | "books" | "pages" | "files";

let dbPromise: Promise<IDBPDatabase<StudioDB>> | null = null;
export function db() {
  if (!dbPromise) {
    dbPromise = openDB<StudioDB>("lm-studio-factory", 1, {
      upgrade(d) {
        d.createObjectStore("meta", { keyPath: "id" });
        d.createObjectStore("collections", { keyPath: "id" });
        d.createObjectStore("characters", { keyPath: "id" });
        d.createObjectStore("books", { keyPath: "id" });
        d.createObjectStore("pages", { keyPath: "id" }).createIndex("byBook", "bookId");
        d.createObjectStore("files", { keyPath: "id" }).createIndex("byBook", "bookId");
      },
    });
  }
  return dbPromise;
}

const listeners = new Set<() => void>();
export function notify() {
  listeners.forEach((l) => l());
}

export function uid() {
  return crypto.randomUUID();
}

/** Recharge automatiquement quand les données changent. */
export function useStudio<T>(loader: () => Promise<T>, deps: unknown[] = []): T | undefined {
  const [value, setValue] = useState<T>();
  useEffect(() => {
    let alive = true;
    const run = () => loader().then((v) => alive && setValue(v));
    run();
    listeners.add(run);
    return () => {
      alive = false;
      listeners.delete(run);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return value;
}

export async function getAll<S extends StoreName>(store: S) {
  return (await db()).getAll(store) as Promise<StudioDB[S]["value"][]>;
}
export async function getOne<S extends StoreName>(store: S, id: string) {
  return (await db()).get(store, id) as Promise<StudioDB[S]["value"] | undefined>;
}
export async function put<S extends StoreName>(store: S, value: StudioDB[S]["value"]) {
  await (await db()).put(store, value as never);
  notify();
}
export async function remove(store: StoreName, id: string) {
  await (await db()).delete(store, id);
  notify();
}
export async function pagesOf(bookId: string) {
  const list = await (await db()).getAllFromIndex("pages", "byBook", bookId);
  return list.sort((a, b) => a.order - b.order);
}

export async function getDirection(): Promise<DirectionArtistique> {
  const d = (await (await db()).get("meta", "direction")) as DirectionArtistique | undefined;
  return d ?? DEFAULT_DIRECTION;
}
export async function saveDirection(d: DirectionArtistique) {
  await (await db()).put("meta", { ...d, updatedAt: Date.now() });
  notify();
}

export const DEFAULT_DIRECTION: DirectionArtistique = {
  id: "direction",
  style: "Kawaii japonais contemporain, cozy, doux et élégant, jamais infantile.",
  trait: "Contours noirs nets et fermés, épaisseur régulière, grandes zones à colorier, pas de niveaux de gris.",
  palette: "Rose poudré, pêche, lavande, jaune beurre, vert sauge, crème, brun cacao.",
  regles: "Fond blanc pur. Composition aérée. Détails lisibles à l'impression.",
  interdits: "Texte dans l'image, ombrages gris, hachures fines, filigranes.",
  updatedAt: 0,
};

export async function saveFile(file: StoredFile) {
  await put("files", file);
  return file;
}

export function readImageSize(blob: Blob): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => reject(new Error("Image illisible"));
    img.src = url;
  });
}

/** URL d'affichage mise en cache pour un fichier stocké. */
const urlCache = new Map<string, string>();
export function useFileUrl(fileId?: string) {
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    if (!fileId) return setUrl(undefined);
    const cached = urlCache.get(fileId);
    if (cached) return setUrl(cached);
    let alive = true;
    db()
      .then((d) => d.get("files", fileId))
      .then((f) => {
        if (!f || !alive) return;
        const u = URL.createObjectURL(f.blob);
        urlCache.set(fileId, u);
        setUrl(u);
      });
    return () => {
      alive = false;
    };
  }, [fileId]);
  return url;
}

const SEED_COLLECTIONS: [string, string, Collection["couleur"]][] = [
  ["Boo's Cozy World", "L'univers douillet de Boo : maison, thé, plaids et petits rituels.", "rose"],
  ["L&M Cozy Patterns", "Motifs répétitifs doux pour coloriage et papeterie.", "lavender"],
  ["L&M Cozy Textures", "Textures graphiques : tricot, papier, nature.", "sage"],
  ["Little Seasons", "Les petites saisons japonaises, de la floraison aux premières neiges.", "peach"],
  ["Kawaii Everyday", "Objets et scènes du quotidien rendus kawaii.", "butter"],
  ["Cozy Afternoon", "Goûters, cafés, lecture et après-midis tranquilles.", "peach"],
  ["Spooky but Cute", "Halloween tendre : fantômes, citrouilles et sorcières mignonnes.", "lavender"],
];

export async function ensureSeed() {
  const d = await db();
  if ((await d.count("collections")) > 0) return;
  const now = Date.now();
  for (const [i, [name, univers, couleur]] of SEED_COLLECTIONS.entries()) {
    await d.put("collections", { id: uid(), name, univers, couleur, createdAt: now + i });
  }
  const base = { referenceFileIds: [], createdAt: now };
  await d.put("characters", {
    ...base,
    id: uid(),
    name: "Boo",
    physique: "À compléter",
    personnalite: "À compléter",
    vetements: "",
    accessoires: "",
    couleurs: "",
    invariants: "",
    expressions: "",
    poses: "",
  });
  await d.put("characters", {
    ...base,
    id: uid(),
    name: "Rosa Pouce",
    createdAt: now + 1,
    physique: "À compléter",
    personnalite: "À compléter",
    vetements: "",
    accessoires: "",
    couleurs: "",
    invariants: "",
    expressions: "",
    poses: "",
  });
  notify();
}
