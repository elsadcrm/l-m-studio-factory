import { createFileRoute } from "@tanstack/react-router";
import { ModuleSoon } from "@/components/studio/AppShell";

export const Route = createFileRoute("/diffusion")({
  head: () => ({
    meta: [
      { title: "Diffusion et plateformes · L&M Studio Factory" },
      { name: "description", content: "Fiches des plateformes de vente et d'impression." },
      { property: "og:title", content: "Diffusion et plateformes · L&M Studio Factory" },
      { property: "og:description", content: "Fiches des plateformes de vente et d'impression." },
    ],
  }),
  component: () => <ModuleSoon title="Diffusion et plateformes" description="Fiches des plateformes de vente et d'impression." items={["Amazon KDP", "Etsy", "Imprimeurs", "Aucune connexion automatique sans votre accord"]} />,
});
