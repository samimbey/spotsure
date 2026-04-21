import { Camera, MapPin, Clock, Info, Shield, Zap } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background overflow-y-auto">
      <div className="px-5 pt-14 pb-28">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
            <Camera className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">SpotSure</h1>
            <p className="text-sm text-muted-foreground">Parking sign decoder</p>
          </div>
        </div>

        {/* How it works */}
        <div className="mb-6">
          <h2 className="text-base font-bold mb-3">How It Works</h2>
          <div className="space-y-3">
            {[
              { icon: Camera, title: "Take a Photo", desc: "Snap any parking sign with your camera or upload from your library." },
              { icon: Zap, title: "AI Analysis", desc: "Our AI reads the sign and cross-checks all restrictions for the current time and day." },
              { icon: MapPin, title: "Save Your Spots", desc: "Save results to your history and view them on the map for future reference." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-4 rounded-2xl bg-card border border-border/50">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="mb-6">
          <h2 className="text-base font-bold mb-3">Tips for Best Results</h2>
          <div className="p-4 rounded-2xl bg-card border border-border/50 space-y-2">
            {[
              "Make sure the entire sign is visible in the frame",
              "Good lighting produces more accurate results",
              "Capture all signs on the same pole",
              "Hold the camera steady to avoid blur",
            ].map((tip, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="text-primary font-bold text-xs mt-0.5">{i + 1}.</span>
                <p className="text-sm text-muted-foreground">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <div className="flex gap-3 items-start">
            <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm text-amber-300">Important Disclaimer</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                SpotSure uses AI to interpret parking signs and is provided for guidance only. Always verify the posted signs yourself. We are not responsible for any parking tickets or violations.
              </p>
            </div>
          </div>
        </div>

        {/* Version */}
        <p className="text-center text-xs text-muted-foreground mt-8">SpotSure v1.0</p>
      </div>
    </div>
  );
}