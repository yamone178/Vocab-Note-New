import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateVocabularyReviewStatus } from "../services/vocabulary-service";
import { useSession } from "next-auth/react"; // Import useSession
import { toast } from "sonner"; // Import toast

const XP_AMOUNT_REVIEW_FLASHCARD = 2;

export const useReviewVocabulary = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession(); // Get session to access user ID

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { remembered?: boolean; mastered?: boolean };
    }) => updateVocabularyReviewStatus(id, data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["vocabularies", "review"] });
      queryClient.invalidateQueries({ queryKey: ["vocabularies", "random"] });

      if (session?.user?.id) {
        try {
          await fetch(`/api/users/${session.user.id}/xp`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ xpAmount: XP_AMOUNT_REVIEW_FLASHCARD }),
          });
          queryClient.invalidateQueries({ queryKey: ["userProfile", session.user.id] });
          toast.success(`+${XP_AMOUNT_REVIEW_FLASHCARD} XP!`);
        } catch (error) {
          console.error("Error updating XP:", error);
          toast.error("Failed to update XP.");
        }
      }
    },
  });
};
