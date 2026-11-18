"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [persona, setPersona] = useState<"school_student" | "college_student" | "job_seeker">("college_student");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!name.trim()) {
        throw new Error("Please enter your full name.");
      }
      if (!email.trim()) {
        throw new Error("Please enter a valid email address.");
      }
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long.");
      }

      registerUser({
        name,
        email,
        password,
        persona,
      });

      // Redirect immediately to dashboard
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen cosmic-bg flex items-center justify-center p-6"
      style={{ background: "#070913" }}
    >
      <div className="w-full max-w-lg glass-card p-8 space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg,#8B5CF6,#06B6D4)" }}
            >
              <span className="text-white font-black text-xl">C</span>
            </div>
            <span className="text-white font-bold text-lg">Cortexa AI</span>
          </Link>
          <h1 className="text-2xl font-black text-white">Create Your Account</h1>
          <p className="text-xs" style={{ color: "#64748B" }}>
            Learn Smarter. Remember Longer. Achieve Further.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-xs flex items-center gap-2.5">
            <span className="text-sm">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-xs font-semibold mb-2 block" style={{ color: "#94A3B8" }}>
              CHOOSE YOUR LEARNING PERSONA
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "school_student", label: "School", icon: "🎒" },
                { id: "college_student", label: "College", icon: "🎓" },
                { id: "job_seeker", label: "Job Seeker", icon: "💼" },
              ].map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setPersona(p.id as any)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    persona === p.id
                      ? "border-violet-500 bg-violet-500/20 text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                      : "border-white/5 bg-white/[0.02] text-gray-400 hover:border-white/10"
                  }`}
                >
                  <div className="text-xl mb-1">{p.icon}</div>
                  <div className="text-xs font-bold">{p.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: "#94A3B8" }}>
              YOUR FULL NAME
            </label>
            <input
              type="text"
              required
              className="input-glass"
              placeholder="e.g. Aarush Janga"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: "#94A3B8" }}>
              STUDENT / WORK EMAIL
            </label>
            <input
              type="email"
              required
              className="input-glass"
              placeholder="aarush@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: "#94A3B8" }}>
              PASSWORD
            </label>
            <input
              type="password"
              required
              minLength={6}
              className="input-glass"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full justify-center text-sm py-3 mt-2"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account & Enter Dashboard →"}
          </button>
        </form>

        <div className="text-center text-xs" style={{ color: "#64748B" }}>
          Already have an account?{" "}
          <Link href="/login" className="text-violet-400 font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
