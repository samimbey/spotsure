import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { getLocalScans } from "@/lib/localScans";
import { Camera, MapPin, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import moment from "moment";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const createColorIcon = (color) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="width:28px;height:28px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

const markerColors = {
  yes: "#22c55e",
  no: "#ef4444",
  unclear: "#f59e0b",
};

const decisionIcons = {
  yes: CheckCircle,
  no: XCircle,
  unclear: AlertTriangle,
};

export default function MapView() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState([37.7749, -122.4194]);

  useEffect(() => {
    const load = async () => {
      const data = getLocalScans();
      setScans(data.filter((s) => s.latitude && s.longitude));
      setLoading(false);

      // Center on user location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          setCenter([pos.coords.latitude, pos.coords.longitude]);
        });
      }

      // Or center on most recent scan
      const withCoords = data.filter((s) => s.latitude && s.longitude);
      if (withCoords.length > 0) {
        setCenter([withCoords[0].latitude, withCoords[0].longitude]);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (scans.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
          <MapPin className="w-8 h-8 text-muted-foreground" />
        </div>
        <div>
          <p className="font-semibold text-foreground">No locations saved</p>
          <p className="text-sm text-muted-foreground mt-1">
            Scan and save parking spots to see them on the map
          </p>
        </div>
        <Link
          to="/"
          className="mt-2 px-6 h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2"
        >
          <Camera className="w-4 h-4" />
          Scan Now
        </Link>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-30">
      {/* Header overlay */}
      <div className="absolute top-0 left-0 right-0 z-[1000] bg-gradient-to-b from-background via-background/80 to-transparent px-5 pt-14 pb-8 pointer-events-none">
        <h1 className="text-2xl font-extrabold tracking-tight">Parking Map</h1>
        <p className="text-sm text-muted-foreground mt-1">{scans.length} saved spot{scans.length !== 1 ? "s" : ""}</p>
      </div>

      <MapContainer
        center={center}
        zoom={14}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {scans.map((scan) => (
          <Marker
            key={scan.id}
            position={[scan.latitude, scan.longitude]}
            icon={createColorIcon(markerColors[scan.decision] || markerColors.unclear)}
          >
            <Popup>
              <div className="min-w-[200px] p-1">
                <div className="flex items-center gap-2 mb-2">
                  {scan.image_url && (
                    <img src={scan.image_url} alt="Sign" className="w-12 h-12 rounded-lg object-cover" />
                  )}
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{scan.summary}</p>
                    <p className="text-xs text-gray-500">{moment(scan.scan_time || scan.created_date).fromNow()}</p>
                  </div>
                </div>
                {scan.address && (
                  <p className="text-xs text-gray-500 mb-2">{scan.address}</p>
                )}
                <a
                  href={`/scan/${scan.id}`}
                  className="text-xs text-blue-600 font-medium"
                >
                  View Details →
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Bottom spacer for nav */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-[1000] pointer-events-none" />
    </div>
  );
}