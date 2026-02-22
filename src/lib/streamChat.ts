/**
 * Stream chat helper for Lovable AI gateway via edge function
 */

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/material-chat`;

export type Msg = { role: "user" | "assistant"; content: string };

export async function streamChat({
  messages,
  field,
  specialty,
  optimization,
  onDelta,
  onDone,
}: {
  messages: Msg[];
  field: string;
  specialty: string;
  optimization: string;
  onDelta: (deltaText: string) => void;
  onDone: () => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages, field, specialty, optimization }),
  });

  if (!resp.ok || !resp.body) {
    if (resp.status === 429) throw new Error("rate_limit");
    if (resp.status === 402) throw new Error("payment_required");
    throw new Error("Failed to start stream");
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let textBuffer = "";
  let streamDone = false;

  while (!streamDone) {
    const { done, value } = await reader.read();
    if (done) break;
    textBuffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
      let line = textBuffer.slice(0, newlineIndex);
      textBuffer = textBuffer.slice(newlineIndex + 1);

      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;

      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") {
        streamDone = true;
        break;
      }

      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {
        textBuffer = line + "\n" + textBuffer;
        break;
      }
    }
  }

  // Final flush
  if (textBuffer.trim()) {
    for (let raw of textBuffer.split("\n")) {
      if (!raw) continue;
      if (raw.endsWith("\r")) raw = raw.slice(0, -1);
      if (raw.startsWith(":") || raw.trim() === "") continue;
      if (!raw.startsWith("data: ")) continue;
      const jsonStr = raw.slice(6).trim();
      if (jsonStr === "[DONE]") continue;
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch { /* ignore */ }
    }
  }

  onDone();
}

/** Parse ---CARD--- blocks from AI response text */
export interface ParsedCard {
  name: string;
  category: string;
  score: number;
  sustainability: number;
  co2: number;
  cost: number;
  co2Saved: number;
  profil: string;
  profilColor: string;
}

const PROFILE_COLORS: Record<string, string> = {
  "Best Overall": "#15803d",
  "Ecological Profile": "#0369a1",
  "Economic Profile": "#b45309",
  "Most Sustainable": "#15803d",
  "Lowest Carbon": "#0369a1",
  "Best Value": "#b45309",
};

export function parseCards(text: string): { cleanText: string; cards: ParsedCard[] } {
  const cards: ParsedCard[] = [];
  const cardRegex = /---CARD---([\s\S]*?)---END---/g;
  let match;

  while ((match = cardRegex.exec(text)) !== null) {
    const block = match[1];
    const get = (key: string, ...aliases: string[]) => {
      for (const k of [key, ...aliases]) {
        const m = block.match(new RegExp(`(?:^|\\n)\\s*\\**${k}\\**:\\s*(.+)`, "im"));
        if (m) return m[1].trim().replace(/\*\*/g, "");
      }
      return "";
    };
    const profil = get("profile") || "Best Overall";
    const scoreRaw = get("score", "performance score", "clinical score");
    const sustainRaw = get("sustainability", "sustainability score");
    const co2Raw = get("co2", "co2 emissions");
    const costRaw = get("cost", "cost score");
    const co2SavedRaw = get("co2Saved", "co2saved", "estimated co2 savings");

    cards.push({
      name: get("name", "material name"),
      category: get("category"),
      score: parseFloat(scoreRaw) || 0,
      sustainability: parseFloat(sustainRaw) || 0,
      co2: parseFloat(co2Raw) || 0,
      cost: parseFloat(costRaw) || 0,
      co2Saved: parseFloat(co2SavedRaw) || 0,
      profil,
      profilColor: PROFILE_COLORS[profil] || "#15803d",
    });
  }

  const cleanText = text.replace(/---CARD---[\s\S]*?---END---/g, "").trim();
  return { cleanText, cards };
}
