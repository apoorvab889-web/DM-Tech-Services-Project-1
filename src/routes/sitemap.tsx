import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/sitemap")({
  head: () => ({
    meta: [
      { title: "Sitemap — DM + Tech Services" },
      { name: "description", content: "All pages of DM + Tech Services in one place." },
    ],
  }),
  component: SitemapPage,
});

const sections = [
  {
    title: "Main",
    links: [
      { to: "/", label: "Home" },
      { to: "/services", label: "Services" },
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/privacy", label: "Privacy Policy" },
      { to: "/terms", label: "Terms & Conditions" },
    ],
  },
] as const;

function SitemapPage() {
  return (
    <article className="container mx-auto px-4 md:px-6 py-16 md:py-24 max-w-3xl">
      <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-3">Sitemap</h1>
      <p className="text-muted-foreground mb-10">An overview of every page on DM + Tech Services.</p>

      <div className="space-y-10">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="font-display text-xs uppercase tracking-wider text-primary font-bold mb-4">{s.title}</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {s.links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="group flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/40 hover:shadow-md transition-smooth"
                  >
                    <span className="font-medium">{l.label}</span>
                    <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </article>
  );
}
