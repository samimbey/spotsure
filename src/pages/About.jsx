import { Camera, MapPin, Clock, Shield, Zap, ImagePlus, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: Camera,
    title: "Point Your Camera",
    desc: "Open the Scan tab and tap 'Scan Parking Sign'. Point your camera at any parking sign — make sure the full sign is in frame.",
  },
  {
    number: "2",
    icon: Zap,
    title: "AI Reads the Sign",
    desc: "SpotSure's AI instantly analyzes every rule on the sign — time limits, street cleaning, permit zones, meter rules, and more.",
  },
  {
    number: "3",
    icon: CheckCircle,
    title: "Get Your Answer",
    desc: "You'll see a clear YES, NO, or UNCLEAR verdict based on the current time and day, along with a plain-English explanation.",
  },
  {
    number: "4",
    icon: MapPin,
    title: "Save the Spot",
    desc: "Tap 'Save Spot' to log the scan to your history and pin it on your map for easy reference later.",
  },
];

const features = [
  { icon: Clock, label: "Time-aware", desc: "Checks restrictions against the current time and day of week" },
  { icon: ImagePlus, label: "Camera Roll", desc: "Upload photos from your library if you already took a picture" },
  { icon: MapPin, label: "Location Tagging", desc: "Spots are pinned on a map so you can find them again" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background overflow-y-auto">
      <div className="px-5 pt-14 pb-28 max-w-lg mx-auto">

        {/* Hero */}
        <div className="flex items-center gap-4 mb-2">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md shrink-0">
            <img src="https://media.base44.com/images/public/69d7eb7aef7e046ba8d879cd/45251002f_ChatGPTImageApr21202605_02_24PM.png" alt="SpotSure" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">SpotSure</h1>
            <p className="text-sm text-muted-foreground">Instant parking sign decoder</p>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-muted-foreground text-sm leading-relaxed mt-4 mb-8">
          Never second-guess a parking sign again. SpotSure uses AI to read any sign and tells you instantly whether you can park — right now, on this day, at this time.
        </p>

        {/* Step by step */}
        <h2 className="text-base font-bold mb-4">How to Use SpotSure</h2>
        <div className="space-y-3 mb-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="flex gap-4 p-4 rounded-2xl bg-card border border-border/50">
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
                    <span className="text-primary font-extrabold text-sm">{step.number}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-primary" />
                    <p className="font-semibold text-sm">{step.title}</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Result key */}
        <h2 className="text-base font-bold mb-4">Understanding Results</h2>
        <div className="space-y-2 mb-8">
          {[
            { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", label: "YES", desc: "You can park here right now." },
            { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10", label: "NO", desc: "Parking is not allowed at this time." },
            { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", label: "UNCLEAR", desc: "The sign was hard to read — try a clearer photo." },
          ].map(({ icon: Icon, color, bg, label, desc }) => (
            <div key={label} className={`flex items-center gap-3 p-3 rounded-xl ${bg} border border-white/5`}>
              <Icon className={`w-5 h-5 ${color} shrink-0`} />
              <div>
                <span className={`font-bold text-sm ${color}`}>{label} — </span>
                <span className="text-sm text-muted-foreground">{desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Features */}
        <h2 className="text-base font-bold mb-4">Features</h2>
        <div className="grid grid-cols-1 gap-2 mb-8">
          {features.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex gap-3 p-3 rounded-xl bg-card border border-border/50 items-center">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-6">
          <div className="flex gap-3 items-start">
            <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm text-amber-300">Disclaimer</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                SpotSure is AI-powered guidance only. Always verify posted signs yourself before parking. We are not responsible for any parking tickets or violations.
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">SpotSure v1.0 · Made with ❤️</p>
      </div>
    </div>
  );
}