import { NavLink } from "react-router-dom";
import Icon from "@/components/ui/icon";

const navItems = [
  { path: "/", label: "Генератор", icon: "Sparkles" },
  { path: "/examples", label: "Примеры", icon: "LayoutGrid" },
  { path: "/history", label: "История", icon: "History" },
];

const frameworks = [
  { name: "React", color: "text-cyan-400" },
  { name: "Vue", color: "text-green-400" },
  { name: "Angular", color: "text-red-400" },
  { name: "Svelte", color: "text-orange-400" },
  { name: "Next.js", color: "text-white" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="glass border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center glow-purple">
              <Icon name="Code2" size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg gradient-text">CodeAI</span>
            <div className="hidden md:flex items-center gap-1 ml-2">
              {frameworks.map((fw) => (
                <span key={fw.name} className={`text-xs font-mono px-2 py-0.5 rounded bg-secondary ${fw.color} opacity-80`}>
                  {fw.name}
                </span>
              ))}
            </div>
          </div>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary/20 text-primary glow-purple border border-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`
                }
              >
                <Icon name={item.icon} size={16} />
                <span className="hidden sm:inline">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-muted-foreground hidden sm:inline">AI Online</span>
          </div>
        </div>
      </header>

      <main className="flex-1 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        </div>
        {children}
      </main>
    </div>
  );
}
