'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import DashboardLayout from "@/common/components/DashboardLayout";
import { 
  ChevronLeft, 
  CheckCircle2, 
  XCircle,
  Loader2,
  Trophy,
  ArrowRight,
  RefreshCcw,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetQuiz } from "@/features/vocabularies/hooks/useGetQuiz";
import { useReviewVocabulary } from "@/features/vocabularies/hooks/useReviewVocabulary";

const QuizPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "due";

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [incorrectWords, setIncorrectWords] = useState<string[]>([]);

  const { data, isLoading, isError, error, refetch } = useGetQuiz(mode);
  const { mutate: review } = useReviewVocabulary();

  const questions = data?.data || [];

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption || isAnswered) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore(prev => prev + 1);
    } else {
      setIncorrectWords(prev => [...prev, currentQuestion.word]);
      // Flag incorrect word for review (FR6)
      review({ id: currentQuestion.id, data: { remembered: false } });
    }

    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
    setIncorrectWords([]);
    refetch();
  };

  if (isLoading) {
    return (
      <DashboardLayout activeTab="review" setActiveTab={() => {}} onLogout={handleLogout}>
        <div className="flex h-[calc(100vh-120px)] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (isError || (data && questions.length === 0)) {
    return (
      <DashboardLayout activeTab="review" setActiveTab={() => {}} onLogout={handleLogout}>
        <div className="flex flex-col h-[calc(100vh-120px)] items-center justify-center text-center p-6">
          <div className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-emerald-900 mb-2">
            {mode === "due" ? "All caught up!" : "No words found"}
          </h2>
          <p className="text-emerald-600/70 mb-6">
            {mode === "due" 
              ? "You have no vocabulary words due for review right now." 
              : "Start adding some words to your vocabulary first!"}
          </p>
          <Button onClick={() => router.push("/vocabularies/new")} className="bg-emerald-600 hover:bg-emerald-700">
            Add New Word
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <DashboardLayout activeTab="review" setActiveTab={() => {}} onLogout={handleLogout}>
        <div className="max-w-2xl mx-auto py-12">
          <Card className="border-none shadow-xl bg-white rounded-[40px] overflow-hidden">
            <CardContent className="p-12 text-center space-y-8">
              <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-emerald-100 text-emerald-600">
                <Trophy className="h-12 w-12" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-4xl font-black text-gray-900">Quiz Completed!</h1>
                <p className="text-xl text-gray-500 font-medium">Here&apos;s how you performed today</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-8 rounded-[32px] bg-emerald-50 border border-emerald-100">
                  <p className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-1">Correct</p>
                  <p className="text-4xl font-black text-emerald-700">{score}</p>
                </div>
                <div className="p-8 rounded-[32px] bg-red-50 border border-red-100">
                  <p className="text-sm font-bold text-red-600 uppercase tracking-wider mb-1">Incorrect</p>
                  <p className="text-4xl font-black text-red-700">{questions.length - score}</p>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center px-2">
                  <span className="text-lg font-bold text-gray-900">Final Score</span>
                  <span className="text-2xl font-black text-emerald-600">{percentage}%</span>
                </div>
                <div className="h-4 rounded-full bg-gray-100 overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-500" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {incorrectWords.length > 0 && (
                <div className="pt-6 text-left">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Words to Review:</h3>
                  <div className="flex flex-wrap gap-2">
                    {incorrectWords.map((word, i) => (
                      <span key={i} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <Button 
                  onClick={handleRestart}
                  className="flex-1 h-16 rounded-3xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg gap-2"
                >
                  <RefreshCcw className="h-5 w-5" />
                  Try Again
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => router.push('/review')}
                  className="flex-1 h-16 rounded-3xl border-gray-200 text-gray-700 font-bold text-lg"
                >
                  Back to Review
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <DashboardLayout activeTab="review" setActiveTab={() => {}} onLogout={handleLogout}>
      <div className="max-w-3xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="rounded-full h-12 w-12 p-0 hover:bg-white shadow-sm"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </Button>
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-1">Vocabulary Quiz</span>
            <span className="text-lg font-black text-gray-900">Question {currentQuestionIndex + 1} of {questions.length}</span>
          </div>
          <div className="w-12" /> {/* Spacer */}
        </div>

        <div className="h-2 mb-12 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-500" 
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question Card */}
        <Card className="border-none shadow-xl bg-white rounded-[40px] overflow-hidden mb-8">
          <CardContent className="p-10 text-center">
            <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-4">What is the meaning of</h2>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-2">&quot;{currentQuestion.word}&quot;</h1>
          </CardContent>
        </Card>

        {/* Options */}
        <div className="space-y-4 mb-12">
          {currentQuestion.options.map((option: string, index: number) => {
            let variantClass = "bg-white border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30";
            let icon = null;

            if (isAnswered) {
              if (option === currentQuestion.correctAnswer) {
                variantClass = "bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-500/20";
                icon = <CheckCircle2 className="h-6 w-6 text-emerald-600" />;
              } else if (selectedOption === option) {
                variantClass = "bg-red-50 border-red-500 text-red-700 ring-2 ring-red-500/20";
                icon = <XCircle className="h-6 w-6 text-red-600" />;
              } else {
                variantClass = "bg-white border-gray-100 opacity-50";
              }
            } else if (selectedOption === option) {
              variantClass = "bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-500/20";
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                disabled={isAnswered}
                className={`w-full p-6 text-left rounded-[28px] border-2 transition-all duration-200 flex items-center justify-between group ${variantClass}`}
              >
                <span className="text-lg font-bold leading-tight">{option}</span>
                {icon}
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-center">
          {!isAnswered ? (
            <Button
              onClick={handleSubmitAnswer}
              disabled={!selectedOption}
              className="h-16 px-12 rounded-3xl bg-gray-900 hover:bg-black text-white font-bold text-lg shadow-xl shadow-gray-200 disabled:opacity-50"
            >
              Check Answer
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="h-16 px-12 rounded-3xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-xl shadow-emerald-200 flex items-center gap-2"
            >
              {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              <ArrowRight className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default QuizPage;
