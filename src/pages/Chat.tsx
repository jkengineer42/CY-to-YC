import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Send, Bot, User, Leaf, Shield, TrendingDown, LayoutDashboard, Volume2, Square } from "lucide-react";
import { toast } from "sonner";
import ChatOnboarding from "@/components/ChatOnboarding";
import ChatHistory from "@/components/ChatHistory";
import {
  createSession,
  getSession,
  updateSession,
  getAllSessions,
  type ChatConfig,
  type ChatMessage,
  type ChatSession,
} from "@/lib/chatStore";
import { streamChat, parseCards, type ParsedCard } from "@/lib/streamChat";
import { saveAudit } from "@/lib/auditService";
import { useIndexedTTS } from "@/hooks/useTTS";

/* ── Field config ─────────────────────────────── */

const FIELD_EXAMPLES: Record<string, string[]> = {
  Medicine: [
    "Tibial fracture, 22 y/o patient, planned removal",
    "Hip replacement, 68 y/o female",
    "Femur tumor, 12 y/o child, currently titanium",
  ],
  Architecture: [
    "Insulation for passive house in cold climate",
    "Sustainable flooring for commercial building",
    "Low-carbon concrete alternative for foundation",
  ],
  Mechanics: [
    "Heat-resistant alloy for turbine blade at 1200C",
    "Lightweight composite for robotic arm joint",
    "Thermal conductor for engine cooling system",
  ],
  Aerospace: [
    "Radiation-resistant panel for LEO satellite",
    "Lightweight composite for fuselage section",
    "Flame-retardant material for cabin interior",
  ],
};

const FIELD_PLACEHOLDERS: Record<string, string> = {
  Medicine: "e.g. Tibial fracture, 22 y/o patient, planned removal in 18 months...",
  Architecture: "e.g. Sustainable insulation for a passive house in Scandinavia...",
  Mechanics: "e.g. Heat-resistant alloy for turbine blade operating at 1200C...",
  Aerospace: "e.g. Lightweight radiation-resistant panel for LEO satellite...",
};

const FIELD_TITLES: Record<string, { title: string; subtitle: string }> = {
  Medicine: { title: "Clinical Audit", subtitle: "Describe a clinical case to get biomaterial recommendations" },
  Architecture: { title: "Building Material Audit", subtitle: "Describe a construction scenario for sustainable material recommendations" },
  Mechanics: { title: "Engineering Audit", subtitle: "Describe an engineering challenge for optimal material selection" },
  Aerospace: { title: "Aerospace Audit", subtitle: "Describe an aerospace application for high-performance material recommendations" },
};

/* ── Types for recommendation cards ──────────── */

interface RecommendationCard {
  name: string;
  category: string;
  score: number;
  co2: number;
  sustainability: number;
  cost: number;
  co2Saved: number;
  profil: string;
  profilColor: string;
}

/* ── Sub-components ───────────────────────────── */

