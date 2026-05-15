"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CategoryForm from "./CategoryForm";
import { useCreateCategory } from "../hooks/useCreateCategories";
import { Button } from "@/components/ui/button";
import { CategorySchema } from "../schemas/category-schema";
import { PlusCircle } from "lucide-react";

const CreateCategory = () => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateCategory();

  const onSubmit = (values: CategorySchema) => {
    mutate(values, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
        className="flex-1 sm:flex-none h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm transition-all rounded-xl"
        >
          <PlusCircle className=" h-4 w-4" />
          Add Category
          
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
        </DialogHeader>
        <CategoryForm onSubmit={onSubmit} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategory;
