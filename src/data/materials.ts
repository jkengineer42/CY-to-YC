/**
 * SurgGreen — Knowledge Base (ported from Python)
 * Complete materials database with clinical & environmental data
 */

export type MaterialCategory = 
  | "Métal" | "Polymère" | "Céramique" | "Biosourcé" | "Composite"
  | "Superalliage" | "Alliage Léger" | "Bois" | "Naturel";

export type MaterialField = "Medicine" | "Architecture" | "Mechanics" | "Aerospace";

export interface Material {
  key: string;
  nom: string;
  categorie: MaterialCategory;
  fields?: MaterialField[];
  co2_kg_par_kg: number;
  co2_range: [number, number];
  module_elastique_gpa: number;
  stress_shielding: number;
  recyclable: boolean;
  biodegradable: boolean;
  duree_vie_implant_ans: number;
  types_chirurgie: string[];
  taux_succes_pct: number;
  taux_succes_source: string;
  biocompatibilite: number;
  resistance_mecanique: number;
  osteointegration: number;
  radio_opaque: boolean;
  compatible_irm: boolean;
  sterilisation: string[];
  norme_iso: string;
  prix_relatif: number;
  disponibilite: number;
  risque_infection: number;
  risque_allergie: number;
  reference: string;
}

export interface Origine {
  pays: string;
  ville_ref: string;
  lat: number;
  lon: number;
  distance_km: number;
  mode_transport: "aerien" | "maritime" | "routier";
  note_origine: string;
  flag: string;
}

export const TRANSPORT_FACTEURS = {
  aerien:   { co2: 0.00050, cout: 0.00030 },
  maritime: { co2: 0.00001, cout: 0.000030 },
  routier:  { co2: 0.00010, cout: 0.000080 },
} as const;

export const ORIGINES: Record<string, Origine> = {
  titane_grade5: { pays: "Japon / USA", ville_ref: "Osaka", lat: 34.69, lon: 135.50, distance_km: 9700, mode_transport: "aerien", note_origine: "Alliage Ti-6Al-4V — Sumitomo (JP), ATI Metals (USA)", flag: "🇯🇵" },
  titane_grade23: { pays: "USA", ville_ref: "Pittsburgh", lat: 40.44, lon: -79.99, distance_km: 6700, mode_transport: "aerien", note_origine: "ATI Metals, Carpenter Technology — grade ELI certifié ASTM F136", flag: "🇺🇸" },
  titane_poreux_3d: { pays: "Allemagne / Belgique", ville_ref: "Bruxelles", lat: 50.85, lon: 4.35, distance_km: 310, mode_transport: "routier", note_origine: "EOS GmbH (DE), Materialise (BE) — impression SLM Ti local", flag: "🇩🇪" },
  acier_316L: { pays: "Allemagne", ville_ref: "Düsseldorf", lat: 51.22, lon: 6.78, distance_km: 490, mode_transport: "routier", note_origine: "Outokumpu, ThyssenKrupp — production européenne ISO 5832-1", flag: "🇩🇪" },
  cobalt_chrome: { pays: "RDC → Belgique (raffiné)", ville_ref: "Liège", lat: 50.63, lon: 5.57, distance_km: 370, mode_transport: "routier", note_origine: "Minerai cobalt RDC → raffinerie Umicore (Hoboken, BE)", flag: "🇧🇪" },
  tantale_poreux: { pays: "RDC / Rwanda → USA", ville_ref: "Portland (OR)", lat: 45.52, lon: -122.67, distance_km: 9200, mode_transport: "aerien", note_origine: "Coltan RDC/Rwanda → H.C. Starck (USA) → Zimmer Biomet", flag: "🇺🇸" },
  nitinol: { pays: "USA", ville_ref: "Fremont (CA)", lat: 37.54, lon: -121.98, distance_km: 9100, mode_transport: "aerien", note_origine: "Nitinol Devices & Components, Fort Wayne Metals (USA)", flag: "🇺🇸" },
  magnesium_bio: { pays: "Chine", ville_ref: "Shanghai", lat: 31.22, lon: 121.47, distance_km: 9200, mode_transport: "maritime", note_origine: "Synbone AG (CH) & Shengkai Innovations (CN) — alliage WE43", flag: "🇨🇳" },
  peek: { pays: "Royaume-Uni", ville_ref: "Thornton Cleveleys", lat: 53.87, lon: -3.02, distance_km: 1050, mode_transport: "routier", note_origine: "Victrex plc — seul producteur mondial Victrex® 450G (UK)", flag: "🇬🇧" },
  peek_cf: { pays: "Royaume-Uni / USA", ville_ref: "Thornton Cleveleys", lat: 53.87, lon: -3.02, distance_km: 1050, mode_transport: "routier", note_origine: "Victrex (UK) + fibres carbone Toray (JP) — composite CFR-PEEK", flag: "🇬🇧" },
  uhmwpe_vit_e: { pays: "Pays-Bas", ville_ref: "Geleen", lat: 51.00, lon: 5.83, distance_km: 360, mode_transport: "routier", note_origine: "DSM Biomedical (NL) — GUR 1020/1050 + vitamine E Zimmer Biomet", flag: "🇳🇱" },
  pla_bio: { pays: "Pays-Bas / USA", ville_ref: "Rotterdam", lat: 51.92, lon: 4.47, distance_km: 430, mode_transport: "routier", note_origine: "TotalEnergies Corbion (NL), NatureWorks (USA) — granulés PLA", flag: "🇳🇱" },
  plga_resorbable: { pays: "USA / Belgique", ville_ref: "Birmingham (AL)", lat: 33.52, lon: -86.80, distance_km: 7800, mode_transport: "aerien", note_origine: "Evonik Biomaterials (DE/USA), Corbion (BE) — PLGA 75:25 médical", flag: "🇺🇸" },
  pmma_neuro: { pays: "Allemagne", ville_ref: "Darmstadt", lat: 49.87, lon: 8.65, distance_km: 450, mode_transport: "routier", note_origine: "Heraeus Medical GmbH, Stryker DE — ciment PMMA ISO 5833", flag: "🇩🇪" },
  polyuretane_bio: { pays: "USA", ville_ref: "Berkeley (CA)", lat: 37.87, lon: -122.27, distance_km: 9100, mode_transport: "aerien", note_origine: "DSM Biomedical / Polymer Technology Group — Biospan™", flag: "🇺🇸" },
  ptfe_expanded: { pays: "USA", ville_ref: "Flagstaff (AZ)", lat: 35.19, lon: -111.65, distance_km: 9000, mode_transport: "aerien", note_origine: "W. L. Gore & Associates — ePTFE Gore-Tex® médical (USA)", flag: "🇺🇸" },
  silicone_medical: { pays: "Allemagne / France", ville_ref: "Lyon", lat: 45.75, lon: 4.83, distance_km: 460, mode_transport: "routier", note_origine: "Wacker Chemie (DE), NuSil (FR) — silicone grade implant", flag: "🇩🇪" },
  hydroxyapatite: { pays: "France / Belgique", ville_ref: "Pessac", lat: 44.80, lon: -0.63, distance_km: 580, mode_transport: "routier", note_origine: "Ceraver (FR), Cam Bioceramics (NL) — HA synthétique ISO 13779", flag: "🇫🇷" },
  alumine: { pays: "Allemagne", ville_ref: "Selb", lat: 50.17, lon: 12.13, distance_km: 720, mode_transport: "routier", note_origine: "CeramTec GmbH — BIOLOX® forte, Selb (Allemagne)", flag: "🇩🇪" },
  alumine_zircone: { pays: "Allemagne", ville_ref: "Selb", lat: 50.17, lon: 12.13, distance_km: 720, mode_transport: "routier", note_origine: "CeramTec GmbH — BIOLOX® delta, composite AMC (Allemagne)", flag: "🇩🇪" },
  zircone: { pays: "Australie → Allemagne", ville_ref: "Selb", lat: 50.17, lon: 12.13, distance_km: 720, mode_transport: "routier", note_origine: "Minerai zircon Australie → CeramTec / Saint-Gobain ZirPro (DE)", flag: "🇩🇪" },
  tcp_beta: { pays: "France", ville_ref: "Caen", lat: 49.18, lon: -0.36, distance_km: 240, mode_transport: "routier", note_origine: "Kasios (FR), Noraker (FR) — β-TCP substitut osseux local", flag: "🇫🇷" },
  bioglass: { pays: "Finlande / USA", ville_ref: "Tampere", lat: 61.49, lon: 23.76, distance_km: 2800, mode_transport: "routier", note_origine: "BonAlive Biomaterials (FI), Mo-Sci Corp (USA) — Bioglass 45S5", flag: "🇫🇮" },
  os_allogene: { pays: "France (banques d'os)", ville_ref: "Paris", lat: 48.85, lon: 2.35, distance_km: 0, mode_transport: "routier", note_origine: "Banques d'os hospitalières françaises — circuit court national", flag: "🇫🇷" },
  collagene_bovin: { pays: "France / Brésil", ville_ref: "São Paulo", lat: -23.55, lon: -46.63, distance_km: 9400, mode_transport: "maritime", note_origine: "Symatese (FR), Integra (USA) — collagène bovin réticulé", flag: "🇧🇷" },
  acide_hyaluronique: { pays: "France / Italie", ville_ref: "Padoue", lat: 45.40, lon: 11.87, distance_km: 850, mode_transport: "routier", note_origine: "Fidia Farmaceutici (IT), LCA (FR) — HA réticulé grade implant", flag: "🇮🇹" },
  xenogreffe_porcine: { pays: "Italie / USA", ville_ref: "Milan", lat: 45.46, lon: 9.19, distance_km: 840, mode_transport: "routier", note_origine: "Sorin Group (IT), Edwards Lifesciences (USA) — péricarde porcin", flag: "🇮🇹" },
  pyrocarbone: { pays: "France", ville_ref: "Péronnas", lat: 46.01, lon: 5.22, distance_km: 460, mode_transport: "routier", note_origine: "Carbone Lorraine / Helicoid (FR) — LTI PyC seul producteur EU", flag: "🇫🇷" },
  scaffold_pcl: { pays: "Belgique / Singapour", ville_ref: "Louvain", lat: 50.87, lon: 4.70, distance_km: 280, mode_transport: "routier", note_origine: "Materialise (BE), EnvisionTEC — scaffold PCL impression 3D", flag: "🇧🇪" },
  dacron_polyester: { pays: "USA / Allemagne", ville_ref: "Flagstaff (AZ)", lat: 35.19, lon: -111.65, distance_km: 9000, mode_transport: "aerien", note_origine: "Vascutek Terumo (USA/UK), JOTEC GmbH (DE) — Dacron tressé", flag: "🇺🇸" },
};

