"use client";

import { useState } from "react";
import Link from "next/link";
import quizData from "@/data/quizzes.json";
import DisplayAd from "./components/DisplayAd";
import RelaxedAd from "./components/RelaxedAd";

const categories = [
  { id: "all", label: "All" },
  { id: "relationship", label: "Relationships" },
  { id: "psychology", label: "Psychology" },
  { id: "iq", label: "IQ & Logic" },
  { id: "personality", label: "Personality" },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredQuizzes = activeCategory === "all"
    ? quizData.quizzes
    : quizData.quizzes.filter(q => q.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat.id
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-300 border border-gray-700 hover:border-indigo-400 hover:text-indigo-400"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Ad */}
        <DisplayAd />

        {/* Quiz Grid */}
        {filteredQuizzes.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <div className="text-gray-400">No quizzes found in this category</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {filteredQuizzes.map((quiz) => (
              <Link href={`/quiz/${quiz.id}`} key={quiz.id}>
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-indigo-400 hover:shadow-md transition-all flex gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 ${
                    quiz.category === "relationship" ? "bg-red-900/50" :
                    quiz.category === "psychology" ? "bg-green-900/50" :
                    quiz.category === "iq" ? "bg-blue-900/50" : "bg-yellow-900/50"
                  }`}>
                    {quiz.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-100 mb-1">{quiz.title}</div>
                    {quiz.hook && <div className="text-sm text-gray-400 mb-2">{quiz.hook}</div>}
                    <div className="flex items-center gap-3 text-xs">
                      <span className={`px-2 py-1 rounded font-semibold uppercase ${
                        quiz.category === "relationship" ? "bg-red-900/50 text-red-400" :
                        quiz.category === "psychology" ? "bg-green-900/50 text-green-400" :
                        quiz.category === "iq" ? "bg-blue-900/50 text-blue-400" : "bg-yellow-900/50 text-yellow-400"
                      }`}>
                        {quiz.category}
                      </span>
                      <span className="text-gray-500">{quiz.questions.length} questions</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Relaxed Ad */}
        <RelaxedAd />

        {/* Footer */}
        <div className="text-center py-8 text-sm text-gray-500 border-t border-gray-800">
          © 2025 TruthInSignals. All rights reserved.
        </div>
      </div>
    </div>
  );
}
