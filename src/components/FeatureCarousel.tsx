import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Volume2, Square } from "lucide-react";
import { useSimpleTTS } from "@/hooks/useTTS";

/* ── Slide content (chat mockup) ── */
const ChatSlide = () => {
  const { play, playing } = useSimpleTTS();
  const demoText = "Based on your constraints, I recommend Titanium Grade 5 (Ti-6Al-4V). It is biocompatible, corrosion resistant, and has a moderate cost.";

  return (
    <div className="bg-card/80 backdrop-blur-md rounded-2xl border border-border shadow-lg p-8 text-left max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border">
        <div className="w-2 h-2 rounded-full bg-[rgba(244,171,186,0.8)]" />
        <div className="w-2 h-2 rounded-full bg-[rgba(253,186,116,0.8)]" />
        <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
        <span className="ml-2 text-xs text-muted-foreground font-mono">Materia Chat</span>
      </div>
      <div className="flex justify-end mb-4">
        <div className="bg-foreground text-background rounded-2xl rounded-br-md px-4 py-3 max-w-[80%]">
          <p className="text-sm">I need a biocompatible material for dental implants that is also cost-effective.</p>
        </div>
      </div>
      <div className="flex justify-start mb-4">
        <div className="bg-accent/50 rounded-2xl rounded-bl-md px-4 py-3 max-w-[85%]">
          <p className="text-sm text-foreground mb-2">Based on your constraints, I recommend <strong>Titanium Grade 5 (Ti-6Al-4V)</strong>:</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-xs px-2 py-1 rounded-full bg-[rgba(196,181,253,0.3)] text-foreground/80">Biocompatible</span>
            <span className="text-xs px-2 py-1 rounded-full bg-[rgba(244,171,186,0.3)] text-foreground/80">Corrosion Resistant</span>
            <span className="text-xs px-2 py-1 rounded-full bg-[rgba(253,186,116,0.3)] text-foreground/80">Cost: Moderate</span>
          </div>
          <button
            onClick={() => play(demoText)}
            className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {playing ? <Square className="h-3 w-3" /> : <Volume2 className="h-3.5 w-3.5" />}
            {playing ? "Arrêter" : "Écouter"}
          </button>
        </div>
      </div>
      <div className="flex items-center gap-1 px-4 py-2">
        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
      </div>
    </div>
  );
};

/* ── Slide content (sustainability) ── */
const SustainabilitySlide = () => {
  const bars = [
    { label: "Carbon Footprint", value: 72, color: "rgba(244,171,186,0.6)" },
    { label: "Recyclability", value: 89, color: "rgba(196,181,253,0.6)" },
    { label: "Energy Efficiency", value: 65, color: "rgba(253,186,116,0.6)" },
    { label: "Toxicity Score", value: 94, color: "rgba(147,197,253,0.6)" },
  ];
  return (
    <div className="bg-card/80 backdrop-blur-md rounded-2xl border border-border shadow-lg p-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-5">
        <span className="font-serif text-lg text-foreground">Titanium Grade 5</span>
        <span className="text-xs font-mono text-muted-foreground">Ti-6Al-4V</span>
      </div>
      {bars.map((item) => (
        <div key={item.label} className="mb-4 last:mb-0">
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-foreground/80">{item.label}</span>
            <span className="text-muted-foreground font-mono text-xs">{item.value}/100</span>
          </div>
          <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${item.value}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ backgroundColor: item.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

/* ── Slide content (traceability) ── */
const TraceabilitySlide = () => (
  <div className="bg-card/80 backdrop-blur-md rounded-2xl border border-border shadow-lg p-6 max-w-md mx-auto text-left">
    <div className="flex items-center justify-between mb-5">
      <span className="font-serif text-lg text-foreground">Supply Chain</span>
      <span className="text-xs font-mono text-muted-foreground">Traceability</span>
    </div>
    {[
      { step: "Raw Extraction", location: "Australia", status: "Verified" },
      { step: "Processing", location: "Japan", status: "Verified" },
      { step: "Manufacturing", location: "Germany", status: "Verified" },
      { step: "Distribution", location: "France", status: "In Transit" },
    ].map((item, i) => (
      <div key={item.step} className="flex items-center gap-3 mb-3 last:mb-0">
        <div className={`w-3 h-3 rounded-full shrink-0 ${item.status === "Verified" ? "bg-emerald-400/70" : "bg-amber-400/70"}`} />
        <div className="flex-1">
          <p className="text-sm text-foreground">{item.step}</p>
          <p className="text-xs text-muted-foreground">{item.location}</p>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full ${item.status === "Verified" ? "bg-emerald-400/20 text-emerald-700" : "bg-amber-400/20 text-amber-700"}`}>
          {item.status}
        </span>
      </div>
    ))}
  </div>
);

/* ── Slides data ── */
const SLIDES = [
  {
    title: "Ask, don't search",
    subtitle: "Describe your project constraints in natural language. Mater recommends the best materials instantly.",
    content: <ChatSlide />,
  },
  {
    title: "Built for a better future",
    subtitle: "Every recommendation includes environmental impact scores and sustainability metrics.",
    content: <SustainabilitySlide />,
  },
  {
    title: "Full traceability",
    subtitle: "Track the complete supply chain of every material, from raw extraction to delivery.",
    content: <TraceabilitySlide />,
  },
];

const FeatureCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const go = useCallback((idx: number) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  }, [current]);

  const next = useCallback(() => go((current + 1) % SLIDES.length), [go, current]);
  const prev = () => go((current - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <section className="relative z-10 px-6 py-20">
      <div className="max-w-4xl mx-auto text-center">
        {/* Title + subtitle */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground mb-3">
              {SLIDES[current].title}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto mb-10">
              {SLIDES[current].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows + dots */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <button
            onClick={prev}
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-6 h-2.5 bg-foreground"
                    : "w-2.5 h-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Slide content */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut", delay: 0.1 }}
          >
            {SLIDES[current].content}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default FeatureCarousel;
