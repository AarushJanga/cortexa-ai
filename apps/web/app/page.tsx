"use client";
import Link from "next/link";
import { useState } from "react";

// ── Cosmic Glow Orb ──────────────────────────────────────────────
function CosmicOrb({ size, x, y, color }: { size: number; x: string; y: string; color: string }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        background: color,
        filter: "blur(70px)",
        opacity: 0.45,
      }}
    />
  );
}

// ── Realistic 3D Floating Laptop Mockup ──────────────────────────
function RealisticLaptop3D() {
  return (
    <div className="relative laptop-container w-full max-w-xl mx-auto flex items-center justify-center py-6 select-none">
      {/* Floor Glow Reflection */}
      <div className="laptop-shadow" />

      {/* 3D Laptop Body */}
      <div className="laptop-3d relative w-[420px] sm:w-[480px] md:w-[520px]">
        {/* Screen Chassis (Lid) */}
        <div
          className="relative rounded-[20px] p-3 shadow-2xl transition-all"
          style={{
            background: "linear-gradient(145deg, #252B42, #0C0F1E)",
            border: "1.5px solid rgba(255, 255, 255, 0.16)",
            boxShadow:
              "0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 50px rgba(139, 92, 246, 0.3)",
          }}
        >
          {/* Top Bezel: Camera & Ambient Sensor */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
              <div className="w-0.5 h-0.5 rounded-full bg-cyan-400" />
            </div>
            <div className="w-1 h-1 rounded-full bg-emerald-500/80 animate-pulse" />
          </div>

          {/* High-Resolution Screen Display */}
          <div
            className="relative w-full rounded-xl overflow-hidden text-left"
            style={{
              aspectRatio: "16 / 10",
              background: "#080B18",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            {/* Glossy Diagonal Glare Reflection */}
            <div
              className="absolute inset-0 pointer-events-none z-30"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 45%)",
              }}
            />

            {/* Operating Live Interface Preview */}
            <div className="h-full flex flex-col p-3 text-[11px] font-sans">
              {/* Header Bar inside laptop */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black text-white shadow-sm"
                    style={{ background: "linear-gradient(135deg,#8B5CF6,#06B6D4)" }}
                  >
                    C
                  </div>
                  <span className="font-bold text-white text-[11px] tracking-tight">
                    Cortexa AI
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-2.5 py-0.5 text-[9px] text-gray-300">
                  <span>🔥</span>
                  <span className="font-bold text-amber-400">12 Days Streak</span>
                </div>
              </div>

              {/* Grid content inside screen */}
              <div className="flex-1 grid grid-cols-12 gap-2">
                {/* Mini Sidebar */}
                <div className="col-span-2 space-y-1.5 border-r border-white/5 pr-1">
                  {["🏠", "📄", "📝", "🃏", "🎯"].map((icon, idx) => (
                    <div
                      key={idx}
                      className={`w-full py-1 text-center rounded text-[10px] ${
                        idx === 0
                          ? "bg-violet-600/30 text-violet-300 font-bold border border-violet-500/40"
                          : "text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      {icon}
                    </div>
                  ))}
                </div>

                {/* Main Dashboard Screen View */}
                <div className="col-span-10 space-y-2">
                  <div className="text-[10px] font-bold text-white">
                    Welcome back, <span className="gradient-text">Aarush!</span> 🚀
                  </div>

                  {/* 2 Mini Cards */}
                  <div className="grid grid-cols-2 gap-1.5">
                    {/* Progress Card */}
                    <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5 flex items-center gap-2">
                      <div className="relative w-8 h-8 flex-shrink-0">
                        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                          <circle
                            cx="18"
                            cy="18"
                            r="14"
                            fill="none"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="3"
                          />
                          <circle
                            cx="18"
                            cy="18"
                            r="14"
                            fill="none"
                            stroke="#8B5CF6"
                            strokeWidth="3"
                            strokeDasharray="68 100"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-violet-300">
                          78%
                        </div>
                      </div>
                      <div className="text-[9px] leading-tight">
                        <div className="font-bold text-white">Progress</div>
                        <div className="text-emerald-400 font-semibold">✓ 14 Topics</div>
                      </div>
                    </div>

                    {/* Quick Quiz Card */}
                    <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5 text-[9px] leading-tight">
                      <div className="font-bold text-cyan-300 flex items-center gap-1">
                        <span>⚡</span>
                        <span>Exam Prep</span>
                      </div>
                      <div className="text-gray-300 mt-1 truncate">Deep Learning Quiz</div>
                      <div className="text-violet-400 font-semibold text-[8px]">
                        5 practice questions
                      </div>
                    </div>
                  </div>

                  {/* Grounded RAG Chat Bubble */}
                  <div className="p-2 rounded-lg bg-violet-950/20 border border-violet-500/30 text-[9px] space-y-1">
                    <div className="flex items-center justify-between text-[8px]">
                      <span className="text-gray-400">📎 Machine_Learning_Lecture.pdf</span>
                      <span className="badge badge-cyan text-[7px] py-0 px-1">Source: Page 4</span>
                    </div>
                    <p className="text-gray-200 line-clamp-2 leading-relaxed">
                      &quot;Transformers process input sequences concurrently via scaled dot-product attention, replacing sequential recurrence...&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chin Logo */}
          <div className="text-center pt-1.5 pb-0.5">
            <span className="text-[8px] font-bold tracking-widest text-gray-500 uppercase">
              CORTEXA AI
            </span>
          </div>
        </div>

        {/* Laptop Base / Keyboard Deck */}
        <div
          className="relative w-[108%] -left-[4%] h-[14px] rounded-b-xl shadow-2xl"
          style={{
            background:
              "linear-gradient(to bottom, #2C3247 0%, #151928 60%, #0A0D18 100%)",
            border: "1.5px solid rgba(255,255,255,0.14)",
            borderTop: "1px solid rgba(255,255,255,0.3)",
          }}
        >
          {/* Thumb opening groove */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-1.5 rounded-b-md bg-black/40 border-b border-white/10" />
        </div>

        {/* Surrounding Floating 3D Chips */}
        <div
          className="absolute -top-4 -left-6 glass-card px-3 py-1.5 flex items-center gap-2 text-xs font-semibold shadow-lg border border-violet-500/40 animate-float"
          style={{ animationDelay: "0.2s" }}
        >
          <span>📄</span>
          <span className="text-violet-300 font-bold">Lecture_Notes.pdf</span>
          <span className="badge badge-green text-[9px]">Grounded</span>
        </div>

        <div
          className="absolute -top-6 -right-6 glass-card px-3 py-1.5 flex items-center gap-2 text-xs font-semibold shadow-lg border border-cyan-500/40 animate-float"
          style={{ animationDelay: "1.5s" }}
        >
          <span className="text-cyan-400">⚡</span>
          <span className="text-cyan-200 font-bold">RAG AI Assistant</span>
          <span className="badge badge-cyan text-[9px]">&lt;0.4s</span>
        </div>

        <div
          className="absolute -bottom-4 -left-4 glass-card px-3 py-1.5 flex items-center gap-2 text-xs font-semibold shadow-lg border border-emerald-500/30 animate-float"
          style={{ animationDelay: "2.8s" }}
        >
          <span>🃏</span>
          <span className="text-emerald-300 font-bold">3D Flashcards</span>
        </div>

        <div
          className="absolute -bottom-2 -right-4 glass-card px-3 py-1.5 flex items-center gap-2 text-xs font-semibold shadow-lg border border-amber-500/30 animate-float"
          style={{ animationDelay: "3.6s" }}
        >
          <span>🎯</span>
          <span className="text-amber-300 font-bold">Exam Blueprint</span>
        </div>
      </div>
    </div>
  );
}

// ── Top Navigation Bar ───────────────────────────────────────────
function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backdropFilter: "blur(16px)",
        background: "rgba(7,9,19,0.85)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105"
            style={{ background: "linear-gradient(135deg,#8B5CF6,#06B6D4)" }}
          >
            <span className="text-white font-black text-sm">C</span>
          </div>
          <div>
            <span className="text-white font-bold text-lg">Cortexa</span>
            <span className="gradient-text font-bold text-lg"> AI</span>
            <div className="text-xs" style={{ color: "#64748B", lineHeight: 1 }}>
              Learn Smarter. Achieve Bigger.
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {["Home", "Features", "Pricing", "About", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium transition-colors duration-200"
              style={{ color: "#94A3B8" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#F0F0FF")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden md:block text-sm font-medium hover:text-white transition-colors"
            style={{ color: "#94A3B8" }}
          >
            Sign In
          </Link>
          <Link href="/register" className="btn-primary text-sm py-2 px-5">
            Get Started →
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ── Hero Section with Animated Matrix & 3D Floating Laptop ──────
function HeroSection() {
  return (
    <section
      className="relative min-h-screen cosmic-bg flex items-center pt-20 pb-16 overflow-hidden"
      id="home"
    >
      {/* Animated Cyber Grid Matrix */}
      <div className="cyber-grid pointer-events-none" />

      {/* Ambient Pulsing Nebulae Orbs */}
      <CosmicOrb size={520} x="-10%" y="5%" color="radial-gradient(circle, #8B5CF6, transparent)" />
      <CosmicOrb size={460} x="65%" y="-5%" color="radial-gradient(circle, #06B6D4, transparent)" />
      <CosmicOrb size={380} x="80%" y="55%" color="radial-gradient(circle, #3B82F6, transparent)" />
      <CosmicOrb size={320} x="20%" y="65%" color="radial-gradient(circle, #7C3AED, transparent)" />

      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-12 items-center w-full relative z-10">
        {/* Left Content */}
        <div className="animate-fade-in-up">
          <div className="badge badge-violet mb-6 inline-flex items-center gap-1.5">
            <span>🚀</span>
            <span>AI-Powered Study Platform</span>
          </div>

          <h1
            className="text-5xl lg:text-6xl font-black leading-tight mb-6"
            style={{ color: "#F0F0FF" }}
          >
            Your <span className="gradient-text text-glow-violet">AI Study</span>
            <br />Companion
          </h1>

          <div className="text-2xl font-semibold mb-4" style={{ color: "#94A3B8" }}>
            Upload. Ask. Learn. Grow.
          </div>

          <p className="text-base mb-8 leading-relaxed max-w-lg" style={{ color: "#94A3B8" }}>
            Cortexa AI helps students understand complex content, prepare for exams, build
            skills, and get job-ready — all in one place.
          </p>

          <div className="flex flex-wrap gap-4 mb-10">
            <Link href="/register" className="btn-primary text-base">
              Start Learning Free →
            </Link>
            <Link href="/login" className="btn-secondary text-base">
              <span>▶</span> Sign In to Dashboard
            </Link>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {["#8B5CF6", "#06B6D4", "#F59E0B", "#10B981"].map((c, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full border-2 border-[#070913] flex items-center justify-center text-xs font-bold text-white shadow-md"
                  style={{ background: c }}
                >
                  {["A", "S", "R", "P"][i]}
                </div>
              ))}
            </div>
            <div>
              <div className="text-white font-bold text-sm">100K+ Happy Students</div>
              <div className="text-xs" style={{ color: "#64748B" }}>
                Across 50+ universities worldwide
              </div>
            </div>
          </div>
        </div>

        {/* Right — Realistic 3D Floating Laptop */}
        <div className="relative flex justify-center animate-fade-in-up animate-delay-200">
          <RealisticLaptop3D />
        </div>
      </div>

      {/* Quick Feature Pills Bar */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20"
        style={{
          background: "rgba(7,9,19,0.75)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex flex-wrap justify-center gap-6">
          {[
            { icon: "🧠", label: "RAG-Powered Smart Answers" },
            { icon: "📝", label: "AI Quizzes & Flashcards" },
            { icon: "🎯", label: "Exam Prep Guide" },
            { icon: "📍", label: "Placement Tracker" },
            { icon: "📄", label: "Resume Analyzer" },
            { icon: "✅", label: "Todo List" },
          ].map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-2 text-xs font-medium"
              style={{ color: "#94A3B8" }}
            >
              <span>{f.icon}</span>
              <span>{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Feature Cards ─────────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    {
      icon: "📄",
      title: "RAG Document Assistant",
      description: "Upload any PPT, PDF or Document and get instant AI answers.",
      color: "#3B82F6",
      demo: (
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 glass-card p-2 text-xs">
            <span>📄</span>
            <span style={{ color: "#94A3B8" }}>Machine Learning Notes.pdf</span>
            <span className="ml-auto badge badge-green">✓</span>
          </div>
          <div className="glass-card p-3 text-xs" style={{ borderLeft: "2px solid #8B5CF6" }}>
            <div style={{ color: "#94A3B8" }}>💬 &quot;Explain the key concepts of Machine Learning?&quot;</div>
            <div className="mt-2" style={{ color: "#C4B5FD" }}>
              Machine Learning is a subset of AI that allows systems to learn from data and improve...
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: "✅",
      title: "AI Quiz & Flashcards",
      description: "Practice with smart quizzes and interactive flashcards.",
      color: "#8B5CF6",
      demo: (
        <div className="mt-4">
          <div className="text-sm font-semibold mb-2" style={{ color: "#F0F0FF" }}>
            Q1. What is RAG?
          </div>
          {["A) Retrieval Augmented Generation", "B) Random Access Graph", "C) Robust Algorithmic Growth"].map(
            (opt, i) => (
              <div
                key={opt}
                className="flex items-center gap-2 p-2 rounded-lg mb-1 text-xs cursor-pointer transition-all"
                style={{
                  background: i === 0 ? "rgba(139,92,246,0.2)" : "rgba(13,17,39,0.5)",
                  border: `1px solid ${i === 0 ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.06)"}`,
                  color: i === 0 ? "#C4B5FD" : "#64748B",
                }}
              >
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                  style={{
                    background: i === 0 ? "#8B5CF6" : "transparent",
                    border: "1px solid #64748B",
                  }}
                >
                  {i === 0 ? "✓" : String.fromCharCode(65 + i)}
                </span>
                {opt}
              </div>
            )
          )}
          <Link href="/dashboard/quizzes" className="mt-2 btn-primary w-full text-xs py-2 justify-center">
            Next →
          </Link>
        </div>
      ),
    },
    {
      icon: "🎓",
      title: "Exam Prep Guide",
      description: "Get personalized study plans and top strategies.",
      color: "#06B6D4",
      demo: (
        <div className="mt-4 space-y-2">
          {["Key Topics", "Important Questions", "Study Plan", "Time Management Tips"].map(
            (item) => (
              <div key={item} className="flex items-center gap-2 text-sm" style={{ color: "#94A3B8" }}>
                <span className="text-green-400">✓</span> {item}
              </div>
            )
          )}
          <Link href="/dashboard/exam-guide" className="mt-3 btn-cyan w-full text-xs py-2 justify-center">
            View Study Guide
          </Link>
        </div>
      ),
    },
    {
      icon: "📄",
      title: "Resume Analyzer",
      description: "Analyze your resume and get improvement tips.",
      color: "#10B981",
      demo: (
        <div className="mt-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke="#34D399"
                  strokeWidth="3"
                  strokeDasharray="85 15"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-green-400">
                85%
              </div>
            </div>
            <div>
              <div className="text-sm font-bold" style={{ color: "#34D399" }}>
                Resume Score: Great!
              </div>
            </div>
          </div>
          <div className="mt-3 space-y-1 text-xs" style={{ color: "#F87171" }}>
            <div>⚠️ Missing Skills: Docker, Testing</div>
            <div>➕ Add Quantified Metrics</div>
            <div>✏️ Improve Executive Summary</div>
          </div>
          <Link href="/dashboard/resume" className="mt-3 btn-primary w-full text-xs py-2 justify-center">
            View Suggestions →
          </Link>
        </div>
      ),
    },
    {
      icon: "🚀",
      title: "Placement Tracker & Job Opportunities",
      description: "Track your placement journey and find the best jobs.",
      color: "#F59E0B",
      demo: (
        <div className="mt-4 space-y-2">
          {[
            { company: "Google", role: "SDE Intern", type: "Remote · Internship", logo: "G" },
            { company: "Microsoft", role: "Software Engineer", type: "Bengaluru · Full Time", logo: "M" },
            { company: "Amazon", role: "Data Scientist", type: "Remote · Full Time", logo: "A" },
          ].map((j) => (
            <div key={j.company} className="flex items-center gap-3 glass-card p-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                style={{ background: "linear-gradient(135deg,#8B5CF6,#3B82F6)" }}
              >
                {j.logo}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold" style={{ color: "#F0F0FF" }}>
                  {j.role} · {j.company}
                </div>
                <div className="text-xs" style={{ color: "#64748B" }}>
                  {j.type}
                </div>
              </div>
              <Link href="/dashboard/placement" className="btn-cyan text-xs py-1 px-3">
                Apply
              </Link>
            </div>
          ))}
          <Link href="/dashboard/placement" className="mt-1 text-xs font-semibold block text-center" style={{ color: "#8B5CF6" }}>
            Explore More Jobs →
          </Link>
        </div>
      ),
    },
  ];

  return (
    <section id="features" className="py-24" style={{ background: "#070913" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="badge badge-violet mb-4">✨ Everything You Need</div>
          <h2 className="text-4xl font-black mb-4" style={{ color: "#F0F0FF" }}>
            Supercharge Your <span className="gradient-text">Learning Journey</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#64748B" }}>
            From document analysis to career prep — Cortexa AI is your all-in-one intelligent study
            platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="glass-card glass-card-hover p-6 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                style={{ background: `${f.color}22`, border: `1px solid ${f.color}44` }}
              >
                {f.icon}
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: "#F0F0FF" }}>
                {f.title}
              </h3>
              <p className="text-sm mb-2" style={{ color: "#64748B" }}>
                {f.description}
              </p>
              {f.demo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Stats Bar ─────────────────────────────────────────────────────
function StatsBar() {
  return (
    <div
      className="py-12"
      style={{
        background: "rgba(13,17,39,0.6)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {[
          { value: "100K+", label: "Happy Students", icon: "👨‍🎓" },
          { value: "50M+", label: "Documents Processed", icon: "📄" },
          { value: "98%", label: "Satisfaction Rate", icon: "⭐" },
          { value: "50+", label: "Countries Supported", icon: "🌍" },
        ].map((s) => (
          <div key={s.label}>
            <div className="text-3xl mb-1">{s.icon}</div>
            <div className="text-3xl font-black gradient-text">{s.value}</div>
            <div className="text-sm mt-1" style={{ color: "#64748B" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Footer ────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      style={{ background: "#070913", borderTop: "1px solid rgba(255,255,255,0.06)" }}
      className="py-12"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          {/* Trust Badges */}
          <div className="flex flex-wrap gap-6">
            {[
              { icon: "🛡️", title: "Secure & Scalable", desc: "Enterprise-grade security" },
              {
                icon: "✨",
                title: "Powered by Advanced AI",
                desc: "Groq & Gemini API with auto-fallback",
              },
              { icon: "</>", title: "Built with Modern Tech", desc: "Next.js · Supabase · pgvector" },
              { icon: "☁️", title: "Ready for Deployment", desc: "Vercel · Render compatible" },
            ].map((b) => (
              <div key={b.title} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                  style={{
                    background: "rgba(139,92,246,0.15)",
                    border: "1px solid rgba(139,92,246,0.3)",
                    color: "#8B5CF6",
                  }}
                >
                  {b.icon}
                </div>
                <div>
                  <div className="text-xs font-semibold" style={{ color: "#F0F0FF" }}>
                    {b.title}
                  </div>
                  <div className="text-xs" style={{ color: "#64748B" }}>
                    {b.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#8B5CF6,#06B6D4)" }}
            >
              <span className="text-white font-black text-xs">C</span>
            </div>
            <div>
              <span className="text-white font-bold">Cortexa AI</span>
              <div className="text-xs" style={{ color: "#64748B" }}>
                Learn Smarter. Achieve Bigger.
              </div>
            </div>
          </div>
          <Link href="/register" className="btn-primary text-sm">
            Start Now →
          </Link>
        </div>
      </div>
    </footer>
  );
}

// ── Main Page Export ──────────────────────────────────────────────
export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <StatsBar />
      <FeaturesSection />
      <Footer />
    </main>
  );
}
