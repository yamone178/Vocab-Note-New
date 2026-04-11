"use client";

import { useState, useEffect } from "react";
import { Sparkles, Check, BookmarkPlus, Loader2 } from "lucide-react";

interface DailySuggestionsProps {
  selectedWord: string | null;
  setSelectedWord: (word: string | null) => void;
}

interface Recommendation {
  word: string;
  meaning: string;
  example: string;
}

export default function DailySuggestions({ selectedWord, setSelectedWord }: DailySuggestionsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const res = await fetch("/api/recommendations");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setRecommendations(data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, []);

  const handleInteraction = async (word: string, type: "VIEW" | "SAVE" | "MASTERED") => {
    try {
      await fetch("/api/interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vocabularyWord: word, interactionType: type }),
      });
      if (type !== "VIEW") {
        alert(`Word ${word} marked as ${type.toLowerCase()}`);
      }
    } catch (error) {
      console.error("Failed to save interaction", error);
    }
  };

  const toggleWord = (word: string) => {
    const isSelecting = selectedWord !== word;
    setSelectedWord(isSelecting ? word : null);
    if (isSelecting) {
      handleInteraction(word, "VIEW");
    }
  };

  const activeRecommendation = recommendations.find(r => r.word === selectedWord);

  return (
    <div className="animate-fadeInUp d6 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-50 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
      <div className="mb-1.5 flex items-center gap-2 text-emerald-600">
        <Sparkles size={18} />
        <span className="text-[0.97rem] font-bold text-emerald-900">Daily Suggestions</span>
      </div>
      <p className="mb-4 text-[0.86rem] text-emerald-700">Recommended based on what similar learners are studying:</p>
      
      {loading ? (
        <div className="flex items-center gap-2 text-emerald-600">
          <Loader2 className="animate-spin" size={16} />
          <span className="text-sm">Loading recommendations...</span>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="text-sm text-emerald-600">No new recommendations available today.</div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2.5">
            {recommendations.map(({ word }) => (
              <button
                key={word}
                onClick={() => toggleWord(word)}
                className={`rounded-full border px-4 py-2 text-[0.875rem] font-medium transition-all duration-200 hover:-translate-y-0.5
                  ${selectedWord === word
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-emerald-800 border-emerald-200 hover:border-emerald-300 hover:shadow-[0_3px_10px_rgba(16,185,129,0.15)]'}`}
              >
                {word}
              </button>
            ))}
          </div>

          {activeRecommendation && (
            <div className="mt-2 rounded-xl bg-white/60 p-4 border border-emerald-100">
              <h4 className="font-bold text-emerald-900 text-lg mb-1">{activeRecommendation.word}</h4>
              <p className="text-sm text-emerald-800 mb-2 font-medium">{activeRecommendation.meaning}</p>
              {activeRecommendation.example && (
                <p className="text-sm text-emerald-600 italic border-l-2 border-emerald-300 pl-2 mb-4">
                  &quot;{activeRecommendation.example}&quot;
                </p>
              )}
              
              <div className="flex gap-2">
                <button 
                  onClick={() => handleInteraction(activeRecommendation.word, "SAVE")}
                  className="flex items-center gap-1.5 text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-3 py-1.5 rounded-md font-medium transition-colors"
                >
                  <BookmarkPlus size={14} />
                  Save
                </button>
                <button 
                  onClick={() => handleInteraction(activeRecommendation.word, "MASTERED")}
                  className="flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md font-medium transition-colors"
                >
                  <Check size={14} />
                  Mark as Learned
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
