import { createFileRoute } from "@tanstack/react-router";
import { ModuleSoon } from "@/components/studio/AppShell";

export const Route = createFileRoute("/kits")({
  head: () => ({
    meta: [
      { title: "Creative Kits · L&M Studio Factory" },
      { name: "description", content: "Coffrets créatifs assemblant plusieurs produits." },
      { property: "og:title", content: "Creative Kits · L&M Studio Factory" },
      { property: "og:description", content: "Coffrets créatifs assemblant plusieurs produits." },
    ],
  }),
  component: () => <ModuleSoon title="Creative Kits" description="Coffrets créatifs assemblant plusieurs produits." items={["Composition du kit", "Contenu", "Fiche fabricant"]} />,
});
