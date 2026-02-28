import { SignupForm } from "@/features/auth/components/SignupForm";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#f6fef9] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-[0_4px_20px_rgba(22,163,74,0.35)]">
              <BookOpen size={24} color="white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join VocabNote and start building your vocabulary</p>
        </div>

        {/* Signup Form Card */}
        <div className="rounded-2xl border border-emerald-100 bg-white p-8 shadow-[0_4px_20px_rgba(16,185,129,0.08)]">
          <SignupForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline">
                Sign in
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