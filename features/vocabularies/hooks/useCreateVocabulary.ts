import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createVocabulary } from "../services/vocabulary-service";
import { VocabularySchema } from "../schemas/vocabulary-schema";
import { toast } from "react-toastify";

interface CreateVocabularyVariables extends VocabularySchema {
  categoryId: string;
}

export const useCreateVocabulary = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, VocabularySchema>({
    mutationFn: (data) => {
      return createVocabulary(data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["vocabularies", { categoryId: variables.categoryId }],
      });
      toast.success("Vocabulary created successfully");
    },
  });
};
