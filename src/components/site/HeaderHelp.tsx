import { HelpCircle, Mail, MessageCircle, BookOpen } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How quickly do you respond?",
    a: "Within 24 hours on business days. Most messages get a reply within 4 hours.",
  },
  {
    q: "What services do you offer?",
    a: "Web development, SEO, social media, branding, AI solutions, and growth analytics.",
  },
  {
    q: "How do I book a free audit?",
    a: "Head to the Contact page, share your project details, and we'll schedule a 30-minute strategy call.",
  },
  {
    q: "Where can I track my projects?",
    a: "Once signed in, your dashboard shows lead status, services, and activity in real time.",
  },
];

export function HeaderHelp() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Help & support"
        className="w-9 h-9 rounded-lg hover:bg-muted text-foreground/80 hover:text-primary flex items-center justify-center transition-smooth"
      >
        <HelpCircle size={18} />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl flex items-center gap-2">
              <span className="w-9 h-9 rounded-lg bg-gradient-primary text-primary-foreground flex items-center justify-center shadow-glow">
                <HelpCircle size={18} />
              </span>
              Help & Support
            </DialogTitle>
            <DialogDescription>
              Quick answers to common questions, or reach our team directly.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-2 my-2">
            <a
              href="mailto:hello@dmtech.services"
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/40 hover:bg-primary/10 hover:text-primary transition-smooth text-center"
            >
              <Mail size={16} />
              <span className="text-[11px] font-semibold">Email us</span>
            </a>
            <button
              onClick={() => {
                setOpen(false);
                document
                  .querySelector<HTMLButtonElement>("[aria-label='Open chat']")
                  ?.click();
              }}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/40 hover:bg-primary/10 hover:text-primary transition-smooth text-center"
            >
              <MessageCircle size={16} />
              <span className="text-[11px] font-semibold">Live chat</span>
            </button>
            <a
              href="/blog"
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/40 hover:bg-primary/10 hover:text-primary transition-smooth text-center"
            >
              <BookOpen size={16} />
              <span className="text-[11px] font-semibold">Read docs</span>
            </a>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`help-${i}`}>
                <AccordionTrigger className="text-left text-sm font-semibold hover:text-primary">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </DialogContent>
      </Dialog>
    </>
  );
}
