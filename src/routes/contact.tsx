import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Send, CheckCircle2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { dbClient } from "@/integrations/mongodb/client";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — DM + Tech Services" },
      {
        name: "description",
        content: "Tell us about your project and we'll send a tailored proposal within 24 hours.",
      },
      { property: "og:title", content: "Contact — DM + Tech Services" },
      {
        property: "og:description",
        content: "Get in touch with our team. We reply within one business day.",
      },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  business_type: z.string().trim().max(80).optional(),
  budget: z.string().trim().max(40).optional(),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
});

const businessTypes = ["Startup", "SMB / Agency", "Mid-market", "Enterprise", "Solo / Founder", "Other"];
const budgets = ["< $5K", "$5K – $15K", "$15K – $50K", "$50K – $150K", "$150K+"];

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const fd = new FormData(form);

    const data = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      business_type: String(fd.get("business_type") || ""),
      budget: String(fd.get("budget") || ""),
      message: String(fd.get("message") || ""),
    };

    const result = schema.safeParse(data);

    if (!result.success) {
      const nextErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = String(issue.path[0] || "");
        if (key) nextErrors[key] = issue.message;
      });
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const { error } = await dbClient.from("leads").insert({
        name: result.data.name,
        email: result.data.email,
        business_type: result.data.business_type || null,
        budget: result.data.budget || null,
        message: result.data.message,
        user_id: null,
      });

      if (error) {
        toast.error("Couldn't send message", { description: error.message });
        return;
      }

      setSubmitted(true);
      form.reset();
      toast.success("Message sent!", { description: "We'll get back to you within 24 hours." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="bg-gradient-hero-dark text-white">
        <div className="container mx-auto px-4 md:px-6 py-14 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold uppercase tracking-wider mb-4">
            Get in touch
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold leading-tight">
            Let's build something <span className="text-gradient-primary">extraordinary</span>
          </h1>
          <p className="mt-4 text-white/75 text-lg max-w-2xl mx-auto">
            Share your project details and we'll send a tailored proposal within 24 hours.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-14 md:py-16">
        <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h2 className="font-display text-2xl font-extrabold mb-2">Reach us directly</h2>
              <p className="text-muted-foreground">Prefer email or a quick call? We're here.</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 flex gap-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center shadow-glow shrink-0">
                <Mail size={18} />
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Email</div>
                <a
                  href="mailto:hello@dmtech.services"
                  className="font-display font-bold text-lg hover:text-primary transition-colors"
                >
                  hello@dmtech.services
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 flex gap-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center shadow-glow shrink-0">
                <Phone size={18} />
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Phone</div>
                <a
                  href="tel:+15550102024"
                  className="font-display font-bold text-lg hover:text-primary transition-colors"
                >
                  +1 (555) 010-2024
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 flex gap-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center shadow-glow shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Location</div>
                <div className="font-display font-bold text-lg">Remote-first · Worldwide</div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="text-sm font-semibold mb-2">Response time</div>
              <div className="text-2xl font-display font-extrabold text-gradient-primary">&lt; 24 hours</div>
              <div className="text-xs text-muted-foreground mt-1">Monday – Friday</div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-border bg-card p-7 md:p-9 shadow-elegant">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/15 text-primary flex items-center justify-center mb-5 shadow-glow">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="font-display text-2xl font-extrabold mb-2">Thank you!</h3>
                  <p className="text-muted-foreground">
                    We've received your message and will be in touch within 24 hours.
                  </p>
                  <Button className="mt-6" variant="outline" onClick={() => setSubmitted(false)}>
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate className="space-y-5">
                  <h2 className="font-display text-2xl font-extrabold mb-1">Tell us about your project</h2>
                  <p className="text-sm text-muted-foreground -mt-1">All fields with * are required.</p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="text-sm font-medium block mb-1.5">
                        Name *
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        maxLength={100}
                        className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                        placeholder="Jane Doe"
                      />
                      {errors.name && <p className="text-xs text-destructive mt-1.5">{errors.name}</p>}
                    </div>

                    <div>
                      <label htmlFor="email" className="text-sm font-medium block mb-1.5">
                        Email *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        maxLength={255}
                        className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                        placeholder="jane@company.com"
                      />
                      {errors.email && <p className="text-xs text-destructive mt-1.5">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="business_type" className="text-sm font-medium block mb-1.5">
                        Business type
                      </label>
                      <select
                        id="business_type"
                        name="business_type"
                        defaultValue=""
                        className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                      >
                        <option value="">Select…</option>
                        {businessTypes.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="budget" className="text-sm font-medium block mb-1.5">
                        Budget
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        defaultValue=""
                        className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                      >
                        <option value="">Select…</option>
                        {budgets.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="text-sm font-medium block mb-1.5">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      maxLength={2000}
                      className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition resize-none"
                      placeholder="Tell us about your goals, timelines, and what success looks like."
                    />
                    {errors.message && <p className="text-xs text-destructive mt-1.5">{errors.message}</p>}
                  </div>

                  <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                    {loading ? "Sending..." : <>Send message <Send size={16} /></>}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}