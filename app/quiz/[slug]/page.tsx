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
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-xl font-bold text-gray-100 mb-4">Quiz not found</h2>
          <Link href="/" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (result) {
    const totalQuestions = quiz.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-md mx-auto px-4 py-8">
          {/* Shareable Card - Screenshot This! */}
          <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700 shadow-2xl mb-6">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">{quiz.emoji}</div>
              <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">Quiz Result</div>
              <div className="text-lg font-bold text-gray-300">{quiz.title}</div>
            </div>

            {/* Score Circle */}
            <div className="flex justify-center mb-6">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="#374151" strokeWidth="8" fill="none" />
                  <circle
                    cx="64" cy="64" r="56"
                    stroke={percentage >= 70 ? "#22c55e" : percentage >= 40 ? "#eab308" : "#ef4444"}
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${percentage * 3.52} 352`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white">{score}/{totalQuestions}</span>
                  <span className="text-xs text-gray-400">{percentage}%</span>
                </div>
              </div>
            </div>

            {/* Result Title */}
            <div className="text-center mb-4">
              <div className="inline-block px-4 py-2 rounded-full bg-indigo-600/30 border border-indigo-500/50 mb-3">
                <span className="text-lg font-bold text-indigo-300">{result.title}</span>
              </div>
            </div>

            {/* Description */}
            <div className="text-center text-gray-400 text-sm leading-relaxed mb-6 px-2">
              {result.description}
            </div>

            {/* Watermark */}
            <div className="text-center pt-4 border-t border-gray-700/50">
              <div className="text-xs text-gray-500">truthinsignals.com</div>
            </div>
          </div>

          {/* Screenshot Hint */}
          <div className="text-center mb-6 px-4 py-3 bg-indigo-600/20 border border-indigo-500/30 rounded-xl">
            <div className="text-indigo-300 text-sm font-medium mb-1">Share your result!</div>
            <div className="text-indigo-400/70 text-xs">Take a screenshot and share with friends</div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={restart}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all"
            >
              Retake Quiz
            </button>
            <Link
              href="/"
              className="flex-1 text-center bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold py-3 px-4 rounded-xl border border-gray-700 transition-all"
            >
              More Quizzes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const question = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {currentQuestion === 0 && (
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold text-gray-100 mb-2">{quiz.title}</h1>
            {quiz.hook && <p className="text-indigo-400 text-sm">{quiz.hook}</p>}
          </div>
        )}

        {/* Progress Bar */}
        <div className="h-1 bg-gray-700 rounded-full mb-8 overflow-hidden">
          <div className="h-full bg-indigo-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="text-lg font-semibold text-gray-100 text-center mb-6">{question.text}</div>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelect(option)}
                className="w-full text-left bg-gray-800 border border-gray-600 rounded-lg px-5 py-4 font-medium text-gray-200 hover:border-indigo-400 hover:bg-gray-700 transition-all"
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
