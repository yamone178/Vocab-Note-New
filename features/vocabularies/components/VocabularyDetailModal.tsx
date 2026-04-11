"use client";

import { useState } from "react";
import { Vocabulary } from "../types";
import { useDeleteVocabulary } from "../hooks/useDeleteVocabulary";
import ConfirmationModal from "@/common/components/ConfirmationModal";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { 
  Volume2, 
  Calendar, 
  Tag, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  Trash2,
} from "lucide-react";

interface VocabularyDetailModalProps {
  vocabulary: (Vocabulary & { category?: { name: string } }) | null;
  isOpen: boolean;
  onClose: () => void;
}

const VocabularyDetailModal = ({
  vocabulary,
  isOpen,
  onClose,
}: VocabularyDetailModalProps) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { mutate: deleteVocab, isPending: isDeleting } = useDeleteVocabulary();

  if (!vocabulary) return null;

  const handleDelete = () => {
    deleteVocab(
      { id: vocabulary.id, categoryId: vocabulary.categoryId },
      {
        onSuccess: () => {
          setIsConfirmOpen(false);
          onClose();
        },
      },
    );
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-white p-0 overflow-hidden border-emerald-100">
        <div className="bg-emerald-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-emerald-100 text-sm font-medium tracking-wide uppercase">
                  {vocabulary.partOfSpeech}
                </span>
                {vocabulary.difficulty && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border bg-white/10 border-white/20 uppercase`}>
                    {vocabulary.difficulty}
                  </span>
                )}
              </div>
              <h2 className="text-3xl font-bold">{vocabulary.word}</h2>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5" />
              Definition
            </h4>
            <p className="text-gray-700 text-lg leading-relaxed">
              {vocabulary.definition}
            </p>
          </div>

          {vocabulary.example && (
            <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
              <h4 className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">Example</h4>
              <p className="text-emerald-900 italic">
                &ldquo;{vocabulary.example}&rdquo;
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" />
                Category
              </h4>
              <p className="text-gray-900 font-medium">
                {vocabulary.category?.name || "Uncategorized"}
              </p>
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Status
              </h4>
              <p className="text-gray-900 font-medium">
                {vocabulary.knowIt ? "Mastered" : "Learning"}
              </p>
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Added on
              </h4>
              <p className="text-gray-900 font-medium text-sm">
                {new Date(vocabulary.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            {vocabulary.synonyms && vocabulary.synonyms.length > 0 && (
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5" />
                  Synonyms
                </h4>
                <p className="text-gray-900 font-medium text-sm">
                  {vocabulary.synonyms.join(", ")}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-gray-50 flex justify-between items-center border-t border-gray-100">
          <button
            onClick={() => setIsConfirmOpen(true)}
            disabled={isDeleting}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
            title="Delete Word"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </button>
          
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 transition-colors">
              Edit Word
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <ConfirmationModal
      isOpen={isConfirmOpen}
      onClose={() => setIsConfirmOpen(false)}
      onConfirm={handleDelete}
      title="Delete Vocabulary"
      description={`Are you sure you want to delete "${vocabulary.word}"? This action cannot be undone.`}
      confirmText="Delete"
      variant="danger"
      isLoading={isDeleting}
    />
  </>
);
};

export default VocabularyDetailModal;