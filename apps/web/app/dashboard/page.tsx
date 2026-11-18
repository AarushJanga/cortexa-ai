"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getCurrentUser, UserProfile } from "@/lib/auth";

// ── Progress Ring ──────────────────────────────────────────────
function ProgressRing({ pct, size = 120, stroke = 10 }: { pct: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="url(#prog)" strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
      <defs>
        <linearGradient id="prog" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Quick Action Card ──────────────────────────────────────────
function QuickActionCard({ icon, label, sublabel, href, color }: { icon: string; label: string; sublabel: string; href: string; color: string }) {
  return (
    <Link href={href} className="glass-card glass-card-hover p-5 flex flex-col items-center text-center cursor-pointer gap-3">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${color}22`, border: `1px solid ${color}44` }}>
        {icon}
      </div>
      <div>
        <div className="text-sm font-bold" style={{ color: "#F0F0FF" }}>{label}</div>
        <div className="text-xs mt-0.5" style={{ color: "#64748B" }}>{sublabel}</div>
      </div>
    </Link>
  );
}

// ── Recommended Card ──────────────────────────────────────────
function RecommendedCard({ icon, title, tag, href }: { icon: string; title: string; tag: string; href: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer" style={{ background: "rgba(255,255,255,0.03)" }}
      onMouseEnter={e => (e.currentTarget.style.background = "rgba(139,92,246,0.1)")}
      onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.25)" }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold truncate" style={{ color: "#F0F0FF" }}>{title}</div>
        <div className="badge badge-cyan mt-1">{tag}</div>
      </div>
      <Link href={href} className="btn-cyan py-1 px-3 text-xs flex-shrink-0">Explore →</Link>
    </div>
  );
}

// ── Stat Widget ───────────────────────────────────────────────
function StatWidget({ icon, value, label, change, positive }: { icon: string; value: string; label: string; change: string; positive: boolean }) {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-2xl">{icon}</div>
        <div className={`text-xs font-semibold ${positive ? "text-green-400" : "text-red-400"}`}>{change}</div>
      </div>
      <div className="text-2xl font-black" style={{ color: "#F0F0FF" }}>{value}</div>
      <div className="text-xs mt-1" style={{ color: "#64748B" }}>{label}</div>
    </div>
  );
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const welcomeName = user?.name ? user.name.split(" ")[0] : "Scholar";
  const progressPct = 78;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="glass-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4" style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.15),rgba(6,182,212,0.08),rgba(13,17,39,0.9))", borderColor: "rgba(139,92,246,0.25)" }}>
        <div>
          <h1 className="text-2xl font-black" style={{ color: "#F0F0FF" }}>
            Welcome back, <span className="gradient-text">{welcomeName}!</span> 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>Keep learning, keep growing 🌱</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="glass-card px-4 py-3 text-center">
            <div className="text-2xl mb-1">🔥</div>
            <div className="text-xl font-black" style={{ color: "#F59E0B" }}>12 Days</div>
            <div className="text-xs" style={{ color: "#64748B" }}>Learning Streak</div>
          </div>
          <div className="glass-card px-4 py-3">
            <div className="text-xs mb-1" style={{ color: "#64748B" }}>Weekly Activity</div>
            <div className="flex items-end gap-1 h-8">
              {[3, 5, 4, 7, 6, 8, 5].map((h, i) => (
                <div key={i} className="w-4 rounded-t" style={{ height: `${(h / 8) * 100}%`, background: i === 5 ? "linear-gradient(to top,#8B5CF6,#06B6D4)" : "rgba(139,92,246,0.3)" }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatWidget icon="📄" value="12" label="Documents Uploaded" change="+3 this week" positive={true} />
        <StatWidget icon="📝" value="8" label="Quizzes Taken" change="+2 today" positive={true} />
        <StatWidget icon="🃏" value="156" label="Flashcards Reviewed" change="+24 today" positive={true} />
        <StatWidget icon="💼" value="5" label="Job Applications" change="2 pending" positive={false} />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold mb-4" style={{ color: "#F0F0FF" }}>Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionCard icon="📄" label="Upload Documents" sublabel="Get AI Answers" href="/dashboard/documents" color="#3B82F6" />
          <QuickActionCard icon="📝" label="Take a Quiz" sublabel="Test Your Knowledge" href="/dashboard/quizzes" color="#8B5CF6" />
          <QuickActionCard icon="🃏" label="Create Flashcards" sublabel="Revise Smartly" href="/dashboard/flashcards" color="#06B6D4" />
          <QuickActionCard icon="🎯" label="View Study Guide" sublabel="Ace Your Exams" href="/dashboard/exam-guide" color="#10B981" />
        </div>
      </div>

      {/* Progress + Recommendations row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Progress Card */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold" style={{ color: "#F0F0FF" }}>Your Progress</h3>
            <Link href="/dashboard/documents" className="text-xs font-semibold" style={{ color: "#8B5CF6" }}>View Details →</Link>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <ProgressRing pct={progressPct} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-black gradient-text">{progressPct}%</span>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: "Topics Covered", done: true },
                { label: "Quizzes Completed", done: true },
                { label: "Skills Improved", done: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className={item.done ? "text-green-400" : "text-yellow-400"}>{item.done ? "✓" : "○"}</span>
                  <span className="text-sm" style={{ color: item.done ? "#F0F0FF" : "#64748B" }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold" style={{ color: "#F0F0FF" }}>🔥 Recommended for You</h3>
            <button className="text-xs font-semibold" style={{ color: "#8B5CF6" }}>View All →</button>
          </div>
          <div className="space-y-2">
            <RecommendedCard icon="📊" title="Data Structures Basics" tag="Quiz" href="/dashboard/quizzes" />
            <RecommendedCard icon="💼" title="Resume Tips for SDE Roles" tag="Career" href="/dashboard/resume" />
            <RecommendedCard icon="⚛️" title="Top JS Frameworks" tag="Study" href="/dashboard/documents" />
          </div>
        </div>
      </div>

      {/* Encouragement Banner */}
      <div className="glass-card p-5 flex items-center gap-4" style={{ background: "linear-gradient(135deg,rgba(245,158,11,0.12),rgba(251,191,36,0.06),rgba(13,17,39,0.9))", borderColor: "rgba(245,158,11,0.25)" }}>
        <div className="text-4xl">🏆</div>
        <div className="flex-1">
          <div className="text-sm font-bold" style={{ color: "#FCD34D" }}>You&apos;re doing great!</div>
          <div className="text-xs mt-1" style={{ color: "#94A3B8" }}>Keep going towards your goals. You&apos;ve improved 23% this week!</div>
        </div>
        <button className="btn-primary text-sm py-2 px-5">View Rewards</button>
      </div>
    </div>
  );
}
