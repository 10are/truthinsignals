import Link from "next/link";
import redflagData from "@/data/redflags.json";

export default function RedFlagsPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-block bg-red-900/50 text-red-400 px-3 py-1 rounded-full text-sm font-semibold mb-3">
            🚩 Red Flags
          </span>
          <h1 className="text-2xl font-bold text-gray-100 mb-2">Is This a Red Flag?</h1>
          <p className="text-gray-400">Vote on relationship behaviors and see what others think</p>
        </div>

        {/* My Flags CTA */}
        <Link
          href="/redflags/my-flags"
          className="flex items-center justify-between bg-red-900/30 border border-red-800 rounded-xl p-5 mb-6 hover:border-red-500 transition-all"
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl">🪞</span>
            <div>
              <div className="font-semibold text-gray-100">My Flags</div>
              <div className="text-sm text-gray-400">Create your red 🚩 & green 💚 flags and share!</div>
            </div>
          </div>
          <span className="text-red-400 font-bold">→</span>
        </Link>


        {/* Poll Categories */}
        <div className="space-y-3">
          {redflagData.polls.map((poll) => (
            <Link
              href={`/redflags/${poll.id}`}
              key={poll.id}
              className="flex items-center gap-4 bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-indigo-400 transition-all"
            >
              <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                {poll.emoji}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-100">{poll.title}</h3>
                <p className="text-sm text-gray-400">{poll.description}</p>
                <span className="text-xs text-indigo-400 font-medium">{poll.items.length} items to vote</span>
              </div>
              <span className="text-gray-500">→</span>
            </Link>
          ))}
        </div>

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-block px-6 py-3 text-gray-300 border border-gray-700 rounded-lg font-medium hover:border-gray-500 transition-all"
          >
            ← Back to Quizzes
          </Link>
        </div>
      </div>
    </div>
  );
}
