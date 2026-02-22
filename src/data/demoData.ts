/**
 * Field-specific demo data for dashboard display across all domains.
 */

export interface DemoMaterial {
  name: string;
  category: string;
  score: number;
  co2: number;
  sustainability: number;
  cost: number;
  durability: number;
  availability: number;
}

export interface DemoAnalysis {
  date: string;
  useCase: string;
  currentMaterial: string;
  recommended: string;
  co2Saved: number;
}

export interface FieldDemoData {
  materials: DemoMaterial[];
  categories: { name: string; color: string }[];
  analyses: DemoAnalysis[];
  metrics: {
    totalMaterials: number;
    totalAnalyses: number;
    totalCO2Saved: number;
    unitLabel: string;
  };
  radarAxes: string[];
}

const MEDICINE_DATA: FieldDemoData = {
  materials: [
    { name: "Titanium Grade 23", category: "Metal", score: 8.7, co2: 44, sustainability: 6.2, cost: 4, durability: 9, availability: 8 },
    { name: "UHMWPE + Vitamin E", category: "Polymer", score: 8.3, co2: 3.4, sustainability: 8.5, cost: 6, durability: 8, availability: 9 },
    { name: "PEEK Standard", category: "Polymer", score: 8.1, co2: 9.8, sustainability: 7.2, cost: 4, durability: 8, availability: 8 },
    { name: "Hydroxyapatite", category: "Ceramic", score: 7.9, co2: 6.2, sustainability: 8.1, cost: 6, durability: 7, availability: 7 },
    { name: "PLA Biosourced", category: "Biosourced", score: 7.5, co2: 2.2, sustainability: 9.2, cost: 8, durability: 4, availability: 8 },
    { name: "CoCrMo Alloy", category: "Metal", score: 7.4, co2: 51, sustainability: 4.1, cost: 6, durability: 9, availability: 8 },
    { name: "CFR-PEEK Composite", category: "Composite", score: 8.0, co2: 29, sustainability: 5.5, cost: 3, durability: 8, availability: 6 },
    { name: "Bioglass 45S5", category: "Ceramic", score: 7.2, co2: 5.8, sustainability: 7.8, cost: 5, durability: 6, availability: 5 },
  ],
  categories: [
    { name: "Metal", color: "#64748b" },
    { name: "Polymer", color: "#14b8a6" },
    { name: "Ceramic", color: "#f59e0b" },
    { name: "Biosourced", color: "#22c55e" },
    { name: "Composite", color: "#8b5cf6" },
  ],
  analyses: [
    { date: "2026-02-21 14:30", useCase: "Hip replacement, 68 y/o", currentMaterial: "CoCrMo Alloy", recommended: "Titanium Grade 23", co2Saved: 7.0 },
    { date: "2026-02-20 09:15", useCase: "Tibial fracture, 22 y/o", currentMaterial: "Stainless Steel 316L", recommended: "PLA Biosourced", co2Saved: 2.9 },
    { date: "2026-02-19 16:45", useCase: "Spinal fusion, 55 y/o", currentMaterial: "Titanium Grade 5", recommended: "PEEK Standard", co2Saved: 32.2 },
    { date: "2026-02-18 11:00", useCase: "Knee prosthesis, 72 y/o", currentMaterial: "CoCrMo Alloy", recommended: "UHMWPE + Vitamin E", co2Saved: 47.6 },
    { date: "2026-02-17 08:30", useCase: "Cranial repair, 45 y/o", currentMaterial: "PMMA Cement", recommended: "Hydroxyapatite", co2Saved: -1.7 },
  ],
  metrics: { totalMaterials: 30, totalAnalyses: 5, totalCO2Saved: 88.0, unitLabel: "kg CO2/implant" },
  radarAxes: ["Clinical", "Ecology", "Durability", "Cost", "Availability"],
};

