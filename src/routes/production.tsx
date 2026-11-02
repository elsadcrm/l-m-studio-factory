import { createFileRoute } from "@tanstack/react-router";
import { ModuleSoon } from "@/components/studio/AppShell";

export const Route = createFileRoute("/production")({
  head: () => ({
    meta: [
      { title: "Production et contrôle qualité · L&M Studio Factory" },
      { name: "description", content: "Contrôles et assemblage." },
      { property: "og:title", content: "Production et contrôle qualité · L&M Studio Factory" },
      { property: "og:description", content: "Contrôles et assemblage." },
    ],
  }),
  component: () => <ModuleSoon title="Production et contrôle qualité" description="Contrôles et assemblage." items={[]} />,
});
