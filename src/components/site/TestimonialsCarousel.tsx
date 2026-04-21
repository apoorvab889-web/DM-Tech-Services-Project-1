import { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import { dbClient } from "@/integrations/mongodb/client";
import { Skeleton } from "@/components/ui/skeleton";

type T = {
  id: string;
  client_name: string;
  company: string | null;
  role: string | null;
  feedback: string;
  rating: number;
  avatar_url: string | null;
};

export function TestimonialsCarousel() {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [i, setI] = useState(0);

  useEffect(() => {
    dbClient
      .from("testimonials")
      .select("*")
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setItems((data as T[] | null) ?? []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (items.length < 2) return;
    const id = setInterval(() => setI((p) => (p + 1) % items.length), 6000);
    return () => clearInterval(id);
  }, [items.length]);

  if (loading) {
    return <Skeleton className="h-64 max-w-3xl mx-auto rounded-3xl" />;
  }
  if (!items.length) return null;
  const t = items[i];

  return (
    <div className="relative max-w-3xl mx-auto">
      <div className="absolute -inset-6 bg-gradient-primary opacity-10 blur-3xl rounded-3xl pointer-events-none" />
      <div className="relative glass rounded-3xl p-8 md:p-12 shadow-elegant overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary" />
        <Quote className="text-primary/30 mb-4" size={42} />
        <div key={t.id} className="animate-fade-up">
          <div className="flex gap-0.5 mb-5">
            {Array.from({ length: t.rating }).map((_, k) => (
              <Star key={k} size={16} className="fill-primary text-primary" />
            ))}
          </div>
          <p className="font-display text-xl md:text-2xl font-medium leading-relaxed text-foreground">
            "{t.feedback}"
          </p>
          <div className="mt-6 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold shadow-glow">
              {t.client_name[0]}
            </div>
            <div>
              <div className="font-semibold text-sm">{t.client_name}</div>
              <div className="text-xs text-muted-foreground">
                {t.role}
                {t.role && t.company && " · "}
                {t.company}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 flex items-center gap-2">
          {items.map((_, k) => (
            <button
              key={k}
              onClick={() => setI(k)}
              aria-label={`Testimonial ${k + 1}`}
              className={`h-2 rounded-full transition-all ${k === i ? "w-8 bg-primary shadow-glow" : "w-2 bg-muted hover:bg-muted-foreground/40"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
