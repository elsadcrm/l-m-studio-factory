import { createFileRoute } from "@tanstack/react-router";
import { ModuleSoon } from "@/components/studio/AppShell";

export const Route = createFileRoute("/parametres")({
  head: () => ({
    meta: [
      { title: "Paramètres · L&M Studio Factory" },
      { name: "description", content: "Export, import et profils d'impression." },
      { property: "og:title", content: "Paramètres · L&M Studio Factory" },
      { property: "og:description", content: "Export, import et profils d'impression." },
    ],
  }),
  component: () => <ModuleSoon title="Paramètres" description="Export, import et profils d'impression." items={[]} />,
});
