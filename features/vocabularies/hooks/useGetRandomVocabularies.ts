import { useQuery } from "@tanstack/react-query";
import { getRandomVocabularies } from "@/features/category/services/category-service";

export const useGetRandomVocabularies = (count: number = 7) => {
  return useQuery({
    queryKey: ["vocabularies", "random", { count }],
    queryFn: () => getRandomVocabularies(count),
  });
};
