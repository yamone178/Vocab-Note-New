import { useQuery } from "@tanstack/react-query";
import { getQuizQuestions } from "../services/vocabulary-service";

export const useGetQuiz = () => {
  return useQuery({
    queryKey: ["vocabularies", "quiz"],
    queryFn: getQuizQuestions,
    refetchOnWindowFocus: false,
    staleTime: 0, // Always get a new quiz when requested
  });
};
