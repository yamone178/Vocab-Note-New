import { ChevronRight, Folder, Plus, RefreshCw, Zap } from "lucide-react";
import Link from "next/link";

export default function QuickActions() {
  return (
    <div className="animate-fadeInUp d5 rounded-2xl border border-emerald-100 bg-white p-6 shadow-[0_1px_3px_rgba(16,185,129,0.06)]">
      <div className="mb-4 flex items-center gap-2 text-emerald-600">
        <Zap size={18} />
        <span className="text-[0.97rem] font-bold text-gray-900">Quick Actions</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {[
          { label: "Add New Vocabulary", icon: Plus, href: "/vocabularies" },
          { label: "Start Review Session", icon: RefreshCw, href: "/review" },
          { label: "Manage Categories", icon: Folder, href: "/categories" },
        ].map((action, i) => (
          <Link href={action.href} key={i} className="group flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-left transition-all duration-200 hover:border-emerald-100 hover:bg-emerald-50">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.6rem] bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 transition-all duration-200 group-hover:scale-105 group-hover:from-emerald-100 group-hover:to-emerald-200">
              <action.icon size={18} />
            </div>
            <span className="flex-1 text-[0.93rem] font-semibold text-gray-800">{action.label}</span>
            <ChevronRight size={15} className="text-gray-300 transition-colors group-hover:text-emerald-400" />
          </Link>
        ))}
      </div>
    </div>
  );
}