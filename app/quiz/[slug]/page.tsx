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
  description: string;
  emoji: string;
  category: string;
  questions: Question[];
  results: Result[];
}

export default function QuizPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Option[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    const foundQuiz = quizData.quizzes.find((q) => q.id === slug);
    if (foundQuiz) {
      setQuiz(foundQuiz as Quiz);
    }
  }, [slug]);

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
  };

  const handleNext = () => {
    if (selectedOption === null || !quiz) return;

    const newAnswers = [...answers, quiz.questions[currentQuestion].options[selectedOption]];
    setAnswers(newAnswers);

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
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

    setShowResult(true);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setAnswers([]);
    setShowResult(false);
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
        <div className="quiz-container">
          <div className="result">
            <div className="result-emoji">😢</div>
            <div className="result-title">Quiz not found</div>
            <Link href="/" className="btn" style={{width: 'auto', display: 'inline-block'}}>Go Home</Link>
          </div>
        </div>
      </>
    );
  }

  if (showResult && result) {
    return (
      <>
        <nav className="navbar">
          <div className="navbar-inner">
            <Link href="/" className="logo">TruthInSignals</Link>
          </div>
        </nav>

        <div className="quiz-container">
          <div className="ad">Advertisement</div>

          <div className="result">
            <div className="result-emoji">{quiz.emoji}</div>
            <div className="result-title">{result.title}</div>
            <div className="result-desc">{result.description}</div>
            <div className="result-actions">
              <button onClick={restartQuiz} className="btn">Take Again</button>
              <Link href="/" className="btn btn-outline">More Quizzes</Link>
              <button
                onClick={() => {
                  const shareUrl = `https://www.truthinsignals.com/quiz/${quiz.id}`;
                  const text = `I got "${result.title}" - ${quiz.title}`;
                  if (navigator.share) {
                    navigator.share({ title: quiz.title, text, url: shareUrl });
                  } else {
                    navigator.clipboard.writeText(`${text} ${shareUrl}`);
                    alert('Copied to clipboard!');
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
          <span style={{color: '#999', fontSize: '14px'}}>{currentQuestion + 1}/{quiz.questions.length}</span>
        </div>
      </nav>

      <div className="quiz-container">
        <div className="ad">Advertisement</div>

        <div className="quiz-header">
          <div className="quiz-title">{quiz.title}</div>
          <div className="quiz-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="question">{question.text}</div>

        <div className="options">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              className={`option ${selectedOption === index ? 'selected' : ''}`}
            >
              {option.text}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={selectedOption === null}
          className="btn"
        >
          {currentQuestion < quiz.questions.length - 1 ? 'Next' : 'See Result'}
        </button>

        <div className="ad">Advertisement</div>
      </div>
    </>
  );
}
