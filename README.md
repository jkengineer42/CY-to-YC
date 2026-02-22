# Materia

> AI-powered material selection for engineers, architects and researchers — faster, smarter and greener.

Built at **HackEurope 2026** · Crusoe Sustainability Track & Best Use of Lovable

---

## What is Materia?

Choosing the right material for a project is a slow, fragmented process: scattered databases, opaque sustainability data, and no carbon-aware recommendations. **Materia** fixes that.

Describe your use case in plain language — a clinical case, a construction scenario, an aerospace challenge — and Materia's AI returns scored material recommendations across three profiles:

| Profile | Focus |
|---|---|
| **Best Overall** | Balanced performance, cost and ecology |
| **Ecological** | Lowest carbon footprint and highest sustainability |
| **Economic** | Best cost-efficiency ratio |

Each recommendation comes with: LCA-certified CO₂ data, supply chain traceability on a live map, and a full analytics dashboard tracking your historical savings.

---

## Features

### Landing & Workspace Configuration
Configure your **field** (Medicine, Architecture, Mechanics, Aerospace), your **specialty**, and your **optimization target** before entering the app.

### AI Chat Audit
Describe your need in natural language. The AI streams back structured material recommendations with:
- Composite score /10
- Ecology score /10
- CO₂ per kg (vs. reference)
- CO₂ saved vs. a conventional material
- Category badge (Metal, Polymer, Ceramic, Biosourced, Composite…)

Includes **text-to-speech** playback and a **chat history** across sessions.

### Analytics Dashboard
After each audit, your results are stored and surfaced in a rich dashboard:
- **Net Carbon Savings** across all analyses
- **Tree equivalent** (kg CO₂ / 25 kg absorbed per tree per year)
- **Radar chart** — multi-criteria profile comparison
- **Bar chart** — top 5 CO₂ savings potential by material
- **Traceability map** — interactive Leaflet map showing material origins
- **Full comparison table** with all recommended materials
- **Analysis history** — click any past audit to review its recommendations

### Materials Library
Browse the full certified materials database with:
- **3D interactive previews** (Three.js) on hover
- Filter by **field** and **category**
- Sort by **score**, **CO₂** or **alphabetically**
- Biodegradable / MRI-compatible / Recyclable badges

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| UI Components | shadcn/ui + Radix UI + Tailwind CSS |
| Animations | Framer Motion |
| 3D rendering | Three.js + React Three Fiber + Drei |
| Charts | Recharts |
| Map | Leaflet + React Leaflet |
| Backend | Supabase (PostgreSQL + Edge Functions) |
| AI streaming | Supabase Edge Function → streamed SSE |
| State management | TanStack React Query |
| Forms | React Hook Form + Zod |
| Testing | Vitest + Testing Library |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm or bun

### Install & run

```sh
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:8080`.

### Other scripts

```sh
npm run build        # Production build
npm run build:dev    # Development build
npm run preview      # Preview the production build locally
npm run lint         # ESLint
npm run test         # Run tests (Vitest)
npm run test:watch   # Watch mode
```

### Environment variables

Create a `.env` file at the root with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Project Structure

```
src/
├── pages/
│   ├── Index.tsx          # Landing page with workspace selector
│   ├── Chat.tsx           # AI audit chat interface
│   ├── Dashboard.tsx      # Analytics & history
│   ├── Materials.tsx      # Material library with 3D previews
│   ├── HelpCenter.tsx     # Help & documentation
│   └── Auth.tsx           # Authentication
├── components/
│   ├── AnimatedChatBox.tsx     # Hero animated chat preview
│   ├── TraceabilityMap.tsx     # Leaflet supply chain map
│   ├── FeatureCarousel.tsx     # Landing feature highlights
│   ├── materials3d/            # Three.js material scenes
│   └── ui/                     # shadcn/ui component library
├── data/
│   └── materials.ts            # Certified LCA material database
├── lib/
│   ├── streamChat.ts           # SSE streaming + card parser
│   ├── auditService.ts         # Supabase audit CRUD
│   └── chatStore.ts            # Session & message persistence
├── hooks/
│   └── useTTS.ts               # Text-to-speech hook
└── integrations/
    └── supabase/               # Supabase client & types
supabase/
├── functions/                  # Edge Functions (AI inference)
└── migrations/                 # Database schema
```

---

## Sustainability Metrics

Materia is purpose-built for the Crusoe Sustainability Track. Every recommendation surfaces:

- **CO₂ per kg** — sourced from certified Life Cycle Assessment (LCA) data
- **CO₂ saved** — delta vs. a conventional reference material for the same use case
- **Tree equivalent** — 1 tree absorbs ~25 kg CO₂/year, making savings tangible
- **Ecology score** — composite of CO₂, biodegradability, recyclability and biocompatibility

The dashboard aggregates these metrics across all of your analyses so you can track the cumulative environmental impact of your material choices over time.

---

## Team

| Name | Role |
|---|---|
| **Jerémie Konda** | Full-Stack Engineer |
| **Arun Kuganesan** | Frontend Engineer |
| **Adel Noui** | Backend Engineer |
| **Gaïa Mezaïb** | Product & Design |

---

## Hackathon

Built at [HackEurope 2026](https://app.hackeurope.eu) for two tracks:

- **Crusoe Sustainability Track** — Build a tool that makes AI development (and engineering broadly) more energy-efficient and sustainable.
- **Best Use of Lovable** — Build the most impressive project using Lovable as the primary development platform.

---

## Disclaimer

Materia provides decision support only. Recommendations are aids for human decision-making and do not replace expert engineering or clinical judgment.
