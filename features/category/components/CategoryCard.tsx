interface CategoryProps {
  name: string;
  count: number;
  color: string;
  delay: string;
}

export default function CategoryCard({ name, count, color, delay }: CategoryProps) {
  // Extract first letter for the icon
  const initial = name.charAt(0);

  return (
    <div className={`animate-fadeInUp ${delay} group cursor-pointer rounded-2xl border border-emerald-50 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md`}>
      <div className="flex flex-col gap-4">
        {/* Category Icon/Initial */}
        <div className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white shadow-inner ${color}`}>
          {initial}
        </div>
        
        <div>
          <h3 className="text-lg font-bold text-gray-900">{name}</h3>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="flex items-center justify-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[0.75rem] font-bold text-emerald-600">
              {count}
            </span>
            <span className="text-[0.85rem] font-medium text-gray-400">words</span>
          </div>
        </div>
      </div>
    </div>
  );
}