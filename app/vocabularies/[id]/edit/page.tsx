"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/common/components/DashboardLayout";
import VocabularyForm from "@/features/vocabularies/components/VocabularyForm";
import { useGetVocabulary } from "@/features/vocabularies/hooks/useGetVocabulary";
import { useUpdateVocabulary } from "@/features/vocabularies/hooks/useUpdateVocabulary";
import { VocabularySchema } from "@/features/vocabularies/schemas/vocabulary-schema";

import { use } from "react";
export default function EditVocabularyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data, isLoading } = useGetVocabulary(resolvedParams.id);
  const { mutate: updateVocabulary, isPending } = useUpdateVocabulary();

  const [activeTab, setActiveTab] = useState("vocabularies");

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  
  const handleUpdate = (values: VocabularySchema) => {
    updateVocabulary(
      { id: resolvedParams.id, ...values },
      {
        onSuccess: () => {
          router.refresh();
          router.back();
        },
      }
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
        <div className="flex justify-center items-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      </DashboardLayout>
    );
  }

  if (!data?.data) {
    return (
      <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
        <div className="flex flex-col justify-center items-center h-full space-y-4">
          <h2 className="text-xl font-bold">Vocabulary not found</h2>
          <Button onClick={() => router.back()} variant="outline">
            Go back
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const vocabulary = data.data;

  const initialValues: Partial<VocabularySchema> = {
    word: vocabulary.word,
    partOfSpeech: vocabulary.partOfSpeech,
    definition: vocabulary.definition,
    categoryId: vocabulary.categoryId,
    difficulty: vocabulary.difficulty,
    example: vocabulary.example || "",
    synonyms: vocabulary.synonyms ? vocabulary.synonyms.join(", ") : "",
    antonyms: vocabulary.antonyms ? vocabulary.antonyms.join(", ") : "",
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-xl hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
              Edit Vocabulary
            </h1>
            <p className="text-slate-500 mt-1">
              Update meaning, examples, or category.
            </p>
          </div>
        </div>

        <VocabularyForm
          initialValues={initialValues}
          onSubmit={handleUpdate}
          isPending={isPending}
          isEdit={true}
        />
      </div>
    </DashboardLayout>
  );
}
