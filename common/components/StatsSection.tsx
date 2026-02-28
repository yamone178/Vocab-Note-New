import { BookOpen, Folder, RefreshCw } from "lucide-react";
import DashboardCard from "@/features/dashboard/components/DashboardCard";

export default function StatsSection() {
  return (
    <div className="mb-5 grid grid-cols-1 md:grid-cols-3 gap-5">
      <DashboardCard icon={BookOpen} value="247" label="Total Vocabulary" delay="d1" />
      <DashboardCard icon={Folder} value="8" label="Categories" delay="d2" />
      <DashboardCard icon={RefreshCw} value="23" label="Due for Review" delay="d3" />
    </div>
  );
}