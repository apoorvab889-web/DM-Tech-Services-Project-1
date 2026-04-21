import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, Save, X, Eye, EyeOff, FileText, Sparkles, Inbox, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { dbClient } from "@/integrations/mongodb/client";
import { useAuth } from "@/lib/auth-context";

type Service = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string | null;
  price: number | null;
  featured: boolean;
  published: boolean;
};

type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  tags: string[] | null;
  published: boolean;
  published_at: string | null;
};

type Lead = {
  id: string;
  name: string;
  email: string;
  business_type: string | null;
  budget: string | null;
  message: string;
  status: string;
  created_at: string;
};

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — DM + Tech Services" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").slice(0, 80);
}

function AdminPage() {
  const { isAdmin, loading } = useAuth();
  const [tab, setTab] = useState<"services" | "blogs" | "leads">("leads");

  if (loading) return <div className="container mx-auto py-20 text-center text-muted-foreground">Loading…</div>;

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-20 text-center max-w-md">
        <h1 className="font-display text-3xl font-extrabold mb-3">Admin access required</h1>
        <p className="text-muted-foreground mb-6">Your account doesn't have admin permissions.</p>
        <Button asChild variant="outline"><Link to="/dashboard">Back to dashboard</Link></Button>
      </div>
    );
  }

  const tabs: { key: typeof tab; label: string }[] = [
    { key: "leads", label: "Leads" },
    { key: "services", label: "Services" },
    { key: "blogs", label: "Blog posts" },
  ];

  return (
    <div className="container mx-auto px-4 md:px-6 py-10 max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary text-sm font-medium mb-1">
            <Sparkles size={16} /> Admin
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold">Control center</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage leads, services and blog posts.</p>
        </div>
        <div className="inline-flex rounded-xl border border-border bg-card p-1 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-smooth ${tab === t.key ? "bg-gradient-primary text-primary-foreground shadow-glow" : "text-foreground/70 hover:text-foreground"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "services" && <ServicesAdmin />}
      {tab === "blogs" && <BlogsAdmin />}
      {tab === "leads" && <LeadsAdmin />}
    </div>
  );
}

function ServicesAdmin() {
  const [items, setItems] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Partial<Service> | null>(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await dbClient.from("services").select("*").order("created_at", { ascending: false });
    setItems((data as Service[] | null) ?? []);
  };
  useEffect(() => { void load(); }, []);

  const save = async () => {
    if (!editing?.title || !editing?.description) {
      toast.error("Title and description are required");
      return;
    }
    setBusy(true);
    const payload = {
      title: editing.title,
      slug: editing.slug || slugify(editing.title),
      description: editing.description,
      category: editing.category || null,
      price: editing.price != null ? Number(editing.price) : null,
      featured: !!editing.featured,
      published: editing.published ?? true,
    };
    const { error } = editing.id
      ? await dbClient.from("services").update(payload).eq("id", editing.id)
      : await dbClient.from("services").insert(payload);
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success(editing.id ? "Service updated" : "Service created");
    setEditing(null);
    void load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    const { error } = await dbClient.from("services").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    void load();
  };

  const togglePublish = async (s: Service) => {
    const { error } = await dbClient.from("services").update({ published: !s.published }).eq("id", s.id);
    if (error) { toast.error(error.message); return; }
    void load();
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-lg">All services ({items.length})</h2>
          <Button size="sm" variant="hero" onClick={() => setEditing({ published: true, featured: false })}>
            <Plus size={14} /> New service
          </Button>
        </div>
        {items.length === 0 && <p className="text-sm text-muted-foreground">No services yet.</p>}
        {items.map((s) => (
          <div key={s.id} className="bg-card border border-border rounded-xl p-4 flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold truncate">{s.title}</h3>
                {!s.published && <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Draft</span>}
                {s.featured && <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-primary/15 text-primary">Featured</span>}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{s.description}</p>
              <div className="text-xs text-muted-foreground mt-1">{s.category} {s.price != null && `· $${s.price}`}</div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button size="icon" variant="ghost" onClick={() => togglePublish(s)} aria-label="Toggle publish">
                {s.published ? <Eye size={16} /> : <EyeOff size={16} />}
              </Button>
              <Button size="icon" variant="ghost" onClick={() => setEditing(s)} aria-label="Edit">
                <Pencil size={16} />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => remove(s.id)} aria-label="Delete">
                <Trash2 size={16} className="text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="lg:col-span-1">
        {editing ? (
          <div className="bg-card border border-border rounded-2xl p-5 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold">{editing.id ? "Edit service" : "New service"}</h3>
              <Button size="icon" variant="ghost" onClick={() => setEditing(null)}><X size={16} /></Button>
            </div>
            <div className="space-y-3">
              <div>
                <Label>Title</Label>
                <Input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value, slug: editing.id ? editing.slug : slugify(e.target.value) })} />
              </div>
              <div>
                <Label>Slug</Label>
                <Input value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })} />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea rows={4} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Category</Label>
                  <Input value={editing.category ?? ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
                </div>
                <div>
                  <Label>Price ($)</Label>
                  <Input type="number" value={editing.price ?? ""} onChange={(e) => setEditing({ ...editing, price: e.target.value === "" ? null : Number(e.target.value) })} />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={!!editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.published ?? true} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />
                Published
              </label>
              <Button variant="hero" className="w-full" onClick={save} disabled={busy}>
                <Save size={14} /> {busy ? "Saving…" : "Save"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-muted/40 border border-dashed border-border rounded-2xl p-8 text-center text-sm text-muted-foreground">
            Select a service to edit, or create a new one.
          </div>
        )}
      </div>
    </div>
  );
}

