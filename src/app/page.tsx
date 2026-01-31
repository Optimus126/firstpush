"use client";

import { useState } from "react";
import Link from "next/link";

const CATEGORIES = [
  { id: "fitness", name: "Fitness & Health", icon: "💪", color: "from-green-500 to-emerald-600", examples: ["Go to the gym", "Lose weight", "Run a 5K"] },
  { id: "career", name: "Career & Work", icon: "💼", color: "from-blue-500 to-indigo-600", examples: ["Get a promotion", "Find a new job", "Learn a skill"] },
  { id: "financial", name: "Financial", icon: "💰", color: "from-yellow-500 to-amber-600", examples: ["Save $10K", "Pay off debt", "Start investing"] },
  { id: "personal", name: "Personal Growth", icon: "🌱", color: "from-purple-500 to-violet-600", examples: ["Read more books", "Meditate daily", "Wake up earlier"] },
  { id: "relationships", name: "Relationships", icon: "❤️", color: "from-pink-500 to-rose-600", examples: ["Spend more quality time", "Reconnect with friends", "Better communication"] },
  { id: "education", name: "Education", icon: "📚", color: "from-cyan-500 to-teal-600", examples: ["Learn a language", "Get certified", "Take a course"] },
];

export default function HomePage() {
  const [activeGoal, setActiveGoal] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-4 pt-16 pb-12">
        <div className="text-center mb-16">
          <div className="text-6xl mb-4">🚀</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            FirstPush
          </h1>
          <p className="text-xl text-slate-400 mb-2">Stop overthinking. Start doing.</p>
          <p className="text-2xl font-semibold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            One goal. We'll give you the first push you need.
          </p>
        </div>

        {/* Problem / Solution */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="bg-red-900/20 border border-red-800/50 rounded-2xl p-6">
            <h3 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
              <span>❌</span> The Problem
            </h3>
            <ul className="text-slate-300 space-y-2 text-sm">
              <li>• You've said "I'll start Monday" for months</li>
              <li>• You have 10 goals but zero progress</li>
              <li>• Other apps track habits — but you never start</li>
              <li>• Overthinking kills your momentum</li>
            </ul>
          </div>
          <div className="bg-emerald-900/20 border border-emerald-800/50 rounded-2xl p-6">
            <h3 className="text-emerald-400 font-semibold mb-3 flex items-center gap-2">
              <span>✅</span> The Solution
            </h3>
            <ul className="text-slate-300 space-y-2 text-sm">
              <li>• Pick ONE goal — that's it</li>
              <li>• We break it down into the first tiny step</li>
              <li>• Templates show you exactly what to do</li>
              <li>• Can't quit until you face it</li>
            </ul>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { step: "1", title: "Pick One Goal", desc: "Not 10. Just one.", icon: "🎯" },
              { step: "2", title: "Choose Template", desc: "Pre-built first steps", icon: "📋" },
              { step: "3", title: "Get Your Push", desc: "We break it down small", icon: "🚀" },
              { step: "4", title: "Can't Quit Easy", desc: "Face it before you leave", icon: "🔒" },
            ].map((item) => (
              <div key={item.step} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 text-center">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="text-xs text-emerald-400 font-semibold mb-1">STEP {item.step}</div>
                <div className="text-white font-semibold mb-1">{item.title}</div>
                <div className="text-slate-400 text-sm">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white text-center mb-2">What's Your Goal?</h2>
          <p className="text-slate-400 text-center mb-8">Choose a category to see templates</p>
          
          <div className="grid md:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/goal/${cat.id}`}
                className={`bg-gradient-to-br ${cat.color} p-[1px] rounded-xl group hover:scale-[1.02] transition-transform`}
              >
                <div className="bg-slate-900 rounded-xl p-5 h-full">
                  <div className="text-3xl mb-2">{cat.icon}</div>
                  <div className="text-white font-semibold mb-2">{cat.name}</div>
                  <div className="text-slate-400 text-sm">
                    {cat.examples.map((ex, i) => (
                      <span key={i}>
                        {ex}{i < cat.examples.length - 1 ? " • " : ""}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/goal/fitness"
            className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-lg rounded-xl hover:opacity-90 transition-opacity"
          >
            Get Your First Push →
          </Link>
          <p className="text-slate-500 text-sm mt-4">Free. No signup required.</p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
        <p>Built with ❤️ by Captain & Optimus</p>
        <p className="mt-1">Part of the FirstPush suite</p>
      </div>
    </div>
  );
}
