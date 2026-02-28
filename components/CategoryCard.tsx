import { BookOpen } from 'lucide-react';

interface CategoryCardProps {
  name: string;
  count: number;
  color: string;
  delay: string;
}

export default function CategoryCard({ name, count, color, delay }: CategoryCardProps) {
  return (
    <div className={`group animate-fadeInUp ${delay} rounded-2xl border border-emerald-100 bg-white p-6 shadow-[0_1px_3px_rgba(16,185,129,0.06)] transition-all duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_4px_20px_rgba(16,185,129,0.12)] cursor-pointer`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color} shadow-sm`}>
          <BookOpen size={20} color="white" />
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-gray-500">{count} words</div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">{name}</h3>
        <p className="text-sm text-gray-600">Vocabulary category</p>
      </div>
    </div>
  );
}