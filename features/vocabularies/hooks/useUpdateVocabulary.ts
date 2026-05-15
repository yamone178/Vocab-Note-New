import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateVocabulary } from "../services/vocabulary-service";
import { VocabularySchema } from "../schemas/vocabulary-schema";
import { toast } from "sonner";

interface UpdateVocabularyVariables extends VocabularySchema {
  id: string;
}

export const useUpdateVocabulary = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, UpdateVocabularyVariables>({
    mutationFn: ({ id, ...data }) => {
      return updateVocabulary(id, data);
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["vocabularies"] });
      await queryClient.invalidateQueries({ queryKey: ["vocabulary", variables.id] });
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Vocabulary updated successfully");
    },
  });
};
