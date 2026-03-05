export interface Vocabulary {
  id: string;
  word: string;
  partOfSpeech: string;
  definition: string;
  example?: string;
  synonyms: string[];
  antonyms: string[];
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  knowIt: boolean;
}
