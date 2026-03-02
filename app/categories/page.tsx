"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LoadingSpinner,
  LandingPage,
  DashboardLayout,
} from "@/common/components";
import { Plus, BookOpen, Users, Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CreateCategory from "@/features/category/components/CreateCategory";
import { useGetCategories } from "@/features/category/hooks/useGetCategories";
import { Category } from "@/features/category/types";
import Link from "next/link";

function CategoriesContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading } = useGetCategories({ page: 1, limit: 100 }); // Fetch all for now

  const categories = data?.data || [];

  const filteredCategories = categories.filter(
    (category: Category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[2rem] font-extrabold leading-tight tracking-[-0.04em] text-gray-900">
            Categories
          </h1>
          <p className="mt-1 text-[0.93rem] text-gray-500">Organize your vocabulary by topics</p>
        </div>
        <CreateCategory />
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-emerald-200 focus:border-emerald-400"
        />
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category: Category) => (
          <Link href={`/categories/${category.id}`} key={category.id}>
          <div
            className="group rounded-2xl border border-emerald-100 bg-white p-6 shadow-[0_1px_3px_rgba(16,185,129,0.06)] transition-all duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_4px_20px_rgba(16,185,129,0.12)] cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500 shadow-sm`}
              >
                <BookOpen size={20} color="white" />
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-500">
                  {category._count?.vocabularies || 0} words
                </div>
              </div>
            </div>

            <div className="mb-3">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600">{category.description}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock size={12} />
                <span>
                  Created at {new Date(category.createdAt).toLocaleDateString()}
                </span>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
              >
                Study
              </Button>
            </div>
          </div>
          </Link>
        ))}
      </div>

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
    return <LoadingSpinner />;
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