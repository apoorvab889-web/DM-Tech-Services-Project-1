import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "How quickly can you start on my project?",
    a: "Most engagements kick off within 5–7 business days. After our discovery call we send a tailored proposal within 24 hours, then schedule a sprint-zero session.",
  },
  {
    q: "Do you work with startups or only large companies?",
    a: "Both. We have packages tailored to early-stage founders (lean, conversion-first) and full retainers for scale-ups and enterprise.",
  },
  {
    q: "How do you measure success?",
    a: "Every engagement is tied to a measurable outcome: revenue, qualified pipeline, signups, or organic traffic. You get a live dashboard updated weekly.",
  },
  {
    q: "Do you offer ongoing retainers?",
    a: "Yes. Most clients move into a monthly partnership after the initial project. Retainers cover SEO, content, paid media, AI ops, and continuous CRO.",
  },
  {
    q: "Can you integrate with our existing tools?",
    a: "Absolutely. We work with HubSpot, Salesforce, Shopify, Webflow, Notion, Slack, and most modern stacks. Custom integrations are part of the AI service line.",
  },
  {
    q: "What does pricing look like?",
    a: "Projects start at $1,500 for landing pages, $5K for branding, and $8K+ for full sites or AI builds. Retainers start at $3K/month. We send a tailored quote after discovery.",
  },
];

export function FAQSection() {
  return (
    <section className="container mx-auto px-4 md:px-6 py-20 md:py-28">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <HelpCircle size={12} /> FAQ
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold mb-3">
            Questions, answered
          </h2>
          <p className="text-muted-foreground text-lg">Everything you need to know before we start.</p>
        </div>

        <Accordion type="single" collapsible className="glass rounded-2xl px-6">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-border">
              <AccordionTrigger className="text-left font-display font-bold text-base hover:text-primary">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
