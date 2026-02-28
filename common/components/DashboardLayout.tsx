import { ReactNode } from "react";
import Navbar from "./Navbar";

interface DashboardLayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export default function DashboardLayout({
  children,
  activeTab,
  setActiveTab,
  onLogout
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f6fef9] antialiased font-sans">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
      <main className="mx-auto max-w-[1300px] px-8 py-10">
        {children}
      </main>
    </div>
  );
}