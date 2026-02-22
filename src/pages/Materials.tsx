import { useState, lazy, Suspense, useMemo } from "react";
import {
  MATERIAUX,
  ORIGINES,
  scoreClinique,
  scoreEnvironnemental,
  scoreGlobal,
  getCoutTransport,
  type Material,
  type MaterialCategory,
  type MaterialField,
} from "@/data/materials";
import { categoryTo3D } from "@/components/materials3d/MaterialScene";

const MaterialScene = lazy(() => import("@/components/materials3d/MaterialScene"));

const categoryStyles: Record<MaterialCategory, { pill: string; gradient: string }> = {
  "Métal": { pill: "bg-slate-100 text-slate-700", gradient: "from-slate-200 via-blue-100 to-slate-300" },
  "Polymère": { pill: "bg-teal-50 text-teal-700", gradient: "from-teal-100 via-white to-teal-50" },
  "Céramique": { pill: "bg-amber-50 text-amber-800", gradient: "from-amber-50 via-orange-50 to-yellow-50" },
  "Biosourcé": { pill: "bg-green-50 text-green-700", gradient: "from-green-100 via-emerald-50 to-green-50" },
  "Composite": { pill: "bg-purple-50 text-purple-700", gradient: "from-purple-200 via-indigo-100 to-slate-800" },
  "Superalliage": { pill: "bg-red-50 text-red-700", gradient: "from-red-200 via-orange-100 to-red-300" },
  "Alliage Léger": { pill: "bg-sky-50 text-sky-700", gradient: "from-sky-100 via-blue-50 to-sky-200" },
  "Bois": { pill: "bg-yellow-50 text-yellow-800", gradient: "from-yellow-100 via-amber-50 to-yellow-200" },
  "Naturel": { pill: "bg-lime-50 text-lime-700", gradient: "from-lime-100 via-green-50 to-lime-50" },
};

type Filter = "All" | MaterialCategory | MaterialField;
const categoryFilters: MaterialCategory[] = ["Métal", "Polymère", "Céramique", "Biosourcé", "Composite", "Superalliage", "Alliage Léger", "Bois", "Naturel"];
const fieldFilters: MaterialField[] = ["Medicine", "Architecture", "Mechanics", "Aerospace"];

const FIELD_LABELS: Record<MaterialField, string> = {
  Medicine: "🩺 Médecine",
  Architecture: "🏗️ Architecture",
  Mechanics: "⚙️ Mécanique",
  Aerospace: "🚀 Aérospatial",
};

const CO2Badge = ({ co2 }: { co2: number }) => {
  const color =
    co2 < 5 ? "bg-green-100 text-green-700" : co2 < 20 ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${color}`}>
      {co2} kg CO₂
    </span>
  );
};

const StaticPreview = ({ category }: { category: MaterialCategory }) => {
  const s = categoryStyles[category];
  return (
    <div className={`w-full h-full rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center relative overflow-hidden`}>
      {(category === "Métal" || category === "Alliage Léger") && (
        <>
          <div className="w-10 h-24 rounded-md bg-white/20 backdrop-blur-sm" style={{ boxShadow: "inset -2px 0 8px rgba(0,0,0,0.1), 4px 4px 12px rgba(0,0,0,0.08)" }} />
          {[0,1,2,3,4].map(i => <div key={i} className="absolute w-12 h-[1.5px] bg-white/30" style={{ top: `${30 + i*10}%` }} />)}
        </>
      )}
      {category === "Polymère" && (
        <>
          {[0,1,2].map(i => <div key={i} className="absolute rounded-lg bg-white/25 backdrop-blur-sm" style={{ width: `${70-i*15}%`, height: "14%", top: `${25+i*20}%`, left: `${15+i*5}%`, transform: `rotate(${-3+i*3}deg)` }} />)}
        </>
      )}
      {(category === "Céramique" || category === "Naturel") && (
        <>
          <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm" style={{ boxShadow: "inset -3px -3px 10px rgba(0,0,0,0.05), 3px 3px 10px rgba(0,0,0,0.06)" }} />
          <div className="absolute w-8 h-8 rotate-45 bg-white/20 top-6 right-8 rounded-sm" />
        </>
      )}
      {(category === "Biosourcé" || category === "Bois") && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 140 140">
          <path d="M10 70 Q40 30 70 70 Q100 110 130 70" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
          <path d="M10 85 Q40 50 70 85 Q100 120 130 85" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
          <path d="M10 55 Q40 20 70 55 Q100 90 130 55" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
        </svg>
      )}
      {(category === "Composite" || category === "Superalliage") && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 140 140">
          {[[40,30],[80,25],[60,60],[30,80],[100,70],[55,100],[90,95]].map(([x,y],i) => (
            <circle key={i} cx={x} cy={y} r="5" fill="rgba(255,255,255,0.5)" />
          ))}
          {[[40,30,80,25],[80,25,60,60],[40,30,60,60],[60,60,30,80],[60,60,100,70],[30,80,55,100],[100,70,90,95],[55,100,90,95]].map(([x1,y1,x2,y2],i) => (
            <line key={`l${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          ))}
        </svg>
      )}
    </div>
  );
};

