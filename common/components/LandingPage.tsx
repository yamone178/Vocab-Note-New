import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, Target, TrendingUp, Sparkles, CheckCircle2, ArrowRight, Zap, Globe } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-emerald-200 selection:text-emerald-900 font-sans">
      {/* Navigation */}
      <nav className="border-b border-slate-200/50 bg-white/80 backdrop-blur-md fixed top-0 w-full z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                Vocab<span className="text-emerald-600">Note</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild className="text-slate-600 hover:text-slate-900 hidden sm:flex">
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6 shadow-sm hover:shadow-md transition-all">
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Decorative Blob */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 opacity-20 pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-emerald-300 to-teal-100 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Hero Text */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-sm font-medium text-slate-600 mb-6">
                <Sparkles className="h-4 w-4 text-emerald-500" />
                <span>The smart way to build fluency</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.1]">
                Master new words <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                  in record time.
                </span>
              </h1>
              
              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
                Stop forgetting the vocabulary you learn. VocabNote uses AI-powered spaced repetition, adaptive quizzes, and smart categorization to lock words into your long-term memory.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 py-6 text-base group shadow-lg shadow-emerald-600/20">
                  <Link href="/auth/signup">
                    Start Learning Free
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-8 py-6 text-base border-slate-200 hover:bg-slate-50 text-slate-700">
                  <Link href="/auth/login">
                    See How It Works
                  </Link>
                </Button>
              </div>
            </div>

            {/* Hero Visual Mockup */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none lg:h-[500px] flex items-center justify-center">
              {/* Main Flashcard */}
              <div className="relative z-20 w-full max-w-sm bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Spanish • Hard</span>
                  <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                </div>
                <div className="text-center mb-10">
                  <h3 className="text-4xl font-bold text-slate-900 mb-2">desarrollo</h3>
                  <p className="text-lg text-slate-500 italic">noun</p>
                </div>
                <div className="space-y-3">
                  <Button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl py-6">Show Translation</Button>
                </div>
              </div>
              
              {/* Background Card */}
              <div className="absolute z-10 w-full max-w-sm bg-emerald-50 rounded-3xl shadow-lg border border-emerald-100 p-8 transform rotate-[4deg] translate-x-4 translate-y-4 opacity-70">
                 <div className="h-48"></div> {/* Spacer */}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Bento Box Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 max-w-2xl">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">
              A complete toolkit for language learners.
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to capture, organize, and memorize vocabulary effectively, all in one seamless experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Large Feature 1 */}
            <div className="md:col-span-2 bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:border-emerald-200 transition-colors group">
              <div className="h-12 w-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-6 shadow-sm">
                <Brain className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Spaced Repetition Engine</h3>
              <p className="text-slate-600 max-w-md leading-relaxed">
                Our algorithm calculates the exact moment you are about to forget a word, and prompts you to review it. Learn faster and retain information forever.
              </p>
            </div>

            {/* Small Feature 1 */}
            <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100 hover:border-emerald-200 transition-colors">
              <div className="h-12 w-12 rounded-2xl bg-white border border-emerald-200 flex items-center justify-center mb-6 shadow-sm">
                <Target className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Smart Categories</h3>
              <p className="text-slate-600">Organize your lists by topics, difficulty, or source material effortlessly.</p>
            </div>

            {/* Small Feature 2 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:border-emerald-200 transition-colors">
              <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Quick Capture</h3>
              <p className="text-slate-600">Add words on the fly while reading or watching movies.</p>
            </div>

            {/* Large Feature 2 */}
            <div className="md:col-span-2 bg-slate-900 rounded-3xl p-8 border border-slate-800 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10">
                <div className="h-12 w-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6">
                  <TrendingUp className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Detailed Analytics</h3>
                <p className="text-slate-400 max-w-md leading-relaxed">
                  Watch your vocabulary grow over time. Track your daily streaks, retention rates, and most difficult words with beautiful, easy-to-read charts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits / Checklist Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6 tracking-tight">
                Designed for serious learners.
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Whether you're studying for an exam, learning a new language for travel, or just expanding your native vocabulary, VocabNote gives you the edge.
              </p>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                {[
                  "Unlimited collections",
                  "Audio pronunciations",
                  "Detailed statistics",
                  "Cross-device sync",
                  "Offline mode support",
                  "100% Free to start"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    </div>
                    <span className="text-slate-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative rounded-3xl bg-emerald-600 p-8 sm:p-12 text-center text-white overflow-hidden shadow-xl shadow-emerald-600/20">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <Globe className="h-16 w-16 mx-auto mb-6 opacity-80" />
              <h3 className="text-3xl font-bold mb-4 relative z-10">Ready to start?</h3>
              <p className="text-emerald-100 mb-8 relative z-10">
                Join thousands of learners building their vocabulary right now.
              </p>
              <Button asChild size="lg" className="w-full sm:w-auto bg-white text-emerald-700 hover:bg-emerald-50 rounded-full px-8 py-6 text-base font-bold shadow-lg relative z-10">
                <Link href="/auth/signup">
                  Create Your Free Account
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-600" />
            <span className="text-lg font-bold text-slate-900">VocabNote</span>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} VocabNote. Master your vocabulary with intelligent learning.
          </p>
          <div className="flex gap-4">
             {/* Placeholder for legal links */}
            <Link href="#" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">Privacy</Link>
            <Link href="#" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}