import { z } from "zod";

export const vocabularySchema = z.object({
  word: z.string().min(1, { message: "Word is required" }),
  partOfSpeech: z.string().min(1, { message: "Part of speech is required" }),
  definition: z.string().min(1, { message: "Definition is required" }),
  categoryId: z.string().min(1, { message: "Category is required" }),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  example: z.string().optional(),
  synonyms: z.string().optional(),
  antonyms: z.string().optional(),
});

export type VocabularySchema = z.infer<typeof vocabularySchema>;
