import { Code2, Search, Megaphone, Palette, Sparkles, BarChart3 } from "lucide-react";

export const services = [
  {
    slug: "web-development",
    icon: Code2,
    title: "Web Development",
    blurb: "Lightning-fast, conversion-focused websites and web apps built with React and modern stacks.",
    features: [
      "Custom React & Next.js builds",
      "Headless CMS integration",
      "E-commerce & SaaS platforms",
      "Performance-first architecture",
    ],
    accent: "primary" as const,
    description:
      "We design and engineer websites and web apps that load instantly, convert visitors, and scale with your business. From marketing sites to custom SaaS platforms, every build is performance-first, accessible, and SEO-ready.",
    deliverables: [
      "Custom React, Next.js, or TanStack Start build",
      "Headless CMS or custom admin",
      "E-commerce, booking, or SaaS workflows",
      "Lighthouse 95+ performance & accessibility",
      "Hosting setup, CI/CD, and 30 days of post-launch support",
    ],
  },
  {
    slug: "seo",
    icon: Search,
    title: "Search Engine Optimization",
    blurb: "Rank where it matters. Technical SEO, content strategy, and authority building that compounds.",
    features: [
      "Technical SEO audits",
      "Keyword & content strategy",
      "On-page optimization",
      "Authority link building",
    ],
    accent: "accent" as const,
    description:
      "Our SEO program is engineered around intent and authority. We diagnose technical issues, build a content engine around the queries that move revenue, and earn the backlinks that compound your rankings month after month.",
    deliverables: [
      "Full technical SEO audit & fix-list",
      "Keyword universe & content roadmap",
      "On-page optimization for top pages",
      "Monthly authority link building",
      "Live dashboard with rankings & traffic",
    ],
  },
  {
    slug: "social-media",
    icon: Megaphone,
    title: "Social Media Marketing",
    blurb: "End-to-end social campaigns that build community and drive measurable revenue.",
    features: [
      "Content production",
      "Paid social ads",
      "Community management",
      "Analytics & reporting",
    ],
    accent: "primary" as const,
    description:
      "We run social like a senior in-house team — content production, paid amplification, community, and analytics — all tied to revenue, not vanity metrics. Built for brands that want a real presence, not just posts.",
    deliverables: [
      "Channel strategy across IG, LinkedIn, TikTok, X",
      "Monthly content production & scheduling",
      "Paid social ad management",
      "Community engagement & DM management",
      "Bi-weekly performance reporting",
    ],
  },
  {
    slug: "branding",
    icon: Palette,
    title: "Branding & Identity",
    blurb: "Distinctive brand systems — naming, logos, and guidelines — that scale across every touchpoint.",
    features: [
      "Brand strategy & naming",
      "Logo & visual identity",
      "Brand guidelines",
      "Design systems",
    ],
    accent: "accent" as const,
    description:
      "We craft brands that look unmistakably yours — from positioning and naming to a full visual identity and design system that scales from a business card to a billion-dollar product.",
    deliverables: [
      "Brand strategy, positioning, and messaging",
      "Naming exploration (when applicable)",
      "Logo system, type, and color",
      "Brand guidelines (PDF + Figma)",
      "Component / design system kit",
    ],
  },
  {
    slug: "ai-solutions",
    icon: Sparkles,
    title: "AI-Driven Solutions",
    blurb: "Custom chatbots, content engines, and automations powered by GPT, Gemini, and proprietary models.",
    features: [
      "AI chatbots & agents",
      "Content automation",
      "Workflow integrations",
      "Custom model fine-tuning",
    ],
    accent: "primary" as const,
    description:
      "We build production AI — not demos. Custom chatbots that know your products, content engines that match your tone, and back-office automations that quietly remove hours of work each week.",
    deliverables: [
      "Custom AI chatbot trained on your data",
      "Content & creative automation pipelines",
      "Internal copilots and workflow agents",
      "Vector search, RAG, and fine-tuning",
      "Monitoring, evals, and continuous tuning",
    ],
  },
  {
    slug: "growth-analytics",
    icon: BarChart3,
    title: "Growth Analytics",
    blurb: "Data dashboards and attribution systems so you know exactly what's working.",
    features: [
      "GA4 & Tag Manager setup",
      "Conversion tracking",
      "Custom dashboards",
      "Funnel optimization",
    ],
    accent: "accent" as const,
    description:
      "We turn scattered numbers into a single source of truth. From a clean GA4 setup to multi-touch attribution and exec-ready dashboards, you'll always know what to do next.",
    deliverables: [
      "GA4 + GTM setup or audit",
      "Server-side conversion tracking",
      "Multi-touch attribution model",
      "Custom Looker Studio dashboards",
      "Quarterly funnel & experiment review",
    ],
  },
];

export type ServiceItem = (typeof services)[number];
export const SERVICE_SLUGS = services.map((s) => s.slug);
export type ServiceSlug = (typeof services)[number]["slug"];
