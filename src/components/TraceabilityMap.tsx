import React, { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { AuditRecommendation } from "@/lib/auditService";
import { Plane, Ship, Truck, MapPin } from "lucide-react";

/* ── Material origin database ──────────────────── */

interface MaterialOrigin {
  name: string;
  lat: number;
  lng: number;
  country: string;
  transport: "air" | "maritime" | "road";
  distanceKm: number;
  co2PerKg: number;
}

const MATERIAL_ORIGINS: Record<string, MaterialOrigin> = {
  "Ti-6Al-4V": { name: "Ti-6Al-4V", lat: 55.75, lng: 37.62, country: "Russia", transport: "air", distanceKm: 2500, co2PerKg: 0.18 },
  "Alliage de Titane": { name: "Titanium Alloy", lat: 55.75, lng: 37.62, country: "Russia", transport: "air", distanceKm: 2500, co2PerKg: 0.18 },
  "Alliage Titane Ti-6Al-4V ELI": { name: "Ti-6Al-4V ELI", lat: 55.75, lng: 37.62, country: "Russia", transport: "air", distanceKm: 2500, co2PerKg: 0.18 },
  "Acier Inoxydable 316L": { name: "Stainless 316L", lat: 48.86, lng: 2.35, country: "France", transport: "road", distanceKm: 50, co2PerKg: 0.005 },
  "Acier Inoxydable 316L Standard": { name: "Stainless 316L", lat: 48.86, lng: 2.35, country: "France", transport: "road", distanceKm: 50, co2PerKg: 0.005 },
  "Inox Médical 316L Recyclé": { name: "Recycled 316L", lat: 50.94, lng: 6.96, country: "Germany", transport: "road", distanceKm: 500, co2PerKg: 0.02 },
  "Titane de grade commercial recyclé": { name: "Recycled Ti", lat: 51.51, lng: -0.13, country: "UK", transport: "maritime", distanceKm: 800, co2PerKg: 0.03 },
  "Tantale Poreux": { name: "Tantalum", lat: -1.94, lng: 29.87, country: "Rwanda", transport: "air", distanceKm: 6200, co2PerKg: 0.45 },
  "PEEK": { name: "PEEK", lat: 48.86, lng: 2.35, country: "France", transport: "road", distanceKm: 80, co2PerKg: 0.008 },
  "PEEK Fibres Carbone": { name: "PEEK-CF", lat: 48.86, lng: 2.35, country: "France", transport: "road", distanceKm: 80, co2PerKg: 0.008 },
  "Hydroxyapatite": { name: "Hydroxyapatite", lat: 35.68, lng: 139.69, country: "Japan", transport: "air", distanceKm: 9700, co2PerKg: 0.7 },
  "Zircone": { name: "Zirconia", lat: 52.52, lng: 13.41, country: "Germany", transport: "road", distanceKm: 1000, co2PerKg: 0.04 },
  "Composite PEEK-HA": { name: "PEEK-HA", lat: 42.36, lng: -71.06, country: "USA", transport: "air", distanceKm: 5800, co2PerKg: 0.42 },
  "Magnésium WE43": { name: "Mg WE43", lat: 31.23, lng: 121.47, country: "China", transport: "maritime", distanceKm: 9500, co2PerKg: 0.12 },
  "Titane β (Ti-Nb-Zr)": { name: "Ti-β", lat: 35.68, lng: 139.69, country: "Japan", transport: "air", distanceKm: 9700, co2PerKg: 0.55 },
  "Titane Imprimé 3D": { name: "3D-Printed Ti", lat: 48.86, lng: 2.35, country: "France", transport: "road", distanceKm: 30, co2PerKg: 0.003 },
};

const PARIS: [number, number] = [48.8566, 2.3522];

const TRANSPORT_COLORS: Record<string, string> = {
  air: "#ef4444",
  maritime: "#3b82f6",
  road: "#22c55e",
};

/* ── Custom markers ──────────────────────────────── */

const createDotIcon = (color: string) =>
  L.divIcon({
    className: "",
    html: `<div style="width:10px;height:10px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.3)"></div>`,
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  });

const parisIcon = L.divIcon({
  className: "",
  html: `<div style="width:14px;height:14px;display:flex;align-items:center;justify-content:center">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1e293b" stroke-width="3"><path d="M12 2L12 22"/><path d="M2 12L22 12"/></svg>
  </div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

/* ── Curved line helper ──────────────────────────── */

function getCurvedPath(from: [number, number], to: [number, number]): [number, number][] {
  const points: [number, number][] = [];
  const midLat = (from[0] + to[0]) / 2;
  const midLng = (from[1] + to[1]) / 2;
  const dist = Math.sqrt((from[0] - to[0]) ** 2 + (from[1] - to[1]) ** 2);
  const offset = dist * 0.2;
  const controlLat = midLat + offset;
  const controlLng = midLng;

  for (let t = 0; t <= 1; t += 0.05) {
    const lat = (1 - t) ** 2 * from[0] + 2 * (1 - t) * t * controlLat + t ** 2 * to[0];
    const lng = (1 - t) ** 2 * from[1] + 2 * (1 - t) * t * controlLng + t ** 2 * to[1];
    points.push([lat, lng]);
  }
  return points;
}

/* ── Component ───────────────────────────────────── */

interface TraceabilityMapProps {
  recommendations: AuditRecommendation[];
}

export default function TraceabilityMap({ recommendations }: TraceabilityMapProps) {
  const origins = useMemo(() => {
    const matched: (MaterialOrigin & { materialName: string })[] = [];
    recommendations.forEach((r) => {
      let origin = MATERIAL_ORIGINS[r.material_name];
      if (!origin) {
        const key = Object.keys(MATERIAL_ORIGINS).find((k) =>
          r.material_name.toLowerCase().includes(k.toLowerCase()) ||
          k.toLowerCase().includes(r.material_name.toLowerCase().split(" ")[0])
        );
        if (key) origin = MATERIAL_ORIGINS[key];
      }
      if (origin) {
        matched.push({ ...origin, materialName: r.material_name });
      } else {
        matched.push({
          name: r.material_name,
          lat: 48.86 + (Math.random() - 0.5) * 10,
          lng: 2.35 + (Math.random() - 0.5) * 15,
          country: "Europe",
          transport: "road",
          distanceKm: 500,
          co2PerKg: 0.02,
          materialName: r.material_name,
        });
      }
    });
    return matched;
  }, [recommendations]);

  const stats = useMemo(() => {
    const local = origins.filter((o) => o.distanceKm < 100).length;
    const europe = origins.filter((o) => o.distanceKm >= 100 && o.distanceKm <= 3000).length;
    const longHaul = origins.filter((o) => o.distanceKm > 3000).length;
    const avgCo2 = origins.length > 0
      ? Math.round((origins.reduce((s, o) => s + o.co2PerKg, 0) / origins.length) * 10000) / 10000
      : 0;
    return { local, europe, longHaul, avgCo2 };
  }, [origins]);

  if (recommendations.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Traceability & Import
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Showing {recommendations.length} candidates from the latest audit
      </p>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <div className="rounded-xl border-l-4 border-l-green-500 border border-border bg-card p-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            🏭 Local Manufacturing
          </span>
          <p className="text-2xl font-bold text-foreground font-mono mt-1">{stats.local}</p>
          <p className="text-xs text-muted-foreground">materials &lt; 100 km</p>
        </div>
        <div className="rounded-xl border-l-4 border-l-blue-500 border border-border bg-card p-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            🇪🇺 European Manufacturing
          </span>
          <p className="text-2xl font-bold text-foreground font-mono mt-1">{stats.europe}</p>
          <p className="text-xs text-muted-foreground">materials 100–3000 km</p>
        </div>
        <div className="rounded-xl border-l-4 border-l-orange-500 border border-border bg-card p-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            ✈️ Long-Haul Import
          </span>
          <p className="text-2xl font-bold text-foreground font-mono mt-1">{stats.longHaul}</p>
          <p className="text-xs text-muted-foreground">materials &gt; 3000 km</p>
        </div>
        <div className="rounded-xl border-l-4 border-l-purple-500 border border-border bg-card p-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            Avg. Transport CO₂
          </span>
          <p className="text-2xl font-bold text-foreground font-mono mt-1">{stats.avgCo2}</p>
          <p className="text-xs text-muted-foreground">kg CO₂ · 100 g implant</p>
        </div>
      </div>

      {/* Map */}
      <div className="rounded-xl border border-border overflow-hidden" style={{ height: 420 }}>
        <MapContainer
          center={[35, 10]}
          zoom={2}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />

          <Marker position={PARIS} icon={parisIcon}>
            <Popup>
              <strong>Paris</strong>
              <br />
              Material destination
            </Popup>
          </Marker>

          {origins.map((origin, i) => {
            const color = TRANSPORT_COLORS[origin.transport] || "#64748b";
            const from: [number, number] = [origin.lat, origin.lng];
            const path = getCurvedPath(from, PARIS);

            return (
              <React.Fragment key={i}>
                <Marker position={from} icon={createDotIcon(color)}>
                  <Popup>
                    <strong>{origin.materialName}</strong>
                    <br />
                    {origin.country} · {origin.distanceKm.toLocaleString()} km
                    <br />
                    Transport: {origin.transport === "air" ? "Air" : origin.transport === "maritime" ? "Maritime" : "Road"}
                    <br />
                    CO₂: {origin.co2PerKg} kg/kg
                  </Popup>
                </Marker>
                <Polyline
                  positions={path}
                  pathOptions={{
                    color,
                    weight: 2,
                    opacity: 0.7,
                    dashArray: origin.transport === "air" ? "8 4" : undefined,
                  }}
                />
              </React.Fragment>
            );
          })}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
          ✈️ Air
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
          🚢 Maritime
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
          🚛 Road
        </div>
      </div>
    </div>
  );
}
