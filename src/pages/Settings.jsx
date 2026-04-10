import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, Trash2, AlertTriangle, LogOut } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setDeleting(true);
    await base44.auth.deleteMe();
    toast.success("Account deleted");
    base44.auth.logout("/");
  };

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
        {/* Delete Account */}
        <div className="p-4 rounded-2xl bg-card border border-border/50">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Account</p>
          <button
            onClick={() => {
              localStorage.removeItem("spotr_onboarded");
              base44.auth.logout();
            }}
            className="w-full h-12 rounded-xl bg-secondary border border-border/50 text-foreground font-semibold text-sm flex items-center justify-center gap-2 no-select mb-3"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full h-12 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive font-semibold text-sm flex items-center justify-center gap-2 no-select"
          >
            <Trash2 className="w-4 h-4" />
            Delete Account
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
              <h2 className="text-lg font-bold">Delete Account?</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              This will permanently delete your account and all saved scans. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 h-12 rounded-xl bg-secondary text-secondary-foreground font-semibold text-sm no-select"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex-1 h-12 rounded-xl bg-destructive text-destructive-foreground font-semibold text-sm disabled:opacity-50 no-select"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}