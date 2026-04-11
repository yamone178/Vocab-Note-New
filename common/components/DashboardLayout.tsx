import { ReactNode } from "react";
import Navbar from "./Navbar";
import { useSession } from "next-auth/react"; // Import useSession
import { useGetUserProfile } from "@/features/users/hooks/useGetUserProfile"; // Import useGetUserProfile

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
  const { data: session } = useSession();
  const { data: userData } = useGetUserProfile(session?.user?.id);

  return (
    <div className="min-h-screen bg-[#f6fef9] antialiased font-sans">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} session={session} userData={userData} />
      <main className="mx-auto max-w-[1300px] px-8 py-10">
        {children}
      </main>
    </div>
  );
}