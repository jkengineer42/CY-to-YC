import hackEuropeLogo from "@/assets/logo_hackeurope.png";

const Footer = () => {
  return (
    <footer className="relative z-10 w-full border-t border-border/30 bg-white px-8 py-5">
      <div className="max-w-6xl mx-auto flex items-center justify-between flex-col md:flex-row gap-6 md:gap-0">
        {/* Left */}
        <span
          className="text-[11px] uppercase tracking-[0.3em] font-mono"
          style={{ color: "#888" }}
        >
          Copyright &nbsp; © 2026
        </span>

        {/* Center – logo only */}
        <img
          src={hackEuropeLogo}
          alt="HackEurope"
          className="h-7 w-auto"
        />

        {/* Right */}
        <span
          className="text-[11px] uppercase tracking-[0.3em] font-mono"
          style={{ color: "#888" }}
        >
          Current Status: Hacking
        </span>
      </div>
    </footer>
  );
};

export default Footer;
