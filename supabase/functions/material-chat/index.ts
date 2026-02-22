import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPTS: Record<string, string> = {
  Medicine: `You are Mater, an expert biomaterial recommendation assistant for medical applications.
You help clinicians choose the best implant materials based on clinical cases.
For each case, recommend exactly 3 materials with these profiles:
1. **Best Overall** (or matching the user's optimization priority)
2. **Ecological Profile** (most sustainable option)
3. **Economic Profile** (best cost-effectiveness)

For each material provide:
- Material name and category (Metal, Polymer, Ceramic, Composite, Biosourced)
- Clinical score (out of 10)
- Sustainability score (out of 10)
- CO2 emissions (kg CO2/kg)
- Cost score (out of 10, higher = cheaper)
- Estimated CO2 savings vs conventional material

Format your response as:
1. A brief analysis paragraph
2. Then for each of the 3 recommendations, use this exact format:
---CARD---
name: [Material Name]
category: [Category]
score: [X.X]
sustainability: [X.X]
co2: [XX.X]
cost: [X]
co2Saved: [X.X]
profile: [Best Overall|Ecological Profile|Economic Profile]
---END---

Be precise, evidence-based, and always consider biocompatibility, mechanical properties, and environmental impact.`,

  Architecture: `You are Mater, an expert sustainable building material recommendation assistant.
You help architects and builders choose optimal construction materials.
For each scenario, recommend exactly 3 materials with these profiles:
1. **Best Overall** (or matching the user's optimization priority)
2. **Ecological Profile** (most sustainable option)
3. **Economic Profile** (best cost-effectiveness)

For each material provide:
- Material name and category (Wood, Bio-based, Metal, Mineral, Natural)
- Performance score (out of 10)
- Sustainability score (out of 10)
- CO2 emissions (kg CO2/m²)
- Cost score (out of 10, higher = cheaper)
- Estimated CO2 savings vs conventional material

Use the same ---CARD--- format. Consider structural integrity, thermal performance, lifecycle analysis, and local availability.`,

  Mechanics: `You are Mater, an expert engineering material recommendation assistant.
You help engineers select optimal materials for mechanical applications.
For each challenge, recommend exactly 3 materials with these profiles:
1. **Best Overall** (or matching the user's optimization priority)
2. **Ecological Profile** (most sustainable option)
3. **Economic Profile** (best cost-effectiveness)

For each material provide:
- Material name and category (Superalloy, Composite, Light Alloy, Steel, Ceramic, Bio-composite)
- Performance score (out of 10)
- Sustainability score (out of 10)
- CO2 emissions (kg CO2/part)
- Cost score (out of 10, higher = cheaper)
- Estimated CO2 savings vs conventional material

Use the same ---CARD--- format. Consider operating conditions, fatigue life, thermal resistance, and manufacturability.`,

  Aerospace: `You are Mater, an expert aerospace material recommendation assistant.
You help aerospace engineers select high-performance materials.
For each application, recommend exactly 3 materials with these profiles:
1. **Best Overall** (or matching the user's optimization priority)
2. **Ecological Profile** (most sustainable option)
3. **Economic Profile** (best cost-effectiveness)

For each material provide:
- Material name and category (Composite, Titanium, Light Alloy, Ceramic, Superalloy, Bio-composite)
- Performance score (out of 10)
- Sustainability score (out of 10)
- CO2 emissions (kg CO2/kg)
- Cost score (out of 10, higher = cheaper)
- Estimated CO2 savings vs conventional material

Use the same ---CARD--- format. Consider weight-to-strength ratio, radiation resistance, thermal limits, and certification requirements.`,
};

