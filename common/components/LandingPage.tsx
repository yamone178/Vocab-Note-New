import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, Target, TrendingUp, Sparkles, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30">
      {/* Navigation */}
      <nav className="border-b border-emerald-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-lg shadow-emerald-200">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-600 bg-clip-text text-transparent">
                VocabNote
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50">
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 hover:shadow-xl transition-all">
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6 animate-fadeInUp">
              <Sparkles className="h-4 w-4" />
              <span>Master vocabulary the smart way</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
              Build Your Vocabulary
              <span className="block bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                One Word at a Time
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
              Master new vocabulary with intelligent spaced repetition, flashcards, and quizzes. 
              Track your progress and learn efficiently.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
              <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 hover:shadow-xl transition-all text-lg px-8 py-6">
                <Link href="/auth/signup">
                  Start Learning Free
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-lg px-8 py-6">
                <Link href="/auth/login">
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Learn
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to accelerate your vocabulary learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Brain,
                title: "Smart Learning",
                description: "AI-powered spaced repetition adapts to your learning pace",
                color: "emerald"
              },
              {
                icon: Target,
                title: "Organized Categories",
                description: "Group words by topics, themes, or difficulty levels",
                color: "emerald"
              },
              {
                icon: TrendingUp,
                title: "Track Progress",
                description: "Visualize your improvement with detailed analytics",
                color: "emerald"
              },
              {
                icon: Sparkles,
                title: "Interactive Quizzes",
                description: "Test your knowledge with flashcards and quiz modes",
                color: "emerald"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white hover:shadow-lg hover:shadow-emerald-100 transition-all duration-300 group cursor-pointer"
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-200">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose VocabNote?
            </h2>
          </div>

          <div className="space-y-4">
            {[
              "Create unlimited vocabulary collections organized by category",
              "Practice with flashcards and adaptive quiz modes",
              "Track your learning progress with detailed statistics",
              "Use spaced repetition to retain words long-term",
              "Access your vocabulary anywhere, anytime",
              "Free to use with no hidden costs"
            ].map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl bg-white border border-emerald-100 hover:border-emerald-300 transition-all"
              >
                <CheckCircle2 className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                <span className="text-lg text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-600 to-emerald-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Expand Your Vocabulary?
          </h2>
          <p className="text-xl text-emerald-100 mb-10">
            Join thousands of learners and start your journey today. It's free!
          </p>
          <Button asChild size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50 shadow-xl hover:shadow-2xl transition-all text-lg px-10 py-6">
            <Link href="/auth/signup">
              Create Free Account
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p>© 2026 VocabNote. Master your vocabulary with intelligent learning.</p>
        </div>
      </footer>
    </div>
  );
}