export const MATERIAUX: Record<string, Material> = {
  titane_grade5: {
    key: "titane_grade5", nom: "Titane Grade 5 (Ti-6Al-4V CNC)", categorie: "Métal",
    co2_kg_par_kg: 42.0, co2_range: [35.0, 52.0], module_elastique_gpa: 110.0, stress_shielding: 4,
    recyclable: true, biodegradable: false, duree_vie_implant_ans: 25,
    types_chirurgie: ["orthopédie", "traumatologie", "rachis", "dentaire", "genou", "hanche", "maxillo-facial", "neurochirurgie"],
    taux_succes_pct: 95, taux_succes_source: "NJR 2024 + AOANJRR 2023 — tiges fémorales Ti",
    biocompatibilite: 5, resistance_mecanique: 5, osteointegration: 5,
    radio_opaque: true, compatible_irm: true, sterilisation: ["autoclave", "EtO", "rayonnement_gamma"],
    norme_iso: "ISO 5832-3", prix_relatif: 3, disponibilite: 5,
    risque_infection: 2, risque_allergie: 1,
    reference: "Priarone et al. J Ind Ecol 2017; NJR 21st Report 2024",
  },
  titane_grade23: {
    key: "titane_grade23", nom: "Titane Grade 23 (Ti-6Al-4V ELI)", categorie: "Métal",
    co2_kg_par_kg: 44.0, co2_range: [37.0, 54.0], module_elastique_gpa: 110.0, stress_shielding: 4,
    recyclable: true, biodegradable: false, duree_vie_implant_ans: 30,
    types_chirurgie: ["orthopédie", "hanche", "genou", "rachis", "traumatologie", "neurochirurgie"],
    taux_succes_pct: 97, taux_succes_source: "ASTM F136; AOANJRR 2023",
    biocompatibilite: 5, resistance_mecanique: 5, osteointegration: 5,
    radio_opaque: true, compatible_irm: true, sterilisation: ["autoclave", "EtO"],
    norme_iso: "ASTM F136 / ISO 5832-3", prix_relatif: 4, disponibilite: 4,
    risque_infection: 1, risque_allergie: 1,
    reference: "ASTM F136; NJR 21st Report 2024",
  },
  titane_poreux_3d: {
    key: "titane_poreux_3d", nom: "Titane Poreux Imprimé 3D (SLM)", categorie: "Métal",
    co2_kg_par_kg: 68.0, co2_range: [50.0, 95.0], module_elastique_gpa: 55.0, stress_shielding: 2,
    recyclable: true, biodegradable: false, duree_vie_implant_ans: 25,
    types_chirurgie: ["oncologie osseuse", "rachis", "hanche", "neurochirurgie", "reprise"],
    taux_succes_pct: 93, taux_succes_source: "Sing SL 2021",
    biocompatibilite: 5, resistance_mecanique: 4, osteointegration: 5,
    radio_opaque: true, compatible_irm: true, sterilisation: ["EtO", "rayonnement_gamma"],
    norme_iso: "ISO 5832-3", prix_relatif: 5, disponibilite: 2,
    risque_infection: 1, risque_allergie: 1,
    reference: "Xiao et al. 2024 (CO2 SLM); Sing SL et al. 2021",
  },
  acier_316L: {
    key: "acier_316L", nom: "Acier Inoxydable 316L", categorie: "Métal",
    co2_kg_par_kg: 5.1, co2_range: [4.2, 7.5], module_elastique_gpa: 200.0, stress_shielding: 5,
    recyclable: true, biodegradable: false, duree_vie_implant_ans: 10,
    types_chirurgie: ["traumatologie", "fixation externe", "rachis"],
    taux_succes_pct: 89, taux_succes_source: "Usage temporaire — corrosion long terme",
    biocompatibilite: 3, resistance_mecanique: 5, osteointegration: 2,
    radio_opaque: true, compatible_irm: false, sterilisation: ["autoclave", "EtO"],
    norme_iso: "ISO 5832-1", prix_relatif: 1, disponibilite: 5,
    risque_infection: 3, risque_allergie: 3,
    reference: "Ecoinvent 3.9; Hedberg 2014",
  },
  cobalt_chrome: {
    key: "cobalt_chrome", nom: "Cobalt-Chrome (CoCrMo)", categorie: "Métal",
    co2_kg_par_kg: 51.0, co2_range: [45.0, 58.0], module_elastique_gpa: 225.0, stress_shielding: 5,
    recyclable: true, biodegradable: false, duree_vie_implant_ans: 20,
    types_chirurgie: ["orthopédie", "hanche", "genou", "dentaire"],
    taux_succes_pct: 94, taux_succes_source: "NJR PLOS Med 2024",
    biocompatibilite: 3, resistance_mecanique: 5, osteointegration: 3,
    radio_opaque: true, compatible_irm: false, sterilisation: ["autoclave", "EtO"],
    norme_iso: "ISO 5832-4 / ISO 5832-12", prix_relatif: 3, disponibilite: 4,
    risque_infection: 2, risque_allergie: 4,
    reference: "NJR PLOS Med 2024; Norgate 2004",
  },
  tantale_poreux: {
    key: "tantale_poreux", nom: "Tantale Poreux (Trabecular Metal™)", categorie: "Métal",
    co2_kg_par_kg: 152.0, co2_range: [120.0, 200.0], module_elastique_gpa: 3.0, stress_shielding: 1,
    recyclable: true, biodegradable: false, duree_vie_implant_ans: 30,
    types_chirurgie: ["oncologie osseuse", "reprise", "hanche", "genou"],
    taux_succes_pct: 96, taux_succes_source: "Levine B. J Am Acad Orthop Surg 2008",
    biocompatibilite: 5, resistance_mecanique: 4, osteointegration: 5,
    radio_opaque: true, compatible_irm: true, sterilisation: ["EtO"],
    norme_iso: "ASTM F560", prix_relatif: 5, disponibilite: 2,
    risque_infection: 1, risque_allergie: 1,
    reference: "Levine B. 2008; Norgate & Rankin 2002",
  },
  nitinol: {
    key: "nitinol", nom: "Nitinol NiTi (Superélastique)", categorie: "Métal",
    co2_kg_par_kg: 91.0, co2_range: [70.0, 120.0], module_elastique_gpa: 48.0, stress_shielding: 2,
    recyclable: true, biodegradable: false, duree_vie_implant_ans: 20,
    types_chirurgie: ["rachis", "cardiovasculaire", "vasculaire"],
    taux_succes_pct: 91, taux_succes_source: "Morgan NB. Mater Sci Eng C 2004",
    biocompatibilite: 4, resistance_mecanique: 4, osteointegration: 2,
    radio_opaque: true, compatible_irm: true, sterilisation: ["EtO", "rayonnement_gamma"],
    norme_iso: "ASTM F2063", prix_relatif: 5, disponibilite: 3,
    risque_infection: 2, risque_allergie: 3,
    reference: "Morgan NB. Mater Sci Eng C 2004",
  },
  magnesium_bio: {
    key: "magnesium_bio", nom: "Magnésium Bio-résorbable (WE43)", categorie: "Métal",
    co2_kg_par_kg: 18.5, co2_range: [12.0, 26.0], module_elastique_gpa: 45.0, stress_shielding: 2,
    recyclable: false, biodegradable: true, duree_vie_implant_ans: 2,
    types_chirurgie: ["pédiatrie", "traumatologie", "main", "orthopédie"],
    taux_succes_pct: 87, taux_succes_source: "Zhao D. Biomaterials 2017",
    biocompatibilite: 4, resistance_mecanique: 3, osteointegration: 4,
    radio_opaque: true, compatible_irm: true, sterilisation: ["EtO"],
    norme_iso: "ASTM F3094", prix_relatif: 4, disponibilite: 2,
    risque_infection: 2, risque_allergie: 1,
    reference: "Zhao D. Biomaterials 2017",
  },
  peek: {
    key: "peek", nom: "PEEK Standard (Victrex® 450G)", categorie: "Polymère",
    co2_kg_par_kg: 9.8, co2_range: [7.5, 13.0], module_elastique_gpa: 3.6, stress_shielding: 1,
    recyclable: false, biodegradable: false, duree_vie_implant_ans: 25,
    types_chirurgie: ["rachis", "neurochirurgie", "maxillo-facial"],
    taux_succes_pct: 93, taux_succes_source: "Kurtz SM & Devine JN. Biomaterials 2007",
    biocompatibilite: 5, resistance_mecanique: 4, osteointegration: 2,
    radio_opaque: false, compatible_irm: true, sterilisation: ["autoclave", "EtO", "rayonnement_gamma"],
    norme_iso: "ISO 10993", prix_relatif: 4, disponibilite: 4,
    risque_infection: 2, risque_allergie: 1,
    reference: "Kurtz SM & Devine JN. Biomaterials 2007",
  },
  peek_cf: {
    key: "peek_cf", nom: "PEEK Fibres Carbone (CFR-PEEK)", categorie: "Composite",
    co2_kg_par_kg: 29.0, co2_range: [22.0, 38.0], module_elastique_gpa: 18.0, stress_shielding: 1,
    recyclable: false, biodegradable: false, duree_vie_implant_ans: 25,
    types_chirurgie: ["oncologie osseuse", "rachis", "neurochirurgie"],
    taux_succes_pct: 94, taux_succes_source: "Duflou JR. CIRP Annals 2012",
    biocompatibilite: 5, resistance_mecanique: 5, osteointegration: 2,
    radio_opaque: false, compatible_irm: true, sterilisation: ["autoclave", "EtO"],
    norme_iso: "ISO 10993", prix_relatif: 5, disponibilite: 3,
    risque_infection: 1, risque_allergie: 1,
    reference: "Duflou JR CIRP 2012",
  },
  uhmwpe_vit_e: {
    key: "uhmwpe_vit_e", nom: "UHMWPE Réticulé + Vitamine E", categorie: "Polymère",
    co2_kg_par_kg: 3.4, co2_range: [2.8, 4.5], module_elastique_gpa: 0.8, stress_shielding: 1,
    recyclable: false, biodegradable: false, duree_vie_implant_ans: 20,
    types_chirurgie: ["orthopédie", "genou", "hanche"],
    taux_succes_pct: 96, taux_succes_source: "NJR 2024 Partridge",
    biocompatibilite: 5, resistance_mecanique: 3, osteointegration: 1,
    radio_opaque: false, compatible_irm: true, sterilisation: ["rayonnement_gamma", "EtO"],
    norme_iso: "ISO 5834-1 / ISO 5834-2", prix_relatif: 3, disponibilite: 5,
    risque_infection: 2, risque_allergie: 1,
    reference: "Kurtz SM UHMWPE Handbook 2016",
  },
  pla_bio: {
    key: "pla_bio", nom: "PLA Biosourcé (Acide Polylactique)", categorie: "Polymère",
    co2_kg_par_kg: 2.2, co2_range: [1.4, 3.0], module_elastique_gpa: 3.5, stress_shielding: 1,
    recyclable: true, biodegradable: true, duree_vie_implant_ans: 2,
    types_chirurgie: ["pédiatrie", "main", "maxillo-facial", "ophtalmologie"],
    taux_succes_pct: 87, taux_succes_source: "Vink E. Polym Degrad Stab 2004",
    biocompatibilite: 4, resistance_mecanique: 2, osteointegration: 3,
    radio_opaque: false, compatible_irm: true, sterilisation: ["EtO"],
    norme_iso: "ISO 13781", prix_relatif: 2, disponibilite: 4,
    risque_infection: 2, risque_allergie: 2,
    reference: "Vink E. Polym Degrad Stab 2004",
  },
  plga_resorbable: {
    key: "plga_resorbable", nom: "PLGA 75:25 (Copolymère Résorbable)", categorie: "Polymère",
    co2_kg_par_kg: 3.0, co2_range: [2.2, 4.0], module_elastique_gpa: 2.0, stress_shielding: 1,
    recyclable: false, biodegradable: true, duree_vie_implant_ans: 1,
    types_chirurgie: ["pédiatrie", "traumatologie", "ophtalmologie", "main"],
    taux_succes_pct: 85, taux_succes_source: "Athanasiou KA. Biomaterials 1996",
    biocompatibilite: 4, resistance_mecanique: 2, osteointegration: 3,
    radio_opaque: false, compatible_irm: true, sterilisation: ["EtO"],
    norme_iso: "ISO 10993", prix_relatif: 3, disponibilite: 4,
    risque_infection: 2, risque_allergie: 2,
    reference: "Athanasiou KA. Biomaterials 1996",
  },
  pmma_neuro: {
    key: "pmma_neuro", nom: "PMMA Chirurgical (Ciment Acrylique)", categorie: "Polymère",
    co2_kg_par_kg: 4.5, co2_range: [3.2, 6.0], module_elastique_gpa: 2.5, stress_shielding: 1,
    recyclable: false, biodegradable: false, duree_vie_implant_ans: 15,
    types_chirurgie: ["neurochirurgie", "rachis", "cranioplastie"],
    taux_succes_pct: 88, taux_succes_source: "Kühn KD. Bone Cement 2000",
    biocompatibilite: 3, resistance_mecanique: 3, osteointegration: 1,
    radio_opaque: true, compatible_irm: true, sterilisation: ["EtO"],
    norme_iso: "ISO 5833", prix_relatif: 2, disponibilite: 5,
    risque_infection: 3, risque_allergie: 2,
    reference: "Kühn KD. Bone Cement 2000",
  },
  polyuretane_bio: {
    key: "polyuretane_bio", nom: "Polyuréthane Biostable (Biospan™)", categorie: "Polymère",
    co2_kg_par_kg: 5.5, co2_range: [4.0, 7.5], module_elastique_gpa: 0.05, stress_shielding: 1,
    recyclable: false, biodegradable: false, duree_vie_implant_ans: 15,
    types_chirurgie: ["cardiovasculaire", "vasculaire", "reconstruction"],
    taux_succes_pct: 88, taux_succes_source: "Zdrahala RJ. J Biomater Appl 1999",
    biocompatibilite: 4, resistance_mecanique: 3, osteointegration: 1,
    radio_opaque: false, compatible_irm: true, sterilisation: ["EtO"],
    norme_iso: "ISO 10993", prix_relatif: 3, disponibilite: 3,
    risque_infection: 2, risque_allergie: 2,
    reference: "Zdrahala RJ. J Biomater Appl 1999",
  },
  ptfe_expanded: {
    key: "ptfe_expanded", nom: "ePTFE Gore-Tex® Expanded", categorie: "Polymère",
    co2_kg_par_kg: 9.1, co2_range: [7.0, 12.0], module_elastique_gpa: 0.1, stress_shielding: 1,
    recyclable: false, biodegradable: false, duree_vie_implant_ans: 20,
    types_chirurgie: ["cardiovasculaire", "vasculaire", "reconstruction"],
    taux_succes_pct: 91, taux_succes_source: "Sefton MV. Ann NY Acad Sci 2002",
    biocompatibilite: 5, resistance_mecanique: 3, osteointegration: 1,
    radio_opaque: false, compatible_irm: true, sterilisation: ["autoclave", "EtO", "rayonnement_gamma"],
    norme_iso: "ISO 7198", prix_relatif: 4, disponibilite: 4,
    risque_infection: 2, risque_allergie: 1,
    reference: "Sefton MV 2002",
  },
  silicone_medical: {
    key: "silicone_medical", nom: "Silicone Médical Grade Implant", categorie: "Polymère",
    co2_kg_par_kg: 6.2, co2_range: [4.5, 8.5], module_elastique_gpa: 0.002, stress_shielding: 1,
    recyclable: false, biodegradable: false, duree_vie_implant_ans: 15,
    types_chirurgie: ["reconstruction", "main", "ophtalmologie", "maxillo-facial"],
    taux_succes_pct: 88, taux_succes_source: "Ratner BD. Biomaterials Science 2004",
    biocompatibilite: 4, resistance_mecanique: 2, osteointegration: 1,
    radio_opaque: false, compatible_irm: true, sterilisation: ["autoclave", "EtO"],
    norme_iso: "ISO 10993", prix_relatif: 3, disponibilite: 5,
    risque_infection: 2, risque_allergie: 2,
    reference: "Ratner BD. Biomaterials Science 2004",
  },
  hydroxyapatite: {
    key: "hydroxyapatite", nom: "Hydroxyapatite Synthétique (HA)", categorie: "Céramique",
    co2_kg_par_kg: 3.1, co2_range: [2.0, 5.0], module_elastique_gpa: 80.0, stress_shielding: 3,
    recyclable: false, biodegradable: true, duree_vie_implant_ans: 10,
    types_chirurgie: ["dentaire", "orthopédie", "rachis", "maxillo-facial"],
    taux_succes_pct: 89, taux_succes_source: "Dorozhkin SV. Acta Biomater 2010",
    biocompatibilite: 5, resistance_mecanique: 2, osteointegration: 5,
    radio_opaque: true, compatible_irm: true, sterilisation: ["autoclave", "rayonnement_gamma"],
    norme_iso: "ISO 13779", prix_relatif: 2, disponibilite: 4,
    risque_infection: 1, risque_allergie: 1,
    reference: "Dorozhkin SV. Acta Biomater 2010",
  },
  alumine: {
    key: "alumine", nom: "Alumine Al₂O₃ (BIOLOX® forte)", categorie: "Céramique",
    co2_kg_par_kg: 8.5, co2_range: [6.0, 11.0], module_elastique_gpa: 380.0, stress_shielding: 5,
    recyclable: false, biodegradable: false, duree_vie_implant_ans: 25,
    types_chirurgie: ["orthopédie", "hanche", "genou"],
    taux_succes_pct: 96, taux_succes_source: "NJR PLOS Med 2024",
    biocompatibilite: 5, resistance_mecanique: 4, osteointegration: 2,
    radio_opaque: true, compatible_irm: true, sterilisation: ["autoclave"],
    norme_iso: "ISO 6474-1", prix_relatif: 4, disponibilite: 3,
    risque_infection: 1, risque_allergie: 1,
    reference: "Chevalier J. Biomaterials 2006; NJR PLOS Med 2024",
  },
  alumine_zircone: {
    key: "alumine_zircone", nom: "Composite AMC Alumine-Zircone (BIOLOX® delta)", categorie: "Céramique",
    co2_kg_par_kg: 10.5, co2_range: [8.0, 14.0], module_elastique_gpa: 350.0, stress_shielding: 5,
    recyclable: false, biodegradable: false, duree_vie_implant_ans: 30,
    types_chirurgie: ["hanche", "genou", "orthopédie"],
    taux_succes_pct: 97, taux_succes_source: "NJR PLOS Med 2024",
    biocompatibilite: 5, resistance_mecanique: 5, osteointegration: 2,
    radio_opaque: true, compatible_irm: true, sterilisation: ["autoclave"],
    norme_iso: "ISO 6474-2", prix_relatif: 5, disponibilite: 2,
    risque_infection: 1, risque_allergie: 1,
    reference: "NJR PLOS Med 2024 — delta ceramic hanche",
  },
  zircone: {
    key: "zircone", nom: "Zircone Y-TZP (Stabilisée Yttrium)", categorie: "Céramique",
    co2_kg_par_kg: 12.8, co2_range: [9.0, 17.0], module_elastique_gpa: 200.0, stress_shielding: 4,
    recyclable: false, biodegradable: false, duree_vie_implant_ans: 25,
    types_chirurgie: ["dentaire", "hanche", "ophtalmologie"],
    taux_succes_pct: 94, taux_succes_source: "Piconi C. Biomaterials 1999",
    biocompatibilite: 5, resistance_mecanique: 5, osteointegration: 3,
    radio_opaque: true, compatible_irm: true, sterilisation: ["autoclave"],
    norme_iso: "ISO 13356", prix_relatif: 4, disponibilite: 3,
    risque_infection: 1, risque_allergie: 1,
    reference: "Piconi C. Biomaterials 1999",
  },
  tcp_beta: {
    key: "tcp_beta", nom: "β-TCP (Phosphate Tricalcique Bêta)", categorie: "Céramique",
    co2_kg_par_kg: 2.8, co2_range: [1.8, 4.0], module_elastique_gpa: 33.0, stress_shielding: 2,
    recyclable: false, biodegradable: true, duree_vie_implant_ans: 2,
    types_chirurgie: ["dentaire", "maxillo-facial", "orthopédie"],
    taux_succes_pct: 86, taux_succes_source: "Bohner M. Injury 2000",
    biocompatibilite: 5, resistance_mecanique: 1, osteointegration: 5,
    radio_opaque: true, compatible_irm: true, sterilisation: ["autoclave", "rayonnement_gamma"],
    norme_iso: "ISO 13779", prix_relatif: 2, disponibilite: 4,
    risque_infection: 1, risque_allergie: 1,
    reference: "Bohner M. Injury 2000",
  },
  bioglass: {
    key: "bioglass", nom: "Bioglass 45S5 (Verre Bioactif)", categorie: "Céramique",
    co2_kg_par_kg: 4.2, co2_range: [3.0, 6.0], module_elastique_gpa: 35.0, stress_shielding: 2,
    recyclable: false, biodegradable: true, duree_vie_implant_ans: 3,
    types_chirurgie: ["ORL", "dentaire", "reconstruction", "maxillo-facial"],
    taux_succes_pct: 84, taux_succes_source: "Hench LL. Science 1984",
    biocompatibilite: 5, resistance_mecanique: 1, osteointegration: 5,
    radio_opaque: false, compatible_irm: true, sterilisation: ["autoclave"],
    norme_iso: "ISO 10993", prix_relatif: 3, disponibilite: 3,
    risque_infection: 1, risque_allergie: 1,
    reference: "Hench LL. Science 1984",
  },
  os_allogene: {
    key: "os_allogene", nom: "Os Allogène Humain (Banque d'Os)", categorie: "Biosourcé",
    co2_kg_par_kg: 1.8, co2_range: [0.8, 3.5], module_elastique_gpa: 18.0, stress_shielding: 1,
    recyclable: false, biodegradable: true, duree_vie_implant_ans: 5,
    types_chirurgie: ["oncologie osseuse", "rachis", "orthopédie"],
    taux_succes_pct: 80, taux_succes_source: "Vavken P. JBJS Am 2010",
    biocompatibilite: 4, resistance_mecanique: 3, osteointegration: 5,
    radio_opaque: true, compatible_irm: true, sterilisation: ["lyophilisation", "rayonnement_gamma"],
    norme_iso: "ISO 12891", prix_relatif: 3, disponibilite: 2,
    risque_infection: 4, risque_allergie: 3,
    reference: "Vavken P. JBJS Am 2010",
  },
  collagene_bovin: {
    key: "collagene_bovin", nom: "Collagène Bovin Réticulé", categorie: "Biosourcé",
    co2_kg_par_kg: 2.5, co2_range: [1.5, 4.0], module_elastique_gpa: 0.5, stress_shielding: 1,
    recyclable: false, biodegradable: true, duree_vie_implant_ans: 1,
    types_chirurgie: ["reconstruction", "ophtalmologie", "maxillo-facial"],
    taux_succes_pct: 86, taux_succes_source: "Lee CH. J Biomed Mater Res 2001",
    biocompatibilite: 5, resistance_mecanique: 1, osteointegration: 3,
    radio_opaque: false, compatible_irm: true, sterilisation: ["EtO"],
    norme_iso: "ISO 11979", prix_relatif: 3, disponibilite: 4,
    risque_infection: 2, risque_allergie: 3,
    reference: "Lee CH. J Biomed Mater Res 2001",
  },
  acide_hyaluronique: {
    key: "acide_hyaluronique", nom: "Acide Hyaluronique Réticulé (HA-XL)", categorie: "Biosourcé",
    co2_kg_par_kg: 1.5, co2_range: [0.8, 2.5], module_elastique_gpa: 0.001, stress_shielding: 1,
    recyclable: false, biodegradable: true, duree_vie_implant_ans: 1,
    types_chirurgie: ["ophtalmologie", "reconstruction"],
    taux_succes_pct: 91, taux_succes_source: "Prestwich GD. J Control Release 2011",
    biocompatibilite: 5, resistance_mecanique: 1, osteointegration: 1,
    radio_opaque: false, compatible_irm: true, sterilisation: ["autoclave"],
    norme_iso: "ISO 11979", prix_relatif: 4, disponibilite: 4,
    risque_infection: 1, risque_allergie: 1,
    reference: "Prestwich GD. J Control Release 2011",
  },
  xenogreffe_porcine: {
    key: "xenogreffe_porcine", nom: "Xénogreffe Porcine Décellularisée", categorie: "Biosourcé",
    co2_kg_par_kg: 3.2, co2_range: [2.0, 5.0], module_elastique_gpa: 0.05, stress_shielding: 1,
    recyclable: false, biodegradable: true, duree_vie_implant_ans: 10,
    types_chirurgie: ["cardiovasculaire", "reconstruction"],
    taux_succes_pct: 87, taux_succes_source: "Naso F. Sci Rep 2016",
    biocompatibilite: 4, resistance_mecanique: 2, osteointegration: 2,
    radio_opaque: false, compatible_irm: true, sterilisation: ["EtO"],
    norme_iso: "ISO 10993", prix_relatif: 3, disponibilite: 3,
    risque_infection: 2, risque_allergie: 3,
    reference: "Naso F. Sci Rep 2016",
  },
  pyrocarbone: {
    key: "pyrocarbone", nom: "Pyrocarbone (LTI PyC)", categorie: "Composite",
    co2_kg_par_kg: 25.0, co2_range: [18.0, 35.0], module_elastique_gpa: 28.0, stress_shielding: 1,
    recyclable: false, biodegradable: false, duree_vie_implant_ans: 15,
    types_chirurgie: ["main", "orthopédie", "cardiovasculaire"],
    taux_succes_pct: 90, taux_succes_source: "Cook SD. Clin Orthop 1992",
    biocompatibilite: 5, resistance_mecanique: 4, osteointegration: 3,
    radio_opaque: false, compatible_irm: true, sterilisation: ["autoclave", "EtO"],
    norme_iso: "ISO 10993", prix_relatif: 4, disponibilite: 2,
    risque_infection: 1, risque_allergie: 1,
    reference: "Cook SD. Clin Orthop 1992",
  },
  scaffold_pcl: {
    key: "scaffold_pcl", nom: "Scaffold PCL Imprimé 3D (Polycaprolactone)", categorie: "Composite",
    co2_kg_par_kg: 3.3, co2_range: [2.2, 5.0], module_elastique_gpa: 0.4, stress_shielding: 1,
    recyclable: false, biodegradable: true, duree_vie_implant_ans: 3,
    types_chirurgie: ["reconstruction", "pédiatrie", "maxillo-facial"],
    taux_succes_pct: 85, taux_succes_source: "Woodruff MA. Prog Polym Sci 2010",
    biocompatibilite: 5, resistance_mecanique: 2, osteointegration: 3,
    radio_opaque: false, compatible_irm: true, sterilisation: ["EtO"],
    norme_iso: "ISO 10993", prix_relatif: 3, disponibilite: 3,
    risque_infection: 1, risque_allergie: 1,
    reference: "Woodruff MA. Prog Polym Sci 2010",
  },
  dacron_polyester: {
    key: "dacron_polyester", nom: "Dacron Polyester Tressé (Woven PET)", categorie: "Composite",
    co2_kg_par_kg: 5.8, co2_range: [4.5, 7.5], module_elastique_gpa: 2.0, stress_shielding: 1,
    recyclable: false, biodegradable: false, duree_vie_implant_ans: 20,
    types_chirurgie: ["cardiovasculaire", "vasculaire", "reconstruction"],
    taux_succes_pct: 90, taux_succes_source: "Kannan RY. J Biomed Mater Res B 2005",
    biocompatibilite: 4, resistance_mecanique: 4, osteointegration: 1,
    radio_opaque: false, compatible_irm: true, sterilisation: ["autoclave", "EtO"],
    norme_iso: "ISO 7198", prix_relatif: 2, disponibilite: 5,
    risque_infection: 2, risque_allergie: 2,
    reference: "Kannan RY. J Biomed Mater Res B 2005",
  },
  // ═══════ SUPERALLOYS — Mechanics / Aerospace ═══════
  inconel_718: {
    key: "inconel_718", nom: "Inconel 718 (Ni-Cr-Fe)", categorie: "Superalliage",
    fields: ["Mechanics", "Aerospace"],
    co2_kg_par_kg: 38.0, co2_range: [30.0, 48.0], module_elastique_gpa: 205.0, stress_shielding: 5,
    recyclable: true, biodegradable: false, duree_vie_implant_ans: 30,
    types_chirurgie: [], taux_succes_pct: 95, taux_succes_source: "Special Metals Corp.",
    biocompatibilite: 2, resistance_mecanique: 5, osteointegration: 0,
    radio_opaque: true, compatible_irm: false, sterilisation: [],
    norme_iso: "AMS 5662", prix_relatif: 4, disponibilite: 4,
    risque_infection: 0, risque_allergie: 0,
    reference: "Special Metals — Inconel 718 datasheet",
  },
  inconel_617: {
    key: "inconel_617", nom: "Inconel 617 (Solution Strengthened)", categorie: "Superalliage",
    fields: ["Mechanics", "Aerospace"],
    co2_kg_par_kg: 42.0, co2_range: [35.0, 52.0], module_elastique_gpa: 211.0, stress_shielding: 5,
    recyclable: true, biodegradable: false, duree_vie_implant_ans: 25,
    types_chirurgie: [], taux_succes_pct: 92, taux_succes_source: "ASME SB-168",
    biocompatibilite: 1, resistance_mecanique: 5, osteointegration: 0,
    radio_opaque: true, compatible_irm: false, sterilisation: [],
    norme_iso: "ASME SB-168", prix_relatif: 4, disponibilite: 3,
    risque_infection: 0, risque_allergie: 0,
    reference: "ASME SB-168; Haynes Int.",
  },
  ma754_ods: {
    key: "ma754_ods", nom: "MA754 ODS (Ni-Cr-Y₂O₃)", categorie: "Superalliage",
    fields: ["Mechanics", "Aerospace"],
    co2_kg_par_kg: 55.0, co2_range: [45.0, 70.0], module_elastique_gpa: 220.0, stress_shielding: 5,
    recyclable: true, biodegradable: false, duree_vie_implant_ans: 30,
    types_chirurgie: [], taux_succes_pct: 90, taux_succes_source: "Special Metals",
    biocompatibilite: 1, resistance_mecanique: 5, osteointegration: 0,
    radio_opaque: true, compatible_irm: false, sterilisation: [],
    norme_iso: "AMS 5754", prix_relatif: 5, disponibilite: 2,
    risque_infection: 0, risque_allergie: 0,
    reference: "Special Metals — MA754 ODS alloy",
  },
  hastelloy_x: {
    key: "hastelloy_x", nom: "Hastelloy X (Ni-Cr-Fe-Mo)", categorie: "Superalliage",
    fields: ["Mechanics", "Aerospace"],
    co2_kg_par_kg: 40.0, co2_range: [32.0, 50.0], module_elastique_gpa: 205.0, stress_shielding: 5,
    recyclable: true, biodegradable: false, duree_vie_implant_ans: 25,
    types_chirurgie: [], taux_succes_pct: 93, taux_succes_source: "Haynes International",
    biocompatibilite: 1, resistance_mecanique: 5, osteointegration: 0,
    radio_opaque: true, compatible_irm: false, sterilisation: [],
    norme_iso: "AMS 5536", prix_relatif: 4, disponibilite: 3,
    risque_infection: 0, risque_allergie: 0,
    reference: "Haynes International — Hastelloy X",
  },
  // ═══════ LIGHT ALLOYS — Mechanics / Aerospace ═══════
  aluminium_7075: {
    key: "aluminium_7075", nom: "Aluminium 7075-T6", categorie: "Alliage Léger",
    fields: ["Mechanics", "Aerospace"],
    co2_kg_par_kg: 12.5, co2_range: [9.0, 16.0], module_elastique_gpa: 72.0, stress_shielding: 3,
    recyclable: true, biodegradable: false, duree_vie_implant_ans: 30,
    types_chirurgie: [], taux_succes_pct: 95, taux_succes_source: "Alcoa / Constellium",
    biocompatibilite: 2, resistance_mecanique: 5, osteointegration: 0,
    radio_opaque: true, compatible_irm: true, sterilisation: [],
    norme_iso: "AMS 4078", prix_relatif: 2, disponibilite: 5,
    risque_infection: 0, risque_allergie: 0,
    reference: "Ecoinvent 3.9; Constellium",
  },
  aluminium_2024: {
    key: "aluminium_2024", nom: "Aluminium 2024-T3", categorie: "Alliage Léger",
    fields: ["Mechanics", "Aerospace"],
    co2_kg_par_kg: 11.8, co2_range: [8.5, 15.0], module_elastique_gpa: 73.0, stress_shielding: 3,
    recyclable: true, biodegradable: false, duree_vie_implant_ans: 30,
    types_chirurgie: [], taux_succes_pct: 94, taux_succes_source: "Alcoa",
    biocompatibilite: 1, resistance_mecanique: 4, osteointegration: 0,
    radio_opaque: true, compatible_irm: true, sterilisation: [],
    norme_iso: "AMS 4037", prix_relatif: 2, disponibilite: 5,
    risque_infection: 0, risque_allergie: 0,
    reference: "Ecoinvent 3.9; Alcoa",
  },
  titane_grade2_aero: {
    key: "titane_grade2_aero", nom: "Titane Grade 2 (CP Ti)", categorie: "Alliage Léger",
    fields: ["Aerospace", "Mechanics"],
    co2_kg_par_kg: 36.0, co2_range: [28.0, 45.0], module_elastique_gpa: 105.0, stress_shielding: 4,
    recyclable: true, biodegradable: false, duree_vie_implant_ans: 30,
    types_chirurgie: [], taux_succes_pct: 96, taux_succes_source: "ASTM B348",
    biocompatibilite: 5, resistance_mecanique: 4, osteointegration: 4,
    radio_opaque: true, compatible_irm: true, sterilisation: [],
    norme_iso: "ASTM B348", prix_relatif: 3, disponibilite: 4,
    risque_infection: 0, risque_allergie: 0,
    reference: "ASTM B348; ATI Metals",
  },
  // ═══════ COMPOSITES — Aerospace / Mechanics ═══════
  sic_sic_cmc: {
    key: "sic_sic_cmc", nom: "SiC-SiC CMC (Composite Céramique)", categorie: "Composite",
    fields: ["Aerospace", "Mechanics"],
    co2_kg_par_kg: 28.0, co2_range: [20.0, 38.0], module_elastique_gpa: 300.0, stress_shielding: 5,
    recyclable: false, biodegradable: false, duree_vie_implant_ans: 30,
    types_chirurgie: [], taux_succes_pct: 95, taux_succes_source: "GE Aviation / Safran",
    biocompatibilite: 1, resistance_mecanique: 5, osteointegration: 0,
    radio_opaque: true, compatible_irm: false, sterilisation: [],
    norme_iso: "ASTM C1793", prix_relatif: 5, disponibilite: 2,
    risque_infection: 0, risque_allergie: 0,
    reference: "GE Aviation CMC data; Bansal & Lamon 2015",
  },
  carbone_t700: {
    key: "carbone_t700", nom: "Fibre de Carbone T700/Époxy", categorie: "Composite",
    fields: ["Aerospace", "Mechanics"],
    co2_kg_par_kg: 22.0, co2_range: [16.0, 30.0], module_elastique_gpa: 135.0, stress_shielding: 4,
    recyclable: false, biodegradable: false, duree_vie_implant_ans: 30,
    types_chirurgie: [], taux_succes_pct: 96, taux_succes_source: "Toray Industries",
    biocompatibilite: 1, resistance_mecanique: 5, osteointegration: 0,
    radio_opaque: false, compatible_irm: true, sterilisation: [],
    norme_iso: "ASTM D3039", prix_relatif: 4, disponibilite: 4,
    risque_infection: 0, risque_allergie: 0,
    reference: "Toray T700S datasheet; Duflou CIRP 2012",
  },
  carbone_m55j: {
    key: "carbone_m55j", nom: "Fibre de Carbone M55J/Époxy (Haut Module)", categorie: "Composite",
    fields: ["Aerospace"],
    co2_kg_par_kg: 35.0, co2_range: [25.0, 45.0], module_elastique_gpa: 338.0, stress_shielding: 5,
    recyclable: false, biodegradable: false, duree_vie_implant_ans: 30,
    types_chirurgie: [], taux_succes_pct: 96, taux_succes_source: "Toray Industries",
    biocompatibilite: 1, resistance_mecanique: 5, osteointegration: 0,
    radio_opaque: false, compatible_irm: true, sterilisation: [],
    norme_iso: "ASTM D3039", prix_relatif: 5, disponibilite: 3,
    risque_infection: 0, risque_allergie: 0,
    reference: "Toray M55J datasheet",
  },
  kevlar_aramide: {
    key: "kevlar_aramide", nom: "Kevlar® 49 / Aramide", categorie: "Composite",
    fields: ["Aerospace", "Mechanics"],
    co2_kg_par_kg: 18.0, co2_range: [14.0, 24.0], module_elastique_gpa: 125.0, stress_shielding: 4,
    recyclable: false, biodegradable: false, duree_vie_implant_ans: 25,
    types_chirurgie: [], taux_succes_pct: 93, taux_succes_source: "DuPont / Teijin",
    biocompatibilite: 1, resistance_mecanique: 5, osteointegration: 0,
    radio_opaque: false, compatible_irm: true, sterilisation: [],
    norme_iso: "ASTM D3039", prix_relatif: 3, disponibilite: 4,
    risque_infection: 0, risque_allergie: 0,
    reference: "DuPont Kevlar 49 datasheet",
  },
  // ═══════ CERAMICS — Mechanics / Aerospace ═══════
  carbure_silicium: {
    key: "carbure_silicium", nom: "Carbure de Silicium (SiC)", categorie: "Céramique",
    fields: ["Mechanics", "Aerospace"],
    co2_kg_par_kg: 15.0, co2_range: [10.0, 22.0], module_elastique_gpa: 450.0, stress_shielding: 5,
    recyclable: false, biodegradable: false, duree_vie_implant_ans: 30,
    types_chirurgie: [], taux_succes_pct: 94, taux_succes_source: "Saint-Gobain",
    biocompatibilite: 1, resistance_mecanique: 5, osteointegration: 0,
    radio_opaque: true, compatible_irm: true, sterilisation: [],
    norme_iso: "ASTM C1161", prix_relatif: 4, disponibilite: 3,
    risque_infection: 0, risque_allergie: 0,
    reference: "Saint-Gobain Ceramics; Ecoinvent",
  },
  nitrure_silicium: {
    key: "nitrure_silicium", nom: "Nitrure de Silicium (Si₃N₄)", categorie: "Céramique",
    fields: ["Mechanics", "Aerospace"],
    co2_kg_par_kg: 18.0, co2_range: [12.0, 25.0], module_elastique_gpa: 310.0, stress_shielding: 5,
    recyclable: false, biodegradable: false, duree_vie_implant_ans: 30,
    types_chirurgie: [], taux_succes_pct: 93, taux_succes_source: "CeramTec",
    biocompatibilite: 3, resistance_mecanique: 5, osteointegration: 0,
    radio_opaque: true, compatible_irm: true, sterilisation: [],
    norme_iso: "ISO 20501", prix_relatif: 4, disponibilite: 3,
    risque_infection: 0, risque_allergie: 0,
    reference: "CeramTec; Riley FL 2000",
  },
  // ═══════ WOOD — Architecture ═══════
  bois_clt: {
    key: "bois_clt", nom: "Bois CLT (Cross-Laminated Timber)", categorie: "Bois",
    fields: ["Architecture"],
    co2_kg_par_kg: -1.6, co2_range: [-2.0, -0.8], module_elastique_gpa: 12.0, stress_shielding: 1,
    recyclable: true, biodegradable: true, duree_vie_implant_ans: 60,
    types_chirurgie: [], taux_succes_pct: 95, taux_succes_source: "FPInnovations",
    biocompatibilite: 0, resistance_mecanique: 3, osteointegration: 0,
    radio_opaque: false, compatible_irm: true, sterilisation: [],
    norme_iso: "EN 16351", prix_relatif: 3, disponibilite: 4,
    risque_infection: 0, risque_allergie: 0,
    reference: "FPInnovations CLT Handbook; Ecoinvent",
  },
  bois_lamelle_colle: {
    key: "bois_lamelle_colle", nom: "Bois Lamellé-Collé (Glulam)", categorie: "Bois",
    fields: ["Architecture"],
    co2_kg_par_kg: -1.2, co2_range: [-1.8, -0.5], module_elastique_gpa: 14.0, stress_shielding: 1,
    recyclable: true, biodegradable: true, duree_vie_implant_ans: 50,
    types_chirurgie: [], taux_succes_pct: 94, taux_succes_source: "Eurocode 5",
    biocompatibilite: 0, resistance_mecanique: 3, osteointegration: 0,
    radio_opaque: false, compatible_irm: true, sterilisation: [],
    norme_iso: "EN 14080", prix_relatif: 3, disponibilite: 4,
    risque_infection: 0, risque_allergie: 0,
    reference: "EN 14080; Ecoinvent 3.9",
  },
  bambou_lamelle: {
    key: "bambou_lamelle", nom: "Bambou Lamellé Structural", categorie: "Bois",
    fields: ["Architecture"],
    co2_kg_par_kg: -0.8, co2_range: [-1.2, 0.5], module_elastique_gpa: 10.0, stress_shielding: 1,
    recyclable: true, biodegradable: true, duree_vie_implant_ans: 30,
    types_chirurgie: [], taux_succes_pct: 88, taux_succes_source: "INBAR",
    biocompatibilite: 0, resistance_mecanique: 3, osteointegration: 0,
    radio_opaque: false, compatible_irm: true, sterilisation: [],
    norme_iso: "ISO 22157", prix_relatif: 2, disponibilite: 3,
    risque_infection: 0, risque_allergie: 0,
    reference: "INBAR; ISO 22157; Vogtländer 2019",
  },
  // ═══════ NATURAL — Architecture ═══════
  chanvre_chaux: {
    key: "chanvre_chaux", nom: "Béton de Chanvre (Chanvre-Chaux)", categorie: "Naturel",
    fields: ["Architecture"],
    co2_kg_par_kg: -0.3, co2_range: [-0.6, 0.2], module_elastique_gpa: 0.015, stress_shielding: 1,
    recyclable: false, biodegradable: true, duree_vie_implant_ans: 50,
    types_chirurgie: [], taux_succes_pct: 85, taux_succes_source: "Construire en Chanvre",
    biocompatibilite: 0, resistance_mecanique: 1, osteointegration: 0,
    radio_opaque: false, compatible_irm: true, sterilisation: [],
    norme_iso: "Règles CP 2012", prix_relatif: 2, disponibilite: 3,
    risque_infection: 0, risque_allergie: 0,
    reference: "Construire en Chanvre; Pretot 2014",
  },
  laine_bois: {
    key: "laine_bois", nom: "Laine de Bois (Fibre Isolante)", categorie: "Naturel",
    fields: ["Architecture"],
    co2_kg_par_kg: -0.5, co2_range: [-0.8, 0.1], module_elastique_gpa: 0.003, stress_shielding: 1,
    recyclable: true, biodegradable: true, duree_vie_implant_ans: 40,
    types_chirurgie: [], taux_succes_pct: 90, taux_succes_source: "Steico",
    biocompatibilite: 0, resistance_mecanique: 1, osteointegration: 0,
    radio_opaque: false, compatible_irm: true, sterilisation: [],
    norme_iso: "EN 13171", prix_relatif: 2, disponibilite: 4,
    risque_infection: 0, risque_allergie: 0,
    reference: "Steico; FDES Base INIES",
  },
  liege_expanse: {
    key: "liege_expanse", nom: "Liège Expansé (Isolant)", categorie: "Naturel",
    fields: ["Architecture"],
    co2_kg_par_kg: -0.7, co2_range: [-1.0, -0.2], module_elastique_gpa: 0.005, stress_shielding: 1,
    recyclable: true, biodegradable: true, duree_vie_implant_ans: 50,
    types_chirurgie: [], taux_succes_pct: 92, taux_succes_source: "Amorim",
    biocompatibilite: 0, resistance_mecanique: 1, osteointegration: 0,
    radio_opaque: false, compatible_irm: true, sterilisation: [],
    norme_iso: "EN 13170", prix_relatif: 3, disponibilite: 3,
    risque_infection: 0, risque_allergie: 0,
    reference: "Amorim Cork; Ecoinvent",
  },
  terre_crue: {
    key: "terre_crue", nom: "Terre Crue Compressée (BTC)", categorie: "Naturel",
    fields: ["Architecture"],
    co2_kg_par_kg: 0.05, co2_range: [0.02, 0.1], module_elastique_gpa: 2.0, stress_shielding: 1,
    recyclable: true, biodegradable: true, duree_vie_implant_ans: 100,
    types_chirurgie: [], taux_succes_pct: 85, taux_succes_source: "CRATerre",
    biocompatibilite: 0, resistance_mecanique: 2, osteointegration: 0,
    radio_opaque: false, compatible_irm: true, sterilisation: [],
    norme_iso: "XP P13-901", prix_relatif: 1, disponibilite: 5,
    risque_infection: 0, risque_allergie: 0,
    reference: "CRATerre; Morel 2001",
  },
  paille_porteuse: {
    key: "paille_porteuse", nom: "Bottes de Paille Porteuses", categorie: "Naturel",
    fields: ["Architecture"],
    co2_kg_par_kg: -1.3, co2_range: [-1.8, -0.5], module_elastique_gpa: 0.001, stress_shielding: 1,
    recyclable: true, biodegradable: true, duree_vie_implant_ans: 40,
    types_chirurgie: [], taux_succes_pct: 82, taux_succes_source: "RFCP",
    biocompatibilite: 0, resistance_mecanique: 1, osteointegration: 0,
    radio_opaque: false, compatible_irm: true, sterilisation: [],
    norme_iso: "Règles Pro CP 2012", prix_relatif: 1, disponibilite: 4,
    risque_infection: 0, risque_allergie: 0,
    reference: "RFCP; Boutin 2005",
  },
  // ═══════ BIOSOURCE / COMPOSITE — Architecture ═══════
  lin_composite: {
    key: "lin_composite", nom: "Composite Lin-Époxy (Bio-composite)", categorie: "Composite",
    fields: ["Architecture", "Mechanics"],
    co2_kg_par_kg: 5.5, co2_range: [3.5, 8.0], module_elastique_gpa: 30.0, stress_shielding: 2,
    recyclable: false, biodegradable: true, duree_vie_implant_ans: 25,
    types_chirurgie: [], taux_succes_pct: 88, taux_succes_source: "Lineo / Bcomp",
    biocompatibilite: 0, resistance_mecanique: 4, osteointegration: 0,
    radio_opaque: false, compatible_irm: true, sterilisation: [],
    norme_iso: "ISO 14125", prix_relatif: 3, disponibilite: 3,
    risque_infection: 0, risque_allergie: 0,
    reference: "Bcomp; Duflou CIRP 2012",
  },
  // ═══════ CERAMIQUE — Architecture ═══════
  beton_bas_carbone: {
    key: "beton_bas_carbone", nom: "Béton Bas Carbone (CEM III/B)", categorie: "Céramique",
    fields: ["Architecture"],
    co2_kg_par_kg: 0.08, co2_range: [0.05, 0.12], module_elastique_gpa: 30.0, stress_shielding: 2,
    recyclable: true, biodegradable: false, duree_vie_implant_ans: 100,
    types_chirurgie: [], taux_succes_pct: 95, taux_succes_source: "NF EN 197-1",
    biocompatibilite: 0, resistance_mecanique: 4, osteointegration: 0,
    radio_opaque: true, compatible_irm: true, sterilisation: [],
    norme_iso: "NF EN 206", prix_relatif: 1, disponibilite: 5,
    risque_infection: 0, risque_allergie: 0,
    reference: "Ecoinvent 3.9; ATILH",
  },
  geopolymere: {
    key: "geopolymere", nom: "Géopolymère (Laitier + Métakaolin)", categorie: "Céramique",
    fields: ["Architecture"],
    co2_kg_par_kg: 0.04, co2_range: [0.02, 0.08], module_elastique_gpa: 25.0, stress_shielding: 2,
    recyclable: true, biodegradable: false, duree_vie_implant_ans: 80,
    types_chirurgie: [], taux_succes_pct: 88, taux_succes_source: "Davidovits 2008",
    biocompatibilite: 0, resistance_mecanique: 3, osteointegration: 0,
    radio_opaque: true, compatible_irm: true, sterilisation: [],
    norme_iso: "NF EN 206", prix_relatif: 2, disponibilite: 3,
    risque_infection: 0, risque_allergie: 0,
    reference: "Davidovits 2008; Turner & Collins 2013",
  },
  // ═══════ POLYMERE — Architecture / Mechanics ═══════
  polycarbonate: {
    key: "polycarbonate", nom: "Polycarbonate (PC)", categorie: "Polymère",
    fields: ["Architecture", "Mechanics"],
    co2_kg_par_kg: 7.5, co2_range: [5.5, 10.0], module_elastique_gpa: 2.4, stress_shielding: 1,
    recyclable: true, biodegradable: false, duree_vie_implant_ans: 20,
    types_chirurgie: [], taux_succes_pct: 92, taux_succes_source: "Covestro / SABIC",
    biocompatibilite: 2, resistance_mecanique: 3, osteointegration: 0,
    radio_opaque: false, compatible_irm: true, sterilisation: [],
    norme_iso: "ISO 7391", prix_relatif: 2, disponibilite: 5,
    risque_infection: 0, risque_allergie: 0,
    reference: "Ecoinvent 3.9; Covestro",
  },
  etfe_membrane: {
    key: "etfe_membrane", nom: "ETFE (Membrane Architecturale)", categorie: "Polymère",
    fields: ["Architecture"],
    co2_kg_par_kg: 12.0, co2_range: [9.0, 16.0], module_elastique_gpa: 0.8, stress_shielding: 1,
    recyclable: true, biodegradable: false, duree_vie_implant_ans: 30,
    types_chirurgie: [], taux_succes_pct: 95, taux_succes_source: "AGC / Vector Foiltec",
    biocompatibilite: 0, resistance_mecanique: 3, osteointegration: 0,
    radio_opaque: false, compatible_irm: true, sterilisation: [],
    norme_iso: "ETAG 034", prix_relatif: 4, disponibilite: 3,
    risque_infection: 0, risque_allergie: 0,
    reference: "AGC Chemicals; Robinson-Gayle 2001",
  },
  // ═══════ METAL — Architecture / Mechanics ═══════
  acier_cor_ten: {
    key: "acier_cor_ten", nom: "Acier Corten (Acier Patinable)", categorie: "Métal",
    fields: ["Architecture"],
    co2_kg_par_kg: 2.5, co2_range: [1.8, 3.5], module_elastique_gpa: 200.0, stress_shielding: 5,
    recyclable: true, biodegradable: false, duree_vie_implant_ans: 80,
    types_chirurgie: [], taux_succes_pct: 95, taux_succes_source: "ArcelorMittal",
    biocompatibilite: 0, resistance_mecanique: 5, osteointegration: 0,
    radio_opaque: true, compatible_irm: false, sterilisation: [],
    norme_iso: "EN 10025-5", prix_relatif: 2, disponibilite: 5,
    risque_infection: 0, risque_allergie: 0,
    reference: "ArcelorMittal; Ecoinvent 3.9",
  },
  acier_inox_304: {
    key: "acier_inox_304", nom: "Acier Inoxydable 304", categorie: "Métal",
    fields: ["Architecture", "Mechanics"],
    co2_kg_par_kg: 4.8, co2_range: [3.5, 6.5], module_elastique_gpa: 193.0, stress_shielding: 5,
    recyclable: true, biodegradable: false, duree_vie_implant_ans: 50,
    types_chirurgie: [], taux_succes_pct: 95, taux_succes_source: "Outokumpu",
    biocompatibilite: 2, resistance_mecanique: 5, osteointegration: 0,
    radio_opaque: true, compatible_irm: false, sterilisation: [],
    norme_iso: "EN 10088", prix_relatif: 2, disponibilite: 5,
    risque_infection: 0, risque_allergie: 0,
    reference: "Ecoinvent 3.9; Outokumpu",
  },
};


