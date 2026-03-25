"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useGetVocabularies } from "@/features/vocabularies/hooks/useGetVocabularies";
import DashboardLayout from "@/common/components/DashboardLayout";
import { 
  BookOpen, 
  Search, 
  Plus, 
  Loader2, 
  Sparkles, 
  ChevronDown,
  Layers,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Vocabulary } from "@/features/vocabularies/types";
import VocabularyDetailModal from "@/features/vocabularies/components/VocabularyDetailModal";

const VocabulariesPage = () => {
  const [activeTab, setActiveTab] = useState('vocabularies');
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [selectedVocab, setSelectedVocab] = useState<(Vocabulary & { category?: { name: string } }) | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const limit = 12;

  const { data, isLoading } = useGetVocabularies({
    page,
    limit,
    search,
    difficulty: difficulty === "all" ? undefined : difficulty,
    knowIt: status === "all" ? undefined : status === "know",
  });

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const difficultyColors: Record<string, string> = {
    BEGINNER: "bg-emerald-100 text-emerald-700 border-emerald-200",
    INTERMEDIATE: "bg-amber-100 text-amber-700 border-amber-200",
    ADVANCED: "bg-rose-100 text-rose-700 border-rose-200",
  };

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={handleLogout}
    >
      <div className="flex flex-col h-full max-w-6xl mx-auto space-y-6 p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <BookOpen className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-emerald-900">Vocabulary</h1>
              <p className="text-emerald-600/70">Manage all your words in one place</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
              <Input
                placeholder="Search words..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10 border-emerald-100 focus-visible:ring-emerald-500"
              />
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Select
                value={difficulty}
                onValueChange={(value) => {
                  setDifficulty(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[140px] border-emerald-100 focus:ring-emerald-500">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="BEGINNER">Beginner</SelectItem>
                  <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                  <SelectItem value="ADVANCED">Advanced</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={status}
                onValueChange={(value) => {
                  setStatus(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[140px] border-emerald-100 focus:ring-emerald-500">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="learning">Still Learning</SelectItem>
                  <SelectItem value="know">I Know This</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline"
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Learn Random
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px] rounded-xl border-emerald-100 p-2">
                <DropdownMenuItem asChild className="rounded-lg focus:bg-emerald-50 focus:text-emerald-700 cursor-pointer py-2.5">
                  <Link href="/review/flashcards?mode=random" className="flex items-center gap-3 w-full">
                    <Layers className="h-4 w-4" />
                    <span className="font-medium">Flashcards</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-lg focus:bg-emerald-50 focus:text-emerald-700 cursor-pointer py-2.5">
                  <Link href="/review/quiz?mode=random" className="flex items-center gap-3 w-full">
                    <GraduationCap className="h-4 w-4" />
                    <span className="font-medium">Quiz Mode</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
              asChild
            >
              <Link href="/vocabularies/new">
                <Plus className="h-4 w-4" />
                Add Word
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile Filters */}
        <div className="flex md:hidden items-center gap-2 overflow-x-auto pb-2">
          <Select
            value={difficulty}
            onValueChange={(value) => {
              setDifficulty(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="min-w-[130px] border-emerald-100 focus:ring-emerald-500">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="BEGINNER">Beginner</SelectItem>
              <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
              <SelectItem value="ADVANCED">Advanced</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="min-w-[130px] border-emerald-100 focus:ring-emerald-500">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="learning">Still Learning</SelectItem>
              <SelectItem value="know">I Know This</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : data?.data?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.data.map((vocab: Vocabulary & { category?: { name: string } }) => (
              <Card 
                key={vocab.id} 
                className="overflow-hidden border-emerald-100 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedVocab(vocab);
                  setIsModalOpen(true);
                }}
              >
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-emerald-900">{vocab.word}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${difficultyColors[vocab.difficulty] || ""}`}>
                      {vocab.difficulty}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-emerald-600 mb-2 italic">{vocab.partOfSpeech}</p>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{vocab.definition}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-emerald-50">
                    <span className="text-xs font-medium px-2 py-1 rounded bg-emerald-50 text-emerald-700">
                      {vocab.category?.name || "Uncategorized"}
                    </span>
                    <Link 
                      href={`/categories/${vocab.categoryId}`}
                      className="text-xs text-emerald-600 hover:underline font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Category
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 py-12 text-center bg-emerald-50/30 rounded-3xl border border-dashed border-emerald-200">
            <div className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-10 w-10 text-emerald-600/40" />
            </div>
            <h3 className="text-xl font-semibold text-emerald-900">No words found</h3>
            <p className="text-emerald-600/70 max-w-xs mt-2">
              {search ? "Try adjusting your search terms" : "Start adding some words to your vocabulary!"}
            </p>
          </div>
        )}

        {data?.meta?.totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-4">
             <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="border-emerald-100 text-emerald-700 hover:bg-emerald-50"
            >
              Previous
            </Button>
            <span className="flex items-center px-4 text-sm font-medium text-emerald-900">
              Page {page} of {data.meta.totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page === data.meta.totalPages}
              onClick={() => setPage(p => p + 1)}
              className="border-emerald-100 text-emerald-700 hover:bg-emerald-50"
            >
              Next
            </Button>
          </div>
        )}

        <VocabularyDetailModal 
          vocabulary={selectedVocab}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </DashboardLayout>
  );
};

export default VocabulariesPage;
