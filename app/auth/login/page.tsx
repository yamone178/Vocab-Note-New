import { LoginForm } from "@/features/auth/components/LoginForm";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#f6fef9] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-[0_4px_20px_rgba(22,163,74,0.35)]">
              <BookOpen size={24} color="white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to continue your learning journey</p>
        </div>

        {/* Login Form Card */}
        <div className="rounded-2xl border border-emerald-100 bg-white p-8 shadow-[0_4px_20px_rgba(16,185,129,0.08)]">
          <LoginForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-400">
            Master new vocabulary with intelligent spaced repetition
          </p>
        </div>
      </div>
    </div>
  );
}