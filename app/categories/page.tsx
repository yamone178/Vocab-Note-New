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

function CategoriesContent() {
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    {
      id: 1,
      name: "Business",
      description: "Professional and corporate vocabulary",
      wordCount: 247,
      lastStudied: "2 hours ago",
      color: "bg-blue-500"
    },
    {
      id: 2,
      name: "Technology",
      description: "Tech and programming terms",
      wordCount: 189,
      lastStudied: "Yesterday",
      color: "bg-green-500"
    },
    {
      id: 3,
      name: "Academic",
      description: "University and research vocabulary",
      wordCount: 156,
      lastStudied: "3 days ago",
      color: "bg-purple-500"
    },
    {
      id: 4,
      name: "Medical",
      description: "Healthcare and medical terms",
      wordCount: 98,
      lastStudied: "1 week ago",
      color: "bg-red-500"
    },
    {
      id: 5,
      name: "Travel",
      description: "Travel and tourism vocabulary",
      wordCount: 76,
      lastStudied: "2 weeks ago",
      color: "bg-yellow-500"
    },
    {
      id: 6,
      name: "Food & Cooking",
      description: "Culinary and food-related terms",
      wordCount: 134,
      lastStudied: "5 days ago",
      color: "bg-orange-500"
    }
  ];

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg">
          <Plus size={16} className="mr-2" />
          Add Category
        </Button>
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
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className="group rounded-2xl border border-emerald-100 bg-white p-6 shadow-[0_1px_3px_rgba(16,185,129,0.06)] transition-all duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_4px_20px_rgba(16,185,129,0.12)] cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${category.color} shadow-sm`}>
                <BookOpen size={20} color="white" />
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-500">{category.wordCount} words</div>
              </div>
            </div>

            <div className="mb-3">
              <h3 className="text-lg font-bold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-sm text-gray-600">{category.description}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock size={12} />
                <span>Last studied {category.lastStudied}</span>
              </div>
              <Button size="sm" variant="outline" className="border-emerald-200 text-emerald-600 hover:bg-emerald-50">
                Study
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-50 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-900">{categories.length}</div>
            <div className="text-sm text-emerald-700">Total Categories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-900">
              {categories.reduce((sum, cat) => sum + cat.wordCount, 0)}
            </div>
            <div className="text-sm text-emerald-700">Total Words</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-900">
              {Math.round(categories.reduce((sum, cat) => sum + cat.wordCount, 0) / categories.length)}
            </div>
            <div className="text-sm text-emerald-700">Avg Words/Category</div>
          </div>
        </div>
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