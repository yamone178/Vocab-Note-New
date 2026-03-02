"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  VocabularySchema,
  vocabularySchema,
} from "@/features/vocabularies/schemas/vocabulary-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface VocabularyFormProps {
  onSubmit: (values: VocabularySchema) => void;
  initialValues?: VocabularySchema;
  isPending?: boolean;
}

const VocabularyForm = ({
  onSubmit,
  initialValues,
  isPending,
}: VocabularyFormProps) => {
  const form = useForm<VocabularySchema>({
    resolver: zodResolver(vocabularySchema),
    defaultValues: initialValues || {
      word: "",
      partOfSpeech: "",
      definition: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="word"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Word</FormLabel>
              <FormControl>
                <Input placeholder="Enter the word" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="partOfSpeech"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Part of Speech</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Noun, Verb, Adjective" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="definition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Definition</FormLabel>
              <FormControl>
                <Input placeholder="Enter the definition" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Adding..." : "Add Word"}
        </Button>
      </form>
    </Form>
  );
};

export default VocabularyForm;
