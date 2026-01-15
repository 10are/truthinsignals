"use client";

import Link from "next/link";
import redflagData from "@/data/redflags.json";

export default function RedFlagsPage() {
  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="logo">
            Truth<span>InSignals</span>
          </Link>
        </div>
      </nav>

      <div className="rf-page">
        <div className="rf-page-header">
          <span className="rf-page-badge">🚩 Red Flags</span>
          <h1>Is This a Red Flag?</h1>
          <p>Vote on relationship behaviors and see what others think</p>
        </div>

        {/* My Flags CTA */}
        <Link href="/redflags/my-flags" className="my-rf-banner">
          <div className="my-rf-banner-content">
            <span className="my-rf-banner-icon">🪞</span>
            <div>
              <div className="my-rf-banner-title">My Flags</div>
              <div className="my-rf-banner-desc">Create your red 🚩 & green 💚 flags and share!</div>
            </div>
          </div>
          <span className="my-rf-banner-arrow">→</span>
        </Link>

        {/* Poll Categories */}
        <div className="rf-polls">
          {redflagData.polls.map((poll) => (
            <Link href={`/redflags/${poll.id}`} key={poll.id} className="rf-poll-card">
              <div className="rf-poll-emoji">{poll.emoji}</div>
              <div className="rf-poll-info">
                <h3>{poll.title}</h3>
                <p>{poll.description}</p>
                <span className="rf-poll-count">{poll.items.length} items to vote</span>
              </div>
              <span className="rf-poll-arrow">→</span>
            </Link>
          ))}
        </div>

        <div className="ad">Advertisement</div>

        <div className="rf-page-back">
          <Link href="/" className="btn btn-outline">← Back to Quizzes</Link>
        </div>
      </div>
    </>
  );
}
