"use client";
import { useState, useRef, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

type Doc = {
  id: string;
  title: string;
  file_name: string;
  file_size: number;
  status: string;
  page_count: number;
  summary?: string;
  created_at: string;
};

type CitationItem = {
  chunk_id: string;
  document_id: string;
  file_name?: string;
  page_number?: number;
  slide_number?: number;
  snippet?: string;
};

type Message = {
  role: "user" | "assistant";
  content: string;
  citations?: CitationItem[];
};

function FormattedContent({ text }: { text: string }) {
  // Format markdown bold (**text**), bullet points (- or •), and paragraphs cleanly
  const lines = text.split("\n");
  return (
    <div className="space-y-2 leading-relaxed text-sm">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Format bold spans
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        const formattedParts = parts.map((part, pIdx) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={pIdx} className="font-semibold text-violet-200">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });

        // Bullet point
        if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="text-violet-400 mt-0.5">•</span>
              <span className="flex-1">{formattedParts}</span>
            </div>
          );
        }

        return <div key={idx}>{formattedParts}</div>;
      })}
    </div>
  );
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [convId, setConvId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchDocs = async () => {
    try {
      const res = await fetch(`${API}/api/v1/documents`);
      if (res.ok) {
        const data = await res.json();
        setDocs(data);
        if (data.length > 0 && !selectedDoc) {
          setSelectedDoc(data[0]);
        }
      }
    } catch {
      // Backend may be offline or loading
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const uploadFile = async (file: File) => {
    setUploading(true);
    setErrorMessage(null);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch(`${API}/api/v1/documents/upload`, {
        method: "POST",
        body: form,
      });
      if (res.ok) {
        const doc = await res.json();
        setDocs((prev) => [doc, ...prev]);
        setSelectedDoc(doc);
        setMessages([]);
        setConvId(null);
      } else {
        const err = await res.json().catch(() => ({ detail: "Upload failed" }));
        setErrorMessage(err.detail || "Upload failed. Please check file format and size.");
      }
    } catch {
      setErrorMessage("Could not connect to document processing backend.");
    }
    setUploading(false);
  };

  const sendMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setMessages((m) => [...m, { role: "user", content: userMsg }]);
    setChatLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`${API}/api/v1/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          document_id: selectedDoc?.id,
          conversation_id: convId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setConvId(data.conversation_id);
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: data.assistant_message,
            citations: data.citations,
          },
        ]);
      } else {
        const err = await res.json().catch(() => ({ detail: "Chat request failed" }));
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: `Error: ${err.detail || "Could not complete request."}`,
          },
        ]);
      }
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Sorry, I could not reach the server. Please check that the backend is running.",
        },
      ]);
    }
    setChatLoading(false);
  };

  // Helper to deduplicate citations per message
  const getDeduplicatedCitations = (citations?: CitationItem[]) => {
    if (!citations || citations.length === 0) return [];
    const seen = new Set<string>();
    const result: CitationItem[] = [];
    for (const c of citations) {
      const key = `${c.document_id || ""}-${c.page_number || 1}`;
      if (!seen.has(key)) {
        seen.add(key);
        result.push(c);
      }
    }
    return result;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black" style={{ color: "#F0F0FF" }}>📄 Document Intelligence</h1>
        <p className="text-sm mt-1" style={{ color: "#64748B" }}>
          Upload PDF, PPTX, DOCX, or TXT files and ask AI questions strictly grounded in your content.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs flex items-center justify-between">
          <span>⚠️ {errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-white">✕</button>
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: Upload + Doc List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Upload Zone */}
          <div
            className="glass-card p-6 border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all"
            style={{
              borderColor: dragOver ? "#8B5CF6" : "rgba(255,255,255,0.1)",
              background: dragOver ? "rgba(139,92,246,0.08)" : undefined,
            }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const f = e.dataTransfer.files[0];
              if (f) uploadFile(f);
            }}
            onClick={() => fileRef.current?.click()}
          >
            <div className="text-4xl">{uploading ? "⏳" : "📂"}</div>
            <div className="text-sm font-semibold text-center" style={{ color: "#F0F0FF" }}>
              {uploading ? "Processing document & extracting pages..." : "Drop file here or click to upload"}
            </div>
            <div className="text-xs text-center" style={{ color: "#64748B" }}>
              PDF, PPTX, DOCX, TXT · Max 15 MB
            </div>
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              accept=".pdf,.pptx,.docx,.txt,.md"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadFile(f);
              }}
            />
          </div>

          {/* Document List */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold" style={{ color: "#94A3B8" }}>
              YOUR DOCUMENTS ({docs.length})
            </h3>
            {docs.length === 0 && (
              <div className="glass-card p-4 text-center text-sm" style={{ color: "#64748B" }}>
                No documents yet — upload your first one!
              </div>
            )}
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="glass-card glass-card-hover p-4 cursor-pointer transition-all"
                style={{
                  borderColor: selectedDoc?.id === doc.id ? "rgba(139,92,246,0.6)" : undefined,
                  background: selectedDoc?.id === doc.id ? "rgba(139,92,246,0.08)" : undefined,
                }}
                onClick={() => {
                  setSelectedDoc(doc);
                  setMessages([]);
                  setConvId(null);
                }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">
                    {doc.file_name.endsWith(".pdf") ? "📄" : doc.file_name.endsWith(".pptx") ? "📊" : "📝"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate" style={{ color: "#F0F0FF" }}>
                      {doc.title || doc.file_name}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "#64748B" }}>
                      {doc.page_count} {doc.page_count === 1 ? "page" : "pages"} · {(doc.file_size / 1024).toFixed(0)} KB
                    </div>
                    {doc.summary && (
                      <div className="text-xs mt-1 line-clamp-2" style={{ color: "#94A3B8" }}>
                        {doc.summary}
                      </div>
                    )}
                  </div>
                  <span
                    className={`badge ${
                      doc.status === "ready"
                        ? "badge-green"
                        : doc.status === "failed"
                        ? "badge-red"
                        : "badge-amber"
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Grounded Chat Box */}
        <div className="lg:col-span-3 glass-card flex flex-col" style={{ height: "620px" }}>
          {/* Chat Header */}
          <div className="p-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                style={{ background: "rgba(139,92,246,0.2)" }}
              >
                🤖
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: "#F0F0FF" }}>
                  Cortexa AI Grounded Assistant
                </div>
                <div className="text-xs truncate max-w-xs" style={{ color: "#64748B" }}>
                  {selectedDoc ? `Selected: ${selectedDoc.file_name}` : "Please select or upload a document"}
                </div>
              </div>
            </div>
            {selectedDoc && (
              <span className="text-xs px-2.5 py-1 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20">
                Grounded Mode
              </span>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
                <div className="text-4xl">💬</div>
                <div className="text-sm font-semibold" style={{ color: "#F0F0FF" }}>
                  Ask questions strictly grounded in your document!
                </div>
                <div className="text-xs max-w-sm" style={{ color: "#64748B" }}>
                  Cortexa AI extracts exact facts, scores, dates, and names from your document without hallucinating.
                </div>
              </div>
            )}
            {messages.map((msg, i) => {
              const deduped = getDeduplicatedCitations(msg.citations);
              const isUnavailable = msg.content.toLowerCase().includes("not available in the uploaded document");

              return (
                <div
                  key={i}
                  className={msg.role === "user" ? "chat-message-user self-end max-w-xl" : "chat-message-assistant self-start max-w-xl"}
                >
                  <FormattedContent text={msg.content} />

                  {/* Grounded Page Citations */}
                  {deduped.length > 0 && !isUnavailable && (
                    <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-col gap-1.5">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        📚 Verified Source:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {deduped.map((c, ci) => (
                          <div
                            key={ci}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-violet-950/60 text-violet-200 border border-violet-500/30"
                          >
                            <span>📄 {c.file_name || selectedDoc?.file_name || "Document"}</span>
                            <span className="text-violet-400 font-bold">—</span>
                            <span>Page {c.page_number || 1}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {chatLoading && (
              <div className="chat-message-assistant self-start">
                <div className="flex items-center gap-2 text-xs text-violet-300">
                  <div className="flex gap-1">
                    <span className="animate-bounce" style={{ animationDelay: "0ms" }}>●</span>
                    <span className="animate-bounce" style={{ animationDelay: "150ms" }}>●</span>
                    <span className="animate-bounce" style={{ animationDelay: "300ms" }}>●</span>
                  </div>
                  <span>Searching document context & synthesizing grounded answer...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex gap-3">
              <input
                className="input-glass flex-1 text-sm"
                placeholder={selectedDoc ? `Ask a question about ${selectedDoc.file_name}...` : "Upload a document first to ask questions..."}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <button
                onClick={sendMessage}
                disabled={chatLoading || !chatInput.trim()}
                className="btn-primary px-4 py-2 text-sm disabled:opacity-50"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