function BlogsAdmin() {
  const { user } = useAuth();
  const [items, setItems] = useState<Blog[]>([]);
  const [editing, setEditing] = useState<Partial<Blog> | null>(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await dbClient.from("blogs").select("*").order("created_at", { ascending: false });
    setItems((data as Blog[] | null) ?? []);
  };
  useEffect(() => { void load(); }, []);

  const save = async () => {
    if (!editing?.title || !editing?.content) {
      toast.error("Title and content are required");
      return;
    }
    setBusy(true);
    const willPublish = editing.published ?? false;
    const payload = {
      title: editing.title,
      slug: editing.slug || slugify(editing.title),
      excerpt: editing.excerpt || null,
      content: editing.content,
      cover_image: editing.cover_image || null,
      tags: editing.tags ?? [],
      author_id: user?.id ?? null,
      published: willPublish,
      published_at: willPublish && !editing.published_at ? new Date().toISOString() : editing.published_at ?? null,
    };
    const { error } = editing.id
      ? await dbClient.from("blogs").update(payload).eq("id", editing.id)
      : await dbClient.from("blogs").insert(payload);
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success(editing.id ? "Post updated" : "Post created");
    setEditing(null);
    void load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const { error } = await dbClient.from("blogs").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    void load();
  };

  const togglePublish = async (b: Blog) => {
    const newVal = !b.published;
    const { error } = await dbClient
      .from("blogs")
      .update({ published: newVal, published_at: newVal && !b.published_at ? new Date().toISOString() : b.published_at })
      .eq("id", b.id);
    if (error) { toast.error(error.message); return; }
    void load();
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-lg">All posts ({items.length})</h2>
          <Button size="sm" variant="hero" onClick={() => setEditing({ published: false, tags: [] })}>
            <Plus size={14} /> New post
          </Button>
        </div>
        {items.length === 0 && <p className="text-sm text-muted-foreground">No posts yet.</p>}
        {items.map((b) => (
          <div key={b.id} className="bg-card border border-border rounded-xl p-4 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary text-primary-foreground flex items-center justify-center shrink-0">
              <FileText size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold truncate">{b.title}</h3>
                {!b.published && <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Draft</span>}
              </div>
              {b.excerpt && <p className="text-xs text-muted-foreground line-clamp-2">{b.excerpt}</p>}
              <div className="text-xs text-muted-foreground mt-1">/{b.slug}</div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button size="icon" variant="ghost" onClick={() => togglePublish(b)} aria-label="Toggle publish">
                {b.published ? <Eye size={16} /> : <EyeOff size={16} />}
              </Button>
              <Button size="icon" variant="ghost" onClick={() => setEditing(b)} aria-label="Edit">
                <Pencil size={16} />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => remove(b.id)} aria-label="Delete">
                <Trash2 size={16} className="text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="lg:col-span-1">
        {editing ? (
          <div className="bg-card border border-border rounded-2xl p-5 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold">{editing.id ? "Edit post" : "New post"}</h3>
              <Button size="icon" variant="ghost" onClick={() => setEditing(null)}><X size={16} /></Button>
            </div>
            <div className="space-y-3">
              <div>
                <Label>Title</Label>
                <Input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value, slug: editing.id ? editing.slug : slugify(e.target.value) })} />
              </div>
              <div>
                <Label>Slug</Label>
                <Input value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })} />
              </div>
              <div>
                <Label>Excerpt</Label>
                <Textarea rows={2} value={editing.excerpt ?? ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} />
              </div>
              <div>
                <Label>Cover image URL</Label>
                <Input value={editing.cover_image ?? ""} onChange={(e) => setEditing({ ...editing, cover_image: e.target.value })} placeholder="https://…" />
              </div>
              <div>
                <Label>Tags (comma-separated)</Label>
                <Input
                  value={(editing.tags ?? []).join(", ")}
                  onChange={(e) => setEditing({ ...editing, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
                />
              </div>
              <div>
                <Label>Content</Label>
                <Textarea rows={10} value={editing.content ?? ""} onChange={(e) => setEditing({ ...editing, content: e.target.value })} />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.published ?? false} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />
                Published
              </label>
              <Button variant="hero" className="w-full" onClick={save} disabled={busy}>
                <Save size={14} /> {busy ? "Saving…" : "Save"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-muted/40 border border-dashed border-border rounded-2xl p-8 text-center text-sm text-muted-foreground">
            Select a post to edit, or create a new one.
          </div>
        )}
      </div>
    </div>
  );
}

