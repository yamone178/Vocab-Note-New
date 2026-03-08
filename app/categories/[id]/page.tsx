"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LoadingSpinner,
  LandingPage,
  DashboardLayout,
} from "@/common/components";
import CreateVocabulary from "@/features/vocabularies/components/CreateVocabulary";
import { Plus, BookOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetVocabularies } from "@/features/vocabularies/hooks/useGetVocabularies";
import { Vocabulary } from "@/features/vocabularies/types";

function VocabularyContent({ categoryId }: { categoryId: string }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficulty, setDifficulty] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");

  const { data, isLoading } = useGetVocabularies({
    categoryId,
    page: 1,
    limit: 100, // Fetch all for now
    search: searchTerm,
    difficulty: difficulty === "all" ? undefined : difficulty,
    knowIt: status === "all" ? undefined : status === "know",
  });

  const vocabularies = data?.data || [];
  const category = data?.category;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[2rem] font-extrabold leading-tight tracking-[-0.04em] text-gray-900">
            {category?.name}
          </h1>
          <p className="mt-1 text-[0.93rem] text-gray-500">
            {category?._count?.vocabularies} words in this category
          </p>
        </div>
        <CreateVocabulary categoryId={categoryId} />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <Input
            placeholder="Search vocabulary..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-emerald-200 focus:border-emerald-400"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <Select
            value={difficulty}
            onValueChange={(value) => setDifficulty(value)}
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
            onValueChange={(value) => setStatus(value)}
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
      </div>

        {/* Vocabulary List */}
        <div className="space-y-4">
            {vocabularies.map((vocab: Vocabulary) => (
                <div key={vocab.id} className="rounded-2xl border border-gray-200 bg-white p-6">
                    <div className="flex items-center mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{vocab.word}</h3>
                        <span className="ml-2 text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{vocab.partOfSpeech}</span>
                    </div>
                    <p className="text-sm text-gray-600">{vocab.definition}</p>
                </div>
            ))}
        </div>

        {/* Pagination removed */}
    </div>
  );
}

export default function VocabularyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = useState("vocabulary");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/");
      return;
    }
  }, [session, status, router]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (!session) {
    return <LandingPage />;
  }

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={handleLogout}
    >
      <VocabularyContent categoryId={params.id as string} />
    </DashboardLayout>
  );
}
