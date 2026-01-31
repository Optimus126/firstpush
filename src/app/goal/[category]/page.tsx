"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const CATEGORIES: Record<string, { name: string; icon: string; color: string }> = {
  fitness: { name: "Fitness & Health", icon: "💪", color: "from-green-500 to-emerald-600" },
  career: { name: "Career & Work", icon: "💼", color: "from-blue-500 to-indigo-600" },
  financial: { name: "Financial", icon: "💰", color: "from-yellow-500 to-amber-600" },
  personal: { name: "Personal Growth", icon: "🌱", color: "from-purple-500 to-violet-600" },
  relationships: { name: "Relationships", icon: "❤️", color: "from-pink-500 to-rose-600" },
  education: { name: "Education", icon: "📚", color: "from-cyan-500 to-teal-600" },
};

const TEMPLATES: Record<string, Array<{
  id: string;
  title: string;
  description: string;
  timeEstimate: string;
  firstPush: string[];
  obstacles: string[];
  motivation: string;
}>> = {
  fitness: [
    {
      id: "gym-start",
      title: "Start Going to the Gym",
      description: "Finally make it happen. No more excuses.",
      timeEstimate: "Week 1 focus",
      firstPush: [
        "Pick a gym within 15 min of home or work",
        "Sign up TODAY (not tomorrow)",
        "Set gym clothes out tonight",
        "Go for just 15 minutes — that's it",
        "Walk on treadmill. Nothing else required.",
      ],
      obstacles: ["No time", "Too tired after work", "Don't know what to do"],
      motivation: "You don't have to be great to start. You have to start to be great.",
    },
    {
      id: "lose-weight",
      title: "Lose Weight",
      description: "Start with small changes, not a complete overhaul.",
      timeEstimate: "Week 1 focus",
      firstPush: [
        "Drink water before every meal",
        "Walk 10 minutes after dinner",
        "Cut one sugary drink per day",
        "Track what you eat (just observe, no judgment)",
        "Sleep 30 min earlier tonight",
      ],
      obstacles: ["Love food", "Hate diets", "No willpower"],
      motivation: "Progress, not perfection. Small steps compound.",
    },
    {
      id: "run-5k",
      title: "Run a 5K",
      description: "From zero to 5K. Couch to finish line.",
      timeEstimate: "8 weeks",
      firstPush: [
        "Download a Couch to 5K app",
        "Get running shoes (any shoes work to start)",
        "Do Day 1: Walk 5 min, jog 1 min, repeat",
        "Schedule 3 days this week",
        "Tell one person your goal",
      ],
      obstacles: ["Can't run", "Bad knees", "Embarrassed"],
      motivation: "Everyone starts somewhere. Your first step is faster than everyone on the couch.",
    },
  ],
  career: [
    {
      id: "new-job",
      title: "Find a New Job",
      description: "Stop dreaming. Start applying.",
      timeEstimate: "This week",
      firstPush: [
        "Update LinkedIn headline to 'Open to Work'",
        "Search jobs for 15 minutes",
        "Save 3 interesting listings",
        "Apply to ONE job today",
        "Tell someone you're looking",
      ],
      obstacles: ["No time", "Resume not ready", "Scared of change"],
      motivation: "The job you hate is stealing time from the career you deserve.",
    },
    {
      id: "get-promoted",
      title: "Get a Promotion",
      description: "Stop waiting. Start positioning.",
      timeEstimate: "90 day focus",
      firstPush: [
        "Write down what your next level looks like",
        "Schedule 1:1 with your manager",
        "Ask: 'What would it take for me to get promoted?'",
        "Take on one visible project",
        "Document your wins weekly",
      ],
      obstacles: ["Politics", "No openings", "Don't deserve it"],
      motivation: "You don't get what you deserve. You get what you negotiate.",
    },
    {
      id: "learn-skill",
      title: "Learn a New Skill",
      description: "Invest in yourself. 30 min a day.",
      timeEstimate: "30 days",
      firstPush: [
        "Pick ONE skill (not three)",
        "Find a free course or YouTube tutorial",
        "Block 30 min tomorrow morning",
        "Complete lesson 1 today",
        "Set phone reminder for daily practice",
      ],
      obstacles: ["No time", "Too old", "Won't use it"],
      motivation: "In 30 days you can be 30 days ahead or exactly where you are now.",
    },
  ],
  financial: [
    {
      id: "save-10k",
      title: "Save $10,000",
      description: "Build your safety net. One paycheck at a time.",
      timeEstimate: "12 months",
      firstPush: [
        "Open a separate savings account",
        "Set up auto-transfer of $50/week",
        "Cancel one subscription you forgot about",
        "Check your balance weekly (every Sunday)",
        "Celebrate every $1,000 milestone",
      ],
      obstacles: ["Not enough income", "Always something", "Can't save"],
      motivation: "$50/week = $2,600/year. That's a start. That's more than zero.",
    },
    {
      id: "pay-debt",
      title: "Pay Off Debt",
      description: "Face it. Attack it. Kill it.",
      timeEstimate: "Start this week",
      firstPush: [
        "List ALL your debts (no hiding)",
        "Pick the smallest one first",
        "Pay $20 extra on it this week",
        "Set up auto-pay minimums on others",
        "Track your total debt monthly",
      ],
      obstacles: ["Too much", "Overwhelming", "Interest is killing me"],
      motivation: "The best time to start was yesterday. The second best time is now.",
    },
  ],
  personal: [
    {
      id: "wake-early",
      title: "Wake Up Earlier",
      description: "Own your morning. Own your day.",
      timeEstimate: "2 weeks",
      firstPush: [
        "Set alarm 15 min earlier (not 2 hours)",
        "Put phone across the room",
        "Prepare coffee/clothes night before",
        "Go to bed 15 min earlier tonight",
        "Have ONE thing to look forward to in morning",
      ],
      obstacles: ["Not a morning person", "Need sleep", "Snooze addiction"],
      motivation: "Win the morning, win the day.",
    },
    {
      id: "read-more",
      title: "Read More Books",
      description: "10 pages a day. That's 12+ books a year.",
      timeEstimate: "Daily habit",
      firstPush: [
        "Pick ONE book (not a list of 50)",
        "Put it on your nightstand",
        "Read 10 pages before bed tonight",
        "Delete social media from phone (or time limit)",
        "Track pages in a simple note",
      ],
      obstacles: ["No time", "Can't focus", "Fall asleep"],
      motivation: "Leaders are readers. 10 pages a day changes your life.",
    },
  ],
  relationships: [
    {
      id: "quality-time",
      title: "More Quality Time",
      description: "Be present. Put the phone down.",
      timeEstimate: "This week",
      firstPush: [
        "Schedule one distraction-free hour",
        "Put phones in another room",
        "Ask a real question and listen",
        "Plan one activity together",
        "Say thank you for something specific",
      ],
      obstacles: ["Too busy", "They're always on phone too", "Awkward"],
      motivation: "Connection is a choice. Choose it today.",
    },
  ],
  education: [
    {
      id: "learn-language",
      title: "Learn a New Language",
      description: "15 minutes a day. Consistency over intensity.",
      timeEstimate: "Daily habit",
      firstPush: [
        "Download Duolingo or Babbel",
        "Set 15-min daily reminder",
        "Complete lesson 1 right now",
        "Learn 5 words today",
        "Watch one YouTube video in that language",
      ],
      obstacles: ["No talent for languages", "Will forget", "No one to practice with"],
      motivation: "Every expert was once a beginner. 15 min/day = fluent in a year.",
    },
  ],
};

