import { createFileRoute } from "@tanstack/react-router";
import { ModuleSoon } from "@/components/studio/AppShell";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: "Collections · L&M Studio Factory" },
      { name: "description", content: "Les collections L&M Studio." },
      { property: "og:title", content: "Collections · L&M Studio Factory" },
      { property: "og:description", content: "Les collections L&M Studio." },
    ],
  }),
  component: () => <ModuleSoon title="Collections" description="Les collections L&M Studio." items={[]} />,
});
