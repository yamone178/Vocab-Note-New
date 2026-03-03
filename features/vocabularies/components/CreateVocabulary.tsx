"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CreateVocabularyProps {
  categoryId: string;
}

const CreateVocabulary = ({ categoryId }: CreateVocabularyProps) => {
  return (
    <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg">
      <Link href={`/categories/${categoryId}/vocabularies/new`}>
        <Plus size={16} className="mr-2" />
        Add Word
      </Link>
    </Button>
  );
};

export default CreateVocabulary;
