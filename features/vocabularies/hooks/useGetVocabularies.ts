import { useQuery } from "@tanstack/react-query";
import { getVocabularies } from "@/features/category/services/category-service";

export const useGetVocabularies = ({
  categoryId,
  page,
  limit,
  search,
  difficulty,
  knowIt,
}: {
  categoryId?: string;
  page: number;
  limit: number;
  search: string;
  difficulty?: string;
  knowIt?: boolean;
}) => {
  return useQuery({
    queryKey: ["vocabularies", { categoryId, page, limit, search, difficulty, knowIt }],
    queryFn: () => getVocabularies({ categoryId, page, limit, search, difficulty, knowIt }),
  });
};
