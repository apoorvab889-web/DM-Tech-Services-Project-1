import { useRef, useState } from "react";

export function LocalVideoCard({
  src,
  title,
  poster,
}: {
  src: string;
  title: string;
  poster?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    const v = ref.current;
    if (!v) return;
    v.play();
    setPlaying(true);
  };

  return (
    <div className="group rounded-2xl overflow-hidden bg-card border border-border shadow-md hover:shadow-elegant hover:border-primary/40 transition-smooth">
      <div className="aspect-video relative overflow-hidden bg-black">
        <video
          ref={ref}
          src={src}
          poster={poster}
          controls={playing}
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
        />
        {!playing && (
          <button
            type="button"
            onClick={handlePlay}
            aria-label={`Play ${title}`}
            className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors"
          >
            <span className="w-16 h-16 rounded-full bg-primary/95 text-primary-foreground flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      <div className="p-4">
        <div className="font-semibold text-sm">{title}</div>
        <div className="text-xs text-muted-foreground mt-1">DM + Tech Channel</div>
      </div>
    </div>
  );
}
