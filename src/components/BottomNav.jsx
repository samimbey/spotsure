import { Link, useLocation } from "react-router-dom";
import { Camera, Clock, MapPin, Settings, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/history", icon: Clock, label: "History" },
  { path: "/map", icon: MapPin, label: "Map" },
  { path: "/", icon: Camera, label: "Scan", isCenter: true },
  { path: "/settings", icon: Settings, label: "Settings" },
  { path: "/about", icon: Info, label: "About" },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 no-select">
      <div className="bg-card/80 backdrop-blur-xl border-t border-border/50 pb-safe">
        <div className="flex items-end pt-2 pb-3 max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            if (item.isCenter) {
              return (
                <Link key={item.path} to={item.path} className="flex flex-col items-center -mt-5 flex-1">
                  <div className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300",
                    isActive ? "bg-primary shadow-lg shadow-primary/30 scale-105" : "bg-secondary"
                  )}>
                    <Camera className={cn("w-6 h-6", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                  </div>
                  <span className={cn("text-[10px] mt-1 font-medium", isActive ? "text-primary" : "text-muted-foreground")}>
                    {item.label}
                  </span>
                </Link>
              );
            }

            return (
              <Link key={item.path} to={item.path} className="flex flex-col items-center gap-1 pt-1 flex-1">
                <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary" : "text-muted-foreground")} />
                <span className={cn("text-[10px] font-medium transition-colors", isActive ? "text-primary" : "text-muted-foreground")}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}