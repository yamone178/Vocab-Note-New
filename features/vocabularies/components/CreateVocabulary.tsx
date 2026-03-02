"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import VocabularyForm from "./VocabularyForm";
import { useCreateVocabulary } from "../hooks/useCreateVocabulary";
import { Button } from "@/components/ui/button";
import { VocabularySchema } from "../schemas/vocabulary-schema";
import { Plus } from "lucide-react";

interface CreateVocabularyProps {
    categoryId: string;
}

const CreateVocabulary = ({ categoryId }: CreateVocabularyProps) => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateVocabulary();

  const onSubmit = (values: VocabularySchema) => {
    mutate(
      { ...values, categoryId },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg">
          <Plus size={16} className="mr-2" />
          Add Word
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Add New Word</DialogTitle>
        </DialogHeader>
        <VocabularyForm onSubmit={onSubmit} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateVocabulary;
