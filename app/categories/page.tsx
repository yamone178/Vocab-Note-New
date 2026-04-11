"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LoadingSpinner,
  LandingPage,
  DashboardLayout,
} from "@/common/components";
import { 
  BookOpen, 
  Search, 
  FolderTree, 
  CalendarDays, 
  ArrowRight,
  Layers
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import CreateCategory from "@/features/category/components/CreateCategory";
import { useGetCategories } from "@/features/category/hooks/useGetCategories";
import Link from "next/link";
import { cn } from "@/lib/utils";

function CategoriesContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading } = useGetCategories({ page: 1, limit: 100 }); 

  const categories = data?.data || [];

  const filteredCategories = categories.filter((category: any) => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = category.name?.toLowerCase().includes(searchLower) ?? false;
    const descMatch = category.description?.toLowerCase().includes(searchLower) ?? false;
    
    return nameMatch || descMatch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto space-y-6 p-4 md:p-8">
      
      {/* Header & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Categories
            </h1>
            <p className="text-sm text-gray-500">Organize your vocabulary by topics</p>
          </div>
        </div>
        
        <div className="w-full sm:w-auto">
          <CreateCategory />
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 bg-gray-50/50 p-2 md:p-3 rounded-2xl border border-gray-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search categories by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 pl-10 border-gray-200 bg-white rounded-xl focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Categories Grid */}
      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCategories.map((category: any) => {
            const initial = category.name.charAt(0).toUpperCase();
            
            // Generate a consistent color based on the category name
            const colors = [
              "bg-rose-50 text-rose-600",
              "bg-sky-50 text-sky-600",
              "bg-emerald-50 text-emerald-600",
              "bg-amber-50 text-amber-600",
              "bg-purple-50 text-purple-600",
              "bg-indigo-50 text-indigo-600",
            ];
            const colorClass = colors[category.name.length % colors.length];

            return (
              <Link href={`/categories/${category.id}`} key={category.id} className="block group">
                <div className="flex flex-col justify-between h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md">
                  
                  {/* Card Header: Initial Icon & Word Count */}
                  <div className="flex items-start justify-between mb-5">
                    <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl font-bold shadow-sm ring-1 ring-inset ring-black/5", colorClass)}>
                      {initial}
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 bg-gray-50 text-gray-500 rounded-full border border-gray-100">
                      <BookOpen size={12} className="text-gray-400" />
                      {category._count?.vocabularies || 0}
                    </span>
                  </div>

                  {/* Card Body: Title & Description */}
                  <div className="mb-6 flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                      {category.description || "No description provided."}
                    </p>
                  </div>

                  {/* Card Footer: Date */}
                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                      <CalendarDays size={14} />
                      <span>
                        Created {new Date(category.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center flex-1 py-16 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
          <div className="h-16 w-16 bg-white border border-gray-100 shadow-sm rounded-2xl flex items-center justify-center mb-4">
            <FolderTree className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No categories found</h3>
          <p className="text-sm text-gray-500 max-w-sm mt-1">
            {searchTerm 
              ? "We couldn't find any categories matching your search." 
              : "You haven't created any categories yet. Create one to start organizing your vocabulary!"}
          </p>
        </div>
      )}
    </div>
  );
}

export default function CategoriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('categories');

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push('/');
      return;
    }
  }, [session, status, router]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!session) {
    return <LandingPage />;
  }

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={handleLogout}
    >
      <CategoriesContent />
    </DashboardLayout>
  );
}