// Scoring functions ported from Python

export function scoreClinique(m: Material): number {
  const s =
    (m.taux_succes_pct / 100) * 3.5 +
    (m.biocompatibilite / 5) * 2.5 +
    (m.osteointegration / 5) * 2.0 -
    (m.risque_infection / 5) * 1.0 -
    (m.risque_allergie / 5) * 1.0;
  return Math.round(Math.min(Math.max(s, 0), 10) * 100) / 100;
}

export function scoreEnvironnemental(m: Material): number {
  const co2 = m.co2_kg_par_kg;
  let base: number;
  if (co2 <= 2) base = 9.5;
  else if (co2 <= 5) base = 9.0 - ((co2 - 2) / 3) * 2.0;
  else if (co2 <= 15) base = 7.0 - ((co2 - 5) / 10) * 3.0;
  else if (co2 <= 50) base = 4.0 - ((co2 - 15) / 35) * 3.0;
  else base = Math.max(0.3, 1.0 - (co2 - 50) / 150);

  if (m.biodegradable) base += 1.5;
  if (m.recyclable) base += 0.5;
  return Math.round(Math.min(base, 10) * 100) / 100;
}

export function scoreStressShielding(m: Material): number {
  const gpa = m.module_elastique_gpa;
  const ratio = Math.abs(gpa - 20.0) / 20.0;
  const s = Math.max(0, 10.0 - ratio * 2.0);
  return Math.round(Math.min(s, 10) * 100) / 100;
}

