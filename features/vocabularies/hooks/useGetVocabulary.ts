import { useQuery } from "@tanstack/react-query";
import { getVocabulary } from "../services/vocabulary-service";

export const useGetVocabulary = (id: string) => {
  return useQuery({
    queryKey: ["vocabulary", id],
    queryFn: () => getVocabulary(id),
    enabled: !!id,
  });
};
