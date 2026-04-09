import { useState, useEffect } from "react";
import { Camera, MapPin, User, CheckCircle, ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";

const STORAGE_KEY = "spotr_onboarded";

export default function PermissionsGate({ children }) {
  const [onboarded, setOnboarded] = useState(true); // default true to avoid flash
  const [user, setUser] = useState(null);
  const [cameraGranted, setCameraGranted] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      const done = localStorage.getItem(STORAGE_KEY);
      const me = await base44.auth.me().catch(() => null);
      setUser(me);

      if (done) {
        setOnboarded(true);
      } else {
        setOnboarded(false);
        // Check existing permission states
        if (navigator.permissions) {
          const cam = await navigator.permissions.query({ name: "camera" }).catch(() => null);
          const loc = await navigator.permissions.query({ name: "geolocation" }).catch(() => null);
          if (cam?.state === "granted") setCameraGranted(true);
          if (loc?.state === "granted") setLocationGranted(true);
        }
      }
      setLoading(false);
    };
    check();
  }, []);

  const requestCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((t) => t.stop());
      setCameraGranted(true);
    } catch {
      setCameraGranted(false);
    }
  };

  const requestLocation = () => {
    navigator.geolocation.getCurrentPosition(
      () => setLocationGranted(true),
      () => {}
    );
  };

  const finish = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setOnboarded(true);
  };

  if (loading) return null;
  if (onboarded) return children;

  return (
    <div className="fixed inset-0 bg-background flex flex-col px-6 z-[100]">
      {/* Top */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center"
        >
          <Camera className="w-10 h-10 text-primary" />
        </motion.div>

        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome to Spotr</h1>
          <p className="text-muted-foreground text-sm mt-2 max-w-[280px] mx-auto leading-relaxed">
            Instantly decode any parking sign — we just need a couple of permissions.
          </p>
        </motion.div>

        {/* User pill */}
        {user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border/50"
          >
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{user.full_name || user.email}</span>
          </motion.div>
        )}
      </div>

      {/* Permissions */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="space-y-3 mb-6"
      >
        {/* Camera */}
        <button
          onClick={requestCamera}
          disabled={cameraGranted}
          className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/50 active:scale-[0.98] transition-all disabled:opacity-70"
        >
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${cameraGranted ? "bg-emerald-500/15" : "bg-secondary"}`}>
            <Camera className={`w-5 h-5 ${cameraGranted ? "text-emerald-400" : "text-muted-foreground"}`} />
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-sm">Camera Access</p>
            <p className="text-xs text-muted-foreground">To photograph parking signs</p>
          </div>
          {cameraGranted
            ? <CheckCircle className="w-5 h-5 text-emerald-400" />
            : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
        </button>

        {/* Location */}
        <button
          onClick={requestLocation}
          disabled={locationGranted}
          className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/50 active:scale-[0.98] transition-all disabled:opacity-70"
        >
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${locationGranted ? "bg-emerald-500/15" : "bg-secondary"}`}>
            <MapPin className={`w-5 h-5 ${locationGranted ? "text-emerald-400" : "text-muted-foreground"}`} />
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-sm">Location Access</p>
            <p className="text-xs text-muted-foreground">To tag and map your saved spots</p>
          </div>
          {locationGranted
            ? <CheckCircle className="w-5 h-5 text-emerald-400" />
            : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
        </button>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="mb-10 space-y-3"
      >
        <button
          onClick={finish}
          className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-base active:scale-[0.97] transition-all shadow-lg shadow-primary/20 no-select"
        >
          {cameraGranted && locationGranted ? "Get Started" : "Continue Anyway"}
        </button>
        <p className="text-center text-xs text-muted-foreground">
          You can update permissions anytime in your device settings.
        </p>
      </motion.div>
    </div>
  );
}