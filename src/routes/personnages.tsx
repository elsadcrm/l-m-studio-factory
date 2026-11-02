import { createFileRoute } from "@tanstack/react-router";
import { ModuleSoon } from "@/components/studio/AppShell";

export const Route = createFileRoute("/personnages")({
  head: () => ({
    meta: [
      { title: "Personnages · L&M Studio Factory" },
      { name: "description", content: "Fiches de référence de Boo et Rosa Pouce." },
      { property: "og:title", content: "Personnages · L&M Studio Factory" },
      { property: "og:description", content: "Fiches de référence de Boo et Rosa Pouce." },
    ],
  }),
  component: () => <ModuleSoon title="Personnages" description="Fiches de référence de Boo et Rosa Pouce." items={[]} />,
});
