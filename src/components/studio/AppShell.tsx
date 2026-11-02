import { Link } from "@tanstack/react-router";
import {
  BookHeart,
  Brush,
  Cat,
  Factory,
  FolderHeart,
  Gift,
  Home,
  Library,
  Package,
  Palette,
  Send,
  Settings,
  Sparkles,
  Sticker,
  Grid3x3,
} from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { ensureSeed } from "@/lib/studio/db";

export const NAV = [
  { to: "/", label: "Tableau de bord", icon: Home },
  { to: "/direction", label: "Direction artistique L&M", icon: Palette },
  { to: "/personnages", label: "Personnages", icon: Cat },
  { to: "/collections", label: "Collections", icon: FolderHeart },
  { to: "/livres", label: "Livres de coloriage", icon: BookHeart },
  { to: "/atelier", label: "Atelier de création d'images", icon: Brush },
  { to: "/patterns", label: "Patterns & Textures", icon: Grid3x3 },
  { to: "/papeterie", label: "Papeterie & Stickers", icon: Sticker },
  { to: "/goodies", label: "Goodies & Accessoires", icon: Gift },
  { to: "/kits", label: "Creative Kits", icon: Package },
  { to: "/bibliotheque", label: "Bibliothèque de fichiers", icon: Library },
  { to: "/production", label: "Production et contrôle qualité", icon: Factory },
  { to: "/diffusion", label: "Diffusion et plateformes", icon: Send },
  { to: "/parametres", label: "Paramètres", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    ensureSeed();
  }, []);
  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-4 md:flex">
        <Link to="/" className="mb-6 flex items-center gap-3 px-2">
          <span className="grid size-11 place-items-center rounded-2xl bg-rose text-cocoa shadow-soft">
            <Sparkles className="size-5" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-bold">L&M Studio</span>
            <span className="block text-xs text-muted-foreground">Factory · atelier privé</span>
          </span>
        </Link>
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent/60"
              activeProps={{ className: "bg-sidebar-accent text-sidebar-foreground" }}
            >
              <n.icon className="size-4 shrink-0" />
              {n.label}
            </Link>
          ))}
        </nav>
        <p className="mt-4 px-2 text-xs text-muted-foreground">Leny & Miam Studio</p>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileNav />
        <main className="mx-auto w-full max-w-7xl flex-1 p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}

function MobileNav() {
  return (
    <div className="flex gap-1 overflow-x-auto border-b bg-sidebar p-2 md:hidden">
      {NAV.map((n) => (
        <Link
          key={n.to}
          to={n.to}
          activeOptions={{ exact: n.to === "/" }}
          className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold"
          activeProps={{ className: "bg-sidebar-accent" }}
        >
          {n.label}
        </Link>
      ))}
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl md:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function ModuleSoon({ title, description, items }: { title: string; description: string; items: string[] }) {
  return (
    <>
      <PageHeader title={title} subtitle={description} />
      <div className="card-soft dots-bg p-8">
        <span className="inline-block rounded-full bg-butter px-3 py-1 text-xs font-bold">Module en préparation</span>
        <p className="mt-4 max-w-xl">
          La structure est prévue. Ce module permettra de décliner une illustration ou une collection validée en
          produits, sans repartir de zéro.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((i) => (
            <div key={i} className="rounded-2xl border bg-card p-4 font-semibold">
              {i}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
