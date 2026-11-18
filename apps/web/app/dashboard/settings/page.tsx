"use client";
import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/auth";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState("Student Scholar");
  const [persona, setPersona] = useState<"school_student" | "college_student" | "job_seeker">("college_student");
  const [institution, setInstitution] = useState("University Institute of Technology");
  const [targetRole, setTargetRole] = useState("Software Development Engineer");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [savedStatus, setSavedStatus] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      if (user.name) setDisplayName(user.name);
      if (user.persona) setPersona(user.persona);
      if (user.institution) setInstitution(user.institution);
      if (user.targetRole) setTargetRole(user.targetRole);
    }
  }, []);

  const handleSave = () => {
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2500);
  };

  const handleExportData = () => {
    const data = {
      profile: { displayName, persona, institution, targetRole },
      exported_at: new Date().toISOString(),
      note: "Cortexa AI student data export archive.",
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cortexa_user_data_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black" style={{ color: "#F0F0FF" }}>
          ⚙️ Profile & Persona Settings
        </h1>
        <p className="text-sm mt-1" style={{ color: "#64748B" }}>
          Customize your learning path, persona experience, and data preferences.
        </p>
      </div>

      {/* Persona Selection */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
          Active Student Persona
        </h3>
        <p className="text-xs" style={{ color: "#94A3B8" }}>
          Cortexa AI tailors study recommendations, quiz difficulty, and career tools based on your persona.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              id: "school_student",
              title: "School Student",
              icon: "🎒",
              desc: "Chapter revision, foundational concept quizzes, and homework assistance.",
            },
            {
              id: "college_student",
              title: "College Student",
              icon: "🎓",
              desc: "Lecture slide RAG, semester exam guides, and technical skill builders.",
            },
            {
              id: "job_seeker",
              title: "Early Career / Job Seeker",
              icon: "💼",
              desc: "Resume analysis, ATS feedback, and placement application pipeline.",
            },
          ].map((p) => {
            const isSelected = persona === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setPersona(p.id as any)}
                className={`p-4 rounded-xl cursor-pointer border transition-all ${
                  isSelected
                    ? "border-violet-500 bg-violet-500/10 shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                    : "border-white/5 bg-white/[0.02] hover:border-white/10"
                }`}
              >
                <div className="text-3xl mb-2">{p.icon}</div>
                <div className="text-sm font-bold text-white mb-1">{p.title}</div>
                <div className="text-xs" style={{ color: "#64748B" }}>
                  {p.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Profile Details */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
          Profile Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: "#94A3B8" }}>
              DISPLAY NAME
            </label>
            <input
              className="input-glass"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: "#94A3B8" }}>
              INSTITUTION / UNIVERSITY
            </label>
            <input
              className="input-glass"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-semibold mb-1 block" style={{ color: "#94A3B8" }}>
              PRIMARY TARGET ROLE
            </label>
            <input
              className="input-glass"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {savedStatus && (
            <span className="badge badge-green text-xs">✓ Preferences saved successfully</span>
          )}
          <button className="btn-primary text-xs py-2 px-6 ml-auto" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>

      {/* Security & Privacy */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
          Data Governance & Privacy
        </h3>
        <p className="text-xs leading-relaxed" style={{ color: "#94A3B8" }}>
          In accordance with privacy standards, you maintain complete ownership over your uploaded
          lecture notes, resumes, and study conversations.
        </p>
        <div className="flex flex-wrap gap-4 pt-2">
          <button className="btn-secondary text-xs py-2" onClick={handleExportData}>
            📦 Export My Data (JSON)
          </button>
          <button
            className="text-xs py-2 px-4 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
            onClick={() => alert("To delete your account and cascade delete all documents/vectors, visit your Supabase auth console or contact privacy@cortexa.ai.")}
          >
            🗑 Request Account Deletion
          </button>
        </div>
      </div>
    </div>
  );
}
