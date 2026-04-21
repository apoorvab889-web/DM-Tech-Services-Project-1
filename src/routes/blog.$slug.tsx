import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, ArrowLeft } from "lucide-react";
import { dbClient } from "@/integrations/mongodb/client";

type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  tags: string[] | null;
  published_at: string | null;
};

export const Route = createFileRoute("/blog/$slug")({
  head: () => ({
    meta: [
      { title: "Blog post — DM + Tech Services" },
      { name: "description", content: "Read insights from the DM + Tech team." },
    ],
  }),
  component: BlogPostPage,
});

function BlogPostPage() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    dbClient
      .from("blogs")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) {
          setMissing(true);
        } else {
          setPost(data as Blog);
        }
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Loading…</div>;
  }

  if (missing || !post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-extrabold mb-3">Post not found</h1>
        <Link to="/blog" className="text-primary font-semibold hover:underline">← Back to blog</Link>
      </div>
    );
  }

  return (
    <article className="container mx-auto px-4 md:px-6 py-12 md:py-16 max-w-3xl">
      <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft size={14} /> All posts
      </Link>

      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.map((t) => (
            <span key={t} className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
              {t}
            </span>
          ))}
        </div>
      )}

      <h1 className="font-display text-3xl md:text-5xl font-extrabold leading-tight mb-4">{post.title}</h1>
      {post.published_at && (
        <div className="text-sm text-muted-foreground flex items-center gap-1.5 mb-8">
          <Calendar size={14} />
          {new Date(post.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </div>
      )}

      {post.cover_image && (
        <img src={post.cover_image} alt={post.title} className="w-full aspect-video object-cover rounded-2xl mb-10 shadow-elegant" />
      )}

      <div className="prose prose-slate max-w-none whitespace-pre-wrap text-base leading-relaxed text-foreground/90">
        {post.content}
      </div>
    </article>
  );
}
