import { useQuery } from "@tanstack/react-query";

interface Activity {
  text: string;
  createdAt: string;
}

interface ActivitiesResponse {
  data: Activity[];
}

export const useGetActivities = () => {
  return useQuery<ActivitiesResponse, Error>({
    queryKey: ["activities"],
    queryFn: async () => {
      const res = await fetch("/api/users/activities");
      if (!res.ok) {
        throw new Error("Failed to fetch activities");
      }
      return res.json();
    },
  });
};
