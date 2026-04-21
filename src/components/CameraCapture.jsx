import { useRef } from "react";
import { Camera, ImagePlus } from "lucide-react";
import AnalyzingAnimation from "./AnalyzingAnimation";

export default function CameraCapture({ onCapture, isAnalyzing }) {
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) onCapture(file);
    e.target.value = "";
  };

  if (isAnalyzing) {
    return <AnalyzingAnimation />;
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 gap-8">
      {/* Logo area */}
      <div className="text-center space-y-3">
        <div className="w-20 h-20 rounded-3xl overflow-hidden shadow-lg mx-auto">
          <img src="https://media.base44.com/images/public/69d7eb7aef7e046ba8d879cd/45251002f_ChatGPTImageApr21202605_02_24PM.png" alt="SpotSure" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">SpotSure</h1>
        <p className="text-muted-foreground text-sm max-w-[260px] mx-auto leading-relaxed">
          Snap a photo of any parking sign and get an instant answer
        </p>
      </div>

      {/* Action buttons */}
      <div className="w-full max-w-sm space-y-3">
        {/* Camera button — capture="environment" opens native iOS camera directly */}
        <label
          htmlFor="camera-capture-input"
          className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-base flex items-center justify-center gap-3 active:scale-[0.97] transition-all shadow-lg shadow-primary/20 cursor-pointer select-none"
        >
          <Camera className="w-5 h-5" />
          Scan Parking Sign
        </label>
        <input
          id="camera-capture-input"
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Gallery button — no capture attribute, opens photo library */}
        <label
          htmlFor="gallery-input"
          className="w-full h-14 rounded-2xl bg-secondary text-secondary-foreground font-semibold text-base flex items-center justify-center gap-3 active:scale-[0.97] transition-all cursor-pointer select-none"
        >
          <ImagePlus className="w-5 h-5" />
          Upload from Camera Roll
        </label>
        <input
          id="gallery-input"
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}