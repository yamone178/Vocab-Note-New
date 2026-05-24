import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateVocabularyReviewStatus } from "../services/vocabulary-service";
import { useSession } from "next-auth/react";

export const useReviewVocabulary = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { remembered?: boolean; mastered?: boolean };
    }) => updateVocabularyReviewStatus(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["vocabularies", "review"] });
      queryClient.invalidateQueries({ queryKey: ["vocabularies", "random"] });

      if (session?.user?.id && data?.xpEarned > 0) {
        // XP is already updated in the backend during the review mutation
        queryClient.invalidateQueries({ queryKey: ["userProfile", session.user.id] });
      }
    },
  });
};
