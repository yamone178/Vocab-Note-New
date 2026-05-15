"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import DashboardLayout from "@/common/components/DashboardLayout";
import { 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  BookOpen, 
  ArrowRight, 
  Zap,
  Loader2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useGetDueVocabularies } from "@/features/vocabularies/hooks/useGetDueVocabularies";

const ReviewPage = () => {
  const [activeTab, setActiveTab] = useState('review');
  const { data, isLoading } = useGetDueVocabularies();
  const cards = data?.data || [];
  const completedThisWeek = data?.completedThisWeek || 0;

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const stats = [
    { 
      label: "Due Today", 
      value: cards.length.toString(), 
      icon: Clock, 
      color: "text-orange-500", 
      bgColor: "bg-orange-50",
      iconColor: "text-white",
      iconBg: "bg-orange-500"
    },
    { 
      label: "Completed This Week", 
      value: completedThisWeek.toString(), 
      icon: CheckCircle2, 
      color: "text-emerald-500", 
      bgColor: "bg-emerald-50",
      iconColor: "text-white",
      iconBg: "bg-emerald-500"
    }
  ];

  const reviewModes = [
    {
      title: "Flashcards",
      description: "Review with interactive flashcards",
      countText: `${cards.length} cards due for review`,
      icon: BookOpen,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-500",
      buttonColor: "bg-emerald-500",
      href: "/review/flashcards"
    },
    {
      title: "Quiz Mode",
      description: "Test your knowledge with quizzes",
      countText: "Practice with multiple choice",
      icon: CheckCircle2,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-500",
      buttonColor: "bg-emerald-500",
      href: "/review/quiz"
    }
  ];

  if (isLoading) {
    return (
      <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
        <div className="flex h-[calc(100vh-120px)] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={handleLogout}
    >
      <div className="max-w-6xl space-y-8 ">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Review Center</h1>
          <p className="text-gray-500 mt-1">Track your progress and stay on schedule</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm bg-white overflow-hidden">
              <CardContent className="p-6 flex items-center gap-5">
                <div className={`h-14 w-14 rounded-2xl ${stat.iconBg} flex items-center justify-center shadow-lg shadow-gray-100`}>
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <div className="text-4xl font-bold text-gray-800">{stat.value}</div>
                  <div className="text-sm font-medium text-gray-500">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Review Modes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviewModes.map((mode, i) => (
            <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="p-8">
                <div className="flex items-start gap-5 mb-8">
                  <div className="h-14 w-14 rounded-2xl bg-emerald-500 flex items-center justify-center">
                    <mode.icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{mode.title}</h3>
                    <p className="text-gray-500">{mode.description}</p>
                  </div>
                </div>
                
                <Link 
                  href={mode.href}
                  className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-2xl group cursor-pointer hover:bg-emerald-50 transition-colors"
                >
                  <span className="text-emerald-900 font-medium">{mode.countText}</span>
                  <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Review Schedule Placeholder */}
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-6 w-6 text-emerald-500" />
              <h2 className="text-2xl font-bold text-gray-900">Review Schedule</h2>
            </div>

            <div className="space-y-4">
              {cards.length > 0 ? (
                <div className="p-5 rounded-3xl border border-emerald-200 bg-emerald-50/20">
                    <p className="text-emerald-800 font-medium">You have {cards.length} words due for review today.</p>
                </div>
              ) : (
                <div className="p-5 rounded-3xl border border-gray-100 bg-gray-50/50">
                    <p className="text-gray-500">No reviews scheduled for today.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ReviewPage;
