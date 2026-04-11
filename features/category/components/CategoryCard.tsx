import { FolderIcon, BookOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export interface CategoryData {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  _count?: {
    vocabularies: number;
  };
}

interface CategoryCardProps {
  category: CategoryData;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const initial = category.name.charAt(0).toUpperCase();

  // Consistent pastel colors based on category name length/characters
  const colors = [
    "bg-rose-100 text-rose-700 ring-rose-200/50",
    "bg-sky-100 text-sky-700 ring-sky-200/50",
    "bg-emerald-100 text-emerald-700 ring-emerald-200/50",
    "bg-amber-100 text-amber-700 ring-amber-200/50",
    "bg-purple-100 text-purple-700 ring-purple-200/50",
    "bg-indigo-100 text-indigo-700 ring-indigo-200/50",
  ];
  
  const colorIndex = category.name.length % colors.length;
  const colorClass = colors[colorIndex];

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-2 ${colorClass}`}>
          <span className="text-xl font-bold">{initial}</span>
        </div>
        
        <div className="flex items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-600 ring-1 ring-inset ring-gray-200/50">
          <BookOpen className="h-3.5 w-3.5" />
          <span>{category._count?.vocabularies || 0}</span>
        </div>
      </div>

      <div className="mt-4 flex-1">
        <h3 className="mb-1 text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
          {category.name}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-gray-500">
          {category.description || "No description provided."}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-4">
        <div className="text-xs font-medium text-gray-400">
          Updated {formatDistanceToNow(new Date(category.createdAt), { addSuffix: true })}
        </div>
      </div>
    </div>
  );
}