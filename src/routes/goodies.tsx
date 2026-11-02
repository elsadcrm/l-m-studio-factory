import { createFileRoute } from "@tanstack/react-router";
import { ModuleSoon } from "@/components/studio/AppShell";

export const Route = createFileRoute("/goodies")({
  head: () => ({
    meta: [
      { title: "Goodies & Accessoires · L&M Studio Factory" },
      { name: "description", content: "Accessoires, porte-clés et goodies." },
      { property: "og:title", content: "Goodies & Accessoires · L&M Studio Factory" },
      { property: "og:description", content: "Accessoires, porte-clés et goodies." },
    ],
  }),
  component: () => <ModuleSoon title="Goodies & Accessoires" description="Accessoires, porte-clés et goodies." items={["Accessoires", "Porte-clés", "Goodies"]} />,
});
