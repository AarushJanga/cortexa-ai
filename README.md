<div align="center">

<img src="https://img.shields.io/badge/Cortexa_AI-Learn%20Smarter-6366f1?style=for-the-badge&logo=sparkles&logoColor=white" alt="Cortexa AI"/>

# ✨ Cortexa AI
### *Learn Smarter. Remember Longer. Achieve Further.*

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python)](https://python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

**A production-ready, AI-powered study and career platform built for students.**  
Document RAG · AI Quizzes · 3D Flashcards · Resume Analyzer · Placement Tracker

</div>

---

## 🚀 What is Cortexa AI?

**Cortexa AI** is a full-stack intelligent study platform that combines the power of **Retrieval-Augmented Generation (RAG)**, **LLM-powered quizzes**, and **career tools** into a single, beautifully designed student dashboard.

Upload your notes, generate quizzes, create flashcards, analyze your resume, and track placements — all in one place, powered by Groq (LLaMA 3.3) and Google Gemini.

---

## 🎯 Key Features

| Feature | Description |
|---------|-------------|
| 🧠 **Document Intelligence** | Upload PDFs, DOCX, PPTX — ask questions, get grounded AI answers |
| ❓ **AI Quiz Generator** | Auto-generate MCQ quizzes from your uploaded study materials |
| 🃏 **3D Flashcards** | Spaced-repetition flashcards generated from your documents |
| 📋 **Exam Prep Guide** | Personalized exam strategy and topic summaries |
| 📄 **Resume Analyzer** | AI-powered resume scoring, gap analysis, and improvement tips |
| 🎯 **Placement Tracker** | Track job applications, interviews, and company pipelines |
| ✅ **Tasks & Todo Planner** | Organize your study schedule and deadlines |
| ⚙️ **Settings & Persona** | Customize your AI study persona and preferences |

---

## 🏗️ Architecture

```
cortexa-ai/
├── apps/
│   ├── api/                    # FastAPI Backend
│   │   ├── app/
│   │   │   ├── api/v1/         # REST API routes
│   │   │   │   ├── chat.py          # AI chat endpoint
│   │   │   │   ├── documents.py     # RAG document pipeline
│   │   │   │   ├── quizzes.py       # Quiz generation
│   │   │   │   ├── flashcards.py    # Flashcard generation
│   │   │   │   ├── exam_guide.py    # Exam prep AI
│   │   │   │   ├── resume.py        # Resume analysis
│   │   │   │   ├── placement.py     # Placement tracker
│   │   │   │   └── tasks.py         # Task management
│   │   │   ├── core/
│   │   │   │   ├── config.py        # App configuration
│   │   │   │   ├── database.py      # Supabase DB layer
│   │   │   │   └── security.py      # JWT auth
│   │   │   └── services/
│   │   │       ├── ai_provider.py   # Groq + Gemini routing
│   │   │       ├── embeddings.py    # Vector embeddings
│   │   │       ├── grounded_engine.py # RAG engine
│   │   │       ├── document_parser.py # PDF/DOCX/PPTX parser
│   │   │       └── chunker.py       # Text chunking
│   │   └── requirements.txt
│   └── web/                    # Next.js 16 Frontend
│       ├── app/
│       │   ├── page.tsx             # Landing page
│       │   └── dashboard/           # All dashboard pages
│       └── lib/                     # Utilities & API clients
├── supabase/                   # DB migrations & schema
├── docs/                       # Documentation
└── tests/                      # Backend test suite
```

---

## ⚡ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 |
| **Backend** | FastAPI, Python 3.11+, Uvicorn, Pydantic v2 |
| **Database** | Supabase (PostgreSQL + pgvector + Row Level Security) |
| **Auth** | Supabase Auth (JWT) |
| **Storage** | Supabase Private Storage |
| **AI (Primary)** | Groq — LLaMA 3.3 70B Versatile |
| **AI (Fallback)** | Google Gemini 1.5 Flash |
| **Embeddings** | Google `text-embedding-004` (1536 dims) |
| **Document Parsing** | PyPDF, python-docx, python-pptx |

---

## 🛠️ Local Development

### Prerequisites

- **Node.js** v18+ (v20+ recommended)
- **Python** 3.11+
- **Git**

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/AarushJanga/cortexa-ai.git
cd cortexa-ai
```

---

### 2️⃣ Backend Setup (`apps/api`)

```bash
# Navigate to the backend
cd apps/api

# (Optional) Create a virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your API keys (see Environment Variables section)

# Start the backend server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

> 💡 **Offline Mode**: The backend ships with a built-in deterministic AI engine — it starts and responds even without API keys!

- **API Docs**: http://localhost:8000/api/docs
- **Health Check**: http://localhost:8000/api/v1/health

---

### 3️⃣ Frontend Setup (`apps/web`)

```bash
# Open a new terminal and navigate to the frontend
cd apps/web

# Install dependencies
npm install

# Configure environment variables
# Edit .env.local:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Start the frontend
npm run dev
```

Open **http://localhost:3000** 🎉

---

### 🖥️ One-Click Launch (Windows)

Just double-click **`RUN-LIVE-IT.bat`** in the project root — it starts both servers automatically!

---

## 🌐 App Pages

| Route | Page |
|-------|------|
| `/` | 🏠 Landing Page |
| `/dashboard` | 🎓 Student Command Dashboard |
| `/dashboard/documents` | 📚 Document Intelligence (RAG) |
| `/dashboard/quizzes` | ❓ AI Quiz Generator |
| `/dashboard/flashcards` | 🃏 3D Flashcard Studio |
| `/dashboard/exam-guide` | 📋 Exam Prep Guide |
| `/dashboard/resume` | 📄 Resume Analyzer |
| `/dashboard/placement` | 🎯 Placement Tracker |
| `/dashboard/tasks` | ✅ Tasks & Todo Planner |
| `/dashboard/settings` | ⚙️ Settings & Persona |

---

## 🔐 Environment Variables

### Backend (`apps/api/.env`)

```ini
APP_ENV=development
PORT=8000
FRONTEND_ORIGINS=http://localhost:3000

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET_OR_JWKS_URL=your-jwt-secret
SUPABASE_STORAGE_BUCKET=student-documents

# AI Providers
GROQ_API_KEY=your-groq-api-key
GROQ_CHAT_MODEL=llama-3.3-70b-versatile
GEMINI_API_KEY=your-gemini-api-key
GEMINI_CHAT_MODEL=gemini-1.5-flash

# Embeddings
EMBEDDING_PROVIDER=gemini
EMBEDDING_API_KEY=your-gemini-api-key
EMBEDDING_MODEL=text-embedding-004
EMBEDDING_DIMENSIONS=1536
```

### Frontend (`apps/web/.env.local`)

```ini
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

---

## ☁️ Production Deployment

### Supabase Setup
1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/migrations/20261116000000_init_cortexa_schema.sql` in the SQL Editor
3. Create a **private** storage bucket named `student-documents`
4. Copy your `Project URL`, `anon key`, and `service_role key`

### Backend → [Render.com](https://render.com)
- **Root Directory**: `apps/api`
- **Environment**: Docker (auto-detects `Dockerfile`)
- **Health Check**: `/api/v1/health`
- Add all environment variables from above

### Frontend → [Vercel.com](https://vercel.com)
- **Framework**: Next.js
- **Root Directory**: `apps/web`
- Set `NEXT_PUBLIC_API_BASE_URL` to your Render backend URL

---

## 🧪 Running Tests

```bash
cd apps/api
pytest tests/ -v
```

---

## 📁 Project Structure

```
.
├── apps/
│   ├── api/          # FastAPI backend
│   └── web/          # Next.js frontend
├── supabase/         # Database migrations
├── docs/             # Documentation
├── tests/            # Test suite
├── RUN-LIVE-IT.bat   # Windows one-click launcher
├── STOP.bat          # Windows server stopper
└── README.md
```

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

1. Fork the project
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 👨‍💻 Author

**Aarush Janga**  
[![GitHub](https://img.shields.io/badge/GitHub-AarushJanga-181717?style=flat-square&logo=github)](https://github.com/AarushJanga)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for students who want to learn smarter.**

⭐ Star this repo if you find it helpful!

</div>
