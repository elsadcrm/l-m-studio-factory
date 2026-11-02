import { createFileRoute } from "@tanstack/react-router";
import { ModuleSoon } from "@/components/studio/AppShell";

export const Route = createFileRoute("/direction")({
  head: () => ({
    meta: [
      { title: "Direction artistique L&M · L&M Studio Factory" },
      { name: "description", content: "Règles graphiques communes à tous les prompts." },
      { property: "og:title", content: "Direction artistique L&M · L&M Studio Factory" },
      { property: "og:description", content: "Règles graphiques communes à tous les prompts." },
    ],
  }),
  component: () => <ModuleSoon title="Direction artistique L&M" description="Règles graphiques communes à tous les prompts." items={[]} />,
});
