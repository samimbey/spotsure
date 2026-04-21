import { Link, useLocation } from "react-router-dom";
import { Camera, Clock, MapPin, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const leftItems = [
  { path: "/history", icon: Clock, label: "History" },
  { path: "/map", icon: MapPin, label: "Map" },
];

const rightItems = [
  { path: "/settings", icon: Settings, label: "Settings" },
];

const centerItem = { path: "/", icon: Camera, label: "Scan" };

export default function BottomNav() {
  const location = useLocation();

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;
    return (
      <Link to={item.path} className="flex flex-col items-center gap-1 pt-1 flex-1">
        <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary" : "text-muted-foreground")} />
        <span className={cn("text-[10px] font-medium transition-colors", isActive ? "text-primary" : "text-muted-foreground")}>
          {item.label}
        </span>
      </Link>
    );
  };

  const isCenterActive = location.pathname === centerItem.path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 no-select">
      <div className="bg-card/80 backdrop-blur-xl border-t border-border/50 pb-safe">
        <div className="flex items-end pt-2 pb-3 max-w-md mx-auto">
          {/* Left items */}
          <div className="flex flex-1 justify-around">
            {leftItems.map((item) => <NavItem key={item.path} item={item} />)}
          </div>

          {/* Center camera button */}
          <Link to={centerItem.path} className="flex flex-col items-center -mt-5 px-6">
            <div className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300",
              isCenterActive ? "bg-primary shadow-lg shadow-primary/30 scale-105" : "bg-secondary"
            )}>
              <Camera className={cn("w-6 h-6", isCenterActive ? "text-primary-foreground" : "text-muted-foreground")} />
            </div>
            <span className={cn("text-[10px] mt-1 font-medium", isCenterActive ? "text-primary" : "text-muted-foreground")}>
              {centerItem.label}
            </span>
          </Link>

          {/* Right items — padded to match left side width */}
          <div className="flex flex-1 justify-around">
            {rightItems.map((item) => <NavItem key={item.path} item={item} />)}
            {/* Invisible spacer to balance the left side which has 2 items */}
            <div className="flex-1" />
          </div>
        </div>
      </div>
    </nav>
  );
}