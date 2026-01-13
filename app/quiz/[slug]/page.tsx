"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import quizData from "@/data/quizzes.json";

interface Option {
  text: string;
  points?: number;
  type?: string;
}

interface Question {
  id: number;
  text: string;
  options: Option[];
}

interface Result {
  minScore?: number;
  maxScore?: number;
  type?: string;
  title: string;
  description: string;
}

interface Quiz {
  id: string;
  title: string;
  emoji: string;
  questions: Question[];
  results: Result[];
}

export default function QuizPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Option[]>([]);
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    const foundQuiz = quizData.quizzes.find((q) => q.id === slug);
    if (foundQuiz) {
      setQuiz(foundQuiz as Quiz);
    }
  }, [slug]);

  const handleSelect = (option: Option) => {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);

    if (currentQuestion < quiz!.questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 150);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: Option[]) => {
    if (!quiz) return;

    const isPointBased = finalAnswers[0]?.points !== undefined;

    if (isPointBased) {
      const totalScore = finalAnswers.reduce((sum, ans) => sum + (ans.points || 0), 0);
      const matchedResult = quiz.results.find(
        (r) => totalScore >= (r.minScore || 0) && totalScore <= (r.maxScore || 100)
      );
      setResult(matchedResult || null);
    } else {
      const typeCounts: Record<string, number> = {};
      finalAnswers.forEach((ans) => {
        if (ans.type) {
          typeCounts[ans.type] = (typeCounts[ans.type] || 0) + 1;
        }
      });
      const dominantType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
      const matchedResult = quiz.results.find((r) => r.type === dominantType);
      setResult(matchedResult || null);
    }
  };

  const restart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  if (!quiz) {
    return (
      <>
        <nav className="navbar">
          <div className="navbar-inner">
            <Link href="/" className="logo">TruthInSignals</Link>
          </div>
        </nav>
        <div className="quiz-wrapper">
          <div className="result">
            <div className="result-title">Quiz not found</div>
            <Link href="/" className="btn">Go Home</Link>
          </div>
        </div>
      </>
    );
  }

  if (result) {
    return (
      <>
        <nav className="navbar">
          <div className="navbar-inner">
            <Link href="/" className="logo">TruthInSignals</Link>
          </div>
        </nav>

        <div className="quiz-wrapper">
          <div className="ad">Advertisement</div>

          <div className="result fade-in">
            <div className="result-title">{result.title}</div>
            <div className="result-desc">{result.description}</div>
            <div className="result-actions">
              <button onClick={restart} className="btn">Take Again</button>
              <Link href="/" className="btn btn-outline">More Quizzes</Link>
              <button
                onClick={() => {
                  const shareUrl = `https://www.truthinsignals.com/quiz/${quiz.id}`;
                  const text = `I got "${result.title}" - ${quiz.title}`;
                  if (navigator.share) {
                    navigator.share({ title: quiz.title, text, url: shareUrl });
                  } else {
                    navigator.clipboard.writeText(`${text} ${shareUrl}`);
                    alert('Copied!');
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

  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const question = quiz.questions[currentQuestion];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="logo">TruthInSignals</Link>
          <span className="quiz-counter">{currentQuestion + 1}/{quiz.questions.length}</span>
        </div>
      </nav>

      <div className="quiz-wrapper">
        <div className="ad">Advertisement</div>

        <div className="progress">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="fade-in" key={currentQuestion}>
          <div className="question">{question.text}</div>

          <div className="options">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelect(option)}
                className="option"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>

        <div className="ad">Advertisement</div>
      </div>
    </>
  );
}
