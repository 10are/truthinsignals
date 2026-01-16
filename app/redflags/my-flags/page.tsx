"use client";

import { useState } from "react";
import Link from "next/link";
import redflagData from "@/data/redflags.json";

interface Flag {
  id: string;
  text: string;
  emoji: string;
}

export default function MyFlagsPage() {
  const [redFlags, setRedFlags] = useState<string[]>([]);
  const [greenFlags, setGreenFlags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"red" | "green">("red");
  const [showResult, setShowResult] = useState(false);

  const toggleRedFlag = (id: string) => {
    if (redFlags.includes(id)) {
      setRedFlags(redFlags.filter((f) => f !== id));
    } else {
      setRedFlags([...redFlags, id]);
    }
  };

  const toggleGreenFlag = (id: string) => {
    if (greenFlags.includes(id)) {
      setGreenFlags(greenFlags.filter((f) => f !== id));
    } else {
      setGreenFlags([...greenFlags, id]);
    }
  };

  const totalSelected = redFlags.length + greenFlags.length;

  const selectedRedFlags: Flag[] = redFlags
    .map((id) => redflagData.myRedFlags.find((f) => f.id === id))
    .filter(Boolean) as Flag[];

  const selectedGreenFlags: Flag[] = greenFlags
    .map((id) => redflagData.myGreenFlags.find((f) => f.id === id))
    .filter(Boolean) as Flag[];

  if (showResult) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-md mx-auto px-4 py-8">
          {/* Shareable Card - Screenshot This! */}
          <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-2xl p-5 border border-gray-700 shadow-2xl mb-6">
            {/* Header */}
            <div className="text-center mb-5">
              <div className="flex justify-center gap-2 text-3xl mb-2">
                <span>🚩</span>
                <span>💚</span>
              </div>
              <div className="text-lg font-bold text-gray-100">My Flags</div>
              <div className="text-xs text-gray-500">Here are my honest red & green flags</div>
            </div>

            {/* Red Flags */}
            {selectedRedFlags.length > 0 && (
              <div className="mb-4">
                <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <span>🚩</span> Red Flags ({selectedRedFlags.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedRedFlags.map((flag) => (
                    <div
                      key={flag.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-900/40 border border-red-800/60 rounded-full text-xs"
                    >
                      <span>{flag.emoji}</span>
                      <span className="text-red-200">{flag.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Green Flags */}
            {selectedGreenFlags.length > 0 && (
              <div className="mb-4">
                <div className="text-xs font-bold text-green-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <span>💚</span> Green Flags ({selectedGreenFlags.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedGreenFlags.map((flag) => (
                    <div
                      key={flag.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-900/40 border border-green-800/60 rounded-full text-xs"
                    >
                      <span>{flag.emoji}</span>
                      <span className="text-green-200">{flag.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="flex justify-center gap-6 py-3 border-t border-b border-gray-700/50 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{selectedRedFlags.length}</div>
                <div className="text-xs text-gray-500">Red Flags</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{selectedGreenFlags.length}</div>
                <div className="text-xs text-gray-500">Green Flags</div>
              </div>
            </div>

            {/* Watermark */}
            <div className="text-center">
              <div className="text-xs text-gray-500">truthinsignals.com</div>
            </div>
          </div>

          {/* Screenshot Hint */}
          <div className="text-center mb-6 px-4 py-3 bg-indigo-600/20 border border-indigo-500/30 rounded-xl">
            <div className="text-indigo-300 text-sm font-medium mb-1">Share your flags!</div>
            <div className="text-indigo-400/70 text-xs">Take a screenshot and share with friends</div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowResult(false)}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all"
            >
              Edit Flags
            </button>
            <Link
              href="/redflags"
              className="flex-1 text-center bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold py-3 px-4 rounded-xl border border-gray-700 transition-all"
            >
              More Polls
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-8 pb-32">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-100 mb-2">My Flags</h1>
          <p className="text-gray-400">Select your red flags 🚩 and green flags 💚 then share!</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab("red")}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold text-sm transition-all ${
              activeTab === "red"
                ? "bg-red-900/50 text-red-400 border border-red-700"
                : "bg-gray-800 text-gray-400 border border-gray-700 hover:border-red-700"
            }`}
          >
            🚩 Red Flags {redFlags.length > 0 && `(${redFlags.length})`}
          </button>
          <button
            onClick={() => setActiveTab("green")}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold text-sm transition-all ${
              activeTab === "green"
                ? "bg-green-900/50 text-green-400 border border-green-700"
                : "bg-gray-800 text-gray-400 border border-gray-700 hover:border-green-700"
            }`}
          >
            💚 Green Flags {greenFlags.length > 0 && `(${greenFlags.length})`}
          </button>
        </div>

        {/* Flags Grid */}
        {activeTab === "red" ? (
          <div>
            <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">
              My Red Flags 🚩
            </div>
            <div className="flex flex-wrap gap-3">
              {redflagData.myRedFlags.map((flag) => (
                <button
                  key={flag.id}
                  onClick={() => toggleRedFlag(flag.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all ${
                    redFlags.includes(flag.id)
                      ? "bg-red-500 text-white border-2 border-red-500"
                      : "bg-gray-800 text-gray-300 border-2 border-gray-700 hover:border-red-500 hover:bg-red-900/30"
                  }`}
                >
                  <span className="text-lg">{flag.emoji}</span>
                  <span>{flag.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">
              My Green Flags 💚
            </div>
            <div className="flex flex-wrap gap-3">
              {redflagData.myGreenFlags.map((flag) => (
                <button
                  key={flag.id}
                  onClick={() => toggleGreenFlag(flag.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all ${
                    greenFlags.includes(flag.id)
                      ? "bg-green-500 text-white border-2 border-green-500"
                      : "bg-gray-800 text-gray-300 border-2 border-gray-700 hover:border-green-500 hover:bg-green-900/30"
                  }`}
                >
                  <span className="text-lg">{flag.emoji}</span>
                  <span>{flag.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        </div>

      {/* Fixed Footer */}
      {totalSelected > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4 shadow-md z-50">
          <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
            <div>
              <div className="font-bold text-gray-100">{totalSelected} selected</div>
              <div className="text-sm text-gray-400">
                {redFlags.length > 0 && `${redFlags.length} 🚩`}
                {redFlags.length > 0 && greenFlags.length > 0 && " • "}
                {greenFlags.length > 0 && `${greenFlags.length} 💚`}
              </div>
            </div>
            <button
              onClick={() => setShowResult(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
            >
              Create Card →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
