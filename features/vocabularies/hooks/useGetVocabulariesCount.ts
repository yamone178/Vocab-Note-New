import { useQuery } from "@tanstack/react-query";
import { getVocabularyCount } from "../services/vocabulary-service";

export const useGetVocabularyCount = () => {
  return useQuery({
    queryKey: ["vocabularies", "count"],
    queryFn: getVocabularyCount,
  });
};
