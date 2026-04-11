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
  GraduationCap,
  Filter
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
import VocabularyCard from "@/features/vocabularies/components/VocabularyCard";

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

  // Matched to the soft UI colors from the Vocabulary Form
  const difficultyStyles: Record<string, string> = {
    BEGINNER: "bg-emerald-50 text-emerald-700 border-emerald-200",
    INTERMEDIATE: "bg-amber-50 text-amber-700 border-amber-200",
    ADVANCED: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={handleLogout}
    >
      <div className="flex flex-col h-full max-w-6xl mx-auto space-y-6 p-4 md:p-8">
        
        {/* Header & Primary Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Vocabulary</h1>
              <p className="text-sm text-gray-500">Manage all your words in one place</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline"
                  className="flex-1 sm:flex-none h-11 border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium"
                >
                  <Sparkles className="mr-2 h-4 w-4 text-emerald-500" />
                  Practice
                  <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl border-gray-100 p-1.5 shadow-lg">
                <DropdownMenuItem asChild className="rounded-lg focus:bg-emerald-50 focus:text-emerald-700 cursor-pointer py-2.5">
                  <Link href="/review/flashcards?mode=random" className="flex items-center gap-3 w-full">
                    <Layers className="h-4 w-4 text-emerald-600" />
                    <span className="font-medium">Flashcards</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-lg focus:bg-emerald-50 focus:text-emerald-700 cursor-pointer py-2.5">
                  <Link href="/review/quiz?mode=random" className="flex items-center gap-3 w-full">
                    <GraduationCap className="h-4 w-4 text-emerald-600" />
                    <span className="font-medium">Quiz Mode</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              className="flex-1 sm:flex-none h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm transition-all rounded-xl"
              asChild
            >
              <Link href="/vocabularies/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Word
              </Link>
            </Button>
          </div>
        </div>

        {/* Search & Filters Toolbar */}
        <div className="flex flex-col md:flex-row gap-3 bg-gray-50/50 p-2 md:p-3 rounded-2xl border border-gray-100">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search words, meanings..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-11 pl-10 border-gray-200 bg-white rounded-xl focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
            <div className="md:hidden flex items-center justify-center px-2 text-gray-400">
              <Filter className="h-4 w-4" />
            </div>
            <Select
              value={difficulty}
              onValueChange={(value) => {
                setDifficulty(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-11 min-w-[140px] border-gray-200 bg-white rounded-xl focus:ring-emerald-500/20 focus:border-emerald-500">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-100 shadow-lg">
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
              <SelectTrigger className="h-11 min-w-[140px] border-gray-200 bg-white rounded-xl focus:ring-emerald-500/20 focus:border-emerald-500">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-100 shadow-lg">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="learning">Still Learning</SelectItem>
                <SelectItem value="know">I Know This</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content Grid */}
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center min-h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          </div>
        ) : data?.data?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.data.map((vocab: Vocabulary & { category?: { name: string } }) => (
              <VocabularyCard
                key={vocab.id}
                vocab={vocab}
                onClick={() => {
                  setSelectedVocab(vocab);
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 py-16 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
            <div className="h-16 w-16 bg-white border border-gray-100 shadow-sm rounded-2xl flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No words found</h3>
            <p className="text-sm text-gray-500 max-w-sm mt-1">
              {search ? "We couldn't find any words matching your search filters." : "Your vocabulary list is empty. Start adding some words!"}
            </p>
            {!search && (
              <Button 
                variant="outline" 
                className="mt-6 border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl"
                onClick={() => document.querySelector('a[href="/vocabularies/new"]')?.dispatchEvent(new MouseEvent('click'))}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Your First Word
              </Button>
            )}
          </div>
        )}

        {/* Pagination */}
        {data?.meta?.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 pt-6 border-t border-gray-100">
             <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="h-10 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              Previous
            </Button>
            <span className="text-sm font-medium text-gray-500">
              Page <span className="text-gray-900">{page}</span> of {data.meta.totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page === data.meta.totalPages}
              onClick={() => setPage(p => p + 1)}
              className="h-10 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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