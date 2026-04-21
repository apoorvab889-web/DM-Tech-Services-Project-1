import { Link, createFileRoute } from "@tanstack/react-router";
import { Heart, Target, Lightbulb, Shield, ArrowRight, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import diyaImg from "@/assets/team-diya.jpg";
import marcusImg from "@/assets/team-marcus.jpg";
import priyaImg from "@/assets/team-priya.jpg";
import liamImg from "@/assets/team-liam.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — DM + Tech Services" },
      { name: "description", content: "We're a senior team of strategists, designers, engineers, and marketers helping businesses grow in the AI era." },
      { property: "og:title", content: "About — DM + Tech Services" },
      { property: "og:description", content: "Meet the team behind your growth." },
    ],
  }),
  component: AboutPage,
});

const values = [
  { icon: Heart, t: "Outcomes over output", d: "We measure success in revenue moved, not slides delivered." },
  { icon: Target, t: "Senior craft", d: "Every project is led by specialists with 8+ years in their field." },
  { icon: Lightbulb, t: "AI-native thinking", d: "We bake intelligence into every workflow we touch." },
  { icon: Shield, t: "Long-term partnership", d: "Most clients stay 18+ months. We're in it for the journey." },
];

const team = [
  { name: "Diya Malhotra", role: "Founder & CEO", img: diyaImg },
  { name: "Marcus Tan", role: "Head of Engineering", img: marcusImg },
  { name: "Priya Shah", role: "Creative Director", img: priyaImg },
  { name: "Liam Ortega", role: "Head of Growth", img: liamImg },
];

function AboutPage() {
  return (
    <>
      <section className="bg-gradient-hero-dark text-white relative overflow-hidden">
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-accent/20 blur-3xl" />
        <div className="container relative mx-auto px-4 md:px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold uppercase tracking-wider mb-5">
              About us
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-tight">
              We help ambitious teams <span className="text-gradient-primary">win in the AI era</span>
            </h1>
            <p className="mt-6 text-white/80 text-lg leading-relaxed">
              DM + Tech Services was founded on one belief: businesses don't need bigger teams — they need sharper ones. We pair senior craft with intelligent automation to ship growth faster than traditional agencies ever could.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-20 md:py-24">
        <div className="grid lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">Our story</div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold leading-tight">
              Built by operators, for operators
            </h2>
          </div>
          <div className="lg:col-span-2 space-y-5 text-muted-foreground text-lg leading-relaxed">
            <p>We started as a small team frustrated with agencies that over-promised and under-delivered. So we built the agency we wished existed — small, senior, and obsessed with outcomes.</p>
            <p>Today we work with founders, marketing leaders, and product teams across SaaS, e-commerce, and services — building everything from category-defining brands to AI products that handle thousands of conversations a day.</p>
            <p>Our edge isn't size. It's craft, speed, and an unfair advantage in modern tooling.</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-soft py-20 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wider mb-4">What we believe</div>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold">Our values</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.t} className="bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-md transition-smooth">
                <div className="w-11 h-11 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center mb-4 shadow-glow">
                  <v.icon size={20} />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{v.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-20 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">The team</div>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold mb-4">Senior, end to end</h2>
          <p className="text-muted-foreground text-lg">No juniors. No layers. The people you meet are the people who do the work.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m) => (
            <div
              key={m.name}
              className="group relative rounded-3xl overflow-hidden bg-card border border-border shadow-md hover:shadow-elegant hover:-translate-y-1 transition-smooth"
            >
              <div className="aspect-square overflow-hidden bg-muted relative">
                <img
                  src={m.img}
                  alt={`${m.name} — ${m.role}`}
                  loading="lazy"
                  width={768}
                  height={768}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-5">
                  <div className="flex gap-2 translate-y-2 group-hover:translate-y-0 transition-transform">
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`${m.name} on LinkedIn`}
                      className="w-9 h-9 rounded-full bg-background/95 text-foreground hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-smooth"
                    >
                      <Linkedin size={15} />
                    </a>
                    <a
                      href="mailto:hello@dmtech.services"
                      aria-label={`Email ${m.name}`}
                      className="w-9 h-9 rounded-full bg-background/95 text-foreground hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-smooth"
                    >
                      <Mail size={15} />
                    </a>
                  </div>
                </div>
              </div>
              <div className="p-4 text-center">
                <div className="font-display font-bold text-lg">{m.name}</div>
                <div className="text-sm text-muted-foreground">{m.role}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Button variant="hero" size="lg" asChild>
            <Link to="/contact">Work with us <ArrowRight size={16} /></Link>
          </Button>
        </div>
      </section>
    </>
  );
}