export function scoreGlobal(m: Material): number {
  return Math.round(
    (scoreClinique(m) * 0.40 +
      scoreEnvironnemental(m) * 0.25 +
      (m.taux_succes_pct / 10) * 0.20 +
      (m.disponibilite / 5) * 10 * 0.10 +
      scoreStressShielding(m) * 0.05) *
      100
  ) / 100;
}

export function getCoutTransport(key: string, poidsKg = 0.1) {
  const orig = ORIGINES[key];
  if (!orig) return { co2_transport_kg: 0, cout_transport_eur: 0, distance_km: 0, mode: "—" };
  const dist = orig.distance_km;
  const facteurs = TRANSPORT_FACTEURS[orig.mode_transport];
  return {
    co2_transport_kg: Math.round(dist * poidsKg * facteurs.co2 * 10000) / 10000,
    cout_transport_eur: Math.round(dist * poidsKg * facteurs.cout * 10000) / 10000,
    distance_km: dist,
    mode: orig.mode_transport,
  };
}

// NLP

export const PATHO_KEYWORDS: Record<string, string[]> = {
  "oncologie osseuse": ["cancer", "tumeur", "oncologie", "sarcome", "métastase", "ostéosarcome", "résection"],
  "pédiatrie": ["enfant", "pédiatrie", "pédiatrique", "nourrisson", "adolescent", "croissance"],
  "rachis": ["rachis", "vertèbre", "scoliose", "lombaire", "cervical", "discal", "dos", "colonne", "hernie"],
  "traumatologie": ["fracture", "traumatologie", "fixation", "cassure", "choc", "ostéosynthèse", "plaque", "vis"],
  "dentaire": ["dent", "dentaire", "implant dentaire", "couronne", "bridge", "alvéolaire"],
  "maxillo-facial": ["mâchoire", "maxillaire", "facial", "mandibule", "visage", "crânien", "orbite"],
  "hanche": ["hanche", "prothèse hanche", "col du fémur", "fémur proximal", "arthroplastie hanche"],
  "genou": ["genou", "prothèse genou", "ligament croisé", "ménisque", "rotule", "arthroplastie genou"],
  "main": ["main", "doigt", "poignet", "carpe", "métacarpe", "phalange", "tunnel carpien"],
  "orthopédie": ["orthopédie", "articulaire", "articulation", "os long"],
  "neurochirurgie": ["neuro", "neurochirurgie", "crâne", "cerveau", "cranio", "cranioplastie", "dure-mère"],
  "cardiovasculaire": ["coeur", "cardiaque", "valve", "aorte", "coronaire", "cardiovasculaire", "pontage"],
  "vasculaire": ["artère", "veine", "vasculaire", "stent", "endoprothèse", "by-pass", "ischémie"],
  "ophtalmologie": ["oeil", "yeux", "ophtalmologie", "rétine", "cornée", "cristallin", "glaucome"],
  "reconstruction": ["reconstruction", "plastie", "greffe", "cicatrice", "lambeau", "tissu mou"],
  "ORL": ["ORL", "oreille", "nez", "gorge", "tympan", "otorhino", "cochléaire"],
};

