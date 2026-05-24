import { BookOpen, LogOut, User, Menu, X } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Session } from "next-auth";
import { UserProfileData } from "@/features/users/hooks/useGetUserProfile";
import { useState } from "react";

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: BookOpen, href: '/' },
  { id: 'vocabularies', label: 'Vocabulary', icon: BookOpen, href: '/vocabularies' },
  { id: 'categories', label: 'Categories', icon: BookOpen, href: '/categories' },
  { id: 'review', label: 'Review', icon: BookOpen, href: '/review' },
];

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  session: Session | null;
  userData: UserProfileData | undefined;
}

export default function Navbar({ activeTab, setActiveTab, onLogout, session, userData }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-emerald-100 bg-white px-4 md:px-8 lg:px-12 shadow-[0_1px_8px_rgba(16,185,129,0.06)]">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-[0_2px_8px_rgba(22,163,74,0.35)] flex-shrink-0">
          <BookOpen size={18} color="white" />
        </div>
        <span className="text-[1.08rem] font-bold tracking-tight text-emerald-600 hidden sm:block">Vocab-note</span>
      </div>

      <div className="hidden md:flex items-center gap-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <Link
              href={item.href}
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center rounded-lg text-[0.87rem] font-medium transition-all duration-200
                ${isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-gray-500 hover:bg-emerald-50 hover:text-emerald-600'}
                gap-1.5 px-3.5 py-2`}
            >
              <Icon size={14} />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/profile"
          onClick={() => setActiveTab('profile')}
          className={`flex items-center justify-center rounded-full h-9 w-9 transition-all duration-200 ring-2 ring-transparent
            ${activeTab === 'profile'
              ? 'ring-emerald-600 shadow-sm'
              : 'hover:ring-emerald-200'}`}
        >
          <Avatar className="h-8 w-8 border border-emerald-100">
            <AvatarImage src={userData?.image || undefined} alt={userData?.name || "User Avatar"} />
            <AvatarFallback className="bg-emerald-50 text-emerald-700 font-medium text-sm">
              {userData?.name?.charAt(0)?.toUpperCase() || userData?.email?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </Link>
        <button
          onClick={onLogout}
          className="hidden md:flex items-center rounded-lg p-2 text-gray-400 transition-all hover:bg-red-50 hover:text-red-600"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex md:hidden items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-emerald-100 p-4 shadow-lg flex flex-col gap-2 md:hidden animate-in slide-in-from-top-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <Link
                href={item.href}
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-gray-500 hover:bg-emerald-50 hover:text-emerald-600'}
                  gap-2.5 px-4 py-3`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
          <div className="h-px bg-gray-100 my-2"></div>
          <button
             onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
             className="flex items-center gap-2.5 px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg text-sm font-medium transition-all duration-200"
          >
             <LogOut size={16} />
             Logout
          </button>
        </div>
      )}
    </nav>
  );
}