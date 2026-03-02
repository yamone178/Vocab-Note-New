import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../services/category-service";

export const useGetCategories = ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  return useQuery({
    queryKey: ["categories", { page, limit }],
    queryFn: () => getCategories({ page, limit }),
  });
};
