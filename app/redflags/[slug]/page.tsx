"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import redflagData from "@/data/redflags.json";

interface PollItem {
  id: number;
  text: string;
  yesPercent: number;
}

interface Poll {
  id: string;
  title: string;
  emoji: string;
  description: string;
  items: PollItem[];
}

export default function PollPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [poll, setPoll] = useState<Poll | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [votes, setVotes] = useState<Record<number, "yes" | "no">>({});
  const [showResult, setShowResult] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const foundPoll = redflagData.polls.find((p) => p.id === slug);
    if (foundPoll) {
      setPoll(foundPoll as Poll);
    }
  }, [slug]);

  const handleVote = (vote: "yes" | "no") => {
    const item = poll!.items[currentIndex];
    setVotes({ ...votes, [item.id]: vote });
    setShowResult(true);

    setTimeout(() => {
      if (currentIndex < poll!.items.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowResult(false);
      } else {
        setIsComplete(true);
      }
    }, 1500);
  };

  if (!poll) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-xl font-bold text-gray-100 mb-4">Poll not found</h2>
          <Link href="/redflags" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all">
            Back to Red Flags
          </Link>
        </div>
      </div>
    );
  }

  if (isComplete) {
    const yesCount = Object.values(votes).filter(v => v === "yes").length;

    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center mb-6">
            <div className="text-5xl mb-4">🚩</div>
            <h2 className="text-xl font-bold text-gray-100 mb-2">Your Results</h2>
            <p className="text-gray-400 mb-6">
              You flagged <strong className="text-red-400">{yesCount}</strong> out of <strong>{poll.items.length}</strong> as red flags
            </p>

            <div className="text-left mb-6">
              {poll.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg mb-2">
                  <span className={`w-8 h-8 rounded flex items-center justify-center text-sm ${votes[item.id] === "yes" ? "bg-red-900/50" : "bg-green-900/50"}`}>
                    {votes[item.id] === "yes" ? "🚩" : "✓"}
                  </span>
                  <span className="flex-1 text-sm text-gray-300">{item.text}</span>
                  <span className="text-xs text-gray-500">{item.yesPercent}% agree</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setVotes({});
                  setShowResult(false);
                  setIsComplete(false);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
              >
                Vote Again
              </button>
              <Link href="/redflags" className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-3 px-6 rounded-lg border border-gray-600 transition-all">
                More Polls
              </Link>
              <button
                onClick={() => {
                  const shareUrl = `https://www.truthinsignals.com/redflags/${poll.id}`;
                  const text = `I flagged ${yesCount}/${poll.items.length} in "${poll.title}"`;
                  if (navigator.share) {
                    navigator.share({ title: poll.title, text, url: shareUrl });
                  } else {
                    navigator.clipboard.writeText(`${text} ${shareUrl}`);
                    alert("Copied!");
                  }
                }}
                className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-3 px-6 rounded-lg border border-gray-600 transition-all"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const item = poll.items[currentIndex];
  const progress = ((currentIndex + 1) / poll.items.length) * 100;
  const userVote = votes[item.id];

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {currentIndex === 0 && !showResult && (
          <div className="text-center mb-8">
            <span className="text-4xl block mb-3">{poll.emoji}</span>
            <h1 className="text-xl font-bold text-gray-100 mb-2">{poll.title}</h1>
            <p className="text-gray-400 text-sm">{poll.description}</p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="h-1 bg-gray-700 rounded-full mb-8 overflow-hidden">
          <div className="h-full bg-red-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span>🚩</span>
            <span className="text-sm font-semibold text-red-400 uppercase tracking-wide">Is this a red flag?</span>
          </div>

          <div className="text-lg font-semibold text-gray-100 text-center mb-6">{item.text}</div>

          {!showResult ? (
            <div className="flex gap-3">
              <button
                onClick={() => handleVote("yes")}
                className="flex-1 py-4 bg-red-900/30 border border-red-800 text-red-400 font-semibold rounded-lg hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
              >
                🚩 Red Flag
              </button>
              <button
                onClick={() => handleVote("no")}
                className="flex-1 py-4 bg-green-900/30 border border-green-800 text-green-400 font-semibold rounded-lg hover:bg-green-500 hover:text-white hover:border-green-500 transition-all"
              >
                ✓ Not a Flag
              </button>
            </div>
          ) : (
            <div>
              <div className="flex h-12 rounded-lg overflow-hidden mb-3">
                <div
                  className="bg-red-500 text-white flex items-center justify-center font-semibold text-sm transition-all duration-500"
                  style={{ width: `${item.yesPercent}%` }}
                >
                  {item.yesPercent}%
                </div>
                <div
                  className="bg-green-500 text-white flex items-center justify-center font-semibold text-sm transition-all duration-500"
                  style={{ width: `${100 - item.yesPercent}%` }}
                >
                  {100 - item.yesPercent}%
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span className={userVote === "yes" ? "font-bold text-gray-100" : ""}>🚩 Red Flag</span>
                <span className={userVote === "no" ? "font-bold text-gray-100" : ""}>✓ Not a Flag</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
