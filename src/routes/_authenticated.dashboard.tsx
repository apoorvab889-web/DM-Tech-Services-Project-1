import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  LayoutDashboard, User, Mail, Building2, Phone, Shield, LogOut,
  Inbox, Activity, Sparkles, ArrowRight, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { dbClient } from "@/integrations/mongodb/client";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — DM + Tech Services" },
      { name: "description", content: "Manage your account, profile, leads and activity." },
    ],
  }),
  component: DashboardPage,
});

type Lead = {
  id: string;
  name: string;
  email: string;
  message: string;
  business_type: string | null;
  budget: string | null;
  status: string;
  created_at: string;
};

type Section = "overview" | "leads" | "profile";

function DashboardPage() {
  const { user, profile, roles, isAdmin, signOut, refreshProfile } = useAuth();
  const [section, setSection] = useState<Section>("overview");

  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(true);

  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [company, setCompany] = useState(profile?.company ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLeadsLoading(true);
    dbClient
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        setLeads((data as Lead[] | null) ?? []);
        setLeadsLoading(false);
      });
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const { error } = await dbClient
      .from("profiles")
      .upsert({ id: user.id, full_name: fullName, company, phone, bio }, { onConflict: "id" });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Profile saved");
    await refreshProfile();
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
  };

  const nav: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "leads", label: "My leads", icon: Inbox },
    { id: "profile", label: "Profile & settings", icon: User },
  ];

  const statusColor: Record<string, string> = {
    new: "bg-primary/15 text-primary",
    contacted: "bg-secondary/30 text-foreground",
    closed: "bg-muted text-muted-foreground",
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-soft">
      <div className="container mx-auto max-w-7xl px-4 md:px-6 py-10">
        <div className="grid lg:grid-cols-[240px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="space-y-2 lg:sticky lg:top-24 lg:self-start">
            <div className="glass rounded-2xl p-5 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center font-bold shadow-glow">
                  {(profile?.full_name?.[0] ?? user?.email?.[0] ?? "U").toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate">{profile?.full_name || "Member"}</div>
                  <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                {roles.map((r) => (
                  <span key={r} className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${r === "admin" ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"}`}>{r}</span>
                ))}
              </div>
            </div>

            <nav className="glass rounded-2xl p-2">
              {nav.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setSection(n.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth ${
                    section === n.id ? "bg-gradient-primary text-primary-foreground shadow-glow" : "text-foreground/75 hover:bg-card hover:text-foreground"
                  }`}
                >
                  <n.icon size={16} /> {n.label}
                </button>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/75 hover:bg-card hover:text-foreground transition-smooth"
                >
                  <Shield size={16} /> Admin panel
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive/80 hover:bg-destructive/10 hover:text-destructive transition-smooth mt-1"
              >
                <LogOut size={16} /> Sign out
              </button>
            </nav>
          </aside>

          {/* Main */}
          <main className="min-w-0">
            {section === "overview" && (
              <div className="space-y-6 animate-fade-up">
                <div>
                  <div className="flex items-center gap-2 text-primary text-sm font-medium mb-1">
                    <Sparkles size={14} /> Welcome back
                  </div>
                  <h1 className="font-display font-extrabold text-3xl md:text-4xl">
                    Hi{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""} 👋
                  </h1>
                  <p className="text-muted-foreground mt-1">Here's what's happening with your account.</p>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <StatCard label="My leads" value={leads.length} icon={Inbox} accent="primary" />
                  <StatCard label="Active conversations" value={leads.filter((l) => l.status === "contacted").length} icon={Activity} accent="secondary" />
                  <StatCard label="Account role" value={isAdmin ? "Admin" : "Member"} icon={Shield} accent="primary" />
                </div>

                <div className="grid lg:grid-cols-2 gap-4">
                  <div className="glass rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-display font-bold">Recent activity</h2>
                      <button onClick={() => setSection("leads")} className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                        View all <ArrowRight size={12} />
                      </button>
                    </div>
                    {leadsLoading ? (
                      <div className="space-y-3">
                        <Skeleton className="h-12" /><Skeleton className="h-12" /><Skeleton className="h-12" />
                      </div>
                    ) : leads.length === 0 ? (
                      <div className="text-sm text-muted-foreground py-6 text-center">
                        No activity yet. <Link to="/contact" className="text-primary hover:underline">Send a request</Link> to get started.
                      </div>
                    ) : (
                      <ol className="relative border-s border-border ms-2 space-y-4">
                        {leads.slice(0, 5).map((l) => (
                          <li key={l.id} className="ms-4">
                            <span className="absolute -start-1.5 mt-1.5 w-3 h-3 rounded-full bg-gradient-primary shadow-glow" />
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock size={11} /> {new Date(l.created_at).toLocaleString()}
                            </div>
                            <div className="font-medium text-sm mt-0.5">
                              Submitted: <span className="text-foreground">{l.name}</span>
                              <span className={`ms-2 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${statusColor[l.status] ?? "bg-muted"}`}>{l.status}</span>
                            </div>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>

                  <div className="glass rounded-2xl p-6">
                    <h2 className="font-display font-bold mb-4">Quick actions</h2>
                    <div className="space-y-2">
                      <ActionLink to="/services" label="Browse our services" />
                      <ActionLink to="/contact" label="Request a proposal" />
                      <ActionLink to="/blog" label="Read latest insights" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {section === "leads" && (
              <div className="animate-fade-up space-y-4">
                <div>
                  <h1 className="font-display font-extrabold text-3xl">My leads</h1>
                  <p className="text-muted-foreground mt-1">Requests you've submitted to our team.</p>
                </div>
                {leadsLoading ? (
                  <div className="space-y-3"><Skeleton className="h-24" /><Skeleton className="h-24" /></div>
                ) : leads.length === 0 ? (
                  <div className="glass rounded-2xl p-10 text-center">
                    <Inbox className="mx-auto mb-3 text-primary" size={28} />
                    <p className="text-muted-foreground mb-4">You haven't sent any requests yet.</p>
                    <Button asChild variant="hero"><Link to="/contact">Send your first request</Link></Button>
                  </div>
                ) : (
                  leads.map((l) => (
                    <div key={l.id} className="glass rounded-xl p-5">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="font-display font-bold">{l.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(l.created_at).toLocaleString()}
                            {l.business_type && <> · {l.business_type}</>}
                            {l.budget && <> · {l.budget}</>}
                          </div>
                        </div>
                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${statusColor[l.status] ?? "bg-muted"}`}>{l.status}</span>
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{l.message}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {section === "profile" && (
              <form onSubmit={handleSave} className="glass rounded-2xl p-6 md:p-8 space-y-5 animate-fade-up">
                <div>
                  <h1 className="font-display font-extrabold text-2xl">Profile & settings</h1>
                  <p className="text-muted-foreground text-sm mt-1">Keep your details up to date so we can serve you better.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="flex items-center gap-1.5"><Mail size={14} /> Email</Label>
                    <Input id="email" value={user?.email ?? ""} disabled />
                  </div>
                  <div>
                    <Label htmlFor="fullName">Full name</Label>
                    <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={100} />
                  </div>
                  <div>
                    <Label htmlFor="company" className="flex items-center gap-1.5"><Building2 size={14} /> Company</Label>
                    <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} maxLength={100} />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-1.5"><Phone size={14} /> Phone</Label>
                    <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} maxLength={500} rows={4} />
                  <p className="text-xs text-muted-foreground mt-1">{bio.length}/500</p>
                </div>

                <Button type="submit" variant="hero" disabled={busy}>{busy ? "Saving…" : "Save changes"}</Button>
              </form>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, accent }: { label: string; value: number | string; icon: typeof LayoutDashboard; accent: "primary" | "secondary" }) {
  return (
    <div className="glass rounded-2xl p-5 hover:-translate-y-0.5 hover:shadow-glow transition-smooth">
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent === "primary" ? "bg-gradient-primary text-primary-foreground shadow-glow" : "bg-secondary text-secondary-foreground shadow-violet"}`}>
          <Icon size={18} />
        </div>
        <div className="text-2xl font-display font-extrabold">{value}</div>
      </div>
      <div className="text-sm text-muted-foreground mt-3">{label}</div>
    </div>
  );
}

function ActionLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between p-3 rounded-lg hover:bg-card transition-smooth group"
    >
      <span className="text-sm font-medium">{label}</span>
      <ArrowRight size={14} className="text-primary group-hover:translate-x-1 transition-transform" />
    </Link>
  );
}
