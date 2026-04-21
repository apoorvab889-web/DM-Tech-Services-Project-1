import { Play, ExternalLink } from "lucide-react";

export function VideoCard({
  id,
  title,
  channel = "DM + Tech Channel",
}: {
  id: string;
  title: string;
  channel?: string;
}) {
  const watchUrl = `https://www.youtube.com/watch?v=${id}`;
  return (
    <button
      type="button"
      onClick={() => window.open(watchUrl, "_blank", "noopener,noreferrer")}
      aria-label={`Watch ${title} on YouTube`}
      className="group w-full text-left rounded-2xl overflow-hidden bg-card border border-border shadow-md hover:shadow-elegant hover:border-primary/40 hover:-translate-y-1 transition-smooth block"
    >
      <div className="aspect-video relative overflow-hidden bg-black">
        <img
          src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = `https://i.ytimg.com/vi/${id}/0.jpg`;
          }}
        />
        <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/50 transition-colors flex items-center justify-center">
          <span className="w-16 h-16 rounded-full bg-primary/95 text-primary-foreground flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
            <Play size={24} className="ml-1" fill="currentColor" />
          </span>
        </span>
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full bg-background/90 backdrop-blur text-foreground/80 shadow-sm">
          <ExternalLink size={10} /> YouTube
        </span>
      </div>
      <div className="p-4">
        <div className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">{title}</div>
        <div className="text-xs text-muted-foreground mt-1">{channel}</div>
      </div>
    </button>
  );
}
