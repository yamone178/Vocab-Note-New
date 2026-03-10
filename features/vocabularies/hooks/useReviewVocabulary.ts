import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateVocabularyReviewStatus } from "../services/vocabulary-service";

export const useReviewVocabulary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { remembered?: boolean; mastered?: boolean };
    }) => updateVocabularyReviewStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vocabularies", "review"] });
    },
  });
};
