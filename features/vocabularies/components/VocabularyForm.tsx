"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  VocabularySchema,
  vocabularySchema,
} from "@/features/vocabularies/schemas/vocabulary-schema";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetCategories } from "@/features/category/hooks/useGetCategories";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils"; // if you have a classnames helper (optional)

// Icons (shadcn recommends lucide-react)
import {
  BadgeCheck,
  BookOpen,
  Brain,
  Briefcase,
  Building2,
  Cpu,
  GraduationCap,
  Languages,
  Stethoscope,
  Waypoints,
} from "lucide-react";

interface VocabularyFormProps {
  onSubmit: (values: VocabularySchema) => void;
  initialValues?: Partial<VocabularySchema>;
  isPending?: boolean;
}

const VocabularyForm = ({ onSubmit, initialValues, isPending }: VocabularyFormProps) => {
  const { data: categories } = useGetCategories();

  const form = useForm<VocabularySchema>({
    resolver: zodResolver(vocabularySchema),
    defaultValues: {
      word: initialValues?.word || "",
      partOfSpeech: initialValues?.partOfSpeech || "",
      definition: initialValues?.definition || "",
      categoryId: initialValues?.categoryId || "",
      difficulty: initialValues?.difficulty || "BEGINNER",
      example: initialValues?.example || "",
      synonyms: initialValues?.synonyms || "",
      antonyms: initialValues?.antonyms || "",
    },
    mode: "onChange",
  });

  // Optional: map some default category icons by name (fallback to a generic icon)
  const categoryIconMap = useMemo(
    () =>
      new Map<string, React.ElementType>([
        ["Business", Briefcase],
        ["Technology", Cpu],
        ["Medical", Stethoscope],
        ["Academic", GraduationCap],
        ["Daily Life", Building2],
        ["Travel", Waypoints],
        // Fallback
        ["Default", BookOpen],
      ]),
    []
  );

  const getCategoryIcon = (name: string) => {
    return categoryIconMap.get(name) || categoryIconMap.get("Default")!;
  };

  const difficultyMeta: Record<
    NonNullable<VocabularySchema["difficulty"]>,
    { title: string; desc: string; barColor: string }
  > = {
    BEGINNER: {
      title: "Beginner",
      desc: "Basic everyday vocabulary",
      barColor: "bg-emerald-500",
    },
    INTERMEDIATE: {
      title: "Intermediate",
      desc: "Common professional terms",
      barColor: "bg-amber-500",
    },
    ADVANCED: {
      title: "Advanced",
      desc: "Complex and specialized words",
      barColor: "bg-rose-500",
    },
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "space-y-6 rounded-2xl p-6 overflow-y-auto max-h-[calc(100vh-250px)] scrollbar-thin scrollbar-thumb-emerald-200 scrollbar-track-transparent",
          "bg-gradient-to-b from-emerald-50/60 to-teal-50/40",
          "border border-emerald-100"
        )}
      >
        {/* Top inputs */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="word"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-emerald-900">Word</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the word"
                    {...field}
                    className="h-11 rounded-xl bg-white/90 placeholder:text-emerald-400"
                  />
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
                <FormLabel className="text-emerald-900">Part of Speech</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Noun, Verb, Adjective..."
                    {...field}
                    className="h-11 rounded-xl bg-white/90 placeholder:text-emerald-400"
                  />
                </FormControl>
                {/* If you want a controlled Select instead of free-text, replace with shadcn <Select> and options */}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="definition"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-emerald-900">Definition</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide a clear, concise definition…"
                  {...field}
                  className="min-h-[96px] rounded-2xl bg-white/90 placeholder:text-emerald-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Example + Synonyms + Antonyms row */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="example"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-emerald-900">Example Sentence (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Write a sentence using this word in context…"
                    {...field}
                    className="h-11 rounded-xl bg-white/90 placeholder:text-emerald-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Spacer on the right in larger screens */}
          <div className="hidden md:block" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="synonyms"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-emerald-900">Synonyms (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="similar, alike, comparable"
                    {...field}
                    className="h-11 rounded-xl bg-white/90 placeholder:text-emerald-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="antonyms"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-emerald-900">Antonyms (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="different, unlike, dissimilar"
                    {...field}
                    className="h-11 rounded-xl bg-white/90 placeholder:text-emerald-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Categories - icon cards */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <Languages className="h-5 w-5 text-emerald-600" />
                <FormLabel className="text-emerald-900">Choose Category *</FormLabel>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
                {categories?.data?.map((category: { id: string; name: string }) => {
                  const Icon = getCategoryIcon(category.name);
                  const isSelected = field.value === category.id;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => field.onChange(category.id)}
                      className={cn(
                        "group relative flex flex-col items-center justify-center gap-2 rounded-2xl border p-3 transition",
                        "bg-white/90 hover:bg-emerald-50",
                        isSelected
                          ? "border-emerald-400 ring-2 ring-emerald-200"
                          : "border-emerald-100"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-xl transition",
                          isSelected
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100"
                        )}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <span
                        className={cn(
                          "text-sm font-medium",
                          isSelected ? "text-emerald-900" : "text-emerald-800"
                        )}
                      >
                        {category.name}
                      </span>

                      {isSelected && (
                        <span className="absolute -right-1 -top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
                          <BadgeCheck className="h-4 w-4" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Difficulty - selectable cards */}
        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-emerald-600" />
                <FormLabel className="text-emerald-900">Difficulty Level *</FormLabel>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                {(Object.keys(difficultyMeta) as Array<keyof typeof difficultyMeta>).map(
                  (key) => {
                    const meta = difficultyMeta[key];
                    const selected = field.value === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => field.onChange(key)}
                        className={cn(
                          "relative rounded-2xl border bg-white/90 p-4 text-left transition",
                          "hover:bg-emerald-50",
                          selected
                            ? "border-emerald-300 ring-2 ring-emerald-200"
                            : "border-emerald-100"
                        )}
                      >
                        {/* accent bar */}
                        <div className="mb-3 h-1.5 w-32 overflow-hidden rounded-full bg-emerald-100">
                          <div
                            className={cn("h-full w-2/3 rounded-full", meta.barColor)}
                          />
                        </div>

                        <div className="flex items-start justify-between">
                          <div>
                            <div
                              className={cn(
                                "text-base font-semibold",
                                selected ? "text-emerald-900" : "text-emerald-800"
                              )}
                            >
                              {meta.title}
                            </div>
                            <p className="mt-1 text-sm text-emerald-700/80">{meta.desc}</p>
                          </div>
                          {selected && (
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow">
                              <BadgeCheck className="h-4 w-4" />
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  }
                )}
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={isPending}
            className={cn(
              "w-full h-12 rounded-2xl",
              "bg-emerald-600 hover:bg-emerald-700",
              "text-white shadow-lg shadow-emerald-200"
            )}
          >
            <BookOpen className="mr-2 h-5 w-5" />
            {isPending ? "Adding..." : "Add Word to Vocabulary"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default VocabularyForm;
