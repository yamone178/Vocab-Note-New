'use client';

import { useSession, signOut } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Zap, Target, CalendarDays, Award } from 'lucide-react';
import { toast } from 'sonner';
import { useGetUserProfile } from '@/features/users/hooks/useGetUserProfile';
import { format } from "date-fns";
import DashboardLayout from '@/common/components/DashboardLayout';
import { useState } from 'react';

const UserProfilePage = () => {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const { data: userProfile, isLoading, error } = useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState('profile');

  const handleLogout = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: '/auth/login' });
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error) {
    toast.error('Failed to load user profile.');
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  if (!session || !session.user || !userProfile) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        <p>Please log in to view your profile or data is not available.</p>
      </div>
    );
  }

  // Calculate daily goal percentage safely
  const dailyGoal = userProfile.dailyGoal || 5;
  const currentLearned = userProfile.currentDailyWordsLearned || 0;
  const dailyGoalPercentage = Math.min(100, (currentLearned / dailyGoal) * 100);

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={handleLogout}
    >
      <div className="mx-auto max-w-5xl space-y-8 p-4 md:p-0">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Profile</h1>

        <div className="grid gap-6 md:grid-cols-12">
          {/* Profile Card - Left Column */}
          <Card className="md:col-span-4 shadow-sm border-gray-200 overflow-hidden">
            <div className="h-24 bg-emerald-50 w-full"></div>
            <CardContent className="pt-0 flex flex-col items-center pb-8">
              <Avatar className="h-28 w-28 border-4 border-white shadow-md -mt-14 mb-4 bg-white">
                <AvatarImage src={userProfile.image || undefined} alt={userProfile.name || "User Avatar"} />
                <AvatarFallback className="bg-emerald-100 text-emerald-700 text-3xl font-bold">
                  {userProfile.name?.charAt(0)?.toUpperCase() || userProfile.email.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="text-center w-full px-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-1 line-clamp-1">
                  {userProfile.name || userProfile.email.split('@')[0]}
                </h2>
                <p className="text-sm text-gray-500 mb-6 line-clamp-1">{userProfile.email}</p>
                
                <div className="space-y-4 w-full">
                  {userProfile.createdAt && (
                    <div className="flex items-center justify-between text-sm border-b border-gray-100 pb-3">
                      <div className="flex items-center text-gray-500 gap-2">
                        <CalendarDays className="w-4 h-4" />
                        <span>Joined</span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {format(new Date(userProfile.createdAt), 'MMMM yyyy')}
                      </span>
                    </div>
                  )}
                  {userProfile.proficiencyLevel && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-500 gap-2">
                        <Award className="w-4 h-4" />
                        <span>Proficiency</span>
                      </div>
                      <span className="font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                        {userProfile.proficiencyLevel}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats & Goals - Right Column */}
          <div className="md:col-span-8 flex flex-col gap-6">
            
            {/* Redesigned XP Stats (No Progress Bar) */}
            <Card className="shadow-sm border-emerald-100 bg-gradient-to-br from-white to-emerald-50/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-emerald-600 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 fill-emerald-500" />
                  Experience Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black tracking-tighter text-gray-900">
                    {userProfile.xp?.toLocaleString() || 0}
                  </span>
                  <span className="text-lg font-medium text-gray-500">XP</span>
                </div>
              </CardContent>
            </Card>

            {/* Daily Goal Progress */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                  <Target className="w-5 h-5 text-blue-500" />
                  Daily Goal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <p className="font-medium text-gray-900">Learn {dailyGoal} words</p>
                    <p className="text-sm text-gray-500 mt-1">Keep up the momentum!</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-blue-600">{currentLearned}</span>
                    <span className="text-gray-400 font-medium"> / {dailyGoal}</span>
                  </div>
                </div>
                
                <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${dailyGoalPercentage}%` }}
                  ></div>
                </div>
                
                {dailyGoalPercentage >= 100 && (
                  <p className="mt-3 text-sm font-medium text-emerald-600 flex items-center gap-1.5">
                    <span>🎉</span> Goal completed for today!
                  </p>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserProfilePage;