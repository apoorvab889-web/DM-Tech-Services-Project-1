import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    const t1 = window.setTimeout(() => setHiding(true), 1100);
    const t2 = window.setTimeout(() => setVisible(false), 1550);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-all duration-500 ${hiding ? "opacity-0 pointer-events-none scale-[1.02]" : "opacity-100"}`}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,oklch(0.7_0.2_290_/_0.16),transparent_38%),radial-gradient(circle_at_bottom_right,oklch(0.72_0.14_185_/_0.18),transparent_30%)]" />
      <div className="relative text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-primary text-primary-foreground shadow-glow animate-float">
          <Sparkles size={30} />
        </div>
        <div className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">
          <span className="text-foreground">DM</span>
          <span className="text-gradient-primary px-1">+</span>
          <span className="text-foreground">Tech</span>
        </div>
        <p className="mt-3 text-sm md:text-base text-muted-foreground">Launching your growth stack…</p>
        <div className="mt-6 h-1.5 w-60 overflow-hidden rounded-full bg-muted mx-auto">
          <div className="h-full w-1/2 rounded-full bg-gradient-primary animate-splash-progress" />
        </div>
      </div>
    </div>
  );
}
