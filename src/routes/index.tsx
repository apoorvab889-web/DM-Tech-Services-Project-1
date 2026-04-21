import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Sparkles, CheckCircle2, TrendingUp, Users, Zap, Award, Rocket, Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { services } from "@/components/site/services-data";
import { VideoCard } from "@/components/site/VideoCard";
import { TestimonialsCarousel } from "@/components/site/TestimonialsCarousel";
import { StatsSection } from "@/components/site/StatsSection";
import { FAQSection } from "@/components/site/FAQSection";
import { Newsletter } from "@/components/site/Newsletter";
import heroImage from "@/assets/hero-light.jpg";
import flyerImage from "@/assets/flyer-promo.jpg";

// YouTube IDs — proven, embeddable marketing/AI talks
const FEATURED_VIDEO_ID = "Sklc_fQBmcs"; // "What is Digital Marketing?"
const VIDEO_LIST: Array<{ id: string; title: string }> = [
  { id: "Sklc_fQBmcs", title: "Growth strategies that actually scale" },
  { id: "8jPQjjsBbIc", title: "The modern marketing playbook" },
  { id: "5q87K1WaoFI", title: "AI-powered customer journeys" },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DM + Tech Services — Your Revenue Growth Partner in the AI Era" },
      { name: "description", content: "We build websites, run SEO and social campaigns, craft brands, and ship AI-driven solutions that grow revenue. Get a free proposal in 24 hours." },
      { property: "og:title", content: "DM + Tech Services — Your Revenue Growth Partner in the AI Era" },
      { property: "og:description", content: "Premium web, marketing, branding, and AI solutions for growing businesses." },
      { property: "og:image", content: heroImage },
      { name: "twitter:image", content: heroImage },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      {/* HERO — premium light */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 opacity-60 pointer-events-none">
          <img src={heroImage} alt="" className="w-full h-full object-cover" width={1920} height={1280} />
        </div>
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/15 blur-3xl animate-glow-pulse" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-accent/20 blur-3xl animate-glow-pulse" />

        <div className="container relative mx-auto px-4 md:px-6 py-20 md:py-32">
          <div className="max-w-3xl animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass text-sm font-medium mb-6">
              <Sparkles size={14} className="text-primary" />
              <span className="text-foreground">AI-powered growth, delivered</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-foreground">
              Your Revenue Growth Partner in the{" "}
              <span className="text-gradient-primary">AI Era</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              We design, build, and scale digital experiences that turn visitors into customers — with strategy, craft, and intelligent automation.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <Button variant="hero" size="xl" asChild>
                <Link to="/contact">
                  Get Free Proposal <ArrowRight size={18} />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/services">Explore Services</Link>
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg">
              {[
                { v: "150+", l: "Projects shipped" },
                { v: "98%", l: "Client retention" },
                { v: "3.4x", l: "Avg. revenue lift" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-2xl md:text-3xl font-extrabold text-gradient-primary">{s.v}</div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-y border-border bg-card">
        <div className="container mx-auto px-4 md:px-6 py-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-muted-foreground text-sm font-medium">
          <span className="text-xs uppercase tracking-wider">Trusted by teams at</span>
          {["Northwind", "Loop & Co.", "Helix Health", "Aurora Labs", "Vega Studio", "Zenith"].map((n) => (
            <span key={n} className="font-display font-bold text-foreground/60 hover:text-primary transition-smooth">{n}</span>
          ))}
        </div>
      </section>

      {/* SERVICES — clickable cards */}
      <section className="container mx-auto px-4 md:px-6 py-20 md:py-28">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            What we do
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold mb-4">
            A complete growth stack, under one roof
          </h2>
          <p className="text-muted-foreground text-lg">
            From the first pixel to the last conversion — every service designed to compound results.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Link
              key={s.slug}
              to="/services/$slug"
              params={{ slug: s.slug }}
              className="group relative bg-card border border-border rounded-2xl p-7 hover:border-primary/40 hover:shadow-elegant hover:-translate-y-1 transition-smooth animate-fade-up block"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${s.accent === "primary" ? "bg-gradient-primary text-primary-foreground shadow-glow" : "bg-gradient-accent text-accent-foreground shadow-emerald"}`}>
                <s.icon size={22} />
              </div>
              <h3 className="font-display text-xl font-bold mb-2 group-hover:text-primary transition-colors">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{s.blurb}</p>
              <span className="inline-flex items-center gap-1 text-primary text-sm font-semibold group-hover:gap-2 transition-all">
                Learn more <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* FLYER PROMO */}
      <section className="container mx-auto px-4 md:px-6 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-flyer text-white shadow-elegant">
          <img
            src={flyerImage}
            alt=""
            loading="lazy"
            width={1600}
            height={1000}
            className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-overlay"
          />
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/15 blur-3xl animate-glow-pulse" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-white/10 blur-3xl animate-glow-pulse" />
          <div className="relative grid lg:grid-cols-2 gap-8 p-8 md:p-14 items-center">
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-semibold uppercase tracking-wider mb-4 border border-white/20">
                <Rocket size={12} /> Limited offer
              </div>
              <h2 className="font-display text-3xl md:text-5xl font-extrabold leading-tight mb-4">
                Free growth audit — worth $1,200
              </h2>
              <p className="text-white/90 text-lg leading-relaxed mb-6 max-w-lg">
                Book a 30-minute strategy call this month and we'll deliver a complete audit of your website, SEO, and conversion funnel — at no cost.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline-hero" size="lg" asChild>
                  <Link to="/contact">
                    Claim my free audit <ArrowRight size={16} />
                  </Link>
                </Button>
                <Button variant="ghost" size="lg" asChild className="text-white hover:bg-white/10 hover:text-white">
                  <Link to="/services">See what we do</Link>
                </Button>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/80">
                {["No obligation", "30-minute call", "Senior strategist"].map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full" />
                <div className="relative w-64 h-64 rounded-3xl bg-white/15 backdrop-blur-xl border border-white/30 flex items-center justify-center animate-float shadow-elegant">
                  <div className="text-center">
                    <div className="font-display text-7xl font-extrabold leading-none">$0</div>
                    <div className="text-sm uppercase tracking-wider mt-2 opacity-80">Audit value</div>
                    <div className="font-display text-3xl font-extrabold mt-3 line-through opacity-50">$1,200</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-gradient-soft py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wider mb-4">
                Why DM + Tech
              </div>
              <h2 className="font-display text-3xl md:text-5xl font-extrabold mb-5 leading-tight">
                Built for outcomes, not output
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                We're a senior team that pairs strategy with serious execution. Every engagement is run like an in-house growth squad — measured by revenue, not deliverables.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Zap, t: "Senior team, fast turnaround", d: "No juniors. No layers. Direct access to specialists." },
                  { icon: TrendingUp, t: "Outcome-based engagements", d: "Goals tied to revenue, signups, or pipeline — never vanity." },
                  { icon: Award, t: "Award-winning craft", d: "Featured by Awwwards, CSS Design Awards, and Product Hunt." },
                  { icon: Users, t: "Long-term partnership", d: "Most clients stay 18+ months. We build for the long game." },
                ].map((item) => (
                  <div key={item.t} className="flex gap-4">
                    <div className="w-10 h-10 shrink-0 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <item.icon size={18} />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{item.t}</div>
                      <div className="text-sm text-muted-foreground mt-0.5">{item.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary blur-3xl opacity-20 rounded-3xl" />
              <div className="relative bg-card border border-border rounded-3xl p-8 shadow-elegant animate-float">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-sm text-muted-foreground">Pipeline this quarter</div>
                    <div className="font-display text-3xl font-extrabold mt-1 text-gradient-primary">$1.24M</div>
                  </div>
                  <div className="px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center gap-1">
                    <TrendingUp size={12} /> +247%
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Organic traffic", value: 92, color: "bg-gradient-primary" },
                    { label: "Conversion rate", value: 78, color: "bg-gradient-accent" },
                    { label: "AI-handled chats", value: 70, color: "bg-gradient-primary" },
                    { label: "Brand mentions", value: 85, color: "bg-gradient-accent" },
                  ].map((m) => (
                    <div key={m.label}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-foreground/70">{m.label}</span>
                        <span className="font-semibold">{m.value}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full ${m.color} rounded-full transition-all`} style={{ width: `${m.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <StatsSection />

      {/* TESTIMONIAL CAROUSEL */}
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            Client love
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold">
            What our partners say
          </h2>
        </div>
        <TestimonialsCarousel />
      </section>

      {/* FAQ */}
      <FAQSection />

      {/* NEWSLETTER */}
      <Newsletter />

      {/* YOUTUBE / VIDEOS */}
      <section className="bg-gradient-soft py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wider mb-4">
              From our channel
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold mb-4">
              Marketing intelligence, on demand
            </h2>
            <p className="text-muted-foreground text-lg">Watch our latest insights on growth, AI, and modern marketing.</p>
          </div>

          {/* Featured video */}
          <div className="max-w-4xl mx-auto mb-10">
            <button
              type="button"
              onClick={() => window.open(`https://www.youtube.com/watch?v=${FEATURED_VIDEO_ID}`, "_blank", "noopener,noreferrer")}
              className="w-full text-left rounded-3xl overflow-hidden bg-card border border-border shadow-elegant hover:border-primary/40 hover:-translate-y-1 transition-smooth group"
              aria-label="Open featured video on YouTube"
            >
              <div className="aspect-video relative bg-black overflow-hidden">
                <img
                  src={`https://i.ytimg.com/vi/${FEATURED_VIDEO_ID}/hqdefault.jpg`}
                  alt="DM + Tech Services — Featured marketing insight"
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = `https://i.ytimg.com/vi/${FEATURED_VIDEO_ID}/hqdefault.jpg`;
                  }}
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent flex items-center justify-center">
                  <span className="w-20 h-20 rounded-full bg-primary/95 text-primary-foreground flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                    <Play size={30} className="ml-1" fill="currentColor" />
                  </span>
                </span>
                <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/90 text-foreground/80 text-xs font-semibold shadow-sm">
                  <ExternalLink size={12} /> YouTube
                </span>
              </div>
              <div className="p-5 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="font-display font-bold">DM + Tech Services — Grow with Intelligence</div>
                  <div className="text-xs text-muted-foreground mt-1">Featured · DM + Tech Channel</div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  <Sparkles size={12} /> New
                </span>
              </div>
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {VIDEO_LIST.map((v) => (
              <VideoCard key={v.id} id={v.id} title={v.title} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 md:px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-flyer text-white p-10 md:p-16 text-center">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/15 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-5xl font-extrabold mb-4 max-w-2xl mx-auto">
              Ready to grow with intelligence?
            </h2>
            <p className="text-white/85 text-lg max-w-xl mx-auto mb-8">
              Tell us about your goals and we'll send a tailored proposal within 24 hours.
            </p>
            <Button variant="outline-hero" size="xl" asChild>
              <Link to="/contact">
                Start your project <ArrowRight size={18} />
              </Link>
            </Button>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/75">
              {["No commitment", "Reply within 24h", "Senior team only"].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
