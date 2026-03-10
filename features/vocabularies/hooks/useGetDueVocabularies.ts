import { useQuery } from "@tanstack/react-query";
import { getDueVocabularyList } from "../services/vocabulary-service";

export const useGetDueVocabularies = () => {
  return useQuery({
    queryKey: ["vocabularies", "review"],
    queryFn: getDueVocabularyList,
  });
};
