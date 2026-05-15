import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, Target, TrendingUp, Sparkles, CheckCircle2, ArrowRight, Zap, Globe, Volume2, RotateCw } from "lucide-react";
import { useState } from "react";

export default function LandingPage() {


  const [isFlipped, setIsFlipped] = useState(false);

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
                {/* <Button asChild size="lg" variant="outline" className="rounded-full px-8 py-6 text-base border-slate-200 hover:bg-slate-50 text-slate-700">
                  <Link href="/auth/login">
                    See How It Works
                  </Link>
                </Button> */}
              </div>
            </div>
{/* Hero Visual Flashcard */}
            <div className="flex-1 flex flex-col items-center justify-center relative perspective-1000 lg:h-[600px] w-full">
              <div 
                onClick={() => setIsFlipped(!isFlipped)}
                className={`relative w-full max-w-[440px] aspect-[1.5/1] cursor-pointer transition-all duration-700 preserve-3d shadow-2xl rounded-[40px] ${
                  isFlipped ? "rotate-y-180" : "-rotate-2 hover:rotate-0"
                }`}
              >
                {/* FRONT: The Word */}
                <div className="absolute inset-0 backface-hidden bg-white rounded-[40px] border border-slate-100 flex flex-col items-center justify-center p-10 text-center overflow-hidden z-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-emerald-50/50 -z-10" />
                  
                  <div className="flex items-center gap-2 text-emerald-600 font-bold mb-6">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-xs uppercase tracking-widest">New Word</span>
                  </div>
                  
                  <h2 className="text-6xl font-black text-slate-900 mb-4 tracking-tighter">
                    Welcome
                  </h2>
                  
                  <div className="px-5 py-1.5 bg-emerald-100/50 text-emerald-700 rounded-full text-sm font-bold mb-10">
                    exclamation
                  </div>
                  
                  <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                    <RotateCw className="h-4 w-4" />
                    <span>Click to see definition</span>
                  </div>
                </div>

                {/* BACK: The Definition */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-[40px] border border-emerald-100 flex flex-col p-10 text-left shadow-inner z-0">
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50/30 to-white -z-10" />

                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 block mb-1">Definition</span>
                      <h3 className="text-2xl font-bold text-slate-900">Welcome</h3>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
                        <Volume2 className="h-5 w-5 text-emerald-600" />
                    </div>
                  </div>
                  
                  <div className="flex-grow">
                    <p className="text-lg text-slate-700 leading-snug font-medium mb-6">
                      Used to greet someone in a polite or friendly way upon their arrival.
                    </p>

                    <div className="relative p-5 bg-slate-50 rounded-2xl border-l-4 border-emerald-500">
                       <span className="absolute -top-3 left-4 px-2 bg-white text-[10px] font-bold text-slate-400 uppercase tracking-wider">Example</span>
                       <p className="text-sm italic text-slate-600 leading-relaxed">
                          "A warm <span className="text-emerald-700 font-semibold underline decoration-emerald-300 underline-offset-2">welcome</span> to our home!"
                       </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-center gap-2 text-slate-300 text-[10px] font-bold uppercase tracking-widest">
                    <RotateCw className="h-3 w-3" />
                    <span>Click to flip back</span>
                  </div>
                </div>
              </div>

              {/* Visual Stack Effect */}
              {!isFlipped && (
                <>
                    <div className="absolute -z-10 w-full max-w-[440px] aspect-[1.5/1] bg-slate-200/40 rounded-[40px] transform rotate-1 translate-x-2 translate-y-2" />
                    <div className="absolute -z-20 w-full max-w-[440px] aspect-[1.5/1] bg-slate-100/40 rounded-[40px] transform rotate-4 translate-x-4 translate-y-4" />
                </>
              )}
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
                  Watch your vocabulary grow over time. 
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
              
            </div>
            
            <div className="relative rounded-3xl bg-emerald-600 p-8 sm:p-12 text-center text-white overflow-hidden shadow-xl shadow-emerald-600/20">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <Globe className="h-16 w-16 mx-auto mb-6 opacity-80" />
              <h3 className="text-3xl font-bold mb-5 relative z-10">Ready to start?</h3>
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