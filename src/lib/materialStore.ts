/**
 * Material history store using localStorage
 */

export interface HistoryEntry {
  date: string;
  age_patient: number;
  pathologie: string;
  materiau_habituel: string;
  materiau_recommande: string;
  gain_co2: number;
}

const STORE_KEY = "surggreen_history";

function load(): Record<string, HistoryEntry[]> {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function save(data: Record<string, HistoryEntry[]>) {
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
}

export function enregistrerUtilisation(entry: HistoryEntry) {
  const data = load();
  const key = entry.materiau_recommande;
  if (!data[key]) data[key] = [];
  data[key].push(entry);
  save(data);
}

export function getTousDossiers(): Record<string, HistoryEntry[]> {
  return load();
}

export function getStatsMateriau(nom: string) {
  const entries = load()[nom] || [];
  if (entries.length === 0) return { count: 0 };
  const ages = entries.map((e) => e.age_patient);
  const gains = entries.map((e) => e.gain_co2);
  return {
    count: entries.length,
    ageMoyen: Math.round((ages.reduce((a, b) => a + b, 0) / ages.length) * 10) / 10,
    gainCO2Total: Math.round(gains.reduce((a, b) => a + b, 0) * 10) / 10,
    gainCO2Moyen: Math.round((gains.reduce((a, b) => a + b, 0) / gains.length) * 10) / 10,
    derniereUtilisation: entries[entries.length - 1].date,
  };
}

export function clearHistory() {
  localStorage.removeItem(STORE_KEY);
}
