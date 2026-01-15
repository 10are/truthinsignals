"use client";

import { useState } from "react";
import Link from "next/link";
import quizData from "@/data/quizzes.json";
import redflagData from "@/data/redflags.json";

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
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="logo">
            Truth<span>InSignals</span>
          </Link>
        </div>
      </nav>

      <div className="container">
        <div className="ad">Advertisement</div>

        <div className="categories">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {filteredQuizzes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-text">No quizzes found in this category</div>
          </div>
        ) : (
          <div className="quiz-grid">
            {filteredQuizzes.map((quiz) => (
              <Link href={`/quiz/${quiz.id}`} key={quiz.id}>
                <div className="quiz-card">
                  <div className={`quiz-icon ${quiz.category}`}>{quiz.emoji}</div>
                  <div className="quiz-content">
                    <div className="quiz-title">{quiz.title}</div>
                    {quiz.hook && <div className="quiz-hook">{quiz.hook}</div>}
                    <div className="quiz-meta">
                      <span className={`quiz-tag ${quiz.category}`}>{quiz.category}</span>
                      <span>{quiz.questions.length} questions</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="ad">Advertisement</div>

        {/* Red Flags Section */}
        <div className="rf-home-section">
          <div className="rf-home-header">
            <h2 className="rf-home-title">🚩 Red Flags</h2>
            <p className="rf-home-subtitle">Vote on relationship behaviors & share your own red flags</p>
          </div>
          <div className="rf-home-grid">
            {redflagData.polls.slice(0, 2).map((poll) => (
              <Link href={`/redflags/${poll.id}`} key={poll.id}>
                <div className="rf-home-card">
                  <div className="rf-home-icon">{poll.emoji}</div>
                  <div className="rf-home-content">
                    <div className="rf-home-card-title">{poll.title}</div>
                    <div className="rf-home-hook">{poll.items.length} items to vote</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="rf-home-cta">
            <Link href="/redflags" className="btn-rf-link">
              Explore Red Flags →
            </Link>
          </div>
        </div>

        <div className="footer">© 2025 TruthInSignals. All rights reserved.</div>
      </div>
    </>
  );
}
