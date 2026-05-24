import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createVocabulary } from "../services/vocabulary-service";
import { VocabularySchema } from "../schemas/vocabulary-schema";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react"; // Import useSession

const XP_AMOUNT_ADD_WORD = 5;

interface CreateVocabularyVariables extends VocabularySchema {
  categoryId: string;
}

export const useCreateVocabulary = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession(); // Get session to access user ID

  return useMutation<unknown, Error, VocabularySchema>({
    mutationFn: (data) => {
      return createVocabulary(data);
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["vocabularies"] });
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Vocabulary created successfully");

      // Update user XP manually through the dedicated route since transaction didn't work
      if (session?.user?.id) {
        try {
          await fetch(`/api/users/${session.user.id}/xp`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ xpAmount: XP_AMOUNT_ADD_WORD }),
          });
          queryClient.invalidateQueries({ queryKey: ["userProfile", session.user.id] });
        } catch (error) {
          console.error("Error updating XP:", error);
          toast.error("Failed to update XP.");
        }
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create vocabulary");
    },
  });
};
