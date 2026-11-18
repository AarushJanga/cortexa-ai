"use client";
import { useState, useRef } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

type Analysis = {
  id?: string;
  overall_score: number;
  target_role: string;
  strengths: string[];
  missing_skills: string[];
  improvement_suggestions: string[];
};

export default function ResumePage() {
  const [targetRole, setTargetRole] = useState("Software Development Engineer");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis>({
    overall_score: 85,
    target_role: "Software Development Engineer",
    strengths: [
      "Strong foundational computer science background and relevant coursework",
      "Explicitly listed modern full-stack web technologies (TypeScript, Next.js, FastAPI)",
      "Clear chronological layout with clean contact information section",
    ],
    missing_skills: [
      "Docker & Containerization workflow experience",
      "Cloud Deployment & Infrastructure (AWS, GCP, or Render)",
      "Automated Testing (Pytest, Jest, or CI/CD pipelines)",
    ],
    improvement_suggestions: [
      "Quantify your bullet points: instead of 'Built web app', use 'Built high-throughput web app serving 10k users, reducing latency by 40%'",
      "Add direct links to live demo deployments and public GitHub repositories",
      "Tailor your summary to highlight system design and database performance indexing",
    ],
  });
  const [fileName, setFileName] = useState("Resume_John_Doe_2026.pdf");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadAndAnalyze = async (file: File) => {
    setAnalyzing(true);
    setFileName(file.name);
    setErrorMessage(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("target_role", targetRole);

    try {
      const res = await fetch(`${API}/api/v1/career/resume/analyze`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setAnalysis(data);
      } else {
        const err = await res.json().catch(() => ({ detail: "Resume analysis failed" }));
        setErrorMessage(err.detail || "Resume analysis failed. Please verify file format.");
      }
    } catch (e) {
      console.error(e);
      setErrorMessage("Could not connect to backend server. Please ensure the API is running on port 8000.");
    }
    setAnalyzing(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#34D399";
    if (score >= 60) return "#FBBF24";
    return "#F87171";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black" style={{ color: "#F0F0FF" }}>
          📋 Resume & Career Intelligence
        </h1>
        <p className="text-sm mt-1" style={{ color: "#64748B" }}>
          Analyze your resume against ATS criteria, role requirements, and hiring standards.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs flex items-center justify-between">
          <span>⚠️ {errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Upload & Role Selector Card */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
          Upload & Target Role Configuration
        </h3>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div className="md:col-span-2">
            <label className="text-xs font-semibold mb-1 block" style={{ color: "#94A3B8" }}>
              TARGET JOB ROLE
            </label>
            <select
              className="input-glass"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
            >
              <option value="Software Development Engineer">Software Development Engineer (SDE)</option>
              <option value="Frontend Engineer">Frontend Engineer (React / Next.js)</option>
              <option value="Backend Engineer">Backend Engineer (Python / Go / Node)</option>
              <option value="Data Scientist / AI Engineer">Data Scientist / AI Engineer</option>
              <option value="Product Manager">Associate Product Manager (APM)</option>
            </select>
          </div>
          <div className="flex flex-col justify-end">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.docx,.txt"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleUploadAndAnalyze(f);
              }}
            />
            <button
              className="btn-primary w-full text-xs py-3"
              onClick={() => fileInputRef.current?.click()}
              disabled={analyzing}
            >
              {analyzing ? "⏳ Analyzing Resume..." : "📤 Upload & Analyze Resume"}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: "#64748B" }}>
          <span>📄 Current document analyzed:</span>
          <span className="text-violet-400 font-semibold">{fileName}</span>
        </div>
      </div>

      {/* Score and Main Findings */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Circular Score Gauge */}
        <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
          <div className="relative w-36 h-36 mb-4">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="3.2"
              />
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke={getScoreColor(analysis.overall_score)}
                strokeWidth="3.2"
                strokeDasharray={`${analysis.overall_score} 100`}
                strokeLinecap="round"
                style={{ transition: "stroke-dasharray 1s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="text-3xl font-black"
                style={{ color: getScoreColor(analysis.overall_score) }}
              >
                {analysis.overall_score}%
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#94A3B8" }}>
                ATS Score
              </span>
            </div>
          </div>
          <div
            className="text-base font-bold mb-1"
            style={{ color: getScoreColor(analysis.overall_score) }}
          >
            {analysis.overall_score >= 80 ? "Great Resume!" : "Needs Optimization"}
          </div>
          <p className="text-xs" style={{ color: "#64748B" }}>
            Benchmark against {analysis.target_role} standard filters.
          </p>
        </div>

        {/* Missing Skills & Gap Analysis */}
        <div className="md:col-span-2 glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Role Skill Gap Analysis
            </h3>
            <span className="badge badge-red">3 CRITICAL GAPS</span>
          </div>

          <div className="space-y-2">
            {analysis.missing_skills.map((skill, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="text-red-400">⚠️</span>
                  <span className="font-semibold text-red-200">Missing Skill: {skill}</span>
                </div>
                <button className="text-cyan-400 hover:underline">Add to Study Plan →</button>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Key Strengths Detected
            </h4>
            <div className="space-y-1 text-xs">
              {analysis.strengths.map((str, idx) => (
                <div key={idx} className="flex items-center gap-2 text-green-400">
                  <span>✓</span>
                  <span style={{ color: "#94A3B8" }}>{str}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Actionable Improvement Suggestions */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
          Actionable Resume Improvements
        </h3>
        <div className="space-y-3">
          {analysis.improvement_suggestions.map((suggestion, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex items-start gap-3"
            >
              <div className="w-6 h-6 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "#F0F0FF" }}>
                {suggestion}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
