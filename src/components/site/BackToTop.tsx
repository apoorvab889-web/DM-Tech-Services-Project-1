import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-24 right-5 z-40 w-11 h-11 rounded-full bg-card border border-border text-primary shadow-elegant hover:shadow-glow hover:-translate-y-1 transition-smooth flex items-center justify-center"
    >
      <ArrowUp size={18} />
    </button>
  );
}
