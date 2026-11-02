import { createFileRoute } from "@tanstack/react-router";
import { ModuleSoon } from "@/components/studio/AppShell";

export const Route = createFileRoute("/atelier")({
  head: () => ({
    meta: [
      { title: "Atelier de création d'images · L&M Studio Factory" },
      { name: "description", content: "Composer des prompts et préparer de futures générations d'images." },
      { property: "og:title", content: "Atelier de création d'images · L&M Studio Factory" },
      { property: "og:description", content: "Composer des prompts et préparer de futures générations d'images." },
    ],
  }),
  component: () => <ModuleSoon title="Atelier de création d'images" description="Composer des prompts et préparer de futures générations d'images." items={["Composeur de prompts", "Import d'images", "Générateur IA (à brancher plus tard, avec votre accord)"]} />,
});
