import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

type Msg = { role: "bot" | "user"; text: string };

const intro: Msg = {
  role: "bot",
  text: "Hi! 👋 I'm DM, your AI assistant. Ask me about our services, pricing, or how we can help grow your business.",
};

function getReply(input: string): string {
  const q = input.toLowerCase();
  if (/(price|pricing|cost|quote|budget)/.test(q))
    return "Our projects start from $1,500 for landing pages and scale based on scope. Drop your details on the Contact page and we'll send a tailored proposal within 24 hours.";
  if (/(seo|search|rank|google)/.test(q))
    return "Our SEO service covers technical audits, on-page optimization, content strategy, and authority building. Most clients see meaningful ranking lifts within 90 days.";
  if (/(web|website|develop|build|app)/.test(q))
    return "We build fast, modern websites and web apps using React, TanStack, and Next-gen tooling. Designs are conversion-focused and fully responsive.";
  if (/(market|social|ads|instagram|facebook)/.test(q))
    return "We run end-to-end social media marketing — content, paid ads, community, and analytics — across LinkedIn, Instagram, Facebook, and YouTube.";
  if (/(brand|logo|identity)/.test(q))
    return "Branding includes naming, logo design, visual identity systems, and brand guidelines that scale across every touchpoint.";
  if (/(ai|artificial|automation|chatbot|gpt)/.test(q))
    return "We build AI solutions like chatbots, content engines, and workflow automations using OpenAI, Gemini, and custom models — integrated directly into your stack.";
  if (/(contact|reach|talk|call|email)/.test(q))
    return "You can reach us via the Contact page, email hello@dmtech.services, or call +1 (555) 010-2024.";
  if (/(hi|hello|hey|yo)/.test(q))
    return "Hello! 👋 What are you looking to grow today — a website, your traffic, or something more ambitious?";
  if (/(thank|thanks|ty)/.test(q))
    return "You're welcome! Anything else I can help with?";
  return "Great question! Our team can give a detailed answer — please share your details on the Contact page and we'll reach out within one business day.";
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([intro]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [...m, { role: "bot", text: getReply(text) }]);
    }, 500);
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-gradient-primary shadow-glow flex items-center justify-center text-primary-foreground hover:scale-110 transition-smooth"
        aria-label="Open chat"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[calc(100vw-2.5rem)] sm:w-[380px] h-[520px] max-h-[calc(100vh-8rem)] bg-card rounded-2xl shadow-elegant border border-border flex flex-col overflow-hidden animate-fade-up">
          <div className="bg-gradient-hero text-white p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="font-display font-bold text-base leading-tight">DM Assistant</div>
              <div className="text-xs text-white/70 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-glow-pulse" />
                Online now
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/30">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-card text-card-foreground border border-border rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-border bg-card flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type your question..."
              className="flex-1 px-3 py-2 text-sm rounded-lg bg-muted/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            />
            <Button size="icon" variant="hero" onClick={send} aria-label="Send">
              <Send size={16} />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
