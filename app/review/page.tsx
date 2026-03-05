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
  Calendar,
  Zap
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ReviewPage = () => {
  const [activeTab, setActiveTab] = useState('review');

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const stats = [
    { 
      label: "Due Today", 
      value: "23", 
      icon: Clock, 
      color: "text-orange-500", 
      bgColor: "bg-orange-50",
      iconColor: "text-white",
      iconBg: "bg-orange-500"
    },
    { 
      label: "Completed This Week", 
      value: "145", 
      icon: CheckCircle2, 
      color: "text-emerald-500", 
      bgColor: "bg-emerald-50",
      iconColor: "text-white",
      iconBg: "bg-emerald-500"
    },
    { 
      label: "Review Streak", 
      value: "7 days", 
      icon: TrendingUp, 
      color: "text-teal-500", 
      bgColor: "bg-teal-50",
      iconColor: "text-white",
      iconBg: "bg-teal-500"
    },
  ];

  const reviewModes = [
    {
      title: "Flashcards",
      description: "Review with interactive flashcards",
      countText: "23 cards due for review",
      icon: BookOpen,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-500",
      buttonColor: "bg-emerald-500"
    },
    {
      title: "Quiz Mode",
      description: "Test your knowledge with quizzes",
      countText: "Create custom quizzes",
      icon: CheckCircle2,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-500",
      buttonColor: "bg-emerald-500"
    }
  ];

  const schedule = [
    { name: "Business", words: 8, status: "Weekly Review", type: "weekly", color: "text-emerald-600", bg: "bg-emerald-50" },
    { name: "Technology", words: 5, status: "Due in 2 days", type: "upcoming", color: "text-gray-600", bg: "bg-gray-50" },
    { name: "Medical", words: 10, status: "Due today", type: "due", color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={handleLogout}
    >
      <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Review Center</h1>
          <p className="text-gray-500 mt-1">Track your progress and stay on schedule</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  href="/review/flashcards"
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

        {/* Review Schedule */}
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-6 w-6 text-emerald-500" />
              <h2 className="text-2xl font-bold text-gray-900">Review Schedule</h2>
            </div>

            <div className="space-y-4">
              {schedule.map((item, i) => (
                <div 
                  key={i} 
                  className={`flex items-center justify-between p-5 rounded-3xl border ${item.type === 'due' ? 'border-emerald-200 ring-4 ring-emerald-50/50' : 'border-gray-50'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-full ${item.type === 'due' ? 'bg-emerald-500' : (item.type === 'weekly' ? 'bg-emerald-50' : 'bg-gray-50')} flex items-center justify-center`}>
                      <span className={`font-bold ${item.type === 'due' ? 'text-white' : 'text-emerald-600'}`}>{item.name[0]}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{item.name}</h4>
                      <p className="text-sm text-gray-500">{item.words} words</p>
                    </div>
                  </div>
                  
                  <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                    item.type === 'due' 
                      ? 'bg-emerald-100 text-emerald-600' 
                      : (item.type === 'weekly' ? 'bg-emerald-50 text-emerald-700/60' : 'bg-gray-50 text-gray-500')
                  }`}>
                    {item.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ReviewPage;
