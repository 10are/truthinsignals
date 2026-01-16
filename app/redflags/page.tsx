"use client";

import Link from "next/link";
import Image from "next/image";
import redflagData from "@/data/redflags.json";
import DisplayAd from "@/app/components/DisplayAd";

export default function RedFlagsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <Image src="/logo.png" alt="TruthInSignals" width={160} height={40} className="h-10 w-auto" priority />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/redflags" className="text-sm font-medium text-red-500">
              🚩 Red Flags
            </Link>
            <Link href="/redflags/my-flags" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
              My Flags
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-block bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold mb-3">
            🚩 Red Flags
          </span>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Is This a Red Flag?</h1>
          <p className="text-gray-500">Vote on relationship behaviors and see what others think</p>
        </div>

        {/* My Flags CTA */}
        <Link
          href="/redflags/my-flags"
          className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl p-5 mb-6 hover:border-red-400 transition-all"
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl">🪞</span>
            <div>
              <div className="font-semibold text-gray-900">My Flags</div>
              <div className="text-sm text-gray-500">Create your red 🚩 & green 💚 flags and share!</div>
            </div>
          </div>
          <span className="text-red-500 font-bold">→</span>
        </Link>

        {/* Ad */}
        <DisplayAd />

        {/* Poll Categories */}
        <div className="space-y-3">
          {redflagData.polls.map((poll) => (
            <Link
              href={`/redflags/${poll.id}`}
              key={poll.id}
              className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-400 transition-all"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                {poll.emoji}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{poll.title}</h3>
                <p className="text-sm text-gray-500">{poll.description}</p>
                <span className="text-xs text-indigo-600 font-medium">{poll.items.length} items to vote</span>
              </div>
              <span className="text-gray-400">→</span>
            </Link>
          ))}
        </div>

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-block px-6 py-3 text-gray-600 border border-gray-200 rounded-lg font-medium hover:border-gray-400 transition-all"
          >
            ← Back to Quizzes
          </Link>
        </div>
      </div>
    </div>
  );
}
