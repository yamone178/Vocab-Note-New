import { useQuery } from "@tanstack/react-query";

export interface UserProfileData {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  proficiencyLevel?: string;
  xp: number;
  createdAt: string;
  wordsLearned?: number;
  flashcardsReviewed?: number;
  quizzesCompleted?: number;
  accuracy?: number;
  dailyGoal?: number;
  currentDailyWordsLearned?: number;
}

const getUserProfile = async (userId: string): Promise<UserProfileData> => {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }
  return response.json();
};

export const useGetUserProfile = (userId: string | undefined) => {
  return useQuery<UserProfileData, Error>({ 
    queryKey: ["userProfile", userId], 
    queryFn: () => getUserProfile(userId!), 
    enabled: !!userId, // Only run query if userId is available
  });
};