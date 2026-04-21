import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dbClient } from "@/integrations/mongodb/client";
import { services as staticServices, SERVICE_SLUGS } from "@/components/site/services-data";

type Service = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string | null;
  price: number | null;
  image_url: string | null;
  featured: boolean;
};

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — DM + Tech Services" },
      { name: "description", content: "Web development, SEO, social media marketing, branding, AI solutions, and growth analytics — a complete growth stack under one roof." },
      { property: "og:title", content: "Services — DM + Tech Services" },
      { property: "og:description", content: "Six service lines, one senior team. Discover what we build." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dbClient
      .from("services")
      .select("*")
      .eq("published", true)
      .order("featured", { ascending: false })
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        setServices((data as Service[] | null) ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <section className="bg-gradient-hero-dark text-white relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/30 blur-3xl" />
        <div className="container relative mx-auto px-4 md:px-6 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold uppercase tracking-wider mb-5">
            Our services
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold max-w-3xl mx-auto leading-tight">
            Everything you need to grow — <span className="text-gradient-primary">in one team</span>
          </h1>
          <p className="mt-5 text-white/75 text-lg max-w-2xl mx-auto">
            Tightly integrated service lines, run by a senior team that owns outcomes.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-20 md:py-24">
        {loading ? (
          <div className="text-center text-muted-foreground py-20">Loading services…</div>
        ) : services.length === 0 ? (
          <div className="text-center text-muted-foreground py-20">No services published yet.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <article
                key={s.id}
                className="bg-card border border-border rounded-2xl p-6 shadow-md hover:shadow-elegant hover:border-primary/40 hover:-translate-y-1 transition-smooth animate-fade-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center shadow-glow mb-4">
                  <Sparkles size={20} />
                </div>
                {s.category && (
                  <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">{s.category}</div>
                )}
                <h2 className="font-display text-xl font-extrabold mb-2">{s.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-4">{s.description}</p>
                <div className="flex items-center justify-between border-t border-border pt-4 mt-4">
                  {s.price != null ? (
                    <div>
                      <div className="text-xs text-muted-foreground">Starting at</div>
                      <div className="font-display font-extrabold text-foreground text-lg">${Number(s.price).toLocaleString()}</div>
                    </div>
                  ) : <span />}
                  <CheckCircle2 size={18} className="text-accent" />
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-20 text-center">
          <h3 className="font-display text-2xl md:text-3xl font-extrabold mb-4">Not sure where to start?</h3>
          <p className="text-muted-foreground mb-6">Book a free 30-minute strategy call and we'll point you in the right direction.</p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/contact">Talk to our team <ArrowRight size={16} /></Link>
          </Button>
        </div>
      </section>
    </>
  );
}
