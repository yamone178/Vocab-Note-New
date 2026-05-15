"use client";

import { useState, useEffect } from "react";
import { Sparkles, Check, BookmarkPlus, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

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

  const handleInteraction = async (word: string, type: "VIEW" | "SAVE" | "MASTERED", activeRecommendation?: Recommendation) => {
    try {
      await fetch("/api/interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vocabularyWord: word, interactionType: type }),
      });
      
      if (type === "SAVE" || type === "MASTERED") {
        if (activeRecommendation) {
          // Add to vocabulary
          const res = await fetch("/api/vocabularies", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              word: activeRecommendation.word,
              definition: activeRecommendation.meaning,
              example: activeRecommendation.example,
              partOfSpeech: "noun", // Defaulting as we don't have this from recommendations endpoint
              difficulty: "BEGINNER", // Defaulting
            }),
          });
          
          if (res.ok) {
             if (type === "MASTERED") {
               toast.success(`Word "${word}" marked as learned!`);
             } else {
               toast.success(`Word "${word}" saved to your vocabulary!`);
             }
             // Invalidate vocabulary queries to update counts and lists
             queryClient.invalidateQueries({ queryKey: ["vocabularies"] });
             // Optionally remove from recommendations list locally so user knows it's saved
             setRecommendations((prev) => prev.filter((r) => r.word !== word));
          } else {
             toast.error(`Failed to save "${word}" to vocabulary.`);
          }
        }
      }
    } catch (error) {
      console.error("Failed to save interaction", error);
      if (type !== "VIEW") {
        toast.error("An error occurred while saving the word.");
      }
    }
  };

  const toggleWord = (word: string) => {
    setSelectedWord(word);
    handleInteraction(word, "VIEW");
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
                className={`rounded-full border px-4 py-2 text-[0.875rem] font-medium transition-all duration-200 hover:-translate-y-0.5 bg-white text-emerald-800 border-emerald-200 hover:border-emerald-300 hover:shadow-[0_3px_10px_rgba(16,185,129,0.15)]`}
              >
                {word}
              </button>
            ))}
          </div>

          <Dialog open={!!selectedWord} onOpenChange={(open) => !open && setSelectedWord(null)}>
            <DialogContent className="sm:max-w-[425px] bg-white">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-emerald-900">{activeRecommendation?.word}</DialogTitle>
                <DialogDescription className="text-emerald-700 font-medium text-base mt-2">
                  {activeRecommendation?.meaning}
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                {activeRecommendation?.example && (
                  <p className="text-sm text-emerald-800 italic border-l-4 border-emerald-400 pl-3 bg-emerald-50 py-2 rounded-r-md">
                    &quot;{activeRecommendation.example}&quot;
                  </p>
                )}
              </div>
              
              <div className="flex gap-3 justify-end pt-2 border-t border-emerald-100">
                <button 
                  onClick={() => {
                    if (activeRecommendation) handleInteraction(activeRecommendation.word, "SAVE", activeRecommendation);
                    setSelectedWord(null);
                  }}
                  className="flex items-center gap-1.5 text-sm bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-4 py-2 rounded-md font-medium transition-colors"
                >
                  <BookmarkPlus size={16} />
                  Save
                </button>
                <button 
                  onClick={() => {
                    if (activeRecommendation) handleInteraction(activeRecommendation.word, "MASTERED", activeRecommendation);
                    setSelectedWord(null);
                  }}
                  className="flex items-center gap-1.5 text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  <Check size={16} />
                  Mark as Learned
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
