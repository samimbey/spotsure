import { Link } from "react-router-dom";
import { CheckCircle, XCircle, AlertTriangle, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import moment from "moment";

const icons = {
  yes: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  no: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10" },
  unclear: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10" },
};

export default function ScanCard({ scan }) {
  const config = icons[scan.decision] || icons.unclear;
  const Icon = config.icon;

  return (
    <Link
      to={`/scan/${scan.id}`}
      className="flex gap-3 p-3 rounded-2xl bg-card border border-border/50 active:scale-[0.98] transition-all"
    >
      {/* Thumbnail */}
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
        {scan.image_url ? (
          <img src={scan.image_url} alt="Sign" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <MapPin className="w-6 h-6" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", config.bg)}>
            <Icon className={cn("w-3.5 h-3.5", config.color)} />
          </div>
          <span className="font-semibold text-sm truncate">{scan.summary}</span>
        </div>
        {scan.address && (
          <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            {scan.address}
          </p>
        )}
        <p className="text-xs text-muted-foreground/70 mt-0.5 flex items-center gap-1">
          <Clock className="w-3 h-3 flex-shrink-0" />
          {moment(scan.scan_time || scan.created_date).fromNow()}
        </p>
      </div>
    </Link>
  );
}