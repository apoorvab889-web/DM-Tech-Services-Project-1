import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { dbClient, type Session, type User } from "@/integrations/mongodb/client";

type AppRole = "admin" | "client";

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  company: string | null;
  phone: string | null;
  bio: string | null;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  roles: AppRole[];
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProfileAndRoles = async (userId: string) => {
    const [{ data: profileRow }, { data: roleRows }] = await Promise.all([
      dbClient.from("profiles").select("*").eq("id", userId).maybeSingle(),
      dbClient.from("user_roles").select("role").eq("user_id", userId),
    ]);
    setProfile(profileRow as Profile | null);
    setRoles((roleRows ?? []).map((r) => r.role as AppRole));
  };

  useEffect(() => {
    // CRITICAL: set up listener BEFORE getSession
    const { data: { subscription } } = dbClient.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        // defer to avoid deadlock inside auth callback
        setTimeout(() => { void loadProfileAndRoles(newSession.user.id); }, 0);
      } else {
        setProfile(null);
        setRoles([]);
      }
    });

    dbClient.auth.getSession().then(({ data: { session: existing } }) => {
      setSession(existing);
      setUser(existing?.user ?? null);
      if (existing?.user) {
        void loadProfileAndRoles(existing.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await dbClient.auth.signOut();
  };

  const refreshProfile = async () => {
    if (user) await loadProfileAndRoles(user.id);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        roles,
        loading,
        isAdmin: roles.includes("admin"),
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
