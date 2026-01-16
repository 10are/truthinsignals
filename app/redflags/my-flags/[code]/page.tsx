"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import redflagData from "@/data/redflags.json";
import RelaxedAd from "@/app/components/RelaxedAd";

interface Flag {
  id: string;
  text: string;
  emoji: string;
}

export default function SharedFlagsPage() {
  const params = useParams();
  const code = params.code as string;

  const [redFlags, setRedFlags] = useState<Flag[]>([]);
  const [greenFlags, setGreenFlags] = useState<Flag[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const decoded = atob(code);
      const [redPart, greenPart] = decoded.split("|");

      const redIds = redPart ? redPart.split(",").filter(Boolean) : [];
      const greenIds = greenPart ? greenPart.split(",").filter(Boolean) : [];

      const selectedRed = redIds
        .map((num) => redflagData.myRedFlags.find((f) => f.id === `r${num}`))
        .filter(Boolean) as Flag[];

      const selectedGreen = greenIds
        .map((num) => redflagData.myGreenFlags.find((f) => f.id === `g${num}`))
        .filter(Boolean) as Flag[];

      setRedFlags(selectedRed);
      setGreenFlags(selectedGreen);

      if (selectedRed.length === 0 && selectedGreen.length === 0) {
        setError(true);
      }
    } catch {
      setError(true);
    }
    setLoading(false);
  }, [code]);

  const handleShare = () => {
    const shareUrl = `https://www.truthinsignals.com/redflags/my-flags/${code}`;
    const redText = redFlags.map((f) => `🚩 ${f.text}`).join("\n");
    const greenText = greenFlags.map((f) => `💚 ${f.text}`).join("\n");
    const text = `My Flags:\n\n${redText ? `Red Flags:\n${redText}\n\n` : ""}${greenText ? `Green Flags:\n${greenText}` : ""}`;

    if (navigator.share) {
      navigator.share({
        title: "My Flags - Truth In Signals",
        text: text,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(`${text}\n\n${shareUrl}`);
      alert("Copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Truth<span className="text-indigo-600">InSignals</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/redflags" className="text-sm font-medium text-gray-600 hover:text-red-500 transition-colors">
                🚩 Red Flags
              </Link>
              <Link href="/redflags/my-flags" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                My Flags
              </Link>
            </div>
          </div>
        </nav>
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
            <div className="text-5xl mb-4">🤔</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Invalid or expired link</h2>
            <p className="text-gray-500 mb-6">Create your own flags instead!</p>
            <Link
              href="/redflags/my-flags"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
            >
              Create My Flags
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Truth<span className="text-indigo-600">InSignals</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/redflags" className="text-sm font-medium text-gray-600 hover:text-red-500 transition-colors">
              🚩 Red Flags
            </Link>
            <Link href="/redflags/my-flags" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
              My Flags
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Shared Card */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-900 mb-1">My Flags</h1>
            <p className="text-gray-500 text-sm">Here are my honest red & green flags</p>
          </div>

          {redFlags.length > 0 && (
            <div className="mb-6">
              <div className="text-sm font-semibold text-red-500 uppercase tracking-wide mb-3">
                🚩 My Red Flags ({redFlags.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {redFlags.map((flag) => (
                  <div
                    key={flag.id}
                    className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-full text-sm"
                  >
                    <span>{flag.emoji}</span>
                    <span className="text-red-700">{flag.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {greenFlags.length > 0 && (
            <div className="mb-6">
              <div className="text-sm font-semibold text-green-500 uppercase tracking-wide mb-3">
                💚 My Green Flags ({greenFlags.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {greenFlags.map((flag) => (
                  <div
                    key={flag.id}
                    className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-full text-sm"
                  >
                    <span>{flag.emoji}</span>
                    <span className="text-green-700">{flag.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={handleShare}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
            >
              Share This
            </button>
            <Link
              href="/redflags/my-flags"
              className="flex-1 text-center bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg border border-gray-200 transition-all"
            >
              Create My Own
            </Link>
          </div>
        </div>

        {/* Ad */}
        <RelaxedAd />

        {/* CTA Banner */}
        <div className="bg-indigo-600 rounded-xl p-5 mb-6 flex items-center justify-between">
          <div className="text-white">
            <div className="font-semibold">What are your flags?</div>
            <div className="text-indigo-200 text-sm">Create your own and share with friends!</div>
          </div>
          <Link
            href="/redflags/my-flags"
            className="bg-white text-indigo-600 font-semibold py-2 px-4 rounded-lg hover:bg-indigo-50 transition-all whitespace-nowrap text-sm"
          >
            Create Mine →
          </Link>
        </div>
      </div>
    </div>
  );
}
