import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { services } from "@/components/site/services-data";
import heroLight from "@/assets/hero-light.jpg";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = services.find((s) => s.slug === params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    const s = loaderData?.service;
    if (!s) return { meta: [{ title: "Service — DM + Tech Services" }] };
    return {
      meta: [
        { title: `${s.title} — DM + Tech Services` },
        { name: "description", content: s.blurb },
        { property: "og:title", content: `${s.title} — DM + Tech Services` },
        { property: "og:description", content: s.blurb },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="font-display text-4xl font-extrabold mb-3">Service not found</h1>
      <p className="text-muted-foreground mb-6">That service doesn't exist — but here's everything we offer.</p>
      <Button variant="hero" asChild>
        <Link to="/services">View all services</Link>
      </Button>
    </div>
  ),
  component: ServiceDetailPage,
});

function ServiceDetailPage() {
  const { service } = Route.useLoaderData();
  const Icon = service.icon;

  const otherServices = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/15 blur-3xl animate-glow-pulse" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-accent/15 blur-3xl animate-glow-pulse" />
        <div className="container relative mx-auto px-4 md:px-6 py-16 md:py-24">
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-smooth mb-6"
          >
            <ArrowLeft size={14} /> All services
          </Link>
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-3 animate-fade-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-5">
                <Sparkles size={12} /> Service
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-tight mb-5">
                {service.title}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                {service.description}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/contact">
                    Get a free proposal <ArrowRight size={16} />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/services">Compare services</Link>
                </Button>
              </div>
            </div>
            <div className="lg:col-span-2 flex justify-center animate-fade-up">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-primary blur-3xl opacity-30 rounded-full" />
                <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-3xl bg-gradient-primary text-primary-foreground flex items-center justify-center shadow-glow animate-float">
                  <Icon size={96} strokeWidth={1.5} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="container mx-auto px-4 md:px-6 py-20 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wider mb-4">
              What's included
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold mb-5 leading-tight">
              A complete delivery, not a checklist
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Every {service.title.toLowerCase()} engagement is run by a senior specialist and tied to a measurable outcome. No layers, no juniors, no surprises.
            </p>
            <div className="rounded-2xl glass p-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Typical timeline</div>
              <div className="font-display text-2xl font-extrabold text-gradient-primary">2 – 8 weeks</div>
              <div className="text-sm text-muted-foreground mt-1">Depending on scope and integrations.</div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-3xl p-7 md:p-10 shadow-elegant">
            <h3 className="font-display text-xl font-extrabold mb-5">You'll get</h3>
            <ul className="space-y-3.5">
              {service.deliverables.map((d: string) => (
                <li key={d} className="flex gap-3">
                  <CheckCircle2 className="text-accent shrink-0 mt-0.5" size={18} />
                  <span className="text-foreground/90">{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* RELATED SERVICES */}
      <section className="bg-gradient-soft py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
              Pairs well with
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold">
              Bundle with another service
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {otherServices.map((s) => {
              const SIcon = s.icon;
              return (
                <Link
                  key={s.slug}
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-elegant hover:-translate-y-1 transition-smooth"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center shadow-glow mb-4">
                    <SIcon size={20} />
                  </div>
                  <h3 className="font-display text-lg font-extrabold mb-2 group-hover:text-primary transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">{s.blurb}</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-primary text-sm font-semibold group-hover:gap-2 transition-all">
                    Learn more <ArrowRight size={14} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 md:px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-flyer text-white p-10 md:p-14 text-center">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <img src={heroLight} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay" loading="lazy" width={1920} height={1080} />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-5xl font-extrabold mb-4 max-w-2xl mx-auto">
              Ready to start with {service.title}?
            </h2>
            <p className="text-white/85 text-lg max-w-xl mx-auto mb-8">
              Tell us about your goals and we'll send a tailored proposal within 24 hours.
            </p>
            <Button variant="outline-hero" size="xl" asChild>
              <Link to="/contact">
                Get free proposal <ArrowRight size={18} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
