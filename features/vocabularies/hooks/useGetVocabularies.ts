import { useQuery } from "@tanstack/react-query";
import { getVocabularies } from "@/features/category/services/category-service";

export const useGetVocabularies = ({
  categoryId,
  page,
  limit,
  search,
}: {
  categoryId?: string;
  page: number;
  limit: number;
  search: string;
}) => {
  return useQuery({
    queryKey: ["vocabularies", { categoryId, page, limit, search }],
    queryFn: () => getVocabularies({ categoryId, page, limit, search }),
  });
};
