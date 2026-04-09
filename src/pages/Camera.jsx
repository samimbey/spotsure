import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import CameraCapture from "../components/CameraCapture";
import DecisionDisplay from "../components/DecisionDisplay";
import { toast } from "sonner";

export default function Camera() {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      );
    }
  }, []);

  const handleCapture = async (file) => {
    setIsAnalyzing(true);
    setResult(null);

    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setImageUrl(file_url);

    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    const dayStr = now.toLocaleDateString("en-US", { weekday: "long" });
    const dateStr = now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    const prompt = `You are a parking sign analysis expert. Analyze the parking sign(s) in this photo and determine if a driver can legally park at this spot RIGHT NOW.

Current time: ${timeStr}
Current day: ${dayStr}
Current date: ${dateStr}
${location ? `Location: approximately ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : ""}

Analyze ALL visible signs and restrictions. Consider:
- Time restrictions (hours, days)
- Permit requirements
- Meter rules
- Street cleaning windows
- Tow-away notices
- Temporary restrictions
- Loading zones
- Any other restrictions

Return your analysis as JSON.`;

    const analysis = await base44.integrations.Core.InvokeLLM({
      prompt,
      file_urls: [file_url],
      response_json_schema: {
        type: "object",
        properties: {
          decision: {
            type: "string",
            enum: ["yes", "no", "unclear"],
            description: "Can the user park here right now?"
          },
          confidence: {
            type: "number",
            description: "Confidence percentage 0-100"
          },
          summary: {
            type: "string",
            description: "Short verdict like 'You Can Park Here Until 8:00 AM' or 'Street Cleaning Until 4 PM' or 'Please Review Signs'. Do NOT include the decision word (YES/NO/UNCLEAR) in the summary."
          },
          reasoning: {
            type: "string",
            description: "Brief explanation of the restrictions found and why the decision was made"
          },
          restrictions_found: {
            type: "array",
            items: { type: "string" },
            description: "List of specific restrictions detected (e.g., 'No Parking 8AM-10AM Mon/Thu', '2hr Meter', 'Permit Zone A')"
          },
          park_until: {
            type: "string",
            description: "If parking is allowed, until when. If not, when restriction ends."
          }
        },
        required: ["decision", "confidence", "summary", "reasoning", "restrictions_found"]
      },
      model: "gpt_5"
    });

    setResult(analysis);
    setIsAnalyzing(false);
  };

  const handleSave = async () => {
    if (!result || !imageUrl) return;
    setIsSaving(true);
    toast.success("Spot saved!");
    handleScanAgain();

    let address = "";
    if (location) {
      const geo = await base44.integrations.Core.InvokeLLM({
        prompt: `What is the approximate street address for coordinates ${location.lat}, ${location.lng}? Return just the address as a short string, like "123 Main St, San Francisco, CA". If you don't know, return "Unknown location".`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: { address: { type: "string" } },
          required: ["address"]
        }
      });
      address = geo.address || "";
    }

    await base44.entities.ParkingScan.create({
      image_url: imageUrl,
      decision: result.decision,
      confidence: result.confidence,
      summary: result.summary,
      reasoning: result.reasoning,
      restrictions_found: result.restrictions_found,
      park_until: result.park_until || "",
      latitude: location?.lat || null,
      longitude: location?.lng || null,
      address,
      scan_time: new Date().toISOString(),
    });
    setIsSaving(false);
  };

  const handleScanAgain = () => {
    setResult(null);
    setImageUrl(null);
  };

  if (result) {
    return (
      <div className="fixed inset-0 flex flex-col z-40">
        <DecisionDisplay
          result={result}
          onScanAgain={handleScanAgain}
          onSave={handleSave}
          isSaving={isSaving}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-background z-40">
      <CameraCapture onCapture={handleCapture} isAnalyzing={isAnalyzing} />
      {!isAnalyzing && (
        <div className="pb-24" />
      )}
    </div>
  );
}