const ARCHITECTURE_DATA: FieldDemoData = {
  materials: [
    { name: "Cross-Laminated Timber", category: "Wood", score: 9.1, co2: -1.2, sustainability: 9.5, cost: 7, durability: 8, availability: 8 },
    { name: "Hempcrete", category: "Bio-based", score: 8.6, co2: -0.4, sustainability: 9.8, cost: 6, durability: 6, availability: 5 },
    { name: "Recycled Steel", category: "Metal", score: 8.2, co2: 1.4, sustainability: 8.0, cost: 7, durability: 9, availability: 9 },
    { name: "Geopolymer Concrete", category: "Mineral", score: 7.9, co2: 0.18, sustainability: 8.5, cost: 5, durability: 9, availability: 4 },
    { name: "Rammed Earth", category: "Natural", score: 8.4, co2: 0.005, sustainability: 9.9, cost: 8, durability: 7, availability: 7 },
    { name: "Cork Insulation", category: "Bio-based", score: 7.8, co2: -0.8, sustainability: 9.3, cost: 5, durability: 7, availability: 6 },
    { name: "Recycled Aluminum", category: "Metal", score: 7.5, co2: 2.8, sustainability: 7.5, cost: 6, durability: 9, availability: 8 },
    { name: "Bamboo Structural", category: "Wood", score: 8.8, co2: -1.5, sustainability: 9.6, cost: 8, durability: 7, availability: 6 },
  ],
  categories: [
    { name: "Wood", color: "#92400e" },
    { name: "Bio-based", color: "#22c55e" },
    { name: "Metal", color: "#64748b" },
    { name: "Mineral", color: "#f59e0b" },
    { name: "Natural", color: "#a16207" },
  ],
  analyses: [
    { date: "2026-02-21 10:00", useCase: "Passive house insulation, cold climate", currentMaterial: "Polystyrene XPS", recommended: "Hempcrete", co2Saved: 12.4 },
    { date: "2026-02-20 14:20", useCase: "Commercial building structure", currentMaterial: "Reinforced Concrete", recommended: "Cross-Laminated Timber", co2Saved: 45.2 },
    { date: "2026-02-19 09:30", useCase: "Foundation for residential", currentMaterial: "Portland Cement", recommended: "Geopolymer Concrete", co2Saved: 18.6 },
    { date: "2026-02-18 16:00", useCase: "Interior wall partition", currentMaterial: "Drywall", recommended: "Rammed Earth", co2Saved: 8.3 },
    { date: "2026-02-17 11:45", useCase: "Facade cladding, mixed-use", currentMaterial: "Aluminum Panels", recommended: "Bamboo Structural", co2Saved: 22.1 },
  ],
  metrics: { totalMaterials: 24, totalAnalyses: 5, totalCO2Saved: 106.6, unitLabel: "kg CO2/m2" },
  radarAxes: ["Structural", "Ecology", "Durability", "Cost", "Availability"],
};

const MECHANICS_DATA: FieldDemoData = {
  materials: [
    { name: "Inconel 718", category: "Superalloy", score: 9.0, co2: 32.5, sustainability: 4.2, cost: 3, durability: 10, availability: 7 },
    { name: "Carbon Fiber IM7", category: "Composite", score: 8.7, co2: 24.0, sustainability: 5.0, cost: 3, durability: 9, availability: 6 },
    { name: "Aluminum 7075-T6", category: "Light Alloy", score: 8.3, co2: 8.2, sustainability: 7.5, cost: 7, durability: 8, availability: 9 },
    { name: "Titanium Ti-6Al-4V", category: "Light Alloy", score: 8.5, co2: 42.0, sustainability: 5.5, cost: 4, durability: 9, availability: 7 },
    { name: "CFRP Recycled", category: "Composite", score: 8.1, co2: 12.0, sustainability: 8.0, cost: 5, durability: 8, availability: 5 },
    { name: "Stainless 17-4PH", category: "Steel", score: 7.8, co2: 6.8, sustainability: 7.0, cost: 7, durability: 9, availability: 9 },
    { name: "Silicon Carbide SiC", category: "Ceramic", score: 7.5, co2: 15.0, sustainability: 6.0, cost: 4, durability: 10, availability: 5 },
    { name: "Natural Fiber Composite", category: "Bio-composite", score: 7.2, co2: 3.5, sustainability: 9.0, cost: 8, durability: 6, availability: 6 },
  ],
  categories: [
    { name: "Superalloy", color: "#dc2626" },
    { name: "Composite", color: "#8b5cf6" },
    { name: "Light Alloy", color: "#3b82f6" },
    { name: "Steel", color: "#64748b" },
    { name: "Ceramic", color: "#f59e0b" },
    { name: "Bio-composite", color: "#22c55e" },
  ],
  analyses: [
    { date: "2026-02-21 08:45", useCase: "Turbine blade, 1200C operating temp", currentMaterial: "Inconel 625", recommended: "Inconel 718", co2Saved: 4.2 },
    { date: "2026-02-20 13:00", useCase: "Robotic arm joint, lightweight", currentMaterial: "Aluminum 6061", recommended: "CFRP Recycled", co2Saved: 8.5 },
    { date: "2026-02-19 10:15", useCase: "Engine cooling system", currentMaterial: "Copper Alloy", recommended: "Aluminum 7075-T6", co2Saved: 15.3 },
    { date: "2026-02-18 15:30", useCase: "Bearing housing, high wear", currentMaterial: "Bronze Alloy", recommended: "Silicon Carbide SiC", co2Saved: 3.1 },
    { date: "2026-02-17 09:00", useCase: "Chassis panel, automotive", currentMaterial: "Mild Steel", recommended: "Natural Fiber Composite", co2Saved: 22.0 },
  ],
  metrics: { totalMaterials: 18, totalAnalyses: 5, totalCO2Saved: 53.1, unitLabel: "kg CO2/part" },
  radarAxes: ["Performance", "Ecology", "Durability", "Cost", "Availability"],
};

