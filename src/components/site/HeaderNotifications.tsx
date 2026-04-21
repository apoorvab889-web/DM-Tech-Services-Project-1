import { Bell, Sparkles, MessageSquare, Calendar, CheckCheck } from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Notif = {
  id: string;
  icon: typeof Sparkles;
  title: string;
  body: string;
  time: string;
  unread: boolean;
};

const initialNotifs: Notif[] = [
  {
    id: "1",
    icon: Sparkles,
    title: "New AI service launched",
    body: "Check out our new AI customer journeys offering.",
    time: "2m ago",
    unread: true,
  },
  {
    id: "2",
    icon: MessageSquare,
    title: "Reply from our team",
    body: "We've sent your tailored growth proposal.",
    time: "1h ago",
    unread: true,
  },
  {
    id: "3",
    icon: Calendar,
    title: "Free audit reminder",
    body: "Your free $1,200 growth audit slot expires Friday.",
    time: "Yesterday",
    unread: false,
  },
];

export function HeaderNotifications() {
  const [notifs, setNotifs] = useState(initialNotifs);
  const unreadCount = notifs.filter((n) => n.unread).length;

  const markAllRead = () => setNotifs((n) => n.map((x) => ({ ...x, unread: false })));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label="Notifications"
          className="relative w-9 h-9 rounded-lg hover:bg-muted text-foreground/80 hover:text-primary flex items-center justify-center transition-smooth"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shadow-glow animate-glow-pulse">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 overflow-hidden">
        <div className="flex items-center justify-between p-3 border-b border-border bg-muted/40">
          <div className="font-display font-bold text-sm">Notifications</div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs text-primary font-semibold inline-flex items-center gap-1 hover:underline"
            >
              <CheckCheck size={12} /> Mark all read
            </button>
          )}
        </div>
        <ul className="max-h-[360px] overflow-y-auto divide-y divide-border">
          {notifs.map((n) => (
            <li
              key={n.id}
              className={`p-3 flex gap-3 hover:bg-muted/40 transition-colors ${
                n.unread ? "bg-primary/[0.04]" : ""
              }`}
            >
              <div className="w-9 h-9 shrink-0 rounded-lg bg-gradient-primary text-primary-foreground flex items-center justify-center shadow-glow">
                <n.icon size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold flex items-center gap-2">
                  {n.title}
                  {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {n.body}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground/70 mt-1">
                  {n.time}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="p-2 border-t border-border bg-muted/20 text-center">
          <button className="text-xs font-semibold text-primary hover:underline">
            View all
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
