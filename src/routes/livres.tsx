import { createFileRoute } from "@tanstack/react-router";
import { ModuleSoon } from "@/components/studio/AppShell";

export const Route = createFileRoute("/livres")({
  head: () => ({
    meta: [
      { title: "Livres de coloriage · L&M Studio Factory" },
      { name: "description", content: "Production des livres page par page." },
      { property: "og:title", content: "Livres de coloriage · L&M Studio Factory" },
      { property: "og:description", content: "Production des livres page par page." },
    ],
  }),
  component: () => <ModuleSoon title="Livres de coloriage" description="Production des livres page par page." items={[]} />,
});
