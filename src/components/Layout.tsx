import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  IndianRupee, 
  Map, 
  Bell, 
  FileText, 
  Settings,
  ShieldAlert,
  SearchIcon,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Projects", path: "/projects", icon: Building2 },
  { name: "Investigations", path: "/investigations", icon: ShieldAlert },
  { name: "Complaints", path: "/complaints", icon: MessageSquare },
  { name: "Contractors", path: "/contractors", icon: Users },
  { name: "Funds", path: "/funds", icon: IndianRupee },
  { name: "GIS Map", path: "/gis-map", icon: Map },
  { name: "Alerts", path: "/alerts", icon: Bell },
  { name: "Reports", path: "/reports", icon: FileText },
  { name: "Settings", path: "/settings", icon: Settings },
];

export function Layout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-surface overflow-hidden text-text-primary font-sans">
      {/* Sidebar - Dark Ink */}
      <aside className="w-64 bg-ink text-white flex-shrink-0 flex flex-col border-r border-hairline">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <ShieldAlert className="w-5 h-5 text-risk-high mr-3" />
          <span className="font-semibold tracking-wide text-sm">
            INTEGRITY LEDGER
          </span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center pl-5 pr-4 py-2.5 text-sm transition-colors border-l-[3px]",
                  isActive 
                    ? "border-primary bg-white/5 text-white font-medium" 
                    : "border-transparent text-text-muted hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className={cn("w-[18px] h-[18px] mr-3 flex-shrink-0", isActive ? "text-primary" : "text-text-muted group-hover:text-white/70")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <div className="text-xs text-text-muted text-center font-mono">
            Gov of India &copy; 2026
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 bg-surface">
        {/* Topbar - Light */}
        <header className="h-16 bg-surface-raised border-b border-hairline flex items-center justify-between px-6 flex-shrink-0 z-10">
          <div className="flex-1 flex">
            <div className="relative w-full max-w-md">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search projects, IDs, or contractors..."
                className="w-full bg-surface border border-hairline rounded-[4px] pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-primary transition-colors font-mono"
              />
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <button className="relative text-text-muted hover:text-text-primary transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-risk-high rounded-full"></span>
            </button>
            <div className="h-8 w-8 bg-surface border border-hairline flex items-center justify-center text-text-primary font-medium text-sm">
              AD
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
