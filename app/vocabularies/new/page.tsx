"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useCreateVocabulary } from "@/features/vocabularies/hooks/useCreateVocabulary";
import VocabularyForm from "@/features/vocabularies/components/VocabularyForm";
import { VocabularySchema } from "@/features/vocabularies/schemas/vocabulary-schema";
import DashboardLayout from "@/common/components/DashboardLayout";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const GlobalNewVocabularyPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('vocabularies');
  const { mutate, isPending } = useCreateVocabulary();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const onSubmit = (values: VocabularySchema) => {
    mutate(values, {
      onSuccess: () => {
        router.push("/vocabularies");
      },
    });
  };

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={handleLogout}
    >
      <div className="flex flex-col h-full max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full hover:bg-emerald-50"
          >
            <ChevronLeft className="h-6 w-6 text-emerald-600" />
          </Button>
          <h1 className="text-3xl font-bold text-emerald-900">Add New Word</h1>
        </div>
        
        <div className="flex-1 min-h-0">
          <VocabularyForm
            onSubmit={onSubmit}
            isPending={isPending}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GlobalNewVocabularyPage;
