import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "../services/category-service";
import { CategorySchema } from "../schemas/category-schema";
import { toast } from "react-toastify";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategorySchema) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created successfully");
    },
  });
};
