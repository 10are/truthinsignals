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
      <>
        <nav className="navbar">
          <div className="navbar-inner">
            <Link href="/" className="logo">Truth<span>InSignals</span></Link>
          </div>
        </nav>
        <div className="rf-poll-wrapper">
          <div className="rf-poll-not-found">
            <h2>Poll not found</h2>
            <Link href="/redflags" className="btn">Back to Red Flags</Link>
          </div>
        </div>
      </>
    );
  }

  if (isComplete) {
    const yesCount = Object.values(votes).filter(v => v === "yes").length;

    return (
      <>
        <nav className="navbar">
          <div className="navbar-inner">
            <Link href="/" className="logo">Truth<span>InSignals</span></Link>
          </div>
        </nav>

        <div className="rf-poll-wrapper">
          <div className="ad">Advertisement</div>

          <div className="rf-complete">
            <div className="rf-complete-icon">🚩</div>
            <h2>Your Results</h2>
            <p className="rf-complete-stat">
              You flagged <strong>{yesCount}</strong> out of <strong>{poll.items.length}</strong> as red flags
            </p>

            <div className="rf-complete-summary">
              {poll.items.map((item) => (
                <div key={item.id} className="rf-summary-item">
                  <span className={`rf-summary-vote ${votes[item.id]}`}>
                    {votes[item.id] === "yes" ? "🚩" : "✓"}
                  </span>
                  <span className="rf-summary-text">{item.text}</span>
                  <span className="rf-summary-percent">{item.yesPercent}% agree</span>
                </div>
              ))}
            </div>

            <div className="rf-complete-actions">
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setVotes({});
                  setShowResult(false);
                  setIsComplete(false);
                }}
                className="btn"
              >
                Vote Again
              </button>
              <Link href="/redflags" className="btn btn-outline">More Polls</Link>
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
                className="btn btn-outline"
              >
                Share
              </button>
            </div>
          </div>

          <div className="ad">Advertisement</div>
        </div>
      </>
    );
  }

  const item = poll.items[currentIndex];
  const progress = ((currentIndex + 1) / poll.items.length) * 100;
  const userVote = votes[item.id];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="logo">Truth<span>InSignals</span></Link>
          <span className="rf-poll-counter">{currentIndex + 1}/{poll.items.length}</span>
        </div>
      </nav>

      <div className="rf-poll-wrapper">
        <div className="ad">Advertisement</div>

        {currentIndex === 0 && !showResult && (
          <div className="rf-poll-header">
            <span className="rf-poll-header-emoji">{poll.emoji}</span>
            <h1>{poll.title}</h1>
            <p>{poll.description}</p>
          </div>
        )}

        <div className="rf-poll-progress">
          <div className="rf-poll-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="rf-poll-card-main fade-in" key={currentIndex}>
          <div className="rf-poll-question">
            <span className="rf-poll-flag">🚩</span>
            <span className="rf-poll-label">Is this a red flag?</span>
          </div>

          <div className="rf-poll-statement">{item.text}</div>

          {!showResult ? (
            <div className="rf-poll-buttons">
              <button onClick={() => handleVote("yes")} className="rf-vote-btn rf-vote-yes">
                🚩 Red Flag
              </button>
              <button onClick={() => handleVote("no")} className="rf-vote-btn rf-vote-no">
                ✓ Not a Flag
              </button>
            </div>
          ) : (
            <div className="rf-poll-result fade-in">
              <div className="rf-result-bar">
                <div
                  className="rf-result-yes"
                  style={{ width: `${item.yesPercent}%` }}
                >
                  {item.yesPercent}%
                </div>
                <div
                  className="rf-result-no"
                  style={{ width: `${100 - item.yesPercent}%` }}
                >
                  {100 - item.yesPercent}%
                </div>
              </div>
              <div className="rf-result-labels">
                <span className={userVote === "yes" ? "active" : ""}>🚩 Red Flag</span>
                <span className={userVote === "no" ? "active" : ""}>✓ Not a Flag</span>
              </div>
            </div>
          )}
        </div>

        <div className="ad">Advertisement</div>
      </div>
    </>
  );
}
