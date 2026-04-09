import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, AlertTriangle, ChevronDown, ChevronUp, Camera, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const decisionConfig = {
  yes: {
    bg: "bg-emerald-500",
    icon: CheckCircle,
    label: "YES",
    glow: "shadow-emerald-500/30",
  },
  no: {
    bg: "bg-red-500",
    icon: XCircle,
    label: "NO",
    glow: "shadow-red-500/30",
  },
  unclear: {
    bg: "bg-amber-500",
    icon: AlertTriangle,
    label: "UNCLEAR",
    glow: "shadow-amber-500/30",
  },
};

export default function DecisionDisplay({ result, onScanAgain, onSave, isSaving }) {
  const [showDetails, setShowDetails] = useState(false);
  const config = decisionConfig[result.decision] || decisionConfig.unclear;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("flex-1 flex flex-col", config.bg)}
    >
      {/* Main decision area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-white">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        >
          <Icon className="w-24 h-24 mb-4" strokeWidth={1.5} />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl font-black tracking-tight mb-2"
        >
          {config.label}
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-semibold text-center text-white/90 max-w-sm leading-relaxed"
        >
          {result.summary}
        </motion.p>

        {result.confidence != null && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-3 text-sm text-white/60 font-medium"
          >
            {result.confidence}% confidence
          </motion.p>
        )}
      </div>

      {/* Details panel */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-black/20 backdrop-blur-sm rounded-t-3xl flex flex-col max-h-[60vh]"
      >
        {/* Toggle details */}
        {result.reasoning && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-center gap-2 py-3 text-white/70 text-sm font-medium"
          >
            {showDetails ? "Hide" : "Show"} Details
            {showDetails ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        )}

        <AnimatePresence>
          {showDetails && result.reasoning && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-y-auto px-6 max-h-[30vh]"
            >
              <p className="text-white/80 text-sm leading-relaxed pb-3">
                {result.reasoning}
              </p>
              {result.restrictions_found?.length > 0 && (
                <div className="flex flex-wrap gap-2 pb-4">
                  {result.restrictions_found.map((r, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-white/15 text-white/80 text-xs font-medium">
                      {r}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons */}
        <div className="flex gap-3 px-6 pb-8 pt-2">
          <button
            onClick={onScanAgain}
            className="flex-1 h-14 rounded-2xl bg-white/20 backdrop-blur-sm text-white font-semibold flex items-center justify-center gap-2 active:scale-[0.97] transition-all"
          >
            <Camera className="w-5 h-5" />
            Scan Again
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex-1 h-14 rounded-2xl bg-white text-gray-900 font-semibold flex items-center justify-center gap-2 active:scale-[0.97] transition-all disabled:opacity-50"
          >
            <Bookmark className="w-5 h-5" />
            {isSaving ? "Saving..." : "Save Spot"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}