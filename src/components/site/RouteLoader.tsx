import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

export function RouteLoader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(true);
    const id = window.setTimeout(() => setActive(false), 450);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[90] h-1 overflow-hidden">
      <div className={`h-full bg-gradient-primary shadow-glow transition-all duration-500 ${active ? "w-full opacity-100" : "w-0 opacity-0"}`} />
    </div>
  );
}