const MaterialCard = ({ material }: { material: Material }) => {
  const [hovered, setHovered] = useState(false);
  const style = categoryStyles[material.categorie];
  const origin = ORIGINES[material.key];
  const global = scoreGlobal(material);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-card rounded-2xl border border-border p-4 flex flex-col items-center gap-3 cursor-pointer transition-all duration-300"
      style={{
        borderRadius: 16,
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 12px 32px rgba(0,0,0,0.12)" : "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <div className="w-full aspect-square rounded-xl overflow-hidden relative" style={{ maxWidth: 180 }}>
        {hovered ? (
          <Suspense fallback={<StaticPreview category={material.categorie} />}>
            <MaterialScene category={categoryTo3D[material.categorie] || "Emerging"} hovered={hovered} />
          </Suspense>
        ) : (
          <StaticPreview category={material.categorie} />
        )}
      </div>
      <div className="flex flex-col items-center gap-2 w-full">
        <span className="font-semibold text-sm text-foreground text-center leading-tight">
          {material.nom}
        </span>
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${style.pill}`}>
            {material.categorie}
          </span>
          <CO2Badge co2={material.co2_kg_par_kg} />
        </div>
        <div className="text-[10px] text-muted-foreground text-center">
          Score : <b className="text-foreground">{global}/10</b>
          {origin && <> · {origin.flag} {origin.pays}</>}
        </div>
        <div className="flex gap-1 flex-wrap justify-center">
          {material.biodegradable && <span className="text-[9px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full">Bio</span>}
          {material.compatible_irm && <span className="text-[9px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded-full">IRM</span>}
          {material.recyclable && <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">♻️</span>}
          {material.fields && material.fields.length > 0 && (
            <span className="text-[9px] font-bold text-violet-700 bg-violet-100 px-1.5 py-0.5 rounded-full">
              {material.fields.map(f => f === "Medicine" ? "🩺" : f === "Architecture" ? "🏗️" : f === "Mechanics" ? "⚙️" : "🚀").join("")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const Materials = () => {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [sortBy, setSortBy] = useState<"score" | "co2" | "name">("score");

  // Determine which categories actually have materials
  const usedCategories = useMemo(() => {
    const cats = new Set<MaterialCategory>();
    Object.values(MATERIAUX).forEach(m => cats.add(m.categorie));
    return categoryFilters.filter(c => cats.has(c));
  }, []);

  const filtered = useMemo(() => {
    let list = Object.values(MATERIAUX);
    if (activeFilter !== "All") {
      // Check if it's a field filter
      if (fieldFilters.includes(activeFilter as MaterialField)) {
        list = list.filter(m => m.fields?.includes(activeFilter as MaterialField) || 
          // Default: materials without fields tag are Medicine
          (!m.fields && activeFilter === "Medicine"));
      } else {
        list = list.filter((m) => m.categorie === activeFilter);
      }
    }
    if (sortBy === "score") list.sort((a, b) => scoreGlobal(b) - scoreGlobal(a));
    else if (sortBy === "co2") list.sort((a, b) => a.co2_kg_par_kg - b.co2_kg_par_kg);
    else list.sort((a, b) => a.nom.localeCompare(b.nom));
    return list;
  }, [activeFilter, sortBy, usedCategories]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl text-foreground mb-1">Materials</h1>
        <p className="text-muted-foreground text-sm">
          {Object.keys(MATERIAUX).length} materials · Certified LCA data
        </p>
      </div>

      {/* Field filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground font-medium mr-1">Domaine :</span>
        {fieldFilters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(activeFilter === f ? "All" : f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              activeFilter === f
                ? "bg-foreground text-background border-foreground"
                : "bg-card text-muted-foreground border-border hover:border-foreground/30"
            }`}
          >
            {FIELD_LABELS[f]}
          </button>
        ))}
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground font-medium mr-1">Catégorie :</span>
        <button
          onClick={() => setActiveFilter("All")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            activeFilter === "All"
              ? "bg-foreground text-background border-foreground"
              : "bg-card text-muted-foreground border-border hover:border-foreground/30"
          }`}
        >
          All
        </button>
        {usedCategories.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              activeFilter === f
                ? "bg-foreground text-background border-foreground"
                : "bg-card text-muted-foreground border-border hover:border-foreground/30"
            }`}
          >
            {f}
          </button>
        ))}
        <div className="ml-auto flex gap-1">
          {(["score", "co2", "name"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                sortBy === s ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s === "score" ? "Score ↓" : s === "co2" ? "CO₂ ↑" : "A-Z"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((m) => (
          <MaterialCard key={m.key} material={m} />
        ))}
      </div>
    </div>
  );
};

export default Materials;
