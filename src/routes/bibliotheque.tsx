import { createFileRoute } from "@tanstack/react-router";
import { ModuleSoon } from "@/components/studio/AppShell";

export const Route = createFileRoute("/bibliotheque")({
  head: () => ({
    meta: [
      { title: "Bibliothèque de fichiers · L&M Studio Factory" },
      { name: "description", content: "Tous les fichiers du studio." },
      { property: "og:title", content: "Bibliothèque de fichiers · L&M Studio Factory" },
      { property: "og:description", content: "Tous les fichiers du studio." },
    ],
  }),
  component: () => <ModuleSoon title="Bibliothèque de fichiers" description="Tous les fichiers du studio." items={[]} />,
});
