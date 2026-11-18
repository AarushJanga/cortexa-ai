"use client";
import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

type Card = {
  id?: string;
  front: string;
  back: string;
  is_known?: boolean;
};

type Deck = {
  id: string;
  title: string;
  description: string;
  card_count: number;
  mastered_count: number;
};

export default function FlashcardsPage() {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(5);
  const [generating, setGenerating] = useState(false);
  const [currentDeckTitle, setCurrentDeckTitle] = useState("Key Definitions & Concepts");
  const [cards, setCards] = useState<Card[]>([
    {
      id: "1",
      front: "What is RAG (Retrieval-Augmented Generation)?",
      back: "A technique that retrieves authoritative documents from an external knowledge base to ground language model generations with verified facts and citations.",
      is_known: false,
    },
    {
      id: "2",
      front: "What is pgvector in PostgreSQL?",
      back: "An open-source extension for PostgreSQL that allows storing high-dimensional vector embeddings and performing fast vector similarity searches (like Cosine or L2 distance).",
      is_known: true,
    },
    {
      id: "3",
      front: "What is Cosine Similarity?",
      back: "A mathematical metric that measures the cosine of the angle between two multi-dimensional vectors, evaluating directional similarity rather than magnitude.",
      is_known: false,
    },
    {
      id: "4",
      front: "Why is Chunk Overlap critical in RAG?",
      back: "Overlap ensures that important context and sentences located across arbitrary chunk boundaries are not sliced in half, preserving semantic continuity.",
      is_known: false,
    },
    {
      id: "5",
      front: "What is a Circuit Breaker in AI system design?",
      back: "A resilience pattern that halts requests to a failing or rate-limited API provider after a threshold of errors, allowing it to recover while failing over to a backup provider.",
      is_known: false,
    },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const generateFlashcards = async () => {
    if (!topic.trim()) return;
    setGenerating(true);
    try {
      const res = await fetch(`${API}/api/v1/flashcards/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, count }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.cards && data.cards.length > 0) {
          setCards(data.cards);
          setCurrentDeckTitle(data.deck?.title || `Flashcards: ${topic}`);
          setCurrentIndex(0);
          setIsFlipped(false);
        }
      }
    } catch (e) {
      console.error(e);
    }
    setGenerating(false);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const toggleMastered = (cardIndex: number) => {
    setCards((prev) =>
      prev.map((c, i) => (i === cardIndex ? { ...c, is_known: !c.is_known } : c))
    );
  };

  const currentCard = cards[currentIndex] || cards[0];
  const masteredTotal = cards.filter((c) => c.is_known).length;
  const progressPct = Math.round((masteredTotal / cards.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "#F0F0FF" }}>
            🃏 Interactive Flashcards
          </h1>
          <p className="text-sm mt-1" style={{ color: "#64748B" }}>
            Study with spaced repetition and 3D card flips. Master concepts faster.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <span className="text-sm">🎯</span>
            <div>
              <div className="text-xs font-bold text-white">
                {masteredTotal} / {cards.length} Mastered
              </div>
              <div className="text-xs" style={{ color: "#64748B" }}>
                {progressPct}% Completion
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generator Bar */}
      <div className="glass-card p-5">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            className="input-glass flex-1"
            placeholder="Generate deck from topic (e.g. Operating Systems, Microeconomics, React Hooks)..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") generateFlashcards();
            }}
          />
          <select
            className="input-glass md:w-36"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          >
            {[5, 10, 15, 20].map((n) => (
              <option key={n} value={n}>
                {n} Cards
              </option>
            ))}
          </select>
          <button
            className="btn-primary whitespace-nowrap"
            onClick={generateFlashcards}
            disabled={generating || !topic.trim()}
          >
            {generating ? "⏳ Building..." : "⚡ Generate Deck"}
          </button>
        </div>
      </div>

      {/* Flashcard Studio View */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <span className="text-sm font-bold" style={{ color: "#C4B5FD" }}>
            {currentDeckTitle}
          </span>
          <span className="text-xs font-semibold" style={{ color: "#94A3B8" }}>
            Card {currentIndex + 1} of {cards.length}
          </span>
        </div>

        {/* 3D Flip Card Container */}
        <div
          className="flashcard-scene w-full cursor-pointer select-none"
          style={{ height: "340px" }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className={`flashcard-inner ${isFlipped ? "flipped" : ""}`}>
            {/* Front Face */}
            <div
              className="flashcard-face glass-card flex flex-col justify-between"
              style={{
                background:
                  "linear-gradient(135deg, rgba(13,17,39,0.9), rgba(139,92,246,0.12))",
                borderColor: "rgba(139,92,246,0.3)",
              }}
            >
              <div className="w-full flex items-center justify-between text-xs" style={{ color: "#64748B" }}>
                <span className="badge badge-violet">QUESTION</span>
                <span>Click or tap to reveal answer 🔄</span>
              </div>
              <div className="my-auto px-6 text-center">
                <p className="text-xl md:text-2xl font-bold leading-relaxed" style={{ color: "#F0F0FF" }}>
                  {currentCard.front}
                </p>
              </div>
              <div className="w-full flex items-center justify-between text-xs" style={{ color: "#64748B" }}>
                <span>Front Side</span>
                {currentCard.is_known && (
                  <span className="badge badge-green">✓ Mastered</span>
                )}
              </div>
            </div>

            {/* Back Face */}
            <div
              className="flashcard-face flashcard-back glass-card flex flex-col justify-between"
              style={{
                background:
                  "linear-gradient(135deg, rgba(13,17,39,0.95), rgba(6,182,212,0.15))",
                borderColor: "rgba(6,182,212,0.4)",
              }}
            >
              <div className="w-full flex items-center justify-between text-xs" style={{ color: "#64748B" }}>
                <span className="badge badge-cyan">ANSWER / EXPLANATION</span>
                <span>Click to return to question 🔄</span>
              </div>
              <div className="my-auto px-6 text-center">
                <p className="text-base md:text-lg leading-relaxed" style={{ color: "#E0E7FF" }}>
                  {currentCard.back}
                </p>
              </div>
              <div className="w-full flex items-center justify-between text-xs" style={{ color: "#64748B" }}>
                <span>Back Side</span>
                <span style={{ color: "#06B6D4" }}>Grounded Fact</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <button className="btn-secondary text-sm px-5" onClick={handlePrev}>
            ← Previous
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleMastered(currentIndex)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                currentCard.is_known
                  ? "bg-green-500/20 text-green-300 border-green-500/40"
                  : "bg-white/5 text-gray-400 border-white/10 hover:border-violet-500/40"
              }`}
            >
              {currentCard.is_known ? "✓ Mastered" : "Mark as Mastered"}
            </button>
            <button
              className="btn-secondary text-xs px-3"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              Flip 🔄
            </button>
          </div>
          <button className="btn-primary text-sm px-6" onClick={handleNext}>
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
