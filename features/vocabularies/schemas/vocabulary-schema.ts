import { z } from "zod";

export const vocabularySchema = z.object({
  word: z.string().min(1, { message: "Word is required" }),
  partOfSpeech: z.string().min(1, { message: "Part of speech is required" }),
  definition: z.string().min(1, { message: "Definition is required" }),
});

export type VocabularySchema = z.infer<typeof vocabularySchema>;
