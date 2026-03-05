import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateVocabularyStatus } from "@/features/category/services/category-service";

export const useUpdateVocabularyStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, knowIt }: { id: string; knowIt: boolean }) =>
      updateVocabularyStatus(id, knowIt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vocabularies"] });
    },
  });
};
