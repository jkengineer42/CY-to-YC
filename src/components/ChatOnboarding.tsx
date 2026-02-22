import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { ChatConfig } from "@/lib/chatStore";

const FIELDS = ["Medicine", "Architecture", "Mechanics", "Aerospace"];

const SPECIALTIES: Record<string, string[]> = {
  Medicine: ["Odontology", "Pediatrics", "Orthopedics", "Cardiovascular"],
  Architecture: ["Urban Design", "Interior", "Landscape", "Structural"],
  Mechanics: ["Thermodynamics", "Fluid Dynamics", "Robotics", "Materials"],
  Aerospace: ["Propulsion", "Avionics", "Aerodynamics", "Orbital"],
};

const OPTIMIZATIONS = [
  "Most Optimal",
  "Most Sustainable",
  "Most Carbon Efficient",
  "Most Economical",
];

interface ChatOnboardingProps {
  onComplete: (config: ChatConfig) => void;
}

const ChatOnboarding = ({ onComplete }: ChatOnboardingProps) => {
  const [step, setStep] = useState(0);
  const [field, setField] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [optimization, setOptimization] = useState("");

  const steps = [
    {
      title: "What field are you working in?",
      options: FIELDS,
      value: field,
      onSelect: (v: string) => { setField(v); setSpecialty(""); setStep(1); },
    },
    {
      title: "What's your specialty?",
      options: SPECIALTIES[field] || [],
      value: specialty,
      onSelect: (v: string) => { setSpecialty(v); setStep(2); },
    },
    {
      title: "What optimization do you prioritize?",
      options: OPTIMIZATIONS,
      value: optimization,
      onSelect: (v: string) => {
        setOptimization(v);
        onComplete({ field, specialty, optimization: v });
      },
    },
  ];

  const current = steps[step];

  return (
    <div className="h-full flex flex-col items-center justify-center gap-6 px-4">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-2">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i <= step ? "w-8 bg-primary" : "w-4 bg-border"
            }`}
          />
        ))}
      </div>

      <h2 className="font-serif text-2xl text-foreground text-center">{current.title}</h2>

      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        {current.options.map((opt) => (
          <button
            key={opt}
            onClick={() => current.onSelect(opt)}
            className={`rounded-xl border-2 px-4 py-4 text-sm font-medium transition-all hover:border-primary hover:bg-primary/5 ${
              current.value === opt
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border bg-card text-muted-foreground"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {step > 0 && (
        <button
          onClick={() => setStep(step - 1)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back
        </button>
      )}
    </div>
  );
};

export default ChatOnboarding;
