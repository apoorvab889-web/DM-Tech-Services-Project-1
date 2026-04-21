import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Clock3,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Youtube,
} from "lucide-react";

const socials = [
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  { icon: Github, href: "https://github.com", label: "GitHub" },
];

const services = [
  { to: "/services/web-development", label: "Web Development" },
  { to: "/services/seo", label: "SEO & Content" },
  { to: "/services/social-media", label: "Social Media" },
  { to: "/services/branding", label: "Brand Systems" },
  { to: "/services/ai-solutions", label: "AI Solutions" },
  { to: "/services/growth-analytics", label: "Growth Analytics" },
] as const;

const company = [
  { to: "/about", label: "About Us" },
  { to: "/services", label: "All Services" },
  { to: "/blog", label: "Insights" },
  { to: "/contact", label: "Contact" },
  { to: "/sitemap", label: "Sitemap" },
] as const;

const legal = [
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms & Conditions" },
] as const;

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-border/60 bg-card">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-primary opacity-70" />
      <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-20 left-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

      <div className="container relative mx-auto px-4 md:px-6 py-16 md:py-20">
        <div className="mb-10 rounded-3xl border border-border/70 bg-background/70 p-6 md:p-8 shadow-md backdrop-blur-sm">
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                <Sparkles size={12} /> Growth-ready delivery
              </div>
              <h2 className="mt-4 font-display text-3xl md:text-4xl font-extrabold leading-tight text-foreground">
                Need a polished digital presence <span className="text-gradient-primary">and a smarter growth engine?</span>
              </h2>
              <p className="mt-3 max-w-2xl text-sm md:text-base leading-relaxed text-muted-foreground">
                We combine web, SEO, performance marketing, analytics, and AI workflows into one streamlined delivery team.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end">
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-5 py-3 font-semibold text-primary-foreground shadow-glow transition-smooth hover:-translate-y-0.5">
                Start your project <ArrowRight size={16} />
              </Link>
              <div className="grid grid-cols-3 gap-3 text-center w-full lg:max-w-sm">
                {[
                  ["24h", "Reply time"],
                  ["SEO", "AI + Web"],
                  ["Full", "Execution"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-border/70 bg-card px-3 py-3 shadow-sm">
                    <div className="font-display text-lg font-extrabold text-foreground">{value}</div>
                    <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-2 font-display font-extrabold text-2xl tracking-tight">
              <span className="text-foreground">DM</span>
              <span className="text-gradient-primary text-3xl leading-none">+</span>
              <span className="text-foreground">Tech</span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Premium web experiences, scalable marketing systems, and AI-powered execution for modern brands that want growth without messy handoffs.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground"><Clock3 size={16} className="text-primary" /> Fast delivery</div>
                <p className="text-xs leading-relaxed text-muted-foreground">Structured execution, clean communication, and milestone-based delivery.</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground"><ShieldCheck size={16} className="text-primary" /> Reliable stack</div>
                <p className="text-xs leading-relaxed text-muted-foreground">Modern architecture with performance, maintainability, and scalability in mind.</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={s.label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-background/80 text-foreground/70 transition-smooth hover:-translate-y-0.5 hover:bg-gradient-primary hover:text-primary-foreground hover:shadow-glow"
                >
                  <s.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-4 font-display text-base font-bold text-foreground">Services</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {services.map((s) => (
                <li key={s.to}>
                  <Link to={s.to} className="transition-smooth hover:text-primary">{s.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-4 font-display text-base font-bold text-foreground">Company</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {company.map((c) => (
                <li key={c.to}>
                  <Link to={c.to} className="transition-smooth hover:text-primary">{c.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="mb-4 font-display text-base font-bold text-foreground">Contact</h4>
            <div className="rounded-3xl border border-border/70 bg-background/70 p-5 shadow-sm">
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <Mail size={15} className="mt-0.5 shrink-0 text-primary" />
                  <a href="mailto:hello@dmtech.services" className="transition-smooth hover:text-primary">hello@dmtech.services</a>
                </li>
                <li className="flex items-start gap-3">
                  <Phone size={15} className="mt-0.5 shrink-0 text-primary" />
                  <a href="tel:+15550102024" className="transition-smooth hover:text-primary">+1 (555) 010-2024</a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-primary" />
                  <span>Remote-first · Worldwide delivery</span>
                </li>
              </ul>
              <div className="mt-5 rounded-2xl bg-card p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-primary">Best fit</div>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Startups, personal brands, founders, and growth-focused businesses looking for a sharper digital presence.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border/70 pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} DM + Tech Services. Built for modern growth teams.</p>
          <div className="flex flex-wrap gap-5">
            {legal.map((item) => (
              <Link key={item.to} to={item.to} className="transition-smooth hover:text-primary">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
