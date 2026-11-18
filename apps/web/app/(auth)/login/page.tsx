"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!email.trim() || !password) {
        throw new Error("Please enter both email and password.");
      }

      // Strict credential verification
      loginUser(email, password);

      // Successfully verified — proceed to dashboard
      router.replace("/dashboard");
    } catch (err: any) {
      setError(
        err?.message ||
          "Invalid email or password. Please verify your credentials or create an account."
      );
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen cosmic-bg flex items-center justify-center p-6"
      style={{ background: "#070913" }}
    >
      <div className="w-full max-w-md glass-card p-8 space-y-6">
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
          <h1 className="text-2xl font-black text-white">Welcome Back</h1>
          <p className="text-xs" style={{ color: "#64748B" }}>
            Sign in with your registered credentials to access your dashboard
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-xs flex items-center gap-2.5">
            <span className="text-sm">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: "#94A3B8" }}>
              STUDENT / WORK EMAIL
            </label>
            <input
              type="email"
              required
              className="input-glass"
              placeholder="your-email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold" style={{ color: "#94A3B8" }}>
                PASSWORD
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-violet-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              required
              className="input-glass"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full justify-center text-sm py-3 mt-2"
            disabled={loading}
          >
            {loading ? "Verifying Credentials..." : "Sign In to Dashboard →"}
          </button>
        </form>

        <div className="text-center text-xs" style={{ color: "#64748B" }}>
          Don&apos;t have an account yet?{" "}
          <Link href="/register" className="text-violet-400 font-semibold hover:underline">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
