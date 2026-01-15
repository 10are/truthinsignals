"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import quizData from "@/data/quizzes.json";

interface Option {
  text: string;
  points?: number;
  type?: string;
  correct?: boolean;
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
  hook?: string;
  category: string;
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
  const [score, setScore] = useState(0);

  useEffect(() => {
    const foundQuiz = quizData.quizzes.find((q) => q.id === slug);
    if (foundQuiz) {
      setQuiz(foundQuiz as Quiz);
    }
  }, [slug]);

  const handleSelect = (option: Option) => {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);

    let newScore = score;
    if (option.correct) {
      newScore = score + 1;
    } else if (option.points !== undefined) {
      newScore = score + option.points;
    }
    setScore(newScore);

    if (currentQuestion < quiz!.questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 150);
    } else {
      calculateResult(newAnswers, newScore);
    }
  };

  const calculateResult = (finalAnswers: Option[], finalScore: number) => {
    if (!quiz) return;

    const hasType = finalAnswers.some(a => a.type);

    if (hasType) {
      const typeCounts: Record<string, number> = {};
      finalAnswers.forEach((ans) => {
        if (ans.type) {
          typeCounts[ans.type] = (typeCounts[ans.type] || 0) + 1;
        }
      });
      const dominantType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
      const matchedResult = quiz.results.find((r) => r.type === dominantType);
      setResult(matchedResult || null);
    } else {
      const matchedResult = quiz.results.find(
        (r) => finalScore >= (r.minScore || 0) && finalScore <= (r.maxScore || 100)
      );
      setResult(matchedResult || null);
    }
  };

  const restart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
    setScore(0);
  };

  if (!quiz) {
    return (
      <>
        <nav className="navbar">
          <div className="navbar-inner">
            <Link href="/" className="logo">Truth<span>InSignals</span></Link>
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
    const totalQuestions = quiz.questions.length;

    return (
      <>
        <nav className="navbar">
          <div className="navbar-inner">
            <Link href="/" className="logo">Truth<span>InSignals</span></Link>
          </div>
        </nav>

        <div className="quiz-wrapper">
          <div className="ad">Advertisement</div>

          <div className="result fade-in">
            <div className="result-score">{score}/{totalQuestions}</div>
            <div className="result-title">{result.title}</div>
            <div className="result-desc">{result.description}</div>
            <div className="result-actions">
              <button onClick={restart} className="btn">Take Again</button>
              <Link href="/" className="btn btn-outline">More Quizzes</Link>
              <button
                onClick={() => {
                  const shareUrl = `https://www.truthinsignals.com/quiz/${quiz.id}`;
                  const text = `I got "${result.title}" on ${quiz.title}`;
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
          <Link href="/" className="logo">Truth<span>InSignals</span></Link>
          <span className="quiz-counter">{currentQuestion + 1}/{quiz.questions.length}</span>
        </div>
      </nav>

      <div className="quiz-wrapper">
        <div className="ad">Advertisement</div>

        {currentQuestion === 0 && (
          <div className="quiz-header">
            <div className="quiz-page-title">{quiz.title}</div>
            {quiz.hook && <div className="quiz-page-hook">{quiz.hook}</div>}
          </div>
        )}

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