export default function GoalCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const category = params.category as string;
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  const categoryInfo = CATEGORIES[category];
  const templates = TEMPLATES[category] || [];
  
  if (!categoryInfo) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🤔</div>
          <p className="text-white">Category not found</p>
          <Link href="/" className="text-emerald-400 hover:underline mt-4 block">← Back home</Link>
        </div>
      </div>
    );
  }

  const activeTemplate = templates.find(t => t.id === selectedTemplate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="text-slate-400 hover:text-white">← Back</Link>
        </div>
        
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">{categoryInfo.icon}</div>
          <h1 className="text-3xl font-bold text-white mb-2">{categoryInfo.name}</h1>
          <p className="text-slate-400">Choose a goal template or create your own</p>
        </div>

        {/* Templates */}
        {!selectedTemplate ? (
          <div className="space-y-4">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-left hover:border-slate-600 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">{template.title}</h3>
                    <p className="text-slate-400 text-sm mb-3">{template.description}</p>
                    <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">{template.timeEstimate}</span>
                  </div>
                  <span className="text-slate-500 text-2xl">→</span>
                </div>
              </button>
            ))}
            
            {/* Custom Goal Option */}
            <button
              onClick={() => router.push(`/goal/${category}/custom`)}
              className="w-full bg-slate-800/30 border border-dashed border-slate-600 rounded-xl p-6 text-left hover:border-slate-500 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">✏️</div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-300">Create Custom Goal</h3>
                  <p className="text-slate-500 text-sm">Start from scratch</p>
                </div>
              </div>
            </button>
          </div>
        ) : activeTemplate && (
          /* Template Detail View */
          <div className="space-y-6">
            <button
              onClick={() => setSelectedTemplate(null)}
              className="text-slate-400 hover:text-white text-sm"
            >
              ← Choose different goal
            </button>
            
            <div className={`bg-gradient-to-r ${categoryInfo.color} p-[1px] rounded-2xl`}>
              <div className="bg-slate-900 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-2">{activeTemplate.title}</h2>
                <p className="text-slate-400 mb-6">{activeTemplate.description}</p>
                
                {/* First Push Section */}
                <div className="bg-emerald-900/20 border border-emerald-800/50 rounded-xl p-6 mb-6">
                  <h3 className="text-emerald-400 font-semibold mb-4 flex items-center gap-2">
                    🚀 Your First Push — Do These NOW
                  </h3>
                  <div className="space-y-3">
                    {activeTemplate.firstPush.map((step, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {i + 1}
                        </div>
                        <span className="text-slate-200">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Obstacles */}
                <div className="bg-amber-900/20 border border-amber-800/50 rounded-xl p-6 mb-6">
                  <h3 className="text-amber-400 font-semibold mb-3">⚠️ Obstacles You'll Face</h3>
                  <div className="flex flex-wrap gap-2">
                    {activeTemplate.obstacles.map((obs, i) => (
                      <span key={i} className="bg-amber-900/30 text-amber-300 px-3 py-1 rounded-full text-sm">
                        "{obs}"
                      </span>
                    ))}
                  </div>
                  <p className="text-slate-400 text-sm mt-3">These are normal. Expect them. Push through anyway.</p>
                </div>

                {/* Motivation */}
                <div className="bg-slate-800 rounded-xl p-6 mb-8 text-center">
                  <div className="text-4xl mb-3">💡</div>
                  <p className="text-xl text-white italic">"{activeTemplate.motivation}"</p>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => router.push(`/active?goal=${encodeURIComponent(activeTemplate.title)}`)}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
                  >
                    Start This Goal →
                  </button>
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="px-6 py-4 border border-slate-600 text-slate-400 rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    Pick Different Goal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
