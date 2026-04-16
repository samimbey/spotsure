import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getLocalScans } from "@/lib/localScans";

export default function Settings() {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClearData = () => {
    localStorage.removeItem("spotsure_scans");
    localStorage.removeItem("spotr_onboarded");
    toast.success("All data cleared");
    setShowConfirm(false);
  };

  const scanCount = getLocalScans().length;

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <div className="px-5 pt-14 pb-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center no-select"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-extrabold tracking-tight">Settings</h1>
      </div>

      <div className="px-5 space-y-4">
        {/* About */}
        <div className="p-4 rounded-2xl bg-card border border-border/50">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">About</p>
          <p className="text-sm text-foreground/80 leading-relaxed">
            SpotSure uses AI to help you interpret parking signs. All scans are saved locally on your device.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            AI-based guidance only. Always verify posted parking signs.
          </p>
        </div>

        {/* Data */}
        <div className="p-4 rounded-2xl bg-card border border-border/50">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Data</p>
          <p className="text-sm text-muted-foreground mb-4">{scanCount} scan{scanCount !== 1 ? "s" : ""} stored on this device</p>
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full h-12 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive font-semibold text-sm flex items-center justify-center gap-2 no-select"
          >
            <Trash2 className="w-4 h-4" />
            Clear All Data
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <h2 className="text-lg font-bold">Clear All Data?</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              This will permanently delete all saved scans from your device. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 h-12 rounded-xl bg-secondary text-secondary-foreground font-semibold text-sm no-select"
              >
                Cancel
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 h-12 rounded-xl bg-destructive text-destructive-foreground font-semibold text-sm no-select"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}