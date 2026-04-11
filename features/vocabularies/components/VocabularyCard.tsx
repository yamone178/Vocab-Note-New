import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { Vocabulary } from "@/features/vocabularies/types";

interface VocabularyCardProps {
  vocab: Vocabulary & { category?: { name: string } };
  onClick: () => void;
}

const difficultyStyles: Record<string, string> = {
  BEGINNER: "bg-emerald-50 text-emerald-700 border-emerald-200",
  INTERMEDIATE: "bg-amber-50 text-amber-700 border-amber-200",
  ADVANCED: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function VocabularyCard({ vocab, onClick }: VocabularyCardProps) {
  return (
    <Card
      className="group overflow-hidden border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200 cursor-pointer rounded-2xl bg-white"
      onClick={onClick}
    >
      <CardContent className="p-5 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3 gap-2">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
              {vocab.word}
            </h3>
            <span className="text-xs font-medium text-gray-500 lowercase">
              {vocab.partOfSpeech}
            </span>
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-1 rounded-md border uppercase tracking-wider whitespace-nowrap ${
              difficultyStyles[vocab.difficulty] || ""
            }`}
          >
            {vocab.difficulty}
          </span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
          {vocab.definition}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 text-gray-600 border border-gray-100">
            <BookOpen className="h-3 w-3 text-gray-400" />
            <span className="text-xs font-medium truncate max-w-[120px]">
              {vocab.category?.name || "Uncategorized"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
