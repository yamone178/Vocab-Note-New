"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
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
import { cn } from "@/lib/utils";

// Icons
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
  Type,
  Link as LinkIcon,
  FolderTree,
} from "lucide-react";

interface VocabularyFormProps {
  onSubmit: (values: VocabularySchema) => void;
  initialValues?: Partial<VocabularySchema>;
  isPending?: boolean;
  onXpEarned?: (xpAmount: number, targetRect: { top: number; left: number; width: number; height: number; }) => void;
}

const COMMON_PARTS_OF_SPEECH = ["Noun", "Verb", "Adjective", "Adverb", "Pronoun", "Other"];

const VocabularyForm = ({ onSubmit, initialValues, isPending, onXpEarned }: VocabularyFormProps) => {
  const { data: categories } = useGetCategories();
  const submitButtonRef = useRef<HTMLButtonElement>(null);

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

  const handleSubmit = async (values: VocabularySchema) => {
    await onSubmit(values);
    if (submitButtonRef.current && onXpEarned) {
      const rect = submitButtonRef.current.getBoundingClientRect();
      onXpEarned(5, { top: rect.top, left: rect.left, width: rect.width, height: rect.height });
    }
  };

  const categoryIconMap = useMemo(
    () =>
      new Map<string, React.ElementType>([
        ["Business", Briefcase],
        ["Technology", Cpu],
        ["Medical", Stethoscope],
        ["Academic", GraduationCap],
        ["Daily Life", Building2],
        ["Travel", Waypoints],
        ["Default", BookOpen],
      ]),
    []
  );

  const getCategoryIcon = (name: string) => {
    return categoryIconMap.get(name) || categoryIconMap.get("Default")!;
  };

  useEffect(() => {
    if (categories?.data && !form.getValues("categoryId") && !initialValues?.categoryId) {
      const generalCategory = categories.data.find((c: { id: string; name: string }) => c.name === "General");
      if (generalCategory) {
        form.setValue("categoryId", generalCategory.id);
      }
    }
  }, [categories?.data, form, initialValues?.categoryId]);

  const difficultyMeta: Record<
    NonNullable<VocabularySchema["difficulty"]>,
    { title: string; desc: string; activeBars: number; color: string }
  > = {
    BEGINNER: {
      title: "Beginner",
      desc: "Everyday basics",
      activeBars: 1,
      color: "bg-emerald-400",
    },
    INTERMEDIATE: {
      title: "Intermediate",
      desc: "Professional terms",
      activeBars: 2,
      color: "bg-amber-400",
    },
    ADVANCED: {
      title: "Advanced",
      desc: "Specialized words",
      activeBars: 3,
      color: "bg-rose-400",
    },
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn(
          "relative space-y-10 rounded-3xl p-6 sm:p-8 overflow-y-auto max-h-[calc(100vh-120px)] scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent",
          "bg-white border border-slate-100 shadow-sm"
        )}
      >
        {/* SECTION 1: CORE DETAILS */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Type className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">1. Core Meaning</h3>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="word"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">Word <span className="text-rose-500">*</span></FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Ubiquitous"
                      {...field}
                      className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-emerald-500 placeholder:text-slate-400 text-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Quick Pill Selector for Part of Speech */}
            <FormField
              control={form.control}
              name="partOfSpeech"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">Part of Speech</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {COMMON_PARTS_OF_SPEECH.map((pos) => {
                        const isSelected = field.value?.toLowerCase() === pos.toLowerCase();
                        return (
                          <button
                            key={pos}
                            type="button"
                            onClick={() => field.onChange(pos)}
                            className={cn(
                              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border",
                              isSelected
                                ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/20"
                                : "bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50"
                            )}
                          >
                            {pos}
                          </button>
                        );
                      })}
                    </div>
                  </FormControl>
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
                <FormLabel className="text-slate-700 font-semibold">Definition <span className="text-rose-500">*</span></FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide a clear, concise definition…"
                    {...field}
                    className="min-h-[100px] rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-emerald-500 placeholder:text-slate-400 resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* SECTION 2: CONTEXT & RELATIONS */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <LinkIcon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">2. Context & Relations</h3>
          </div>

          <FormField
            control={form.control}
            name="example"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 font-semibold">Example Sentence <span className="text-slate-400 font-normal">(Optional)</span></FormLabel>
                <FormControl>
                  <Input
                    placeholder="Write a sentence using this word in context…"
                    {...field}
                    className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-emerald-500 placeholder:text-slate-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="synonyms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">Synonyms <span className="text-slate-400 font-normal">(Optional)</span></FormLabel>
                  <FormControl>
                    <Input
                      placeholder="similar, alike, comparable"
                      {...field}
                      className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-emerald-500 placeholder:text-slate-400"
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
                  <FormLabel className="text-slate-700 font-semibold">Antonyms <span className="text-slate-400 font-normal">(Optional)</span></FormLabel>
                  <FormControl>
                    <Input
                      placeholder="different, unlike, dissimilar"
                      {...field}
                      className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-emerald-500 placeholder:text-slate-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* SECTION 3: ORGANIZATION */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <FolderTree className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">3. Organization</h3>
          </div>

          {/* Categories Grid */}
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 font-semibold flex items-center gap-2">
                  Choose Category <span className="text-rose-500">*</span>
                </FormLabel>
                <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {categories?.data?.map((category: { id: string; name: string }) => {
                    const Icon = getCategoryIcon(category.name);
                    const isSelected = field.value === category.id;
                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => field.onChange(category.id)}
                        className={cn(
                          "group relative flex flex-col items-center justify-center gap-2 rounded-xl border p-4 transition-all duration-200",
                          isSelected
                            ? "bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500 shadow-sm"
                            : "bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50"
                        )}
                      >
                        <Icon className={cn("h-6 w-6 transition-colors", isSelected ? "text-emerald-600" : "text-slate-400 group-hover:text-emerald-500")} />
                        <span className={cn("text-xs font-semibold text-center", isSelected ? "text-emerald-900" : "text-slate-600")}>
                          {category.name}
                        </span>
                        {isSelected && (
                          <span className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full p-0.5 shadow-md">
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

          {/* Difficulty Cards */}
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem className="pt-4">
                <FormLabel className="text-slate-700 font-semibold flex items-center gap-2">
                  Difficulty Level <span className="text-rose-500">*</span>
                </FormLabel>
                <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-3">
                  {(Object.keys(difficultyMeta) as Array<keyof typeof difficultyMeta>).map((key) => {
                    const meta = difficultyMeta[key];
                    const isSelected = field.value === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => field.onChange(key)}
                        className={cn(
                          "relative flex flex-col items-start rounded-xl border p-5 transition-all duration-200 text-left",
                          isSelected
                            ? "bg-white border-emerald-500 ring-1 ring-emerald-500 shadow-md shadow-emerald-100"
                            : "bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50 shadow-sm"
                        )}
                      >
                        {/* 3-Bar Signal Icon */}
                        <div className="flex gap-1 mb-4 h-4 items-end">
                          {[1, 2, 3].map((bar) => (
                            <div
                              key={bar}
                              className={cn(
                                "w-2 rounded-full transition-colors duration-300",
                                bar === 1 ? "h-2" : bar === 2 ? "h-3" : "h-4",
                                bar <= meta.activeBars ? meta.color : "bg-slate-200"
                              )}
                            />
                          ))}
                        </div>
                        
                        <div className={cn("text-lg font-bold mb-1", isSelected ? "text-slate-900" : "text-slate-700")}>
                          {meta.title}
                        </div>
                        <p className="text-sm text-slate-500 leading-tight">{meta.desc}</p>
                        
                        {isSelected && (
                          <div className="absolute top-4 right-4 text-emerald-500">
                            <BadgeCheck className="h-6 w-6" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-6 border-t border-slate-100 sticky bottom-0 bg-white/80 backdrop-blur-sm -mx-6 -mb-6 p-6 sm:-mx-8 sm:-mb-8 sm:p-8 z-10 rounded-b-3xl">
          <Button
            ref={submitButtonRef}
            type="submit"
            disabled={isPending}
            className={cn(
              "w-full h-14 rounded-xl text-lg font-bold transition-all duration-300",
              "bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.01]",
              "text-white shadow-xl shadow-emerald-600/20"
            )}
          >
            <BookOpen className="mr-2 h-6 w-6" />
            {isPending ? "Adding Word..." : "Save to Vocabulary"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default VocabularyForm;