/** Allowed materials per field — AI must ONLY recommend from this list */
const ALLOWED_MATERIALS: Record<string, string[]> = {
  Medicine: [
    "Titanium Grade 5 (Ti-6Al-4V CNC)", "Titanium Grade 23 (Ti-6Al-4V ELI)", "3D-Printed Porous Titanium (SLM)",
    "Stainless Steel 316L", "Cobalt-Chrome (CoCrMo)", "Porous Tantalum (Trabecular Metal)",
    "Nitinol NiTi (Superelastic)", "Bioresorbable Magnesium (WE43)",
    "PEEK Standard (Victrex 450G)", "Crosslinked UHMWPE + Vitamin E",
    "Biosourced PLA (Polylactic Acid)", "PLGA 75:25 (Resorbable Copolymer)",
    "Surgical PMMA (Acrylic Cement)", "Biostable Polyurethane (Biospan)",
    "ePTFE Gore-Tex Expanded", "Medical Grade Silicone Implant",
    "Synthetic Hydroxyapatite (HA)", "Alumina Al2O3 (BIOLOX forte)",
    "AMC Alumina-Zirconia Composite (BIOLOX delta)", "Zirconia Y-TZP (Yttrium Stabilized)",
    "Beta-TCP (Beta Tricalcium Phosphate)", "Bioglass 45S5 (Bioactive Glass)",
    "Human Allograft Bone (Bone Bank)", "Crosslinked Bovine Collagen",
    "Crosslinked Hyaluronic Acid (HA-XL)", "Decellularized Porcine Xenograft",
    "Pyrocarbon (LTI PyC)", "Carbon Fiber PEEK (CFR-PEEK)",
    "3D-Printed PCL Scaffold (Polycaprolactone)", "Woven Dacron Polyester (Woven PET)",
  ],
  Architecture: [
    "CLT (Cross-Laminated Timber)", "Glulam (Glued Laminated Timber)", "Structural Laminated Bamboo",
    "Hempcrete (Hemp-Lime)", "Wood Fiber Insulation", "Expanded Cork Insulation",
    "Compressed Earth Block (CEB)", "Load-Bearing Straw Bales",
    "Flax-Epoxy Composite (Bio-composite)", "Low-Carbon Concrete (CEM III/B)",
    "Geopolymer (Slag + Metakaolin)", "Polycarbonate (PC)", "ETFE (Architectural Membrane)",
    "Corten Steel (Weathering Steel)", "Stainless Steel 304", "Stainless Steel 316L",
  ],
  Mechanics: [
    "Inconel 718 (Ni-Cr-Fe)", "Inconel 617 (Solution Strengthened)", "MA754 ODS (Ni-Cr-Y2O3)",
    "Hastelloy X (Ni-Cr-Fe-Mo)", "Aluminum 7075-T6", "Aluminum 2024-T3",
    "Titanium Grade 2 (CP Ti)", "SiC-SiC CMC (Ceramic Matrix Composite)",
    "Carbon Fiber T700/Epoxy", "Kevlar 49 / Aramid",
    "Silicon Carbide (SiC)", "Silicon Nitride (Si3N4)",
    "Flax-Epoxy Composite (Bio-composite)", "Polycarbonate (PC)",
    "Stainless Steel 304", "Stainless Steel 316L",
    "Titanium Grade 5 (Ti-6Al-4V CNC)", "Cobalt-Chrome (CoCrMo)",
    "Carbon Fiber PEEK (CFR-PEEK)",
  ],
  Aerospace: [
    "Inconel 718 (Ni-Cr-Fe)", "Inconel 617 (Solution Strengthened)", "MA754 ODS (Ni-Cr-Y2O3)",
    "Hastelloy X (Ni-Cr-Fe-Mo)", "Aluminum 7075-T6", "Aluminum 2024-T3",
    "Titanium Grade 2 (CP Ti)", "SiC-SiC CMC (Ceramic Matrix Composite)",
    "Carbon Fiber T700/Epoxy", "Carbon Fiber M55J/Epoxy (High Modulus)",
    "Kevlar 49 / Aramid", "Silicon Carbide (SiC)", "Silicon Nitride (Si3N4)",
    "Titanium Grade 5 (Ti-6Al-4V CNC)", "Titanium Grade 23 (Ti-6Al-4V ELI)",
    "Carbon Fiber PEEK (CFR-PEEK)",
  ],
};
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, field, specialty, optimization } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const fieldDescriptions: Record<string, string> = {
      Medicine: "medical implants, biomaterials, clinical cases, surgery, prosthetics, orthopedics",
      Architecture: "building materials, construction, insulation, structural design, facades",
      Mechanics: "engineering materials, mechanical parts, turbines, engines, robotics, thermal systems",
      Aerospace: "aerospace materials, satellites, aircraft, rockets, fuselage, propulsion",
    };
    const fieldDesc = fieldDescriptions[field] || fieldDescriptions.Medicine;

    const clarificationExamples: Record<string, string> = {
      Medicine: `Examples of clarifying questions:
- Patient age and weight?
- Type of fracture/pathology (open, closed, comminuted)?
- Load-bearing requirements?
- Expected implant duration (temporary or permanent)?
- Any allergies or contraindications?
- Current material being used (if replacement)?`,
      Architecture: `Examples of clarifying questions:
- Climate zone / geographic location?
- Building type (residential, commercial, industrial)?
- Specific performance requirements (thermal, acoustic, structural)?
- Budget constraints?
- Certification requirements (LEED, BREEAM, HQE)?
- Expected lifespan of the building?`,
      Mechanics: `Examples of clarifying questions:
- Operating temperature range?
- Load type (static, dynamic, cyclic)?
- Required fatigue life (number of cycles)?
- Corrosion environment?
- Manufacturing constraints (machining, casting, 3D printing)?
- Weight limitations?`,
      Aerospace: `Examples of clarifying questions:
- Operating altitude and environment (LEO, GEO, atmospheric)?
- Temperature range during operation?
- Radiation exposure level?
- Weight budget for the component?
- Certification standards (FAA, EASA, NASA)?
- Expected service life?`,
    };

    const offTopicGuard = `

CRITICAL RULES — YOU MUST FOLLOW THESE WITHOUT EXCEPTION:

0. CLARIFICATION FIRST: If the user's request lacks important details to make a precise recommendation, you MUST ask 2-4 targeted clarifying questions BEFORE recommending materials. Do NOT include ---CARD--- blocks when asking for clarification. 
   ${clarificationExamples[field] || clarificationExamples.Medicine}
   Only provide the 3 material cards AFTER you have enough context (either from the initial message or after the user answers your questions).
   If the user's message is already very detailed and specific, you can skip clarification and go directly to recommendations.

1. FIELD VALIDATION: You are currently in a "${field}" chat session. You ONLY answer questions about ${fieldDesc}.
   - If the user asks about a topic that belongs to a DIFFERENT field (e.g. a medical question in a Mechanics chat, or an architecture question in a Medicine chat), DO NOT answer. Instead respond ONLY with:
     "⚠️ This question seems related to a different domain. Please create a new chat session and select the appropriate field (e.g. Medicine, Architecture, etc.) to get accurate recommendations."
   - If the user asks something completely unrelated to materials (e.g. general knowledge, coding, jokes), respond ONLY with:
     "⚠️ I can only help with ${field} material recommendations. Please describe a specific ${field} case or scenario."
   - In both cases above, do NOT include any ---CARD--- blocks.

2. CARD FORMAT: When you have enough information and the question IS on-topic, you MUST output exactly 3 cards using this EXACT format (use these exact field names, no variations):
---CARD---
name: Material Name Here
category: Category Here
score: 8.5
sustainability: 7.2
co2: 12.5
cost: 6
co2Saved: -5.3
profile: Best Overall
---END---

   - "profile" must be one of: "Best Overall", "Ecological Profile", "Economic Profile"
   - Do NOT add extra fields like "Description:", "Material Name:", "Performance Score:", etc.
   - Do NOT use labels like "Performance Score: 9.5/10" — just use "score: 9.5"
   - co2Saved should be negative when the material saves CO2 vs baseline

3. The text before the cards MUST be a brief analysis (2-3 sentences max).
`;

    const allowedList = ALLOWED_MATERIALS[field] || ALLOWED_MATERIALS.Medicine;
    const materialConstraint = `\n\nCRITICAL — ALLOWED MATERIALS LIST:
You MUST ONLY recommend materials from this exact list. Do NOT invent or suggest any material not in this list.
Available materials for ${field}:
${allowedList.map((m, i) => `${i + 1}. ${m}`).join("\n")}

Use the EXACT names as written above in your ---CARD--- blocks. If no material in the list fits the user's need, explain why and recommend the closest match from the list.`;

    const systemPrompt = (SYSTEM_PROMPTS[field] || SYSTEM_PROMPTS.Medicine) +
      offTopicGuard +
      materialConstraint +
      `\n\nUser specialty: ${specialty || "General"}` +
      `\nOptimization priority: ${optimization || "Most Optimal"}` +
      `\nIMPORTANT: Always respond in English, regardless of the language the user writes in.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit reached, please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Add credits in Settings → Workspace → Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("material-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
