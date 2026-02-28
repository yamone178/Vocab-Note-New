"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LoadingSpinner,
  LandingPage,
  DashboardLayout,
  StatsSection,
  RecentActivity,
  QuickActions,
  DailySuggestions
} from "@/common/components";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) return;
  }, [session, status, router]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (!session) {
    return <LandingPage />;
  }

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={handleLogout}
    >
      {/* Header */}
      <div className="mb-8 animate-fadeInUp">
        <h1 className="font-serif text-[2rem] font-extrabold leading-tight tracking-[-0.04em] text-gray-900">
          Dashboard
        </h1>
        <p className="mt-1 text-[0.93rem] text-gray-500">Welcome back! Here's your learning progress.</p>
      </div>

      <StatsSection />

      <div className="mb-5 grid grid-cols-1 md:grid-cols-2 gap-5">
        <RecentActivity />
        <QuickActions />
      </div>

      <DailySuggestions selectedWord={selectedWord} setSelectedWord={setSelectedWord} />
    </DashboardLayout>
  );
}