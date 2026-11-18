"use client";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  return (
    <div
      className="min-h-screen cosmic-bg flex items-center justify-center p-6"
      style={{ background: "#070913" }}
    >
      <div className="w-full max-w-md glass-card p-8 space-y-6">
        <div className="text-center space-y-2">
          <div
            className="w-12 h-12 mx-auto rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#8B5CF6,#06B6D4)" }}
          >
            <span className="text-white font-black text-xl">C</span>
          </div>
          <h1 className="text-2xl font-black text-white">Reset Password</h1>
          <p className="text-xs" style={{ color: "#64748B" }}>
            Enter your student email and we&apos;ll send you a recovery link
          </p>
        </div>

        {sent ? (
          <div className="glass-card p-4 text-center space-y-3">
            <div className="text-3xl">📧</div>
            <div className="text-sm font-bold text-white">Password Reset Link Sent</div>
            <p className="text-xs" style={{ color: "#94A3B8" }}>
              If an account exists for {email}, a recovery link has been dispatched to your inbox.
            </p>
            <Link href="/login" className="btn-primary text-xs py-2 px-4 inline-block mt-2">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: "#94A3B8" }}>
                STUDENT EMAIL
              </label>
              <input
                type="email"
                required
                className="input-glass"
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full justify-center text-sm py-3"
            >
              Send Reset Link →
            </button>
          </form>
        )}

        <div className="text-center text-xs" style={{ color: "#64748B" }}>
          Remember your password?{" "}
          <Link href="/login" className="text-violet-400 font-semibold hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
