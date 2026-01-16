"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import quizData from "@/data/quizzes.json";
import DisplayAd from "@/app/components/DisplayAd";

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
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quiz not found</h2>
          <Link href="/" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (result) {
    const totalQuestions = quiz.questions.length;

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
          <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">{score}/{totalQuestions}</div>
            <div className="text-xl font-bold text-gray-900 mb-3">{result.title}</div>
            <div className="text-gray-500 mb-6 max-w-md mx-auto">{result.description}</div>
            <div className="flex gap-3 justify-center flex-wrap">
              <button onClick={restart} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all">
                Take Again
              </button>
              <Link href="/" className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg border border-gray-200 transition-all">
                More Quizzes
              </Link>
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
                className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg border border-gray-200 transition-all"
              >
                Share
              </button>
            </div>
          </div>

          {/* Ad */}
          <DisplayAd />
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const question = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Truth<span className="text-indigo-600">InSignals</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 font-medium">{currentQuestion + 1}/{quiz.questions.length}</span>
            <Link href="/redflags" className="text-sm font-medium text-gray-600 hover:text-red-500 transition-colors">
              🚩 Red Flags
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {currentQuestion === 0 && (
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
            {quiz.hook && <p className="text-indigo-600 text-sm">{quiz.hook}</p>}
          </div>
        )}

        {/* Progress Bar */}
        <div className="h-1 bg-gray-200 rounded-full mb-8 overflow-hidden">
          <div className="h-full bg-indigo-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-lg font-semibold text-gray-900 text-center mb-6">{question.text}</div>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelect(option)}
                className="w-full text-left bg-white border border-gray-200 rounded-lg px-5 py-4 font-medium text-gray-700 hover:border-indigo-400 hover:bg-indigo-50 transition-all"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
