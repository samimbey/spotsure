import { useState, useRef } from "react";
import { Camera, Zap, ZapOff, ImagePlus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CameraCapture({ onCapture, isAnalyzing }) {
  const [flashOn, setFlashOn] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setCameraActive(true);
        setCameraError(false);
      }
    } catch {
      setCameraError(true);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setCameraActive(false);
    }
  };

  const captureFromCamera = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "parking-sign.jpg", { type: "image/jpeg" });
        stopCamera();
        onCapture(file);
      }
    }, "image/jpeg", 0.9);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onCapture(file);
    }
  };

  if (isAnalyzing) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera className="w-8 h-8 text-primary" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-foreground">Analyzing Sign...</p>
          <p className="text-sm text-muted-foreground">This takes 2–3 seconds</p>
        </div>
      </div>
    );
  }

  if (cameraActive) {
    return (
      <div className="flex-1 flex flex-col relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="flex-1 object-cover w-full"
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Camera overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Viewfinder corners */}
          <div className="absolute top-1/4 left-8 right-8 bottom-1/4">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/70 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/70 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/70 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/70 rounded-br-lg" />
          </div>
          <div className="absolute top-12 left-0 right-0 text-center">
            <p className="text-white/80 text-sm font-medium bg-black/30 inline-block px-4 py-1.5 rounded-full backdrop-blur-sm">
              Point at parking sign
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-8 pointer-events-auto">
          <button
            onClick={() => setFlashOn(!flashOn)}
            className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
          >
            {flashOn ? <Zap className="w-5 h-5 text-yellow-400" /> : <ZapOff className="w-5 h-5 text-white/70" />}
          </button>

          <button
            onClick={captureFromCamera}
            className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-2xl active:scale-90 transition-transform"
          >
            <div className="w-16 h-16 rounded-full border-4 border-black/10" />
          </button>

          <button
            onClick={() => { stopCamera(); }}
            className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/70 text-xs font-medium"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 gap-8">
      {/* Logo area */}
      <div className="text-center space-y-3">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center mx-auto">
          <Camera className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Spotr</h1>
        <p className="text-muted-foreground text-sm max-w-[260px] mx-auto leading-relaxed">
          Snap a photo of any parking sign and get an instant answer
        </p>
      </div>

      {/* Action buttons */}
      <div className="w-full max-w-sm space-y-3">
        <button
          onClick={startCamera}
          className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-base flex items-center justify-center gap-3 active:scale-[0.97] transition-all shadow-lg shadow-primary/20"
        >
          <Camera className="w-5 h-5" />
          Open Camera
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-14 rounded-2xl bg-secondary text-secondary-foreground font-semibold text-base flex items-center justify-center gap-3 active:scale-[0.97] transition-all"
        >
          <ImagePlus className="w-5 h-5" />
          Upload Photo
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {cameraError && (
        <p className="text-sm text-muted-foreground text-center">
          Camera not available. Use upload instead.
        </p>
      )}
    </div>
  );
}