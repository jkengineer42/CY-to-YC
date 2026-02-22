import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Leaf, Zap, Search, ShieldCheck, BarChart3 } from "lucide-react";
import FeatureCarousel from "@/components/FeatureCarousel";
import MaterLogo from "@/components/MaterLogo";
import SelectionColumn from "@/components/SelectionColumn";
import AnimatedChatBox from "@/components/AnimatedChatBox";
import Footer from "@/components/Footer";

const FIELDS = ["Medicine", "Architecture", "Mechanics", "Aerospace"];

const SPECIALTIES: Record<string, string[]> = {
  Medicine: ["Odontology", "Pediatrics", "Orthopedics", "Cardiovascular"],
  Architecture: ["Urban Design", "Interior", "Landscape", "Structural"],
  Mechanics: ["Thermodynamics", "Fluid Dynamics", "Robotics", "Materials"],
  Aerospace: ["Propulsion", "Avionics", "Aerodynamics", "Orbital"]
};

const OPTIMIZATIONS = [
"Most Optimal",
"Most Sustainable",
"Most Carbon Efficient",
"Most Economical"];


const Index = () => {
  const [fieldIndex, setFieldIndex] = useState(0);
  const [specialtyIndex, setSpecialtyIndex] = useState(0);
  const [optIndex, setOptIndex] = useState(0);
  const pageRef = useRef<HTMLDivElement>(null);
  const [scrollBackScheduled, setScrollBackScheduled] = useState(false);

  const currentSpecialties = useMemo(
    () => SPECIALTIES[FIELDS[fieldIndex]] || SPECIALTIES.Medicine,
    [fieldIndex]
  );

  const handleFieldSelect = (index: number) => {
    setFieldIndex(index);
    setSpecialtyIndex(0);
  };

  // Detect bottom reached → show wave → scroll back to top
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 20;

      if (atBottom && !scrollBackScheduled) {
        setScrollBackScheduled(true);
        timeout = setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          setTimeout(() => setScrollBackScheduled(false), 800);
        }, 3000);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeout) clearTimeout(timeout);
    };
  }, [scrollBackScheduled]);

  return (
    <div ref={pageRef} className="relative min-h-screen flex flex-col overflow-x-hidden">
      {/* Fixed gradient behind everything - visible on overscroll */}
      <div className="fixed bottom-0 left-0 right-0 h-72 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-400/80 via-pink-300/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-500/70 via-transparent to-transparent translate-y-4" />
        <div className="absolute inset-0 bg-gradient-to-t from-pink-400/60 via-transparent to-transparent translate-y-8"
        style={{ clipPath: "ellipse(80% 60% at 50% 100%)" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-orange-300/50 via-transparent to-transparent translate-y-2"
        style={{ clipPath: "ellipse(75% 55% at 50% 100%)" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-red-400/40 via-transparent to-transparent translate-y-6"
        style={{ clipPath: "ellipse(70% 50% at 50% 100%)" }} />
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs font-mono uppercase tracking-[0.3em] text-white/80">
          ↑ Back to top
        </div>
      </div>

      {/* Page content with background to cover the gradient */}
      <div className="relative z-[1] flex flex-col min-h-screen bg-background">
      {/* Animated gradient blobs background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
            className="absolute w-[600px] h-[600px] rounded-full blur-[130px] opacity-60"
            style={{
              background: "radial-gradient(circle, rgba(244,171,186,0.9) 0%, transparent 70%)",
              top: "10%",
              left: "5%",
              animation: "blob1 18s ease-in-out infinite"
            }} />

        <div
            className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-55"
            style={{
              background: "radial-gradient(circle, rgba(196,181,253,0.9) 0%, transparent 70%)",
              top: "5%",
              right: "10%",
              animation: "blob2 22s ease-in-out infinite"
            }} />

        <div
            className="absolute w-[550px] h-[550px] rounded-full blur-[140px] opacity-50"
            style={{
              background: "radial-gradient(circle, rgba(253,186,116,0.9) 0%, transparent 70%)",
              bottom: "0%",
              left: "30%",
              animation: "blob3 20s ease-in-out infinite"
            }} />

        <div
            className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-45"
            style={{
              background: "radial-gradient(circle, rgba(147,197,253,0.85) 0%, transparent 70%)",
              top: "40%",
              right: "5%",
              animation: "blob4 25s ease-in-out infinite"
            }} />

      </div>

      <style>{`
        @keyframes blob1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(80px, 40px) scale(1.1); }
          50% { transform: translate(30px, -50px) scale(0.95); }
          75% { transform: translate(-60px, 30px) scale(1.05); }
        }
        @keyframes blob2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-70px, 50px) scale(1.08); }
          50% { transform: translate(-40px, -30px) scale(0.92); }
          75% { transform: translate(50px, -40px) scale(1.1); }
        }
        @keyframes blob3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(60px, -40px) scale(1.1); }
          66% { transform: translate(-50px, 30px) scale(0.95); }
        }
        @keyframes blob4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          30% { transform: translate(-40px, -60px) scale(1.15); }
          60% { transform: translate(50px, 40px) scale(0.9); }
        }
      `}</style>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6">
        <MaterLogo />
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center pb-20 min-h-screen gap-0 px-[20px]">
        <div className="text-center mb-12">
          <p className="text-muted-foreground mb-3 tracking-wide text-base">
            A new way to build sustainably
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-foreground leading-tight">
            Configure your workspace
          </h1>
        </div>

        {/* Selection columns */}
        <div className="w-full max-w-2xl mx-auto flex gap-1 sm:gap-4 bg-card/60 backdrop-blur-sm rounded-2xl border border-border p-4 sm:p-6 shadow-sm mb-10">
          <SelectionColumn
              title="Field"
              items={FIELDS}
              selectedIndex={fieldIndex}
              onSelect={handleFieldSelect}
              accentColor="pink" />

          <div className="w-px bg-border self-stretch my-4" />
          <SelectionColumn
              title="Specialty"
              items={currentSpecialties}
              selectedIndex={specialtyIndex}
              onSelect={setSpecialtyIndex}
              accentColor="purple" />

          <div className="w-px bg-border self-stretch my-4" />
          <SelectionColumn
              title="Optimization"
              items={OPTIMIZATIONS}
              selectedIndex={optIndex}
              onSelect={setOptIndex}
              accentColor="orange" />

        </div>

        {/* Animated Chat Box */}
        <AnimatedChatBox
            field={FIELDS[fieldIndex]}
            specialty={currentSpecialties[specialtyIndex]}
            optimization={OPTIMIZATIONS[optIndex]} />


        {/* Spacer */}
        <div className="h-20" />
      </main>

      {/* Summary section */}
      <section className="relative z-10 px-6 py-20">
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14 max-w-2xl mx-auto">

          <h2 className="font-serif text-3xl sm:text-4xl text-foreground mb-4">
            How Materia works
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Materia helps engineers, architects and researchers find the perfect material for any project — faster, smarter and greener.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              icon: Search,
              title: "Describe your needs",
              description: "Tell us your constraints in plain language — field, specialty, budget, sustainability goals. Our AI understands it all.",
              color: "rgba(244,171,186,0.25)"
            },
            {
              icon: BarChart3,
              title: "Get scored recommendations",
              description: "Receive material suggestions ranked by performance, cost, and environmental impact with detailed sustainability metrics.",
              color: "rgba(196,181,253,0.25)"
            },
            {
              icon: ShieldCheck,
              title: "Trace & verify",
              description: "Every material comes with full supply chain traceability — from raw extraction to delivery, verified at each step.",
              color: "rgba(253,186,116,0.25)"
            }].
            map((item, i) =>
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-card/70 backdrop-blur-sm rounded-2xl border border-border p-6 text-center">

              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: item.color }}>

                <item.icon className="w-5 h-5 text-foreground/80" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
            )}
        </div>
      </section>

      <FeatureCarousel />

      {/* Testimonials carousel */}
      <section className="relative z-10 pb-40 overflow-hidden">
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12 px-6">

          <h2 className="font-serif text-3xl sm:text-4xl text-foreground">
            Trusted by professionals
          </h2>
        </motion.div>

        {/* Scrolling track */}
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <motion.div
              animate={{ x: [0, -1680] }}
              transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
              className="flex gap-5 px-6"
              style={{ width: "fit-content" }}>

            {[
              { name: "Dr. Sarah Chen", role: "Orthopedic Surgeon", quote: "Materia completely changed how I select implant materials. What used to take hours of research now takes minutes.", avatar: "https://i.pravatar.cc/80?img=1" },
              { name: "Marco Bellini", role: "Structural Architect", quote: "The sustainability metrics are invaluable. I can now justify material choices to clients with real environmental data.", avatar: "https://i.pravatar.cc/80?img=3" },
              { name: "Pr. Yuki Tanaka", role: "Aerospace Engineer", quote: "From titanium alloys to ceramic composites, Materia covers every material I need for propulsion systems.", avatar: "https://i.pravatar.cc/80?img=5" },
              { name: "Elena Rodriguez", role: "Dental Prosthetist", quote: "The biocompatibility scoring alone saves me so much time. My patients benefit from better material choices.", avatar: "https://i.pravatar.cc/80?img=9" },
              { name: "James Okafor", role: "Mechanical Designer", quote: "I use Materia daily for robotics projects. The optimization filters are exactly what I needed.", avatar: "https://i.pravatar.cc/80?img=11" },
              { name: "Lisa Bergström", role: "Sustainability Consultant", quote: "Finally a tool that puts carbon efficiency front and center. Materia is essential for green building projects.", avatar: "https://i.pravatar.cc/80?img=16" },
              { name: "Dr. Sarah Chen", role: "Orthopedic Surgeon", quote: "Materia completely changed how I select implant materials. What used to take hours of research now takes minutes.", avatar: "https://i.pravatar.cc/80?img=1" },
              { name: "Marco Bellini", role: "Structural Architect", quote: "The sustainability metrics are invaluable. I can now justify material choices to clients with real environmental data.", avatar: "https://i.pravatar.cc/80?img=3" },
              { name: "Pr. Yuki Tanaka", role: "Aerospace Engineer", quote: "From titanium alloys to ceramic composites, Materia covers every material I need for propulsion systems.", avatar: "https://i.pravatar.cc/80?img=5" },
              { name: "Elena Rodriguez", role: "Dental Prosthetist", quote: "The biocompatibility scoring alone saves me so much time. My patients benefit from better material choices.", avatar: "https://i.pravatar.cc/80?img=9" },
              { name: "James Okafor", role: "Mechanical Designer", quote: "I use Materia daily for robotics projects. The optimization filters are exactly what I needed.", avatar: "https://i.pravatar.cc/80?img=11" },
              { name: "Lisa Bergström", role: "Sustainability Consultant", quote: "Finally a tool that puts carbon efficiency front and center. Materia is essential for green building projects.", avatar: "https://i.pravatar.cc/80?img=16" }].
              map((t, i) =>
              <div
                key={`${t.name}-${i}`}
                className="flex-shrink-0 w-[300px] bg-card/80 backdrop-blur-sm rounded-xl border border-border p-6 flex flex-col justify-between">

                <p className="text-sm text-foreground/90 leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover" />

                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
              )}
          </motion.div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="relative z-10 pb-32 px-6">
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14">

          <h2 className="font-serif text-3xl sm:text-4xl text-foreground">Meet the Team</h2>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-10 max-w-5xl mx-auto">
          {[
            { name: "Jerémie Konda", role: "Full-Stack Engineer", img: "/images/team-jeremie.png" },
            { name: "Arun Kuganesan", role: "Frontend Engineer", img: "/images/team-arun.jpg" },
            { name: "Adel Noui", role: "Backend Engineer", img: "/images/team-adel.jpg" },
            { name: "Gaïa Mezaïb", role: "Product & Design", img: "/images/team-gaia.png" }].
            map((member, i) =>
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="flex flex-col items-center gap-3">

              <div className="w-44 h-56 rounded-xl border-2 border-border bg-card/80 backdrop-blur-sm shadow-md overflow-hidden flex items-end justify-center p-1">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover rounded-lg" />

              </div>
              <div className="text-center">
                
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </div>
            </motion.div>
            )}
        </div>
      </section>

      <Footer />
      </div>{/* end content wrapper */}
    </div>);

};

export default Index;