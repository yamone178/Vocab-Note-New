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
  const url = new URL(
    categoryId
      ? `/api/categories/${categoryId}/vocabularies`
      : `/api/vocabularies`,
    window.location.origin,
  );

  url.searchParams.append("page", page.toString());
  url.searchParams.append("limit", limit.toString());
  if (search) url.searchParams.append("search", search);
  if (difficulty) url.searchParams.append("difficulty", difficulty);
  if (knowIt !== undefined) url.searchParams.append("knowIt", knowIt.toString());

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Failed to fetch vocabularies");
  }

  return response.json();
};

export const getRandomVocabularies = async (count: number = 7) => {
  const response = await fetch(`/api/vocabularies/random?count=${count}`);

  if (!response.ok) {
    throw new Error("Failed to fetch random vocabularies");
  }

  return response.json();
};

export const updateVocabularyStatus = async (id: string, knowIt: boolean) => {
  const response = await fetch(`/api/vocabularies/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ knowIt }),
  });

  if (!response.ok) {
    throw new Error("Failed to update vocabulary status");
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
