"use client";
import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

type Question = { id: string; question_text: string; options: string[]; correct_answer: string; explanation?: string };
type Quiz = { id: string; title: string; difficulty: string; question_count: number; questions: Question[]; created_at: string };

export default function QuizzesPage() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [count, setCount] = useState(5);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [generating, setGenerating] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ score: number; total_questions: number; percentage: number; feedback: string } | null>(null);
  const [currentQ, setCurrentQ] = useState(0);

  const generateQuiz = async () => {
    setGenerating(true);
    setSubmitted(false);
    setAnswers({});
    setResult(null);
    setCurrentQ(0);
    try {
      const res = await fetch(`${API}/api/v1/quizzes/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic || "General Knowledge", difficulty, question_count: count }),
      });
      if (res.ok) setQuiz(await res.json());
    } catch { }
    setGenerating(false);
  };

  const submitQuiz = async () => {
    if (!quiz) return;
    try {
      const res = await fetch(`${API}/api/v1/quizzes/${quiz.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (res.ok) { setResult(await res.json()); setSubmitted(true); }
    } catch { }
  };

  const q = quiz?.questions[currentQ];
  const totalAnswered = Object.keys(answers).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black" style={{ color: "#F0F0FF" }}>📝 AI Quiz Builder</h1>
        <p className="text-sm mt-1" style={{ color: "#64748B" }}>Generate custom quizzes on any topic and test your knowledge instantly.</p>
      </div>

      {/* Generator */}
      <div className="glass-card p-6">
        <h3 className="text-base font-bold mb-4" style={{ color: "#F0F0FF" }}>⚡ Generate a New Quiz</h3>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-xs font-semibold mb-2 block" style={{ color: "#94A3B8" }}>TOPIC</label>
            <input className="input-glass" placeholder="e.g. Data Structures, Photosynthesis..." value={topic} onChange={(e) => setTopic(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-semibold mb-2 block" style={{ color: "#94A3B8" }}>DIFFICULTY</label>
            <select className="input-glass" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold mb-2 block" style={{ color: "#94A3B8" }}>QUESTIONS</label>
            <select className="input-glass" value={count} onChange={(e) => setCount(Number(e.target.value))}>
              {[3, 5, 8, 10, 15].map((n) => <option key={n} value={n}>{n} Questions</option>)}
            </select>
          </div>
        </div>
        <button className="btn-primary" onClick={generateQuiz} disabled={generating}>
          {generating ? "⏳ Generating..." : "🚀 Generate Quiz"}
        </button>
      </div>

      {/* Quiz Card */}
      {quiz && !submitted && q && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold" style={{ color: "#F0F0FF" }}>{quiz.title}</h3>
              <div className="flex gap-2 mt-1">
                <span className="badge badge-violet">{quiz.difficulty}</span>
                <span className="badge badge-cyan">{quiz.question_count} Questions</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black gradient-text">{currentQ + 1}<span className="text-base font-normal text-gray-500">/{quiz.questions.length}</span></div>
              <div className="text-xs mt-1" style={{ color: "#64748B" }}>{totalAnswered} answered</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full mb-6" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${((currentQ + 1) / quiz.questions.length) * 100}%`, background: "linear-gradient(90deg,#8B5CF6,#06B6D4)" }} />
          </div>

          <div className="text-base font-semibold mb-5" style={{ color: "#F0F0FF" }}>Q{currentQ + 1}. {q.question_text}</div>

          <div className="space-y-3">
            {q.options.map((opt, i) => {
              const selected = answers[q.id] === opt;
              return (
                <button
                  key={i}
                  onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                  className="w-full text-left p-4 rounded-xl transition-all flex items-center gap-3"
                  style={{
                    background: selected ? "rgba(139,92,246,0.2)" : "rgba(13,17,39,0.5)",
                    border: `1px solid ${selected ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.07)"}`,
                    color: selected ? "#C4B5FD" : "#94A3B8",
                  }}
                >
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: selected ? "#8B5CF6" : "rgba(255,255,255,0.08)" }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm">{opt}</span>
                </button>
              );
            })}
          </div>

          <div className="flex gap-3 mt-6">
            {currentQ > 0 && <button className="btn-secondary flex-1" onClick={() => setCurrentQ(currentQ - 1)}>← Previous</button>}
            {currentQ < quiz.questions.length - 1
              ? <button className="btn-primary flex-1" onClick={() => setCurrentQ(currentQ + 1)}>Next →</button>
              : <button className="btn-primary flex-1" onClick={submitQuiz} disabled={totalAnswered < quiz.questions.length}>Submit Quiz ✓</button>
            }
          </div>
        </div>
      )}

      {/* Results */}
      {submitted && result && (
        <div className="glass-card p-8 text-center" style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.15),rgba(6,182,212,0.08),rgba(13,17,39,0.9))" }}>
          <div className="text-5xl mb-4">{result.percentage >= 80 ? "🏆" : result.percentage >= 60 ? "👍" : "📚"}</div>
          <div className="text-4xl font-black gradient-text mb-2">{result.score}/{result.total_questions}</div>
          <div className="text-xl font-bold mb-2" style={{ color: "#F0F0FF" }}>{result.percentage}% Score</div>
          <div className="text-sm mb-6" style={{ color: "#94A3B8" }}>{result.feedback}</div>
          <div className="flex gap-3 justify-center">
            <button className="btn-primary" onClick={() => { setQuiz(null); setSubmitted(false); setResult(null); }}>Try New Quiz</button>
            <button className="btn-secondary" onClick={() => { setSubmitted(false); setCurrentQ(0); setAnswers({}); }}>Retry This Quiz</button>
          </div>
        </div>
      )}
    </div>
  );
}
