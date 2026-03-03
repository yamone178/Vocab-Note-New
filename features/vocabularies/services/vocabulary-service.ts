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
