import { createFileRoute } from "@tanstack/react-router";
import { ModuleSoon } from "@/components/studio/AppShell";

export const Route = createFileRoute("/patterns")({
  head: () => ({
    meta: [
      { title: "Patterns & Textures · L&M Studio Factory" },
      { name: "description", content: "Motifs répétitifs et textures des collections L&M." },
      { property: "og:title", content: "Patterns & Textures · L&M Studio Factory" },
      { property: "og:description", content: "Motifs répétitifs et textures des collections L&M." },
    ],
  }),
  component: () => <ModuleSoon title="Patterns & Textures" description="Motifs répétitifs et textures des collections L&M." items={["Motifs raccord", "Textures", "Déclinaison en papier cadeau"]} />,
});
