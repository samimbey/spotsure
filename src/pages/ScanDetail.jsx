import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, MapPin, Clock, Trash2, CheckCircle, XCircle, AlertTriangle, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";
import moment from "moment";
import { toast } from "sonner";

const decisionStyles = {
  yes: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400", icon: CheckCircle, label: "CAN PARK" },
  no: { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400", icon: XCircle, label: "CANNOT PARK" },
  unclear: { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400", icon: AlertTriangle, label: "UNCLEAR" },
};

export default function ScanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [editingNotes, setEditingNotes] = useState(false);

  useEffect(() => {
    const load = async () => {
      const scans = await base44.entities.ParkingScan.filter({ id });
      if (scans.length > 0) {
        setScan(scans[0]);
        setNotes(scans[0].notes || "");
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    await base44.entities.ParkingScan.delete(id);
    toast.success("Scan deleted");
    navigate("/history");
  };

  const handleSaveNotes = async () => {
    await base44.entities.ParkingScan.update(id, { notes });
    setEditingNotes(false);
    toast.success("Notes saved");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-muted-foreground">Scan not found</p>
        <button onClick={() => navigate("/history")} className="text-primary font-medium text-sm">
          Go to History
        </button>
      </div>
    );
  }

  const style = decisionStyles[scan.decision] || decisionStyles.unclear;
  const Icon = style.icon;

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <div className="px-5 pt-14 pb-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button onClick={handleDelete} className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
          <Trash2 className="w-5 h-5 text-destructive" />
        </button>
      </div>

      {/* Sign Image */}
      {scan.image_url && (
        <div className="px-5 mb-4">
          <img
            src={scan.image_url}
            alt="Parking sign"
            className="w-full aspect-[4/3] object-cover rounded-2xl"
          />
        </div>
      )}

      {/* Decision Badge */}
      <div className="px-5 mb-4">
        <div className={cn("rounded-2xl p-4 border", style.bg, style.border)}>
          <div className="flex items-center gap-3 mb-2">
            <Icon className={cn("w-8 h-8", style.text)} />
            <div>
              <p className={cn("text-xs font-bold tracking-wider", style.text)}>{style.label}</p>
              <p className="text-lg font-bold text-foreground">{scan.summary}</p>
            </div>
          </div>
          {scan.confidence != null && (
            <p className="text-sm text-muted-foreground">{scan.confidence}% confidence</p>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="px-5 space-y-3">
        {/* Location & Time */}
        <div className="grid grid-cols-2 gap-3">
          {scan.address && (
            <div className="p-3 rounded-xl bg-card border border-border/50">
              <MapPin className="w-4 h-4 text-muted-foreground mb-1" />
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-medium truncate">{scan.address}</p>
            </div>
          )}
          <div className="p-3 rounded-xl bg-card border border-border/50">
            <Clock className="w-4 h-4 text-muted-foreground mb-1" />
            <p className="text-xs text-muted-foreground">Scanned</p>
            <p className="text-sm font-medium">{moment(scan.scan_time || scan.created_date).format("MMM D, h:mm A")}</p>
          </div>
        </div>

        {/* Reasoning */}
        {scan.reasoning && (
          <div className="p-4 rounded-xl bg-card border border-border/50">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Analysis</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{scan.reasoning}</p>
          </div>
        )}

        {/* Restrictions */}
        {scan.restrictions_found?.length > 0 && (
          <div className="p-4 rounded-xl bg-card border border-border/50">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Restrictions Found</p>
            <div className="flex flex-wrap gap-2">
              {scan.restrictions_found.map((r, i) => (
                <span key={i} className="px-3 py-1.5 rounded-lg bg-secondary text-xs font-medium text-foreground/80">
                  {r}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="p-4 rounded-xl bg-card border border-border/50">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Notes</p>
            <button
              onClick={() => editingNotes ? handleSaveNotes() : setEditingNotes(true)}
              className="text-xs text-primary font-medium flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" />
              {editingNotes ? "Save" : "Edit"}
            </button>
          </div>
          {editingNotes ? (
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this spot..."
              className="w-full h-20 bg-secondary rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          ) : (
            <p className="text-sm text-foreground/70">
              {notes || "No notes yet — tap Edit to add"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}