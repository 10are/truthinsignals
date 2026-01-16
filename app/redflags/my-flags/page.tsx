"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
              onClick={generateShareLink}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
            >
              Create & Share →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
