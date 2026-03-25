import { useQuery } from "@tanstack/react-query";
import { getQuizQuestions } from "../services/vocabulary-service";

export const useGetQuiz = (mode?: string) => {
  return useQuery({
    queryKey: ["vocabularies", "quiz", { mode }],
    queryFn: () => getQuizQuestions(mode),
    refetchOnWindowFocus: false,
    staleTime: 0, // Always get a new quiz when requested
  });
};
