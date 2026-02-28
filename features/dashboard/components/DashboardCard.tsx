import { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  value: string | number;
  label: string;
  delay: string;
}

export default function DashboardCard({ icon: Icon, value, label, delay }: Props) {
  return (
    <div className={`group animate-fadeInUp ${delay} flex items-center gap-4 rounded-2xl border border-emerald-100 bg-white p-5 shadow-[0_1px_3px_rgba(16,185,129,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_4px_20px_rgba(16,185,129,0.12)]`}>
      <div className="flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 p-3 text-emerald-600 transition-transform duration-200 group-hover:scale-105">
        <Icon size={22} />
      </div>
      <div>
        <div className="text-[2rem] font-extrabold leading-none tracking-[-0.04em] text-gray-900">{value}</div>
        <div className="mt-0.5 text-[0.83rem] font-medium text-gray-500">{label}</div>
      </div>
    </div>
  );
}