const MAT_ALIASES: Record<string, string> = {
  titane: "titane_grade5", acier: "acier_316L", peek: "peek",
  cobalt: "cobalt_chrome", zircone: "zircone", plga: "plga_resorbable",
  pla: "pla_bio", magnésium: "magnesium_bio", tantale: "tantale_poreux",
  nitinol: "nitinol", alumine: "alumine", silicone: "silicone_medical",
  hydroxyapatite: "hydroxyapatite", pmma: "pmma_neuro", dacron: "dacron_polyester",
  ptfe: "ptfe_expanded", pyrocarbone: "pyrocarbone", collagène: "collagene_bovin",
};

export function detectAge(text: string): number {
  const m = text.match(/(\d+)\s*(ans?|an)/);
  if (m) return parseInt(m[1]);
  const m2 = text.match(/(\d+)/);
  return m2 ? parseInt(m2[1]) : 35;
}

export function detectPathologie(text: string, age: number): string {
  const scores: Record<string, number> = {};
  for (const [patho, keywords] of Object.entries(PATHO_KEYWORDS)) {
    scores[patho] = keywords.filter((kw) => text.includes(kw)).length;
  }
  let best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  if (best[1] === 0) return age < 18 ? "pédiatrie" : "orthopédie";
  return best[0];
}

