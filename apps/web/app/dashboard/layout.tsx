"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getCurrentUser, logoutUser, UserProfile } from "@/lib/auth";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "🏠" },
  { label: "My Documents", href: "/dashboard/documents", icon: "📄" },
  { label: "Quizzes", href: "/dashboard/quizzes", icon: "📝" },
  { label: "Flashcards", href: "/dashboard/flashcards", icon: "🃏" },
  { label: "Exam Guide", href: "/dashboard/exam-guide", icon: "🎯" },
  { label: "Placement Tracker", href: "/dashboard/placement", icon: "💼" },
  { label: "Resume Analyzer", href: "/dashboard/resume", icon: "📋" },
  { label: "Todo List", href: "/dashboard/tasks", icon: "✅" },
  { label: "Settings", href: "/dashboard/settings", icon: "⚙️" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Strict authentication guard: ensure valid registered user session exists
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.replace("/login");
    } else {
      setUser(currentUser);
      setCheckingAuth(false);
    }
  }, [router]);

  const handleSignOut = () => {
    logoutUser();
    router.replace("/login");
  };

  if (checkingAuth) {
    return (
      <div className="flex h-screen items-center justify-center cosmic-bg" style={{ background: "#070913" }}>
        <div className="glass-card p-6 flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center animate-spin" style={{ background: "linear-gradient(135deg,#8B5CF6,#06B6D4)" }}>
            <span className="text-white font-bold text-xs">C</span>
          </div>
          <span className="text-xs text-gray-400">Verifying session credentials...</span>
        </div>
      </div>
    );
  }

  // Get user initials (e.g. Aarush Janga -> AJ)
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "ST";

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#070913" }}>
      {/* ── Sidebar ── */}
      <aside
        className="flex flex-col h-full transition-all duration-300"
        style={{
          width: sidebarOpen ? "250px" : "0",
          minWidth: sidebarOpen ? "250px" : "0",
          overflow: "hidden",
          background: "rgba(13,17,39,0.95)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(16px)",
        }}
      >
        {/* Logo & Home Link */}
        <div className="p-5 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-transform group-hover:scale-105"
              style={{ background: "linear-gradient(135deg,#8B5CF6,#06B6D4)" }}
            >
              <span className="text-white font-black text-sm">C</span>
            </div>
            <div>
              <div className="font-bold text-white text-sm leading-tight group-hover:text-violet-300 transition-colors">
                Cortexa AI
              </div>
              <div className="text-[11px]" style={{ color: "#64748B" }}>
                Learn Smarter.
              </div>
            </div>
          </Link>
        </div>

        {/* User Card */}
        <div className="px-4 py-3 mx-3 my-2 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-sm flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#8B5CF6,#06B6D4)" }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white truncate">{user?.name}</div>
            <div className="text-[10px] text-gray-400 truncate capitalize">
              {user?.persona?.replace("_", " ") || "Student"}
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-1 overflow-y-auto space-y-1">
          {NAV_ITEMS.map((item) => {
            const active =
              pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className={`sidebar-item ${active ? "active" : ""}`}>
                <span className="text-base">{item.icon}</span>
                <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions: Sign Out & Go Pro */}
        <div className="p-3 space-y-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
          >
            <span className="text-sm">🚪</span>
            <span>Sign Out</span>
          </button>

          <div
            className="glass-card p-3 text-center"
            style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.12),rgba(6,182,212,0.06))" }}
          >
            <div className="text-xs font-bold text-white mb-0.5">Upgrade to Pro</div>
            <div className="text-[11px] mb-2" style={{ color: "#64748B" }}>
              Unlimited AI queries
            </div>
            <button className="btn-primary w-full text-[11px] py-1.5 justify-center">Go Pro</button>
          </div>
        </div>
      </aside>

      {/* ── Main Canvas ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header
          className="flex items-center gap-4 px-6 h-16 flex-shrink-0"
          style={{
            background: "rgba(7,9,19,0.9)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(16px)",
          }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-xl p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            style={{ color: "#64748B" }}
            title="Toggle Sidebar"
          >
            ☰
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "#64748B" }}>
                🔍
              </span>
              <input
                type="text"
                placeholder='Search anything... (e.g. "Explain this topic")'
                className="input-glass pl-9 text-sm py-2"
              />
            </div>
          </div>

          <div className="flex-1" />

          {/* Streak Counter */}
          <div className="flex items-center gap-2 glass-card px-3 py-1.5">
            <span className="text-base">🔥</span>
            <div>
              <div className="text-xs font-bold text-white">12 Days</div>
              <div className="text-[10px]" style={{ color: "#64748B" }}>
                Learning Streak
              </div>
            </div>
          </div>

          {/* Notifications Bell */}
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-white/10"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            title="Notifications"
          >
            🔔
          </button>

          {/* Sign Out Button in Header */}
          <button
            onClick={handleSignOut}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all"
            title="Sign Out of Session"
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>

          {/* User Profile Avatar with Tooltip */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white cursor-pointer shadow-[0_0_12px_rgba(139,92,246,0.3)]"
            style={{ background: "linear-gradient(135deg,#8B5CF6,#06B6D4)" }}
            title={`Signed in as: ${user?.name} (${user?.email})`}
          >
            {initials}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
