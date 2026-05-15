import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteVocabulary } from "../services/vocabulary-service";
import { toast } from "react-toastify";

export const useDeleteVocabulary = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, { id: string; categoryId?: string }>({
    mutationFn: ({ id }) => {
      return deleteVocabulary(id);
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["vocabularies"] });
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Vocabulary deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete vocabulary");
    },
  });
};