const STATUSES = ["new", "contacted", "closed"] as const;
type Status = typeof STATUSES[number];

function LeadsAdmin() {
  const [items, setItems] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<Status | "all">("all");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const load = async () => {
    const { data } = await dbClient.from("leads").select("*").order("created_at", { ascending: false });
    setItems((data as Lead[] | null) ?? []);
  };
  useEffect(() => { void load(); }, []);

  const updateStatus = async (id: string, status: Status) => {
    const { error } = await dbClient.from("leads").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Marked as ${status}`);
    setSelected((s) => (s && s.id === id ? { ...s, status } : s));
    void load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    const { error } = await dbClient.from("leads").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Lead deleted");
    setSelected((s) => (s && s.id === id ? null : s));
    void load();
  };

  const filtered = filter === "all" ? items : items.filter((l) => l.status === filter);
  const paged = filtered.slice(page * pageSize, page * pageSize + pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const counts = {
    all: items.length,
    new: items.filter((l) => l.status === "new").length,
    contacted: items.filter((l) => l.status === "contacted").length,
    closed: items.filter((l) => l.status === "closed").length,
  };

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      new: "bg-primary/15 text-primary",
      contacted: "bg-secondary/15 text-secondary",
      closed: "bg-muted text-muted-foreground",
    };
    return <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${map[s] ?? "bg-muted text-muted-foreground"}`}>{s}</span>;
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="font-display font-bold text-lg flex items-center gap-2">
            <Inbox size={18} className="text-primary" /> Leads ({filtered.length})
          </h2>
          <div className="inline-flex rounded-lg border border-border bg-card p-1 text-xs">
            {(["all", ...STATUSES] as const).map((s) => (
              <button
                key={s}
                onClick={() => { setFilter(s); setPage(0); }}
                className={`px-3 py-1.5 rounded-md font-semibold capitalize transition-smooth ${filter === s ? "bg-gradient-primary text-primary-foreground" : "text-foreground/70 hover:text-foreground"}`}
              >
                {s} ({counts[s]})
              </button>
            ))}
          </div>
        </div>

        {paged.length === 0 && <p className="text-sm text-muted-foreground">No leads in this view.</p>}
        {paged.map((l) => (
          <button
            key={l.id}
            onClick={() => setSelected(l)}
            className={`w-full text-left bg-card border rounded-xl p-4 flex items-start gap-4 hover:border-primary/50 transition-smooth ${selected?.id === l.id ? "border-primary" : "border-border"}`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold truncate">{l.name}</h3>
                {statusBadge(l.status)}
              </div>
              <div className="text-xs text-muted-foreground truncate">{l.email}</div>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{l.message}</p>
              <div className="text-[10px] text-muted-foreground mt-1">
                {new Date(l.created_at).toLocaleDateString()} · {l.business_type ?? "—"} · {l.budget ?? "—"}
              </div>
            </div>
          </button>
        ))}

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>Previous</Button>
            <span className="text-xs text-muted-foreground">Page {page + 1} of {totalPages}</span>
            <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>Next</Button>
          </div>
        )}
      </div>

      <div className="lg:col-span-1">
        {selected ? (
          <div className="bg-card border border-border rounded-2xl p-5 sticky top-20 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold">Lead details</h3>
              <Button size="icon" variant="ghost" onClick={() => setSelected(null)}><X size={16} /></Button>
            </div>
            <div className="space-y-2">
              <div>
                <div className="text-xs text-muted-foreground">Name</div>
                <div className="font-semibold">{selected.name}</div>
              </div>
              <a href={`mailto:${selected.email}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                <Mail size={14} /> {selected.email}
              </a>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-muted/40 rounded-lg p-2">
                  <div className="text-muted-foreground">Business</div>
                  <div className="font-medium">{selected.business_type ?? "—"}</div>
                </div>
                <div className="bg-muted/40 rounded-lg p-2">
                  <div className="text-muted-foreground">Budget</div>
                  <div className="font-medium">{selected.budget ?? "—"}</div>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Message</div>
                <p className="text-sm bg-muted/40 rounded-lg p-3 whitespace-pre-wrap">{selected.message}</p>
              </div>
              <div className="text-[10px] text-muted-foreground">Submitted {new Date(selected.created_at).toLocaleString()}</div>
            </div>

            <div>
              <Label className="text-xs">Update status</Label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {STATUSES.map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={selected.status === s ? "hero" : "outline"}
                    onClick={() => updateStatus(selected.id, s)}
                    className="capitalize"
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>

            <Button variant="outline" className="w-full text-destructive hover:text-destructive" onClick={() => remove(selected.id)}>
              <Trash2 size={14} /> Delete lead
            </Button>
          </div>
        ) : (
          <div className="bg-muted/40 border border-dashed border-border rounded-2xl p-8 text-center text-sm text-muted-foreground">
            <Phone size={20} className="mx-auto mb-2 opacity-60" />
            Select a lead to view details and update its status.
          </div>
        )}
      </div>
    </div>
  );
}
