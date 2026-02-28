import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6fef9] px-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to VocabNote
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Master new vocabulary with intelligent spaced repetition
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-emerald-100 shadow-[0_1px_3px_rgba(16,185,129,0.06)]">
            <CardHeader>
              <CardTitle className="text-emerald-600">🚀 Get Started</CardTitle>
              <CardDescription>
                Create your account and start building your vocabulary
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-emerald-100 shadow-[0_1px_3px_rgba(16,185,129,0.06)]">
            <CardHeader>
              <CardTitle className="text-emerald-600">🔑 Welcome Back</CardTitle>
              <CardDescription>
                Continue your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full border-emerald-200 text-emerald-600 hover:bg-emerald-50">
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-gray-500">
            Join thousands of learners improving their vocabulary every day
          </p>
        </div>
      </div>
    </div>
  );
}