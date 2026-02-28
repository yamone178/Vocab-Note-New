import { Sparkles } from "lucide-react";

interface DailySuggestionsProps {
  selectedWord: string | null;
  setSelectedWord: (word: string | null) => void;
}

export default function DailySuggestions({ selectedWord, setSelectedWord }: DailySuggestionsProps) {
  return (
    <div className="animate-fadeInUp d6 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-50 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
      <div className="mb-1.5 flex items-center gap-2 text-emerald-600">
        <Sparkles size={18} />
        <span className="text-[0.97rem] font-bold text-emerald-900">Daily Suggestion</span>
      </div>
      <p className="mb-4 text-[0.86rem] text-emerald-700">Based on your proficiency, here are today's recommended words to learn:</p>
      <div className="flex flex-wrap gap-2.5">
        {['ephemeral', 'ubiquitous', 'pragmatic'].map((word) => (
          <button
            key={word}
            onClick={() => setSelectedWord(selectedWord === word ? null : word)}
            className={`rounded-full border px-4 py-2 text-[0.875rem] font-medium transition-all duration-200 hover:-translate-y-0.5
              ${selectedWord === word
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-emerald-800 border-emerald-200 hover:border-emerald-300 hover:shadow-[0_3px_10px_rgba(16,185,129,0.15)]'}`}
          >
            {word}
          </button>
        ))}
      </div>
    </div>
  );
}