import JSZip from "jszip";
import { db, notify } from "./db";
import type { StoredFile } from "./types";

/** Export complet : data.json (toutes les fiches) + dossier fichiers/ avec les originaux. */
export async function exportAll() {
  const d = await db();
  const [meta, collections, characters, books, pages, files] = await Promise.all([
    d.getAll("meta"),
    d.getAll("collections"),
    d.getAll("characters"),
    d.getAll("books"),
    d.getAll("pages"),
    d.getAll("files"),
  ]);
  const zip = new JSZip();
  const fileIndex = files.map(({ blob: _b, ...rest }) => ({ ...rest, path: `fichiers/${rest.id}_${rest.name}` }));
  zip.file(
    "data.json",
    JSON.stringify(
      { app: "L&M Studio Factory", version: 1, exportedAt: new Date().toISOString(), meta, collections, characters, books, pages, files: fileIndex },
      null,
      2,
    ),
  );
  zip.file(
    "LISEZ-MOI.txt",
    "Export L&M Studio Factory.\n- data.json : collections, personnages, direction artistique, livres, pages, prompts, commentaires, statuts et historique (format JSON lisible).\n- fichiers/ : toutes les images et PDF, nommés <identifiant>_<nom d'origine>.\nLe champ fileId de chaque version de page renvoie à un fichier de ce dossier.\n",
  );
  for (const f of files) zip.file(`fichiers/${f.id}_${f.name}`, f.blob);
  return zip.generateAsync({ type: "blob", compression: "STORE" });
}

/** Restaure un export (remplace les données actuelles). */
export async function importAll(zipFile: File) {
  const zip = await JSZip.loadAsync(zipFile);
  const raw = await zip.file("data.json")?.async("string");
  if (!raw) throw new Error("data.json introuvable dans l'archive");
  const data = JSON.parse(raw);
  const d = await db();
  const stores = ["meta", "collections", "characters", "books", "pages", "files"] as const;
  for (const s of stores) await d.clear(s);
  for (const m of data.meta ?? []) await d.put("meta", m);
  for (const s of ["collections", "characters", "books", "pages"] as const)
    for (const row of data[s] ?? []) await d.put(s, row);
  for (const f of data.files ?? []) {
    const entry = zip.file(f.path);
    if (!entry) continue;
    const blob = new Blob([await entry.async("arraybuffer")], { type: f.mime });
    const { path: _p, ...rest } = f;
    await d.put("files", { ...(rest as Omit<StoredFile, "blob">), blob });
  }
  notify();
}

export async function storageUsage() {
  if (typeof navigator === "undefined" || !navigator.storage?.estimate) return undefined;
  return navigator.storage.estimate();
}
