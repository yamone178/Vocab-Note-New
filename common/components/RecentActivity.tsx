import { Clock } from "lucide-react";
import { useGetActivities } from "@/features/users/hooks/useGetActivities";
import { formatDistanceToNow } from "date-fns";

export default function RecentActivity() {
  const { data, isLoading } = useGetActivities();
  const activities = data?.data || [];

  return (
    <div className="animate-fadeInUp d4 rounded-2xl border border-emerald-100 bg-white p-6 shadow-[0_1px_3px_rgba(16,185,129,0.06)]">
      <div className="mb-3 flex items-center gap-2 text-emerald-600">
        <Clock size={18} />
        <span className="text-[0.97rem] font-bold text-gray-900">Recent Activity</span>
      </div>
      <div className="divide-y divide-gray-50 border-t border-emerald-50">
        {isLoading ? (
          <div className="py-4 text-center text-sm text-gray-400">Loading activities...</div>
        ) : activities.length > 0 ? (
          activities.map((activity, i) => (
            <div key={i} className="flex items-start justify-between gap-4 py-3">
              <div className="flex items-start gap-2.5">
                <span className="mt-[5px] h-2 w-2 shrink-0 rounded-full bg-emerald-400"></span>
                <span className="text-[0.88rem] text-gray-700">{activity.text}</span>
              </div>
              <span className="shrink-0 text-[0.78rem] font-medium text-gray-400">
                {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
              </span>
            </div>
          ))
        ) : (
          <div className="py-4 text-center text-sm text-gray-400">No recent activity</div>
        )}
      </div>
    </div>
  );
}