import blogSeo from "@/assets/blog-seo.jpg";
import blogMarketing from "@/assets/blog-marketing.jpg";
import blogAi from "@/assets/blog-ai.jpg";

export type StaticBlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  tags: string[];
  published_at: string;
};

export const staticBlogPosts: StaticBlogPost[] = [
  {
    id: "blog-1",
    title: "Why your website needs Core Web Vitals in 2026",
    slug: "why-your-website-needs-core-web-vitals-in-2026",
    excerpt:
      "Speed is not just a nice-to-have anymore. Core Web Vitals affect rankings, trust, and conversion rates across modern websites.",
    content:
      `Core Web Vitals are now a business metric as much as a technical one.\n\nA slow website increases bounce rate, weakens trust, and lowers lead quality. For service businesses, even a one second delay can reduce enquiry volume and make paid traffic less profitable.\n\nThe best place to start is image optimisation, font loading, layout stability, and cutting unnecessary JavaScript. Once the fundamentals are stable, performance improvements become much easier to maintain.\n\nAt DM + Tech Services, we treat performance as part of conversion strategy — not an afterthought.`,
    cover_image: blogSeo,
    tags: ["SEO", "Performance"],
    published_at: "2026-04-18",
  },
  {
    id: "blog-2",
    title: "Modern marketing playbook: 5 channels worth your budget",
    slug: "modern-marketing-playbook-5-channels-worth-your-budget",
    excerpt:
      "A no-fluff guide to the digital channels that still create measurable growth for brands in 2026.",
    content:
      `Marketing budgets work best when channels support each other.\n\nThe strongest mix for most growing brands includes SEO, paid search, social content, email retention, and a high-converting website. None of these channels perform at their best in isolation.\n\nThe real playbook is integration: a landing page that converts, content that builds trust, remarketing that recaptures attention, and analytics that reveal which campaigns are driving profitable action.\n\nWhen teams align channels around one clear offer, results compound faster and decision-making becomes much simpler.`,
    cover_image: blogMarketing,
    tags: ["Marketing", "Strategy"],
    published_at: "2026-04-18",
  },
  {
    id: "blog-3",
    title: "AI automation ideas that actually save time for service teams",
    slug: "ai-automation-ideas-that-actually-save-time-for-service-teams",
    excerpt:
      "From lead qualification to content workflows, these are practical automation ideas teams can use without overcomplicating operations.",
    content:
      `The best AI automations remove repetitive tasks that slow teams down.\n\nFor service businesses, useful automation often starts with lead capture, FAQ handling, internal research workflows, and content drafting. These use cases improve response time without sacrificing quality.\n\nThe key is to automate structured, repeatable steps while keeping humans in control of decisions, approvals, and client-facing nuance.\n\nA good automation setup should feel invisible to the customer and obvious to the team using it every day.`,
    cover_image: blogAi,
    tags: ["AI", "Automation"],
    published_at: "2026-04-19",
  },
];