import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";

const SidebarLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background relative overflow-hidden">
        {/* Animated gradient blobs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div
            className="absolute w-[600px] h-[600px] rounded-full blur-[130px] opacity-60"
            style={{
              background: "radial-gradient(circle, rgba(244,171,186,0.9) 0%, transparent 70%)",
              top: "10%",
              left: "5%",
              animation: "sideblob1 18s ease-in-out infinite",
            }}
          />
          <div
            className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-55"
            style={{
              background: "radial-gradient(circle, rgba(196,181,253,0.9) 0%, transparent 70%)",
              top: "5%",
              right: "10%",
              animation: "sideblob2 22s ease-in-out infinite",
            }}
          />
          <div
            className="absolute w-[550px] h-[550px] rounded-full blur-[140px] opacity-50"
            style={{
              background: "radial-gradient(circle, rgba(253,186,116,0.9) 0%, transparent 70%)",
              bottom: "0%",
              left: "30%",
              animation: "sideblob3 20s ease-in-out infinite",
            }}
          />
          <div
            className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-45"
            style={{
              background: "radial-gradient(circle, rgba(147,197,253,0.85) 0%, transparent 70%)",
              top: "40%",
              right: "5%",
              animation: "sideblob4 25s ease-in-out infinite",
            }}
          />
        </div>

        <style>{`
          @keyframes sideblob1 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(80px, 40px) scale(1.1); }
            50% { transform: translate(30px, -50px) scale(0.95); }
            75% { transform: translate(-60px, 30px) scale(1.05); }
          }
          @keyframes sideblob2 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(-70px, 50px) scale(1.08); }
            50% { transform: translate(-40px, -30px) scale(0.92); }
            75% { transform: translate(50px, -40px) scale(1.1); }
          }
          @keyframes sideblob3 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(60px, -40px) scale(1.1); }
            66% { transform: translate(-50px, 30px) scale(0.95); }
          }
          @keyframes sideblob4 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            30% { transform: translate(-40px, -60px) scale(1.15); }
            60% { transform: translate(50px, 40px) scale(0.9); }
          }
        `}</style>

        <AppSidebar />
        <div className="flex-1 flex flex-col relative z-10">
          <header className="flex items-center px-8 py-6">
            <SidebarTrigger />
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SidebarLayout;
