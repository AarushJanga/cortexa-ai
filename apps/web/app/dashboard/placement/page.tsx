"use client";
import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

type Job = {
  id: string;
  company: string;
  role: string;
  location: string;
  type: string;
  apply_url: string;
  logo: string;
  color: string;
};

type Application = {
  id: string;
  company: string;
  role: string;
  application_url?: string;
  status: "saved" | "applied" | "interviewing" | "offer" | "rejected";
  application_date?: string;
  notes?: string;
  next_action?: string;
};

const CURATED_JOBS: Job[] = [
  {
    id: "1",
    company: "Google",
    role: "SDE Intern (Summer 2027)",
    location: "Remote / Bengaluru",
    type: "Internship",
    apply_url: "https://careers.google.com/jobs/results/",
    logo: "G",
    color: "#4285F4",
  },
  {
    id: "2",
    company: "Microsoft",
    role: "Software Engineer (Full-Time)",
    location: "Bengaluru · Onsite",
    type: "Full Time",
    apply_url: "https://careers.microsoft.com/us/en",
    logo: "M",
    color: "#00A4EF",
  },
  {
    id: "3",
    company: "Amazon",
    role: "Data Scientist / Applied ML",
    location: "Remote · Full Time",
    type: "Full Time",
    apply_url: "https://amazon.jobs",
    logo: "A",
    color: "#FF9900",
  },
  {
    id: "4",
    company: "Meta",
    role: "Systems & Infrastructure Intern",
    location: "Hyderabad · Hybrid",
    type: "Internship",
    apply_url: "https://metacareers.com",
    logo: "M",
    color: "#0668E1",
  },
];

export default function PlacementPage() {
  const [activeTab, setActiveTab] = useState<"opportunities" | "tracker">("opportunities");
  const [applications, setApplications] = useState<Application[]>([
    {
      id: "app-1",
      company: "Google",
      role: "SDE Intern",
      status: "applied",
      application_date: "2026-11-10",
      next_action: "OA Round scheduled for Nov 22",
      notes: "Referral from alumni on LinkedIn",
    },
    {
      id: "app-2",
      company: "Microsoft",
      role: "Software Engineer",
      status: "interviewing",
      application_date: "2026-11-04",
      next_action: "Technical Round 2 (System Design)",
      notes: "Revise distributed caching and DB indexing",
    },
    {
      id: "app-3",
      company: "Amazon",
      role: "Data Scientist",
      status: "saved",
      application_date: "2026-11-14",
      next_action: "Tailor resume before submitting",
      notes: "Focus on PyTorch & LangChain projects",
    },
  ]);

  const [newCompany, setNewCompany] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newStatus, setNewStatus] = useState<Application["status"]>("applied");
  const [newAction, setNewAction] = useState("");

  const handleAddApplication = () => {
    if (!newCompany || !newRole) return;
    const newApp: Application = {
      id: `app-${Date.now()}`,
      company: newCompany,
      role: newRole,
      status: newStatus,
      application_date: new Date().toISOString().split("T")[0],
      next_action: newAction || "Review application",
    };
    setApplications([newApp, ...applications]);
    setNewCompany("");
    setNewRole("");
    setNewAction("");
  };

  const getStatusBadge = (status: Application["status"]) => {
    switch (status) {
      case "offer":
        return "badge-green";
      case "interviewing":
        return "badge-cyan";
      case "applied":
        return "badge-violet";
      case "saved":
        return "badge-amber";
      case "rejected":
        return "badge-red";
      default:
        return "badge-violet";
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "#F0F0FF" }}>
            💼 Placement Tracker & Job Opportunities
          </h1>
          <p className="text-sm mt-1" style={{ color: "#64748B" }}>
            Track active interview pipelines and discover verified career opportunities.
          </p>
        </div>
        <div className="flex glass-card p-1">
          <button
            onClick={() => setActiveTab("opportunities")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "opportunities"
                ? "bg-violet-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            🔥 Curated Opportunities
          </button>
          <button
            onClick={() => setActiveTab("tracker")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "tracker"
                ? "bg-violet-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            📊 My Pipeline ({applications.length})
          </button>
        </div>
      </div>

      {activeTab === "opportunities" ? (
        /* Curated Job Opportunities */
        <div className="space-y-4">
          <div className="glass-card p-4 flex items-center justify-between text-xs" style={{ color: "#94A3B8" }}>
            <span>Verified career links directly targeting major hiring tech portals.</span>
            <span className="badge badge-cyan">4 HOT OPENINGS</span>
          </div>

          <div className="grid gap-3">
            {CURATED_JOBS.map((job) => (
              <div
                key={job.id}
                className="glass-card glass-card-hover p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0"
                    style={{ background: job.color }}
                  >
                    {job.logo}
                  </div>
                  <div>
                    <div className="text-base font-bold text-white flex items-center gap-2">
                      {job.role}
                      <span className="badge badge-violet text-[10px]">{job.type}</span>
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
                      {job.company} · {job.location}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setNewCompany(job.company);
                      setNewRole(job.role);
                      setActiveTab("tracker");
                    }}
                    className="btn-secondary text-xs py-2 px-3"
                  >
                    + Add to Pipeline
                  </button>
                  <a
                    href={job.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-cyan text-xs py-2 px-4"
                  >
                    Apply Now ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Pipeline Tracker */
        <div className="space-y-6">
          {/* Add form */}
          <div className="glass-card p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Add New Placement Application
            </h3>
            <div className="grid md:grid-cols-4 gap-3">
              <input
                className="input-glass"
                placeholder="Company Name (e.g. Stripe)"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
              />
              <input
                className="input-glass"
                placeholder="Role (e.g. Backend Intern)"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              />
              <select
                className="input-glass"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as any)}
              >
                <option value="saved">Saved</option>
                <option value="applied">Applied</option>
                <option value="interviewing">Interviewing</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
              <button className="btn-primary text-xs py-2" onClick={handleAddApplication}>
                + Track Application
              </button>
            </div>
          </div>

          {/* Table / List */}
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Active Placement Pipelines
              </span>
              <span className="text-xs" style={{ color: "#64748B" }}>
                {applications.length} tracked records
              </span>
            </div>
            <div className="divide-y divide-white/5">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{app.company}</span>
                      <span className={`badge ${getStatusBadge(app.status)} uppercase text-[9px]`}>
                        {app.status}
                      </span>
                    </div>
                    <div style={{ color: "#94A3B8" }}>{app.role}</div>
                  </div>

                  <div className="space-y-1 text-right">
                    <div className="text-cyan-400 font-medium">Next: {app.next_action}</div>
                    <div style={{ color: "#64748B" }}>
                      Applied: {app.application_date || "Recent"} · {app.notes}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
