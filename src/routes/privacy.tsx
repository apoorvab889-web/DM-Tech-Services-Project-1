import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — DM + Tech Services" },
      { name: "description", content: "How DM + Tech Services collects, uses, and protects your information." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <article className="container mx-auto px-4 md:px-6 py-16 md:py-24 max-w-3xl">
      <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-3">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: April 17, 2026</p>

      <div className="space-y-8 text-foreground/85 leading-relaxed">
        <section>
          <h2 className="font-display text-xl font-bold mb-2 text-foreground">1. Introduction</h2>
          <p>DM + Tech Services ("we", "us", "our") respects your privacy. This policy explains what data we collect, how we use it, and the rights you have over it.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold mb-2 text-foreground">2. Information we collect</h2>
          <p>We collect information you provide directly (name, email, message via our contact form), and basic usage data (pages viewed, device type) through privacy-respecting analytics.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold mb-2 text-foreground">3. How we use your information</h2>
          <p>To respond to inquiries, deliver services, send relevant updates (only if you opt in), and improve our website. We do not sell your data.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold mb-2 text-foreground">4. Cookies</h2>
          <p>We use minimal cookies for authentication and analytics. You can control cookies through your browser settings.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold mb-2 text-foreground">5. Your rights</h2>
          <p>You may request access, correction, or deletion of your data at any time by emailing privacy@dmtech.services.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold mb-2 text-foreground">6. Contact</h2>
          <p>For questions about this policy, contact us at privacy@dmtech.services.</p>
        </section>
      </div>
    </article>
  );
}