export function detectMateriauHabituel(text: string): string {
  for (const [alias, key] of Object.entries(MAT_ALIASES)) {
    if (text.includes(alias)) return key;
  }
  return "titane_grade5";
}

export interface CandidatRow {
  key: string;
  nom: string;
  categorie: string;
  scoreClinique: number;
  scoreEcologie: number;
  scoreSecurite: number;
  scorePrix: number;
  scoreGlobal: number;
  gainCO2: number;
  bio: boolean;
  co2: number;
  irm: boolean;
  duree: number;
  reference: string;
  profil?: string;
  profilColor?: string;
}

export function buildCandidats(cible: string, matHKey: string): CandidatRow[] {
  const matH = MATERIAUX[matHKey];
  if (!matH) return [];

  const rows: CandidatRow[] = [];
  for (const [k, m] of Object.entries(MATERIAUX)) {
    if (!m.types_chirurgie.map((t) => t.toLowerCase()).includes(cible.toLowerCase())) continue;
    rows.push({
      key: k,
      nom: m.nom,
      categorie: m.categorie,
      scoreClinique: scoreClinique(m),
      scoreEcologie: scoreEnvironnemental(m),
      scoreSecurite: Math.round((m.taux_succes_pct / 10) * 10) / 10,
      scorePrix: Math.round((10 - m.prix_relatif * 2) * 10) / 10,
      scoreGlobal: scoreGlobal(m),
      gainCO2: Math.round((matH.co2_kg_par_kg - m.co2_kg_par_kg) * 10) / 10,
      bio: m.biodegradable,
      co2: m.co2_kg_par_kg,
      irm: m.compatible_irm,
      duree: m.duree_vie_implant_ans,
      reference: m.reference,
    });
  }
  return rows.sort((a, b) => b.scoreGlobal - a.scoreGlobal);
}

export function buildTop3(candidats: CandidatRow[]): CandidatRow[] {
  if (candidats.length === 0) return [];
  const top3: CandidatRow[] = [];

  // #1 Best global
  const t1 = { ...candidats[0], profil: "Best Global Score", profilColor: "#15803d" };
  top3.push(t1);

  // #2 Best ecology, different from #1
  const eco = [...candidats].sort((a, b) => b.scoreEcologie - a.scoreEcologie);
  for (const r of eco) {
    if (r.nom !== t1.nom) {
      top3.push({ ...r, profil: "Ecological Profile", profilColor: "#0369a1" });
      break;
    }
  }

  // #3 Best price, different from previous
  const prix = [...candidats].sort((a, b) => b.scorePrix - a.scorePrix);
  for (const r of prix) {
    if (!top3.some((t) => t.nom === r.nom)) {
      top3.push({ ...r, profil: "Economic Profile", profilColor: "#b45309" });
      break;
    }
  }

  return top3;
}
