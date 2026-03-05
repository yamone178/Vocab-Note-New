import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteVocabulary } from "../services/vocabulary-service";
import { toast } from "react-toastify";

export const useDeleteVocabulary = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, { id: string; categoryId?: string }>({
    mutationFn: ({ id }) => {
      return deleteVocabulary(id);
    },
    onSuccess: (_, variables) => {
      // Invalidate both general vocabularies and category-specific ones
      queryClient.invalidateQueries({
        queryKey: ["vocabularies"],
      });
      if (variables.categoryId) {
        queryClient.invalidateQueries({
          queryKey: ["vocabularies", { categoryId: variables.categoryId }],
        });
        queryClient.invalidateQueries({
          queryKey: ["vocabularies"],
        });
      }
      toast.success("Vocabulary deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete vocabulary");
    },
  });
};