const CO2Badge = ({ value }: { value: number }) => {
  const color = value >= 0 ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${color}`}>
      {value >= 0 ? "+" : ""}{value} kg CO2
    </span>
  );
};

const Top3Card = ({ card, index }: { card: RecommendationCard; index: number }) => {
  const borders = ["border-green-400", "border-blue-400", "border-amber-400"];
  const bgs = ["bg-green-50/50", "bg-blue-50/50", "bg-amber-50/50"];
  const icons = [Shield, Leaf, TrendingDown];
  const Icon = icons[index] || Shield;

  return (
    <div className={`rounded-xl border-2 ${borders[index]} ${bgs[index]} p-4 flex flex-col gap-2`}>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-bold uppercase tracking-wide" style={{ color: card.profilColor }}>{card.profil}</span>
      </div>
      <h4 className="font-semibold text-sm text-foreground">{card.name}</h4>
      <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
        <span>Score: <b className="text-foreground">{card.score}/10</b></span>
        <span>Ecology: <b className="text-foreground">{card.sustainability}/10</b></span>
        <span>CO2: <b className="text-foreground">{card.co2} kg</b></span>
        <span>Cost: <b className="text-foreground">{card.cost}/10</b></span>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <CO2Badge value={card.co2Saved} />
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent text-accent-foreground">{card.category}</span>
      </div>
    </div>
  );
};

/* ── Main Chat page ───────────────────────────── */

const Chat = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { play: ttsPlay, playingIdx: ttsPlaying, loadingIdx: ttsLoading } = useIndexedTTS();
  const [sessionId, setSessionId] = useState<string | null>(searchParams.get("session"));
  const [config, setConfig] = useState<ChatConfig | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [historyKey, setHistoryKey] = useState(0);
  const [auditId, setAuditId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load session or detect config from URL params
  useEffect(() => {
    const sid = searchParams.get("session");
    if (sid) {
      const session = getSession(sid);
      if (session) {
        setSessionId(session.id);
        setConfig(session.config);
        setMessages(session.messages);
        setAuditId(session.auditId || null);
        return;
      }
    }

    const field = searchParams.get("field");
    const specialty = searchParams.get("specialty");
    const optimization = searchParams.get("optimization");

    if (field) {
      const cfg: ChatConfig = {
        field,
        specialty: specialty || "General",
        optimization: optimization || "Most Optimal",
      };
      setConfig(cfg);

      const session = createSession(cfg);
      setSessionId(session.id);
      setMessages([]);
      setHistoryKey((k) => k + 1);

      const q = searchParams.get("q");
      if (q) {
        setTimeout(() => handleSendWithConfig(q, cfg, session.id), 100);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleOnboardingComplete = (cfg: ChatConfig) => {
    setConfig(cfg);
    const session = createSession(cfg);
    setSessionId(session.id);
    setMessages([]);
    setHistoryKey((k) => k + 1);
    setSearchParams({ session: session.id });
  };

  const handleSendWithConfig = (text: string, cfg: ChatConfig, sid: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    const title = text.trim().length > 40 ? text.trim().slice(0, 37) + "..." : text.trim();
    updateSession(sid, newMessages, newMessages.length === 1 ? title : undefined);
    setHistoryKey((k) => k + 1);
    setIsTyping(true);

    let assistantSoFar = "";

    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    const aiMessages = newMessages.map((m) => ({ role: m.role, content: m.content }));

    streamChat({
      messages: aiMessages,
      field: cfg.field,
      specialty: cfg.specialty,
      optimization: cfg.optimization,
      onDelta: (chunk) => upsertAssistant(chunk),
      onDone: () => {
        const { cleanText, cards } = parseCards(assistantSoFar);
        setMessages((prev) => {
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          if (updated[lastIdx]?.role === "assistant") {
            updated[lastIdx] = {
              ...updated[lastIdx],
              content: cleanText || assistantSoFar,
              cards: cards.length > 0 ? cards : undefined,
            };
          }
          updateSession(sid, updated);
          return updated;
        });
        setIsTyping(false);

        if (cards.length > 0) {
          saveAudit(cfg.field, cfg.specialty, cfg.optimization, text, cleanText || assistantSoFar, cards)
            .then((savedAuditId) => {
              if (savedAuditId) {
                updateSession(sid, [], undefined, savedAuditId);
                setAuditId(savedAuditId);
              }
            })
            .catch((err) => console.error("Failed to save audit:", err));
        }
      },
    }).catch((err) => {
      setIsTyping(false);
      if (err.message === "rate_limit") {
        toast.error("Rate limit reached, please try again shortly.");
      } else if (err.message === "payment_required") {
        toast.error("AI credits exhausted. Add credits in Settings → Workspace → Usage.");
      } else {
        toast.error("Error connecting to AI. Please try again.");
      }
    });
  };

  const handleSend = (text?: string) => {
    const msg = text || input.trim();
    if (!msg || !config || !sessionId) return;
    setInput("");
    handleSendWithConfig(msg, config, sessionId);
  };

  const handleSelectSession = (id: string) => {
    const session = getSession(id);
    if (!session) return;
    setSessionId(session.id);
    setConfig(session.config);
    setMessages(session.messages);
    setAuditId(session.auditId || null);
    setSearchParams({ session: session.id });
  };

  const handleNewChat = () => {
    setSessionId(null);
    setConfig(null);
    setMessages([]);
    setSearchParams({});
  };

  const field = config?.field || "Medicine";
  const titles = FIELD_TITLES[field] || FIELD_TITLES.Medicine;

  if (!config) {
    return (
      <div className="flex h-full">
        <div className="w-56 border-r border-border bg-card/50 py-4 shrink-0">
          <ChatHistory activeId={null} onSelect={handleSelectSession} onNew={handleNewChat} refreshKey={historyKey} />
        </div>
        <div className="flex-1">
          <ChatOnboarding onComplete={handleOnboardingComplete} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="w-56 border-r border-border bg-card/50 py-4 shrink-0 hidden md:block">
        <ChatHistory activeId={sessionId} onSelect={handleSelectSession} onNew={handleNewChat} refreshKey={historyKey} />
      </div>

      <div className="flex-1 flex flex-col p-4 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="font-serif text-2xl text-foreground">{titles.title}</h1>
          <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-accent">{config.specialty}</span>
          <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-accent">{config.optimization}</span>
        </div>
        <p className="text-muted-foreground text-sm mb-4">{titles.subtitle}</p>

        <div className="flex-1 rounded-xl border border-border bg-card/60 p-4 mb-4 overflow-auto space-y-4">
          {messages.length === 0 && !isTyping && (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm gap-3">
              <Bot className="h-10 w-10 opacity-30" />
              <span>Describe your case...</span>
              <div className="flex flex-wrap gap-2 mt-2 justify-center max-w-lg">
                {(FIELD_EXAMPLES[field] || FIELD_EXAMPLES.Medicine).map((ex) => (
                  <button key={ex} onClick={() => handleSend(ex)} className="px-3 py-1.5 rounded-full text-xs border border-border bg-background hover:bg-accent transition-colors">
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1">
                  <Bot className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
              )}
              <div className={`max-w-[85%] ${msg.role === "user" ? "order-first" : ""}`}>
                <div className={`rounded-2xl px-4 py-3 text-sm ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-accent text-accent-foreground rounded-bl-md"}`}>
                  {msg.content.split("\n").map((line, j) => (
                    <p key={j} className={j > 0 ? "mt-1" : ""}>
                      {line.split("**").map((part, k) => k % 2 === 1 ? <strong key={k}>{part}</strong> : part)}
                    </p>
                  ))}
                </div>
                {msg.role === "assistant" && !isTyping && (
                  <button
                    onClick={() => ttsPlay(msg.content, i)}
                    className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {ttsPlaying === i ? (
                      <Square className="h-3 w-3" />
                    ) : (
                      <Volume2 className="h-3.5 w-3.5" />
                    )}
                    {ttsPlaying === i ? "Stop" : "Listen"}
                  </button>
                )}
                {msg.cards && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                      {msg.cards.map((card, idx) => (
                        <Top3Card key={card.name} card={card} index={idx} />
                      ))}
                    </div>
                    {auditId && (
                      <button
                        onClick={() => navigate(`/dashboard?audit=${auditId}`)}
                        className="mt-3 flex items-center gap-2 text-xs text-primary hover:underline font-medium"
                      >
                        <LayoutDashboard className="h-3.5 w-3.5" />
                        View in Dashboard
                      </button>
                    )}
                  </>
                )}
              </div>
              {msg.role === "user" && (
                <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center shrink-0 mt-1">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 items-start">
              <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Bot className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <div className="rounded-2xl rounded-bl-md bg-accent px-4 py-3 text-sm">
                <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse mr-1" />
                <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse mr-1" style={{ animationDelay: "0.2s" }} />
                <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="rounded-xl border border-border bg-card/80 px-4 py-3 flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={FIELD_PLACEHOLDERS[field] || FIELD_PLACEHOLDERS.Medicine}
            className="flex-1 bg-transparent text-foreground text-sm outline-none"
          />
          <button
            onClick={() => {
              const text = input.trim() || FIELD_PLACEHOLDERS[field] || "";
              if (text) ttsPlay(text, -1);
            }}
            className="h-8 w-8 rounded-full border border-border flex items-center justify-center shrink-0 hover:scale-105 transition-transform text-muted-foreground hover:text-foreground"
          >
            {ttsPlaying === -1 ? <Square className="h-3 w-3" /> : <Volume2 className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={() => handleSend()}
            disabled={isTyping}
            className="h-8 w-8 rounded-full bg-foreground flex items-center justify-center shrink-0 hover:scale-105 transition-transform disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5 text-background" />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 text-center">Decision support only — simulated demo data.</p>
      </div>
    </div>
  );
};

export default Chat;
