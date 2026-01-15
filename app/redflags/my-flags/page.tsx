"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import redflagData from "@/data/redflags.json";

export default function MyFlagsPage() {
  const router = useRouter();
  const [redFlags, setRedFlags] = useState<string[]>([]);
  const [greenFlags, setGreenFlags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"red" | "green">("red");

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

  const generateShareLink = () => {
    const redIds = redFlags.map((id) => id.replace("r", "")).join(",");
    const greenIds = greenFlags.map((id) => id.replace("g", "")).join(",");
    const encoded = btoa(`${redIds}|${greenIds}`);
    router.push(`/redflags/my-flags/${encoded}`);
  };

  const totalSelected = redFlags.length + greenFlags.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Truth<span className="text-indigo-600">InSignals</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8 pb-32">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🪞</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Flags</h1>
          <p className="text-gray-500">Select your red flags 🚩 and green flags 💚 then share!</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab("red")}
            className={`flex-1 py-4 px-6 rounded-xl font-bold text-base transition-all ${
              activeTab === "red"
                ? "bg-red-100 text-red-600 border-2 border-red-300"
                : "bg-white text-gray-500 border-2 border-gray-200 hover:border-red-200"
            }`}
          >
            🚩 Red Flags {redFlags.length > 0 && `(${redFlags.length})`}
          </button>
          <button
            onClick={() => setActiveTab("green")}
            className={`flex-1 py-4 px-6 rounded-xl font-bold text-base transition-all ${
              activeTab === "green"
                ? "bg-green-100 text-green-600 border-2 border-green-300"
                : "bg-white text-gray-500 border-2 border-gray-200 hover:border-green-200"
            }`}
          >
            💚 Green Flags {greenFlags.length > 0 && `(${greenFlags.length})`}
          </button>
        </div>

        {/* Ad */}
        <div className="bg-white border border-dashed border-gray-300 rounded-lg p-5 text-center text-gray-400 text-sm mb-6">
          Advertisement
        </div>

        {/* Flags Grid */}
        {activeTab === "red" ? (
          <div>
            <div className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4">
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
                      : "bg-white text-gray-700 border-2 border-gray-200 hover:border-red-300 hover:bg-red-50"
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
            <div className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4">
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
                      : "bg-white text-gray-700 border-2 border-gray-200 hover:border-green-300 hover:bg-green-50"
                  }`}
                >
                  <span className="text-lg">{flag.emoji}</span>
                  <span>{flag.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link
            href="/redflags"
            className="inline-block px-6 py-3 text-gray-600 border-2 border-gray-200 rounded-xl font-semibold hover:border-gray-400 transition-all"
          >
            ← Back to Red Flags
          </Link>
        </div>
      </div>

      {/* Fixed Footer */}
      {totalSelected > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-gray-900">{totalSelected} selected</div>
              <div className="text-sm text-gray-500">
                {redFlags.length > 0 && `${redFlags.length} 🚩`}
                {redFlags.length > 0 && greenFlags.length > 0 && " • "}
                {greenFlags.length > 0 && `${greenFlags.length} 💚`}
              </div>
            </div>
            <button
              onClick={generateShareLink}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all"
            >
              Create & Share →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
