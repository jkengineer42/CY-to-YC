import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowUp, Volume2, Square } from "lucide-react";
import { useSimpleTTS } from "@/hooks/useTTS";

const PLACEHOLDER_PHRASES: Record<string, string[]> = {
  Medicine: [
    "Find the most sustainable dental implant material…",
    "Compare biocompatible polymers for orthopedic use…",
    "What's the most carbon-efficient surgical steel?",
  ],
  Architecture: [
    "Find eco-friendly insulation for passive houses…",
    "Compare carbon footprint of timber vs concrete…",
    "What's the most sustainable roofing material?",
  ],
  Mechanics: [
    "Find heat-resistant alloys for turbine blades…",
    "Compare lightweight composites for robotics…",
    "What's the most efficient thermal conductor?",
  ],
  Aerospace: [
    "Find radiation-resistant materials for satellites…",
    "Compare carbon fiber grades for fuselage panels…",
    "What's the lightest flame-retardant composite?",
  ],
};

interface AnimatedChatBoxProps {
  field: string;
  specialty?: string;
  optimization?: string;
}

const TYPING_SPEED = 40;
const PAUSE_BEFORE_ERASE = 2000;
const ERASE_SPEED = 20;
const PAUSE_BEFORE_NEXT = 300;

const AnimatedChatBox = ({ field, specialty, optimization }: AnimatedChatBoxProps) => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const { play: ttsPlay, stop: ttsStop, playing: ttsPlaying } = useSimpleTTS();
  const inputRef = useRef<HTMLInputElement>(null);
  const phrases = PLACEHOLDER_PHRASES[field] || PLACEHOLDER_PHRASES.Medicine;
  const isFocused = useRef(false);
  const animFrame = useRef<number>();
  const timeoutRef = useRef<NodeJS.Timeout>();

  const playTts = useCallback(() => {
    const text = inputValue || phrases[phraseIndex % phrases.length];
    ttsPlay(text);
  }, [ttsPlay, inputValue, phrases, phraseIndex]);

  // Reset typewriter when field changes
  useEffect(() => {
    setPhraseIndex(0);
    setDisplayedPlaceholder("");
  }, [field]);

  // Typewriter effect — only runs when input is empty
  const runTypewriter = useCallback(() => {
    if (isFocused.current && inputValue) return;

    const phrase = phrases[phraseIndex % phrases.length];
    let charIndex = 0;
    let isErasing = false;

    const tick = () => {
      if (isFocused.current && inputValue) return;

      if (!isErasing) {
        charIndex++;
        setDisplayedPlaceholder(phrase.slice(0, charIndex));
        if (charIndex < phrase.length) {
          timeoutRef.current = setTimeout(tick, TYPING_SPEED);
        } else {
          // Pause then erase
          timeoutRef.current = setTimeout(() => {
            isErasing = true;
            tick();
          }, PAUSE_BEFORE_ERASE);
        }
      } else {
        charIndex--;
        setDisplayedPlaceholder(phrase.slice(0, charIndex));
        if (charIndex > 0) {
          timeoutRef.current = setTimeout(tick, ERASE_SPEED);
        } else {
          // Next phrase
          timeoutRef.current = setTimeout(() => {
            setPhraseIndex((prev) => (prev + 1) % phrases.length);
          }, PAUSE_BEFORE_NEXT);
        }
      }
    };

    tick();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [phrases, phraseIndex, inputValue]);

  useEffect(() => {
    const cleanup = runTypewriter();
    return cleanup;
  }, [runTypewriter]);

  const handleSubmit = () => {
    const query = inputValue.trim();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    params.set("field", field);
    if (specialty) params.set("specialty", specialty);
    if (optimization) params.set("optimization", optimization);
    navigate(`/chat?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative rounded-2xl border border-border bg-card/80 backdrop-blur-sm shadow-sm px-5 py-4 transition-all duration-200 hover:shadow-md hover:border-forest/30 focus-within:shadow-md focus-within:border-forest/30">
        <div className="flex items-center gap-3">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <div className="flex-1 relative min-h-[28px]">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => { isFocused.current = true; }}
              onBlur={() => { isFocused.current = false; }}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-foreground text-base outline-none placeholder-transparent"
              placeholder=" "
            />
            {/* Typewriter placeholder shown when input is empty */}
            {!inputValue && (
              <span className="absolute inset-0 flex items-center text-muted-foreground text-base pointer-events-none">
                {displayedPlaceholder}
                <span className="inline-block w-[2px] h-5 bg-muted-foreground/50 ml-[1px] animate-pulse" />
              </span>
            )}
          </div>
          <button
            onClick={playTts}
            className="h-9 w-9 rounded-full border border-border flex items-center justify-center shrink-0 hover:scale-105 transition-transform text-muted-foreground hover:text-foreground"
          >
            {ttsPlaying ? <Square className="h-3.5 w-3.5" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <button
            onClick={handleSubmit}
            className="h-9 w-9 rounded-full bg-foreground flex items-center justify-center shrink-0 hover:scale-105 transition-transform"
          >
            <ArrowUp className="h-4 w-4 text-background" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnimatedChatBox;
