import { Link, Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, ArrowRight } from "lucide-react";
import { dbClient } from "@/integrations/mongodb/client";
import blogSeo from "@/assets/blog-seo.jpg";
import blogMarketing from "@/assets/blog-marketing.jpg";
import blogAi from "@/assets/blog-ai.jpg";

type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  tags: string[] | null;
  published_at: string | null;
};

// Pick a category-relevant fallback image based on tags/title
function pickFallbackImage(post: Blog): string {
  const haystack = `${post.title} ${(post.tags ?? []).join(" ")}`.toLowerCase();
  if (/(ai|gpt|automation|machine|llm)/.test(haystack)) return blogAi;
  if (/(seo|search|analytics|rank|traffic)/.test(haystack)) return blogSeo;
  return blogMarketing;
}

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — DM + Tech Services" },
      { name: "description", content: "Insights on digital marketing, SEO, AI, branding, and modern web growth strategies from the DM + Tech team." },
      { property: "og:title", content: "Blog — DM + Tech Services" },
      { property: "og:description", content: "Strategy, playbooks, and tactical guides for modern marketing teams." },
    ],
  }),
  component: BlogIndexPage,
});

function BlogIndexPage() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/blog") return <Outlet />;
  const [posts, setPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dbClient
      .from("blogs")
      .select("id,title,slug,excerpt,cover_image,tags,published_at")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .then(({ data }) => {
        setPosts((data as Blog[] | null) ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <section className="bg-gradient-hero-dark text-white relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-accent/30 blur-3xl" />
        <div className="container relative mx-auto px-4 md:px-6 py-20 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold uppercase tracking-wider mb-5">
            Insights
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold max-w-3xl mx-auto leading-tight">
            The <span className="text-gradient-primary">DM + Tech</span> blog
          </h1>
          <p className="mt-5 text-white/75 text-lg max-w-2xl mx-auto">
            Strategy, playbooks, and tactical guides for modern marketing teams.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-16 md:py-20">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="rounded-2xl bg-card border border-border overflow-hidden animate-pulse">
                <div className="aspect-video bg-muted" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No posts yet — check back soon.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p, i) => {
              const cover = p.cover_image || pickFallbackImage(p);
              return (
                <Link
                  key={p.id}
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="group bg-card border border-border rounded-2xl overflow-hidden shadow-md hover:shadow-elegant hover:border-primary/40 hover:-translate-y-1 transition-smooth animate-fade-up flex flex-col"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="aspect-video overflow-hidden bg-muted relative">
                    <img
                      src={cover}
                      alt={p.title}
                      loading="lazy"
                      width={1280}
                      height={768}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {p.tags && p.tags.length > 0 && (
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        {p.tags.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full bg-background/90 backdrop-blur text-primary shadow-sm"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h2 className="font-display text-lg font-extrabold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {p.title}
                    </h2>
                    {p.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{p.excerpt}</p>
                    )}
                    <div className="mt-auto flex items-center justify-between pt-3 border-t border-border">
                      {p.published_at ? (
                        <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <Calendar size={12} />
                          {new Date(p.published_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      ) : (
                        <span />
                      )}
                      <span className="inline-flex items-center gap-1 text-primary text-xs font-semibold group-hover:gap-2 transition-all">
                        Read more <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
