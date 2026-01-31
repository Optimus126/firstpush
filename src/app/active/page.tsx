"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ActiveGoalContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const goalName = searchParams.get("goal") || "Your Goal";
  
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [quitReason, setQuitReason] = useState("");
  const [day, setDay] = useState(1);
  const [completed, setCompleted] = useState(false);

  const motivationalQuotes = [
    "You showed up. That's more than most.",
    "One day at a time. You've got this.",
    "Small progress is still progress.",
    "The only bad workout is the one that didn't happen.",
    "You're building something. Keep going.",
    "Discipline is choosing between what you want now and what you want most.",
    "You don't have to be extreme, just consistent.",
  ];

  const [quote] = useState(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);

  const handleQuitAttempt = () => {
    setShowQuitModal(true);
  };

  const handleConfirmQuit = () => {
    if (!quitReason.trim()) return;
    // In real app, save this data
    router.push(`/reflection?goal=${encodeURIComponent(goalName)}&status=quit&reason=${encodeURIComponent(quitReason)}`);
  };

  const handleComplete = () => {
    setCompleted(true);
    // Confetti would go here
    setTimeout(() => {
      router.push(`/reflection?goal=${encodeURIComponent(goalName)}&status=completed`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleQuitAttempt}
            className="text-slate-500 hover:text-slate-300 text-sm"
          >
            ✕ Exit
          </button>
          <div className="text-center">
            <div className="text-xs text-slate-500">YOUR ACTIVE GOAL</div>
            <div className="text-sm font-semibold text-emerald-400">Day {day}</div>
          </div>
          <div className="w-16"></div>
        </div>

        {/* Goal Card */}
        <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 p-[1px] rounded-2xl mb-8">
          <div className="bg-slate-900 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">🎯</div>
            <h1 className="text-2xl font-bold text-white mb-2">{goalName}</h1>
            <p className="text-slate-400">Focus on this. Nothing else.</p>
          </div>
        </div>

        {/* Daily Check-in */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
          <h3 className="text-white font-semibold mb-4">Today's Check-in</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-slate-400 mb-3">Did you take action toward your goal today?</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setDay(d => d + 1)}
                  className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors"
                >
                  ✅ Yes, I did!
                </button>
                <button
                  onClick={() => {}}
                  className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold rounded-xl transition-colors"
                >
                  😔 Not today
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Motivation */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 mb-6 text-center">
          <div className="text-3xl mb-3">💡</div>
          <p className="text-slate-300 italic">"{quote}"</p>
        </div>

        {/* Progress */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-400 text-sm">Progress</span>
            <span className="text-emerald-400 text-sm font-semibold">{day} days active</span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
              style={{ width: `${Math.min(day * 10, 100)}%` }}
            />
          </div>
          <p className="text-slate-500 text-xs mt-2">Keep going! Consistency is key.</p>
        </div>

        {/* Complete Goal */}
        <button
          onClick={handleComplete}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity mb-4"
        >
          🎉 I Achieved This Goal!
        </button>

        <Link
          href="/"
          className="block text-center text-slate-500 text-sm hover:text-slate-400"
        >
          Add another goal (not recommended)
        </Link>
      </div>

      {/* Quit Modal */}
      {showQuitModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-2">Wait!</h2>
            <p className="text-slate-400 mb-4">
              You can't just quit without facing it. Why are you leaving?
            </p>
            
            <div className="space-y-3 mb-4">
              {["Too hard", "Lost motivation", "Life got busy", "Changed my mind", "Other"].map((reason) => (
                <button
                  key={reason}
                  onClick={() => setQuitReason(reason)}
                  className={`w-full py-3 rounded-lg text-left px-4 transition-colors ${
                    quitReason === reason
                      ? "bg-red-600 text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            {quitReason === "Other" && (
              <textarea
                placeholder="Tell us why..."
                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white text-sm mb-4"
                rows={3}
              />
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowQuitModal(false)}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg"
              >
                Keep Going
              </button>
              <button
                onClick={handleConfirmQuit}
                disabled={!quitReason}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 rounded-lg"
              >
                Quit Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Completion Celebration */}
      {completed && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="text-8xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-2">Congratulations!</h2>
            <p className="text-emerald-400">You achieved your goal!</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ActiveGoalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>}>
      <ActiveGoalContent />
    </Suspense>
  );
}
