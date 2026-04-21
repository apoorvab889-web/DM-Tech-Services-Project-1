import { Link } from "@tanstack/react-router";
import { Menu, X, LayoutDashboard, LogOut, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { ThemeToggle } from "./ThemeToggle";
import { HeaderNotifications } from "./HeaderNotifications";
import { HeaderHelp } from "./HeaderHelp";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

function Wordmark() {
  return (
    <Link to="/" className="flex items-center gap-2 font-display font-extrabold text-xl tracking-tight">
      <span className="text-foreground">DM</span>
      <span className="text-gradient-primary text-2xl leading-none">+</span>
      <span className="text-foreground">Tech</span>
      <span className="hidden sm:inline text-muted-foreground font-medium text-sm ml-1">Services</span>
    </Link>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/75 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/65">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-17 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Wordmark />
            <div className="hidden lg:inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              <Sparkles size={11} /> Premium delivery
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-2 rounded-full border border-border/70 bg-card/70 p-1.5 shadow-sm">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-full px-4 py-2 text-sm font-medium text-foreground/70 transition-smooth hover:text-primary"
                activeProps={{ className: "rounded-full bg-gradient-primary text-primary-foreground shadow-glow px-4 py-2 text-sm font-medium" }}
                activeOptions={{ exact: true }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <HeaderNotifications />
            <HeaderHelp />
            <ThemeToggle />
            {user ? (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/dashboard">
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut size={16} />
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button variant="hero" size="sm" asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center gap-0.5">
            <HeaderNotifications />
            <HeaderHelp />
            <ThemeToggle />
            <button className="p-2 -mr-2 text-foreground" onClick={() => setOpen(!open)} aria-label="Toggle menu">
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl animate-fade-up">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
            <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              <Sparkles size={11} /> Growth-first design
            </div>
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/80 hover:bg-muted hover:text-primary"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/dashboard" className="px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/80 hover:bg-muted hover:text-primary" onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
                <Button variant="outline" size="sm" className="mt-2" onClick={handleSignOut}>
                  <LogOut size={16} />
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/80 hover:bg-muted hover:text-primary" onClick={() => setOpen(false)}>
                  Sign in
                </Link>
                <Button variant="hero" size="sm" className="mt-2" asChild>
                  <Link to="/register" onClick={() => setOpen(false)}>Get Started</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
