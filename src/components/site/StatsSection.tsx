import { useEffect, useRef, useState } from "react";
import { Briefcase, Users, TrendingUp, Award } from "lucide-react";

const stats = [
  { icon: Briefcase, end: 150, suffix: "+", label: "Projects shipped" },
  { icon: Users, end: 80, suffix: "+", label: "Happy clients" },
  { icon: TrendingUp, end: 340, suffix: "%", label: "Avg. revenue lift" },
  { icon: Award, end: 12, suffix: "", label: "Industry awards" },
];

function Counter({ end, suffix }: { end: number; suffix: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          const dur = 1400;
          const t0 = performance.now();
          const step = (t: number) => {
            const p = Math.min(1, (t - t0) / dur);
            setVal(Math.round(end * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [end]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="container mx-auto px-4 md:px-6 py-16">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="glass rounded-2xl p-6 text-center hover:-translate-y-1 hover:shadow-glow transition-smooth"
          >
            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center shadow-glow mb-3">
              <s.icon size={20} />
            </div>
            <div className="font-display text-3xl md:text-4xl font-extrabold text-gradient-primary">
              <Counter end={s.end} suffix={s.suffix} />
            </div>
            <div className="text-xs md:text-sm text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
