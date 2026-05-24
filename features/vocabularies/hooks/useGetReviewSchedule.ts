import { useQuery } from "@tanstack/react-query";
import { getReviewSchedule } from "../services/vocabulary-service";

export const useGetReviewSchedule = () => {
  return useQuery({
    queryKey: ["vocabularies", "schedule"],
    queryFn: getReviewSchedule,
  });
};
