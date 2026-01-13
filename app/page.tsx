import Link from "next/link";
import quizData from "@/data/quizzes.json";

export default function Home() {
  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="logo">TruthInSignals</Link>
        </div>
      </nav>

      <div className="container">
        <div className="ad">Advertisement</div>

        <div className="quiz-grid">
          {quizData.quizzes.map((quiz) => (
            <Link href={`/quiz/${quiz.id}`} key={quiz.id}>
              <div className="quiz-card">
                <div className="quiz-card-img">{quiz.emoji}</div>
                <div className="quiz-card-body">
                  <div className="quiz-card-title">{quiz.title}</div>
                  <div className="quiz-card-meta">{quiz.questions.length} questions</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="ad">Advertisement</div>

        <div className="footer">
          © 2025 TruthInSignals
        </div>
      </div>
    </>
  );
}
