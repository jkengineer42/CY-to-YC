/**
 * Chat history store using localStorage
 */

export interface ChatConfig {
  field: string;
  specialty: string;
  optimization: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  cards?: any[];
}

export interface ChatSession {
  id: string;
  config: ChatConfig;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  title: string;
  auditId?: string;
}

const STORE_KEY = "mater_chat_history";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function loadAll(): ChatSession[] {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAll(sessions: ChatSession[]) {
  localStorage.setItem(STORE_KEY, JSON.stringify(sessions));
}

export function getAllSessions(): ChatSession[] {
  return loadAll().sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function getSession(id: string): ChatSession | undefined {
  return loadAll().find((s) => s.id === id);
}

export function createSession(config: ChatConfig): ChatSession {
  const session: ChatSession = {
    id: generateId(),
    config,
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    title: "New Audit",
  };
  const all = loadAll();
  all.push(session);
  saveAll(all);
  return session;
}

export function updateSession(id: string, messages: ChatMessage[], title?: string, auditId?: string) {
  const all = loadAll();
  const idx = all.findIndex((s) => s.id === id);
  if (idx === -1) return;
  if (messages.length > 0) all[idx].messages = messages;
  all[idx].updatedAt = new Date().toISOString();
  if (title) all[idx].title = title;
  if (auditId) all[idx].auditId = auditId;
  saveAll(all);
}

export function deleteSession(id: string) {
  const all = loadAll().filter((s) => s.id !== id);
  saveAll(all);
}
