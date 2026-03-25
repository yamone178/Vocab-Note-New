import { VocabularySchema } from "../schemas/vocabulary-schema";

export const createVocabulary = async (data: VocabularySchema) => {
  const response = await fetch(
    `/api/categories/${data.categoryId}/vocabularies`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to create vocabulary");
  }

  return response.json();
};

export const getDueVocabularyList = async () => {
  const response = await fetch("/api/vocabularies/review");
  if (!response.ok) {
    throw new Error("Failed to fetch due vocabularies");
  }
  return response.json();
};

export const updateVocabularyReviewStatus = async (
  id: string,
  data: { remembered?: boolean; mastered?: boolean },
) => {
  const response = await fetch(`/api/vocabularies/${id}/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update review status");
  }

  return response.json();
};

export const getVocabularyCount = async () => {
  const response = await fetch("/api/vocabularies?limit=1");
  if (!response.ok) {
    throw new Error("Failed to fetch vocabularies count");
  }
  const data = await response.json();
  return data.meta.total;
};

export const getQuizQuestions = async (mode?: string) => {
  const url = mode ? `/api/vocabularies/quiz?mode=${mode}` : "/api/vocabularies/quiz";
  const response = await fetch(url);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch quiz questions");
  }
  return response.json();
};

export const deleteVocabulary = async (id: string) => {
  const response = await fetch(`/api/vocabularies/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete vocabulary");
  }

  return response.json();
};
