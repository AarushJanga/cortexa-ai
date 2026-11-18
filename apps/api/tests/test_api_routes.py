import pytest
from fastapi.testclient import TestClient
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from app.main import app

client = TestClient(app)
TEST_TOKEN = "test-token-00000000-0000-0000-0000-000000000001"
AUTH_HEADERS = {"Authorization": f"Bearer {TEST_TOKEN}"}


# ── Health ────────────────────────────────────────────────────
class TestHealth:
    def test_health_ok(self):
        resp = client.get("/api/v1/health")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "healthy"
        assert "service" in data
        assert "env" in data

    def test_ready_ok(self):
        resp = client.get("/api/v1/ready")
        assert resp.status_code == 200
        assert resp.json()["status"] == "ready"


# ── Profile ───────────────────────────────────────────────────
class TestProfile:
    def test_get_profile_authenticated(self):
        resp = client.get("/api/v1/profile", headers=AUTH_HEADERS)
        assert resp.status_code == 200
        data = resp.json()
        assert "id" in data
        assert "persona" in data

    def test_get_profile_unauthenticated_dev_mode(self):
        # In dev mode, missing token still creates a default profile
        resp = client.get("/api/v1/profile")
        assert resp.status_code in [200, 401]

    def test_update_profile(self):
        resp = client.patch(
            "/api/v1/profile",
            json={"display_name": "Aarush Scholar", "persona": "college_student"},
            headers=AUTH_HEADERS
        )
        assert resp.status_code == 200
        assert resp.json()["display_name"] == "Aarush Scholar"


# ── Documents ─────────────────────────────────────────────────
class TestDocuments:
    def test_list_documents_empty(self):
        resp = client.get("/api/v1/documents", headers=AUTH_HEADERS)
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

    def test_upload_txt_document(self):
        txt_content = b"Machine learning is a branch of AI that enables systems to learn from data."
        resp = client.post(
            "/api/v1/documents/upload",
            files={"file": ("ml_notes.txt", txt_content, "text/plain")},
            headers=AUTH_HEADERS
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "ready"
        assert data["file_name"] == "ml_notes.txt"

    def test_upload_unsupported_format(self):
        resp = client.post(
            "/api/v1/documents/upload",
            files={"file": ("image.png", b"fake-image-bytes", "image/png")},
            headers=AUTH_HEADERS
        )
        assert resp.status_code == 400

    def test_get_nonexistent_document(self):
        resp = client.get("/api/v1/documents/nonexistent-id", headers=AUTH_HEADERS)
        assert resp.status_code == 404


# ── Chat ──────────────────────────────────────────────────────
class TestChat:
    def test_chat_basic_query(self):
        resp = client.post(
            "/api/v1/chat",
            json={"message": "What is machine learning?"},
            headers=AUTH_HEADERS
        )
        assert resp.status_code == 200
        data = resp.json()
        assert "assistant_message" in data
        assert "conversation_id" in data
        assert "citations" in data
        assert "provider" in data

    def test_chat_with_conversation_continuation(self):
        # First message creates a conversation
        resp1 = client.post(
            "/api/v1/chat",
            json={"message": "Tell me about neural networks"},
            headers=AUTH_HEADERS
        )
        assert resp1.status_code == 200
        conv_id = resp1.json()["conversation_id"]

        # Second message continues it
        resp2 = client.post(
            "/api/v1/chat",
            json={"message": "How do they compare to traditional algorithms?", "conversation_id": conv_id},
            headers=AUTH_HEADERS
        )
        assert resp2.status_code == 200
        assert resp2.json()["conversation_id"] == conv_id


# ── Quizzes ───────────────────────────────────────────────────
class TestQuizzes:
    def test_generate_quiz(self):
        resp = client.post(
            "/api/v1/quizzes/generate",
            json={"topic": "Data Structures", "difficulty": "easy", "question_count": 2},
            headers=AUTH_HEADERS
        )
        assert resp.status_code == 200
        data = resp.json()
        assert "id" in data
        assert "questions" in data
        assert len(data["questions"]) >= 1

    def test_list_quizzes(self):
        resp = client.get("/api/v1/quizzes", headers=AUTH_HEADERS)
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)


# ── Flashcards ────────────────────────────────────────────────
class TestFlashcards:
    def test_generate_flashcard_deck(self):
        resp = client.post(
            "/api/v1/flashcards/generate",
            json={"topic": "Python Basics", "count": 3},
            headers=AUTH_HEADERS
        )
        assert resp.status_code == 200
        data = resp.json()
        assert "deck" in data
        assert "cards" in data

    def test_list_decks(self):
        resp = client.get("/api/v1/flashcards/decks", headers=AUTH_HEADERS)
        assert resp.status_code == 200


# ── Tasks ─────────────────────────────────────────────────────
class TestTasks:
    def test_create_and_list_tasks(self):
        create_resp = client.post(
            "/api/v1/tasks",
            json={"title": "Study Chapter 5", "priority": "high", "category": "study"},
            headers=AUTH_HEADERS
        )
        assert create_resp.status_code == 200
        task_id = create_resp.json()["id"]

        list_resp = client.get("/api/v1/tasks", headers=AUTH_HEADERS)
        assert list_resp.status_code == 200
        ids = [t["id"] for t in list_resp.json()]
        assert task_id in ids

    def test_complete_task(self):
        create_resp = client.post(
            "/api/v1/tasks",
            json={"title": "Complete assignment", "priority": "medium", "category": "assignment"},
            headers=AUTH_HEADERS
        )
        task_id = create_resp.json()["id"]

        patch_resp = client.patch(
            f"/api/v1/tasks/{task_id}",
            json={"is_completed": True},
            headers=AUTH_HEADERS
        )
        assert patch_resp.status_code == 200
        assert patch_resp.json()["is_completed"] is True

    def test_delete_task(self):
        create_resp = client.post(
            "/api/v1/tasks",
            json={"title": "To be deleted", "priority": "low", "category": "other"},
            headers=AUTH_HEADERS
        )
        task_id = create_resp.json()["id"]
        del_resp = client.delete(f"/api/v1/tasks/{task_id}", headers=AUTH_HEADERS)
        assert del_resp.status_code == 200


# ── Placement ─────────────────────────────────────────────────
class TestPlacement:
    def test_create_and_list_applications(self):
        create_resp = client.post(
            "/api/v1/career/applications",
            json={"company": "Google", "role": "SDE-I", "status": "applied"},
            headers=AUTH_HEADERS
        )
        assert create_resp.status_code == 200
        app_id = create_resp.json()["id"]

        list_resp = client.get("/api/v1/career/applications", headers=AUTH_HEADERS)
        assert list_resp.status_code == 200
        ids = [a["id"] for a in list_resp.json()]
        assert app_id in ids
