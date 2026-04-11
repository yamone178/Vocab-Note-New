
"use client";

import { useState, useRef } from "react"; // Import useRef
import { useRouter, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import DashboardLayout from "@/common/components/DashboardLayout";
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCw, 
  X, 
  Check, 
  Sparkles,
  HelpCircle,
  Loader2,
  Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetDueVocabularies } from "@/features/vocabularies/hooks/useGetDueVocabularies";
import { useGetRandomVocabularies } from "@/features/vocabularies/hooks/useGetRandomVocabularies";
import { useReviewVocabulary } from "@/features/vocabularies/hooks/useReviewVocabulary";
import XpAnimation from "@/common/components/XpAnimation"; // Import XpAnimation

const XP_AMOUNT_REVIEW_FLASHCARD = 2;

interface XpAnimationState {
  xp: number;
  top: number;
  left: number;
  show: boolean;
}

const FlashcardPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const isRandomMode = mode === "random";

  const [activeTab, setActiveTab] = useState("review");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [reviewStats, setReviewStats] = useState({
    remembered: 0,
    forgot: 0,
    mastered: 0
  });
  const [xpAnimation, setXpAnimation] = useState<XpAnimationState | null>(null); // State for XP animation

  const rememberedButtonRef = useRef<HTMLButtonElement>(null); // Ref for remembered button
  const masteredButtonRef = useRef<HTMLButtonElement>(null); // Ref for mastered button

  const { data: dueCardsData, isLoading: isDueLoading, error: isDueError } = useGetDueVocabularies();
  const { data: randomCardsData, isLoading: isRandomLoading, error: isRandomError } = useGetRandomVocabularies(10);
  
  const isLoading = isRandomMode ? isRandomLoading : isDueLoading;
  const isError = isRandomMode ? isRandomError : isDueError;
  const cardsData = isRandomMode ? randomCardsData : dueCardsData;

  const { mutateAsync: review } = useReviewVocabulary();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const cards = cardsData?.data || [];

  const handleNext = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const handleXpEarned = (xpAmount: number, targetRect: { top: number; left: number; width: number; height: number; }) => {
    setXpAnimation({
      xp: xpAmount,
      top: targetRect.top - 20,
      left: targetRect.left + targetRect.width / 2 - 20,
      show: true,
    });
  };

  const handleReviewUpdate = async (remembered: boolean, mastered: boolean = false, buttonRef?: React.RefObject<HTMLButtonElement | null>) => {
    const currentCard = cards[currentCardIndex];
    if (currentCard) {
      try {
        await review({ id: currentCard.id, data: { remembered, mastered } });
        
        // Update stats
        setReviewStats(prev => ({
          remembered: prev.remembered + (remembered && !mastered ? 1 : 0),
          forgot: prev.forgot + (!remembered ? 1 : 0),
          mastered: prev.mastered + (mastered ? 1 : 0)
        }));

        // Show XP animation
        if (buttonRef?.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          handleXpEarned(XP_AMOUNT_REVIEW_FLASHCARD, rect);
        }

        if (currentCardIndex < cards.length - 1) {
          setCurrentCardIndex(prev => prev + 1);
        } else {
          setIsCompleted(true);
        }
        setIsFlipped(false);
      } catch (err) {
        console.error("Failed to update review status", err);
      }
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
        <div className="flex h-[calc(100vh-120px)] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (isCompleted) {
    return (
      <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
        <div className="relative flex flex-col h-[calc(100vh-120px)] items-center justify-center text-center p-6 max-w-2xl mx-auto"> {/* Add relative for animation */}
          <div className="h-24 w-24 bg-emerald-100 rounded-full flex items-center justify-center mb-8">
            <Trophy className="h-12 w-12 text-emerald-600" />
          </div>
          <h2 className="text-4xl font-black text-emerald-900 mb-4 tracking-tight">Review Completed!</h2>
          <p className="text-emerald-600/70 text-lg mb-12">Great job! Here's how you did in this session:</p>
          
          <div className="grid grid-cols-3 gap-6 w-full mb-12">
            <div className="p-6 bg-emerald-50 rounded-[32px] border border-emerald-100">
              <div className="text-3xl font-black text-emerald-600 mb-1">{reviewStats.remembered}</div>
              <div className="text-sm font-bold text-emerald-600/60 uppercase tracking-wider">Remembered</div>
            </div>
            <div className="p-6 bg-orange-50 rounded-[32px] border border-orange-100">
              <div className="text-3xl font-black text-orange-600 mb-1">{reviewStats.forgot}</div>
              <div className="text-sm font-bold text-orange-600/60 uppercase tracking-wider">Forgot</div>
            </div>
            <div className="p-6 bg-indigo-50 rounded-[32px] border border-indigo-100">
              <div className="text-3xl font-black text-indigo-600 mb-1">{reviewStats.mastered}</div>
              <div className="text-sm font-bold text-indigo-600/60 uppercase tracking-wider">Mastered</div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={() => {
                setIsCompleted(false);
                setCurrentCardIndex(0);
                setReviewStats({ remembered: 0, forgot: 0, mastered: 0 });
                router.refresh();
              }} 
              className="h-14 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-lg font-bold"
            >
              Review Again
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push("/vocabularies")} 
              className="h-14 px-8 rounded-2xl border-emerald-100 text-emerald-700 text-lg font-bold"
            >
              Back to Vocabulary
            </Button>
          </div>

          {xpAnimation?.show && (
            <XpAnimation
              xp={xpAnimation.xp}
              top={xpAnimation.top}
              left={xpAnimation.left}
              onComplete={() => setXpAnimation(null)}
            />
          )}

        </div>
      </DashboardLayout>
    );
  }

  if (isError || cards.length === 0) {
    return (
      <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
        <div className="flex flex-col h-[calc(100vh-120px)] items-center justify-center text-center p-6">
          <div className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
            <Check className="h-10 w-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-emerald-900 mb-2">
            {isRandomMode ? "No words found" : "All caught up!"}
          </h2>
          <p className="text-emerald-600/70 mb-6">
            {isRandomMode 
              ? "Start adding some words to your vocabulary first!" 
              : "You have no vocabulary words due for review right now."}
          </p>
          <Button onClick={() => router.push("/vocabularies/new")} className="bg-emerald-600 hover:bg-emerald-700">
            Add New Word
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const currentCard = cards[currentCardIndex] || cards[0];
  const progressPercent = ((currentCardIndex + 1) / cards.length) * 100;

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={handleLogout}
    >
      <div className="relative max-w-5xl mx-auto h-[calc(100vh-120px)] flex flex-col p-4 md:p-6"> {/* Added relative for animation */}
        {/* Progress Bar Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1 max-w-md">
            <div className="flex justify-between text-sm font-bold text-gray-900 mb-2">
              <span>Card {currentCardIndex + 1} of {cards.length}</span>
            </div>
            <div className="h-2 w-full bg-emerald-50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-300" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <div className="text-sm font-bold text-gray-400">
            {Math.round(progressPercent)}% Complete
          </div>
        </div>

        {/* Main Flashcard Container */}
        <div className="flex-1 flex flex-col items-center justify-center relative perspective-1000">
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className={`w-full max-w-3xl aspect-[1.6/1] cursor-pointer transition-all duration-500 preserve-3d relative ${isFlipped ? "rotate-y-180" : ""}`}
          >
            {/* Front of Card */}
            <div className="absolute inset-0 backface-hidden bg-white rounded-[40px] shadow-sm border border-emerald-50 flex flex-col items-center justify-center p-12 text-center overflow-hidden">
               {/* Decorative Background Gradient */}
               <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-emerald-50/30 -z-10" />
               
               <div className="flex items-center gap-2 text-emerald-600 font-bold mb-8">
                 <Sparkles className="h-4 w-4" />
                 <span>{currentCard.category?.name || "Vocabulary"}</span>
               </div>
               
               <h2 className="text-7xl font-black text-emerald-900 mb-8 tracking-tight">
                 {currentCard.word}
               </h2>
               
               <div className="px-6 py-2 bg-emerald-50 text-emerald-600 rounded-full font-bold mb-12">
                 {currentCard.partOfSpeech}
               </div>
               
               <div className="flex items-center gap-2 text-gray-400 font-medium">
                 <RotateCw className="h-4 w-4" />
                 <span>Click to reveal definition</span>
               </div>
            </div>

            {/* Back of Card */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-[40px] shadow-sm border border-emerald-50 flex flex-col items-center justify-center p-12 text-center">
               <div className="flex items-center gap-2 text-emerald-600 font-bold mb-6">
                 <Sparkles className="h-4 w-4" />
                 <span>Definition</span>
               </div>
               
               <p className="text-3xl font-bold text-gray-800 leading-tight max-w-2xl">
                 {currentCard.definition}
               </p>

               {currentCard.example && (
                 <div className="mt-6 p-4 bg-emerald-50 rounded-2xl italic text-emerald-700">
                    "{currentCard.example}"
                 </div>
               )}
               
               <div className="mt-8 flex items-center gap-2 text-gray-400 font-medium">
                 <RotateCw className="h-4 w-4" />
                 <span>Click to see word</span>
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="flex items-center justify-center gap-4 mt-12 mb-8 flex-wrap">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentCardIndex === 0}
            className="h-16 px-6 rounded-3xl text-gray-400 font-bold text-lg hover:bg-gray-50 disabled:opacity-30"
          >
            <ChevronLeft className="mr-2 h-6 w-6" />
            Previous
          </Button>

          <Button
            className="h-16 px-8 rounded-3xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg gap-2 shadow-lg shadow-orange-100"
            onClick={(e) => {
              e.stopPropagation();
              handleReviewUpdate(false);
            }}
          >
            <X className="h-6 w-6" />
            Forgot
          </Button>

          <Button
            ref={rememberedButtonRef} // Attach ref
            className="h-16 px-8 rounded-3xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg gap-2 shadow-lg shadow-emerald-100"
            onClick={(e) => {
              e.stopPropagation();
              handleReviewUpdate(true, false, rememberedButtonRef); // Pass button ref
            }}
          >
            <Check className="h-6 w-6" />
            Remembered
          </Button>

          <Button
            ref={masteredButtonRef} // Attach ref
            className="h-16 px-8 rounded-3xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-lg gap-2 shadow-lg shadow-indigo-100"
            onClick={(e) => {
              e.stopPropagation();
              handleReviewUpdate(true, true, masteredButtonRef); // Pass button ref
            }}
          >
            <Trophy className="h-6 w-6" />
            Mastered
          </Button>

          <Button
            variant="outline"
            onClick={handleNext}
            disabled={currentCardIndex === cards.length - 1}
            className="h-16 px-6 rounded-3xl border-gray-100 text-gray-900 font-bold text-lg hover:bg-gray-50 shadow-sm"
          >
            Skip
            <ChevronRight className="ml-2 h-6 w-6" />
          </Button>
        </div>

        {xpAnimation?.show && (
          <XpAnimation
            xp={xpAnimation.xp}
            top={xpAnimation.top}
            left={xpAnimation.left}
            onComplete={() => setXpAnimation(null)}
          />
        )}

        {/* Floating Help Button */}
        <button className="fixed bottom-8 right-8 h-12 w-12 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-lg">
          <HelpCircle className="h-6 w-6" />
        </button>
      </div>

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </DashboardLayout>
  );
};

export default FlashcardPage;
