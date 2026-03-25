import { LoginForm } from "@/features/auth/components/LoginForm";
import Link from "next/link";
import { BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 flex items-center justify-center px-4 py-8">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to Home */}
        <Button 
          variant="ghost" 
          asChild 
          className="mb-6 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
        >
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-lg shadow-emerald-300">
              <BookOpen size={28} color="white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to continue your learning journey</p>
        </div>

        {/* Login Form Card */}
        <div className="rounded-2xl border border-emerald-100 bg-white/80 backdrop-blur-sm p-8 shadow-xl shadow-emerald-100/50">
          <LoginForm />

          <div className="mt-6 pt-6 border-t border-emerald-100 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline transition-colors">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Master new vocabulary with intelligent spaced repetition
          </p>
        </div>
      </div>
    </div>
  );
}