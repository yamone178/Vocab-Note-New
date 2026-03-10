import { BookOpen, Folder, RefreshCw } from "lucide-react";
import DashboardCard from "@/features/dashboard/components/DashboardCard";
import { useGetCategories } from "@/features/category/hooks/useGetCategories";
import { useGetDueVocabularies } from "@/features/vocabularies/hooks/useGetDueVocabularies";
import { useGetVocabularyCount } from "@/features/vocabularies/hooks/useGetVocabulariesCount";

export default function StatsSection() {
  const { data: categoriesData } = useGetCategories();
  const { data: dueData } = useGetDueVocabularies();
  const { data: vocabCount } = useGetVocabularyCount();

  const categoriesCount = categoriesData?.data?.length || 0;
  const dueCount = dueData?.data?.length || 0;
  const totalVocab = vocabCount || 0;

  return (
    <div className="mb-5 grid grid-cols-1 md:grid-cols-3 gap-5">
      <DashboardCard 
        icon={BookOpen} 
        value={totalVocab} 
        label="Total Vocabulary" 
        delay="d1" 
        href="/vocabularies"
      />
      <DashboardCard 
        icon={Folder} 
        value={categoriesCount} 
        label="Categories" 
        delay="d2" 
        href="/categories"
      />
      <DashboardCard 
        icon={RefreshCw} 
        value={dueCount} 
        label="Due for Review" 
        delay="d3" 
        href="/review"
      />
    </div>
  );
}