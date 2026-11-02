import { cn } from "@/lib/utils";
import { STATUS_LABEL, type PageStatus } from "@/lib/studio/types";
import type { ResolutionLevel } from "@/lib/studio/print";

const STATUS_CLASS: Record<PageStatus, string> = {
  a_generer: "bg-muted text-muted-foreground",
  a_verifier: "bg-butter text-cocoa",
  validee: "bg-sage text-cocoa",
  a_corriger: "bg-peach text-cocoa",
  refusee: "bg-destructive text-destructive-foreground",
};

export function StatusBadge({ status, className }: { status: PageStatus; className?: string }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold", STATUS_CLASS[status], className)}>
      {STATUS_LABEL[status]}
    </span>
  );
}

const RES_CLASS: Record<ResolutionLevel, string> = {
  ok: "bg-sage text-cocoa",
  faible: "bg-warning text-cocoa",
  insuffisante: "bg-destructive text-destructive-foreground",
};
const RES_LABEL: Record<ResolutionLevel, string> = {
  ok: "Résolution OK",
  faible: "Résolution faible",
  insuffisante: "Résolution insuffisante",
};

export function ResolutionBadge({ level, dpi }: { level: ResolutionLevel; dpi: number }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold", RES_CLASS[level])}>
      {RES_LABEL[level]} · {dpi} ppp
    </span>
  );
}
