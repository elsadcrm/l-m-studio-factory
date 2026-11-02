import { createFileRoute } from "@tanstack/react-router";
import { ModuleSoon } from "@/components/studio/AppShell";

export const Route = createFileRoute("/papeterie")({
  head: () => ({
    meta: [
      { title: "Papeterie & Stickers · L&M Studio Factory" },
      { name: "description", content: "Stickers, marque-pages, cartes, affiches et papeterie." },
      { property: "og:title", content: "Papeterie & Stickers · L&M Studio Factory" },
      { property: "og:description", content: "Stickers, marque-pages, cartes, affiches et papeterie." },
    ],
  }),
  component: () => <ModuleSoon title="Papeterie & Stickers" description="Stickers, marque-pages, cartes, affiches et papeterie." items={["Stickers", "Marque-pages", "Cartes", "Affiches", "Papeterie"]} />,
});
