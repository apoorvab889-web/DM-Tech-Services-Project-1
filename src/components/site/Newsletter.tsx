import { useState, type FormEvent } from "react";
import { Mail, Send, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { dbClient } from "@/integrations/mongodb/client";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
});

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse({ email });
    if (!r.success) {
      toast.error(r.error.issues[0].message);
      return;
    }
    setBusy(true);
    const { error } = await dbClient
      .from("newsletter_subscribers")
      .insert({ email: r.data.email, source: "homepage" });
    setBusy(false);
    if (error && !error.message.includes("duplicate")) {
      toast.error(error.message);
      return;
    }
    setDone(true);
    toast.success("You're in!", { description: "Watch for our weekly growth playbook." });
  };

  return (
    <section className="container mx-auto px-4 md:px-6 py-16">
      <div className="relative overflow-hidden glass rounded-3xl p-8 md:p-12 text-center">
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-secondary/30 blur-3xl" />
        <div className="relative max-w-2xl mx-auto">
          <div className="inline-flex w-12 h-12 mx-auto rounded-xl bg-gradient-primary text-primary-foreground items-center justify-center shadow-glow mb-4">
            <Mail size={20} />
          </div>
          <h2 className="font-display text-2xl md:text-4xl font-extrabold mb-3">
            Weekly growth playbook, in your inbox
          </h2>
          <p className="text-muted-foreground mb-6">
            One actionable tactic, every Tuesday. No fluff. Unsubscribe anytime.
          </p>
          {done ? (
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/15 text-primary font-semibold">
              <CheckCircle2 size={18} /> Subscribed — see you Tuesday
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                maxLength={255}
                className="flex-1 px-4 py-3 rounded-xl bg-background/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              />
              <Button type="submit" variant="hero" disabled={busy}>
                {busy ? "Joining…" : <>Subscribe <Send size={14} /></>}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