const AEROSPACE_DATA: FieldDemoData = {
  materials: [
    { name: "CFRP Aerospace Grade", category: "Composite", score: 9.3, co2: 28.0, sustainability: 5.0, cost: 2, durability: 9, availability: 6 },
    { name: "Ti-6Al-4V ELI", category: "Titanium", score: 9.0, co2: 44.0, sustainability: 5.5, cost: 3, durability: 10, availability: 7 },
    { name: "Aluminum-Lithium 2195", category: "Light Alloy", score: 8.6, co2: 12.5, sustainability: 7.0, cost: 5, durability: 8, availability: 7 },
    { name: "Ceramic Matrix CMC", category: "Ceramic", score: 8.4, co2: 35.0, sustainability: 4.5, cost: 2, durability: 10, availability: 4 },
    { name: "Inconel 625", category: "Superalloy", score: 8.2, co2: 38.0, sustainability: 4.0, cost: 3, durability: 10, availability: 6 },
    { name: "Nomex Honeycomb", category: "Composite", score: 7.9, co2: 18.0, sustainability: 6.0, cost: 5, durability: 8, availability: 7 },
    { name: "Recycled Al-2024", category: "Light Alloy", score: 7.6, co2: 3.5, sustainability: 8.5, cost: 7, durability: 7, availability: 8 },
    { name: "Bio-based Epoxy", category: "Bio-composite", score: 7.0, co2: 5.2, sustainability: 9.0, cost: 6, durability: 6, availability: 5 },
  ],
  categories: [
    { name: "Composite", color: "#8b5cf6" },
    { name: "Titanium", color: "#3b82f6" },
    { name: "Light Alloy", color: "#14b8a6" },
    { name: "Ceramic", color: "#f59e0b" },
    { name: "Superalloy", color: "#dc2626" },
    { name: "Bio-composite", color: "#22c55e" },
  ],
  analyses: [
    { date: "2026-02-21 07:00", useCase: "Fuselage panel, narrow-body", currentMaterial: "Aluminum 2024-T3", recommended: "CFRP Aerospace Grade", co2Saved: -16.0 },
    { date: "2026-02-20 11:30", useCase: "Satellite radiation shield", currentMaterial: "Aluminum 6061", recommended: "Recycled Al-2024", co2Saved: 4.7 },
    { date: "2026-02-19 14:00", useCase: "Turbine shroud, hot section", currentMaterial: "Inconel 718", recommended: "Ceramic Matrix CMC", co2Saved: -2.5 },
    { date: "2026-02-18 09:45", useCase: "Cabin interior panel", currentMaterial: "Fiberglass Panel", recommended: "Nomex Honeycomb", co2Saved: 6.2 },
    { date: "2026-02-17 16:20", useCase: "Wing spar, regional jet", currentMaterial: "Aluminum 7075", recommended: "Aluminum-Lithium 2195", co2Saved: -4.3 },
  ],
  metrics: { totalMaterials: 22, totalAnalyses: 5, totalCO2Saved: -11.9, unitLabel: "kg CO2/kg" },
  radarAxes: ["Performance", "Ecology", "Durability", "Cost", "Availability"],
};

export const FIELD_DEMO_DATA: Record<string, FieldDemoData> = {
  Medicine: MEDICINE_DATA,
  Architecture: ARCHITECTURE_DATA,
  Mechanics: MECHANICS_DATA,
  Aerospace: AEROSPACE_DATA,
};
