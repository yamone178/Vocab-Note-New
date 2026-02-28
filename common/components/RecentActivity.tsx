import { Clock } from "lucide-react";

export default function RecentActivity() {
  return (
    <div className="animate-fadeInUp d4 rounded-2xl border border-emerald-100 bg-white p-6 shadow-[0_1px_3px_rgba(16,185,129,0.06)]">
      <div className="mb-3 flex items-center gap-2 text-emerald-600">
        <Clock size={18} />
        <span className="text-[0.97rem] font-bold text-gray-900">Recent Activity</span>
      </div>
      <div className="divide-y divide-gray-50 border-t border-emerald-50">
        {[
          { text: "Added 5 new words to 'Business'", time: "2 hours ago" },
          { text: "Completed quiz in 'Technology'", time: "Yesterday" },
          { text: "Reviewed 15 flashcards", time: "2 days ago" },
        ].map((activity, i) => (
          <div key={i} className="flex items-start justify-between gap-4 py-3">
            <div className="flex items-start gap-2.5">
              <span className="mt-[5px] h-2 w-2 shrink-0 rounded-full bg-emerald-400"></span>
              <span className="text-[0.88rem] text-gray-700">{activity.text}</span>
            </div>
            <span className="shrink-0 text-[0.78rem] font-medium text-gray-400">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}