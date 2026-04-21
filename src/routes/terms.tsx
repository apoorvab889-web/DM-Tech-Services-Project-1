import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — DM + Tech Services" },
      { name: "description", content: "The terms governing your use of DM + Tech Services." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <article className="container mx-auto px-4 md:px-6 py-16 md:py-24 max-w-3xl">
      <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-3">Terms & Conditions</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: April 17, 2026</p>

      <div className="space-y-8 text-foreground/85 leading-relaxed">
        <section>
          <h2 className="font-display text-xl font-bold mb-2 text-foreground">1. Acceptance of terms</h2>
          <p>By accessing or using DM + Tech Services, you agree to be bound by these terms. If you disagree, please do not use the service.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold mb-2 text-foreground">2. Use of the service</h2>
          <p>You agree to use the service lawfully, not to interfere with its operation, and not to attempt unauthorized access to any portion of the platform.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold mb-2 text-foreground">3. Intellectual property</h2>
          <p>All content, branding, and code on this site are the property of DM + Tech Services unless otherwise noted. You may not reproduce or redistribute without permission.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold mb-2 text-foreground">4. Engagements & deliverables</h2>
          <p>Specific terms for client engagements are governed by individual statements of work.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold mb-2 text-foreground">5. Limitation of liability</h2>
          <p>The service is provided "as is". We are not liable for any indirect, incidental, or consequential damages arising from its use.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold mb-2 text-foreground">6. Changes</h2>
          <p>We may update these terms. Continued use of the service after changes constitutes acceptance.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold mb-2 text-foreground">7. Contact</h2>
          <p>Questions? Email legal@dmtech.services.</p>
        </section>
      </div>
    </article>
  );
}
