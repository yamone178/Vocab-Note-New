import { CategorySchema } from "../schemas/category-schema";

export const createCategory = async (data: CategorySchema) => {
  const response = await fetch("/api/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create category");
  }

  return response.json();
};

export const getVocabularies = async ({
  categoryId,
  page,
  limit,
  search,
}: {
  categoryId: string;
  page: number;
  limit: number;
  search: string;
}) => {
  const response = await fetch(
    `/api/categories/${categoryId}/vocabularies?page=${page}&limit=${limit}&search=${search}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch vocabularies");
  }

  return response.json();
};

export const getCategories = async ({
  page,
  limit,
}: {
  page?: number;
  limit?: number;
} = {}) => {
  const url = new URL("/api/categories", window.location.origin);
  if (page) url.searchParams.append("page", page.toString());
  if (limit) url.searchParams.append("limit", limit.toString());

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
};
