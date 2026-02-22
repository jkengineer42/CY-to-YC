import { useState, useMemo, useEffect, lazy, Suspense } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchAudits, type AuditRecord } from "@/lib/auditService";

const TraceabilityMap = lazy(() => import("@/components/TraceabilityMap"));
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { MessageSquare, Package, Leaf, Activity, Clock, TreePine, Shield, TrendingDown } from "lucide-react";

const PROFILE_COLORS: Record<string, string> = {
  "Best Overall": "#15803d",
  "Ecological Profile": "#0369a1",
  "Economic Profile": "#b45309",
};

const CATEGORY_COLORS: Record<string, string> = {
  Metal: "#64748b",
  Polymer: "#14b8a6",
  Ceramic: "#f59e0b",
  Biosourced: "#22c55e",
  Composite: "#8b5cf6",
  Wood: "#92400e",
  "Bio-based": "#22c55e",
  Mineral: "#f59e0b",
  Natural: "#a16207",
  Superalloy: "#dc2626",
  "Light Alloy": "#3b82f6",
  Steel: "#64748b",
  "Bio-composite": "#22c55e",
  Titanium: "#3b82f6",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [audits, setAudits] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(searchParams.get("audit"));

  useEffect(() => {
    fetchAudits().then((data) => {
      setAudits(data);
      setLoading(false);
    });
  }, []);

  const allRecs = useMemo(() => audits.flatMap((a) => a.recommendations), [audits]);

  const totalCO2Saved = useMemo(
    () => Math.round(allRecs.reduce((sum, r) => sum + Number(r.co2_saved), 0) * 10) / 10,
    [allRecs]
  );

  const avgScore = useMemo(() => {
    if (allRecs.length === 0) return 0;
    return Math.round((allRecs.reduce((sum, r) => sum + Number(r.score), 0) / allRecs.length) * 10) / 10;
  }, [allRecs]);

  const treesEquiv = Math.round((Math.abs(totalCO2Saved) / 25) * 10) / 10;

  // CO2 by category for bar chart
  const co2ByCategory = useMemo(() => {
    const cats: Record<string, { total: number; count: number }> = {};
    allRecs.forEach((r) => {
      if (!cats[r.category]) cats[r.category] = { total: 0, count: 0 };
      cats[r.category].total += Number(r.co2);
      cats[r.category].count += 1;
    });
    return Object.entries(cats).map(([cat, { total, count }]) => ({
      category: cat,
      avgCO2: Math.round((total / count) * 10) / 10,
    }));
  }, [allRecs]);

  // Radar data: avg scores by profile
  const radarData = useMemo(() => {
    const axes = ["Score", "Ecology", "Cost"];
    return axes.map((axis) => {
      const entry: Record<string, string | number> = { axis };
      ["Best Overall", "Ecological Profile", "Economic Profile"].forEach((profile) => {
        const recs = allRecs.filter((r) => r.profile === profile);
        if (recs.length === 0) { entry[profile] = 0; return; }
        let val = 0;
        if (axis === "Score") val = recs.reduce((s, r) => s + Number(r.score), 0) / recs.length;
        if (axis === "Ecology") val = recs.reduce((s, r) => s + Number(r.sustainability), 0) / recs.length;
        if (axis === "Cost") val = recs.reduce((s, r) => s + Number(r.cost), 0) / recs.length;
        entry[profile] = Math.round(val * 10) / 10;
      });
      return entry;
    });
  }, [allRecs]);

  // CO2 gain potential: top materials by co2_saved
  const co2GainTop = useMemo(() => {
    const matMap: Record<string, { totalSaved: number; count: number }> = {};
    allRecs.forEach((r) => {
      if (!matMap[r.material_name]) matMap[r.material_name] = { totalSaved: 0, count: 0 };
      matMap[r.material_name].totalSaved += Number(r.co2_saved);
      matMap[r.material_name].count += 1;
    });
    return Object.entries(matMap)
      .map(([name, { totalSaved }]) => ({ name, co2Saved: Math.round(totalSaved * 10) / 10 }))
      .sort((a, b) => Math.abs(b.co2Saved) - Math.abs(a.co2Saved))
      .slice(0, 5);
  }, [allRecs]);

  // Selected or last audit's cards for display
  const activeAudit = selectedAuditId ? audits.find((a) => a.id === selectedAuditId) || audits[0] : audits[0];
  const lastCards = activeAudit?.recommendations || [];

  const barColors = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6"];

  const hasData = audits.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-2xl text-foreground mb-1">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            {hasData
              ? `${audits.length} analysis${audits.length > 1 ? "es" : ""} completed`
              : "Run your first analysis to populate the dashboard"}
          </p>
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Net Carbon Savings",
            value: hasData ? `${totalCO2Saved > 0 ? "+" : ""}${totalCO2Saved} kg` : "—",
            sub: hasData ? "total kg CO₂ saved" : "No data",
            icon: Leaf,
            accent: "border-l-4 border-l-green-500",
          },
          {
            label: "Overall Score",
            value: hasData ? avgScore : "—",
            sub: hasData ? "/ 10 · avg. recommendations" : "No data",
            icon: Activity,
            accent: "border-l-4 border-l-blue-500",
          },
          {
            label: "Tree Equivalent",
            value: hasData ? treesEquiv : "—",
            sub: hasData ? "trees worth of CO₂ saved" : "No data",
            icon: TreePine,
            accent: "border-l-4 border-l-purple-500",
          },
          {
            label: "Analyses Completed",
            value: audits.length,
            sub: hasData ? `${allRecs.length} materials recommended` : "Run an audit",
            icon: Package,
            accent: "border-l-4 border-l-amber-500",
          },
        ].map((m) => (
          <div key={m.label} className={`rounded-xl border border-border bg-card p-5 ${m.accent}`}>
            <div className="flex items-center gap-2 mb-2">
              <m.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {m.label}
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground font-mono">{m.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{m.sub}</p>
          </div>
        ))}
      </div>

      {!hasData && (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-serif text-lg text-foreground mb-2">No analyses yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Run your first audit in the chat to see your data appear here.
          </p>
          <button
            onClick={() => navigate("/chat")}
            className="rounded-lg bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Start an audit
          </button>
        </div>
      )}

      {/* Last audit's top 3 */}
      {lastCards.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Top 3 Recommendations {selectedAuditId ? "· Selected Analysis" : "· Latest Analysis"}
            </h3>
            {selectedAuditId && (
              <button
                onClick={() => setSelectedAuditId(null)}
                className="text-xs text-primary hover:underline"
              >
                ← Back to latest analysis
              </button>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-4">{activeAudit?.query}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {lastCards.map((card, idx) => {
              const borders = ["border-green-400", "border-blue-400", "border-amber-400"];
              const bgs = ["bg-green-50/50", "bg-blue-50/50", "bg-amber-50/50"];
              const icons = [Shield, Leaf, TrendingDown];
              const Icon = icons[idx] || Shield;
              return (
                <div key={card.id} className={`rounded-xl border-2 ${borders[idx]} ${bgs[idx]} p-4 flex flex-col gap-2`}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-bold uppercase tracking-wide" style={{ color: PROFILE_COLORS[card.profile] || "#15803d" }}>
                      {card.profile}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm text-foreground">{card.material_name}</h4>
                  <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                    <span>Score: <b className="text-foreground">{Number(card.score).toFixed(1)}/10</b></span>
                    <span>Ecology: <b className="text-foreground">{Number(card.sustainability).toFixed(1)}/10</b></span>
                    <span>CO2: <b className="text-foreground">{Number(card.co2)} kg</b></span>
                    <span>Cost: <b className="text-foreground">{Number(card.cost)}/10</b></span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${Number(card.co2_saved) <= 0 ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"}`}>
                      {Number(card.co2_saved) <= 0 ? "" : "+"}{Number(card.co2_saved)} kg CO2
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent text-accent-foreground">
                      {card.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Charts row */}
      {hasData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Multi-Criteria Comparison
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fontSize: 9 }} />
                <Radar name="Best Overall" dataKey="Best Overall" stroke="#15803d" fill="#15803d" fillOpacity={0.15} strokeWidth={2} />
                <Radar name="Ecological" dataKey="Ecological Profile" stroke="#0369a1" fill="#0369a1" fillOpacity={0.1} strokeWidth={2} />
                <Radar name="Economic" dataKey="Economic Profile" stroke="#b45309" fill="#b45309" fillOpacity={0.1} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-2 justify-center">
              {[
                { name: "Best Overall", color: "#15803d" },
                { name: "Ecological", color: "#0369a1" },
                { name: "Economic", color: "#b45309" },
              ].map((p) => (
                <div key={p.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  {p.name}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              CO₂ Savings Potential · Top 5
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={co2GainTop} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={140} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid hsl(var(--border))",
                    background: "hsl(var(--card))",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="co2Saved" radius={[0, 6, 6, 0]}>
                  {co2GainTop.map((entry, i) => (
                    <Cell key={i} fill={entry.co2Saved <= 0 ? "#22c55e" : "#f59e0b"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Traceability Map */}
      {hasData && lastCards.length > 0 && (
        <Suspense fallback={<div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">Loading map...</div>}>
          <TraceabilityMap recommendations={lastCards} />
        </Suspense>
      )}

      {/* Full comparison table */}
      {hasData && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Full Recommended Materials Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground uppercase tracking-wide border-b border-border">
                  <th className="pb-2 pr-4">Material</th>
                  <th className="pb-2 pr-4">Score</th>
                  <th className="pb-2 pr-4">Ecology</th>
                  <th className="pb-2 pr-4">CO₂/kg</th>
                  <th className="pb-2 pr-4">CO₂ Saved</th>
                  <th className="pb-2">Profile</th>
                </tr>
              </thead>
              <tbody>
                {allRecs.slice(0, 15).map((r) => (
                  <tr key={r.id} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                    <td className="py-3 pr-4">
                      <span className="font-semibold text-foreground">{r.material_name}</span>
                      <br />
                      <span className="text-xs text-muted-foreground">{r.category}</span>
                    </td>
                    <td className="py-3 pr-4 font-mono font-bold">{Number(r.score).toFixed(1)}</td>
                    <td className="py-3 pr-4 font-mono">{Number(r.sustainability).toFixed(1)}</td>
                    <td className="py-3 pr-4 font-mono">{Number(r.co2)} kg</td>
                    <td className="py-3 pr-4">
                      <span className={`font-mono font-bold text-xs ${Number(r.co2_saved) <= 0 ? "text-green-600" : "text-red-600"}`}>
                        {Number(r.co2_saved) <= 0 ? "" : "+"}{Number(r.co2_saved)} kg
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{
                          backgroundColor: (PROFILE_COLORS[r.profile] || "#64748b") + "20",
                          color: PROFILE_COLORS[r.profile] || "#64748b",
                        }}
                      >
                        {r.profile}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => navigate("/chat")}
          className="rounded-xl border border-border bg-card p-5 text-left hover:bg-accent/50 transition-colors group"
        >
          <MessageSquare className="h-5 w-5 text-muted-foreground group-hover:text-foreground mb-2" />
          <h3 className="font-semibold text-foreground mb-1">Start an audit</h3>
          <p className="text-sm text-muted-foreground">
            Describe a case to get recommendations
          </p>
        </button>
        <button
          onClick={() => navigate("/materials")}
          className="rounded-xl border border-border bg-card p-5 text-left hover:bg-accent/50 transition-colors group"
        >
          <Package className="h-5 w-5 text-muted-foreground group-hover:text-foreground mb-2" />
          <h3 className="font-semibold text-foreground mb-1">Explore materials</h3>
          <p className="text-sm text-muted-foreground">
            Browse the complete database
          </p>
        </button>
      </div>

      {/* History */}
      {hasData && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Analysis History
          </h3>
          <div className="space-y-2">
            {audits.slice(0, 10).map((a) => {
              const bestRec = a.recommendations.find((r) => r.profile === "Best Overall") || a.recommendations[0];
              return (
                <button
                  key={a.id}
                  onClick={() => {
                    setSelectedAuditId(a.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`flex items-center justify-between p-4 rounded-lg text-sm w-full text-left transition-colors ${
                    selectedAuditId === a.id
                      ? "bg-primary/10 border border-primary/30"
                      : "bg-accent/30 hover:bg-accent/60"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-foreground">{bestRec?.material_name || "—"}</span>
                    <span className="text-muted-foreground"> — {a.query.length > 50 ? a.query.slice(0, 47) + "..." : a.query}</span>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {a.field} · {a.specialty} · {new Date(a.created_at).toLocaleDateString("en-US")}
                    </div>
                  </div>
                  {bestRec && (
                    <span className={`font-mono font-bold text-xs shrink-0 ${Number(bestRec.co2_saved) <= 0 ? "text-green-600" : "text-red-600"}`}>
                      {Number(bestRec.co2_saved) <= 0 ? "" : "+"}{Number(bestRec.co2_saved)} kg CO₂
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <p className="text-[10px] text-muted-foreground text-center">
        ⚠️ Decision support only. These recommendations are aids for decision-making.
      </p>
    </div>
  );
};

export default Dashboard;
