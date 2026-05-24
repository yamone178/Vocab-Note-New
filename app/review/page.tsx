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
  Loader2,
  CalendarDays,
  BarChart,
  BrainCircuit,
  Calendar
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useGetDueVocabularies } from "@/features/vocabularies/hooks/useGetDueVocabularies";
import { useGetReviewSchedule } from "@/features/vocabularies/hooks/useGetReviewSchedule";

const ReviewPage = () => {
  const [activeTab, setActiveTab] = useState('review');
  const { data, isLoading } = useGetDueVocabularies();
  const { data: scheduleData, isLoading: isScheduleLoading } = useGetReviewSchedule();
  
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

  if (isLoading || isScheduleLoading) {
    return (
      <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
        <div className="flex h-[calc(100vh-120px)] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      </DashboardLayout>
    );
  }

  const schedule = scheduleData || {
    summary: { dueToday: 0, upcomingSevenDays: 0, mastered: 0 },
    forecast: [],
    breakdown: { learning: 0, reviewing: 0, mastered: 0 }
  };

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm bg-white overflow-hidden">
              <CardContent className="p-4 sm:p-6 flex items-center gap-4 sm:gap-5">
                <div className={`h-12 w-12 sm:h-14 sm:w-14 rounded-2xl ${stat.iconBg} flex items-center justify-center shadow-lg shadow-gray-100 flex-shrink-0`}>
                  <stat.icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-bold text-gray-800">{stat.value}</div>
                  <div className="text-xs sm:text-sm font-medium text-gray-500">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Review Modes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {reviewModes.map((mode, i) => (
            <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-start gap-4 sm:gap-5 mb-6 sm:mb-8">
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
                    <mode.icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{mode.title}</h3>
                    <p className="text-sm sm:text-base text-gray-500">{mode.description}</p>
                  </div>
                </div>
                
                <Link 
                  href={mode.href}
                  className="flex items-center justify-between p-3 sm:p-4 bg-emerald-50/50 rounded-2xl group cursor-pointer hover:bg-emerald-50 transition-colors"
                >
                  <span className="text-emerald-900 font-medium text-sm sm:text-base">{mode.countText}</span>
                  <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform flex-shrink-0">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Review Schedule Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardContent className="p-4 sm:p-8 space-y-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-500" />
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Weekly Forecast</h2>
                </div>
              </div>

              <div className="flex items-end gap-1 sm:gap-2 h-32 sm:h-40 mt-4 overflow-x-auto pb-2">
                {schedule.forecast.map((day: any, i: number) => {
                  const maxCount = Math.max(...schedule.forecast.map((d: any) => d.count), 1);
                  const heightPercent = Math.max((day.count / maxCount) * 100, 5); // Minimum 5% height
                  
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 sm:gap-2 group min-w-[36px]">
                      <div className="text-[10px] sm:text-xs font-bold text-gray-400 group-hover:text-emerald-600 transition-colors">
                        {day.count}
                      </div>
                      <div className="w-full relative bg-emerald-50 rounded-t-lg sm:rounded-t-xl overflow-hidden h-20 sm:h-[100px]">
                        <div 
                          className="absolute bottom-0 w-full bg-emerald-400 group-hover:bg-emerald-500 transition-all duration-300 rounded-t-lg sm:rounded-t-xl" 
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>
                      <div className="text-[10px] sm:text-xs font-medium text-gray-500 truncate w-full text-center">
                        {i === 0 ? "Today" : day.dayName}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
                <div className="bg-orange-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col justify-center">
                  <div className="text-[10px] sm:text-sm font-bold text-orange-600/70 uppercase tracking-wider mb-1">Due Today</div>
                  <div className="text-2xl sm:text-3xl font-black text-orange-600">{schedule.summary.dueToday}</div>
                </div>
                <div className="bg-emerald-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col justify-center">
                  <div className="text-[10px] sm:text-sm font-bold text-emerald-600/70 uppercase tracking-wider mb-1">Next 7 Days</div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-600">{schedule.summary.upcomingSevenDays}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardContent className="p-4 sm:p-8 space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <BrainCircuit className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-500" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Learning Progress</h2>
              </div>

              <div className="space-y-6 mt-4">
                {/* Learning */}
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="font-bold text-gray-700">Learning</span>
                    </div>
                    <span className="font-black text-gray-900">{schedule.breakdown.learning}</span>
                  </div>
                  <div className="h-3 w-full bg-blue-50 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '100%' }} />
                  </div>
                  <p className="text-xs text-gray-500 font-medium">New words that need focus</p>
                </div>

                {/* Reviewing */}
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                      <span className="font-bold text-gray-700">Reviewing</span>
                    </div>
                    <span className="font-black text-gray-900">{schedule.breakdown.reviewing}</span>
                  </div>
                  <div className="h-3 w-full bg-orange-50 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500" style={{ width: '100%' }} />
                  </div>
                  <p className="text-xs text-gray-500 font-medium">Getting familiar, keep practicing</p>
                </div>

                {/* Mastered */}
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="font-bold text-gray-700">Mastered</span>
                    </div>
                    <span className="font-black text-gray-900">{schedule.breakdown.mastered}</span>
                  </div>
                  <div className="h-3 w-full bg-emerald-50 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: '100%' }} />
                  </div>
                  <p className="text-xs text-gray-500 font-medium">Strong memory, review occasionally</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReviewPage;
