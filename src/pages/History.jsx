import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Camera, Search } from "lucide-react";
import { Link } from "react-router-dom";
import ScanCard from "../components/ScanCard";

export default function History() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      const data = await base44.entities.ParkingScan.list("-created_date", 100);
      setScans(data);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = scans.filter((s) =>
    !search ||
    s.summary?.toLowerCase().includes(search.toLowerCase()) ||
    s.address?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-5 pt-14 pb-4">
        <h1 className="text-2xl font-extrabold tracking-tight">Scan History</h1>
        <p className="text-sm text-muted-foreground mt-1">Your saved parking spots</p>
      </div>

      {/* Search */}
      <div className="px-5 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by address or rule..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-secondary border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Results */}
      <div className="px-5 space-y-2 pb-28">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-muted border-t-primary rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
              <Camera className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground">No scans yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Scan a parking sign and save it to build your history
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
        ) : (
          filtered.map((scan) => <ScanCard key={scan.id} scan={scan} />)
        )}
      </div>
    </div>
  );
}