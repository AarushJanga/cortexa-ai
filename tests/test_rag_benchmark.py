import os
import pytest
from starlette.testclient import TestClient
from app.main import app

client = TestClient(app)

TEST_USER_ID = "00000000-0000-0000-0000-000000000001"
AUTH_HEADERS = {
    "X-Test-User-Id": TEST_USER_ID,
    "X-Test-User-Email": "teststudent@cortexa.ai"
}
PDF_PATH = os.path.join(os.path.dirname(__file__), "fixtures", "Cortexa_AI_RAG_Test_Document.pdf")


class TestRAGAccuracyBenchmark:
    @pytest.fixture(scope="class", autouse=True)
    def setup_document(self):
        """Uploads the benchmark PDF before running RAG test queries."""
        assert os.path.exists(PDF_PATH), f"Fixture PDF missing at {PDF_PATH}"
        with open(PDF_PATH, "rb") as f:
            pdf_bytes = f.read()

        resp = client.post(
            "/api/v1/documents/upload",
            files={"file": ("Cortexa_AI_RAG_Test_Document.pdf", pdf_bytes, "application/pdf")},
            headers=AUTH_HEADERS
        )
        assert resp.status_code == 200, f"Upload failed: {resp.text}"
        doc_data = resp.json()
        assert doc_data["status"] == "ready"
        assert doc_data["page_count"] == 5
        self.__class__.document_id = doc_data["id"]

    def test_question_1_group_b_post_test_score(self):
        """Test 1: What was Group B's average post-test score? -> 82 / 100 (Page 3 ONLY)"""
        resp = client.post(
            "/api/v1/chat",
            json={
                "message": "What was Group B's average post-test score?",
                "document_id": self.document_id
            },
            headers=AUTH_HEADERS
        )
        assert resp.status_code == 200
        data = resp.json()
        ans = data["assistant_message"]
        citations = data["citations"]

        assert "82 / 100" in ans or "82" in ans, f"Expected 82 / 100 in answer, got: {ans}"
        assert len(citations) == 1, f"Expected exactly Page 3 citation only, got {len(citations)}: {citations}"
        assert citations[0]["page_number"] == 3, f"Expected Page 3 only, got: {citations}"
        assert citations[0]["file_name"] == "Cortexa_AI_RAG_Test_Document.pdf"

    def test_question_2_group_a_post_test_score(self):
        """Test 2: What was Group A's average post-test score? -> 72 / 100 (Page 3 ONLY)"""
        resp = client.post(
            "/api/v1/chat",
            json={
                "message": "What was Group A's average post-test score?",
                "document_id": self.document_id
            },
            headers=AUTH_HEADERS
        )
        assert resp.status_code == 200
        data = resp.json()
        ans = data["assistant_message"]
        citations = data["citations"]

        assert "72 / 100" in ans or "72" in ans, f"Expected 72 / 100 in answer, got: {ans}"
        assert len(citations) == 1, f"Expected exactly Page 3 citation only, got {len(citations)}: {citations}"
        assert citations[0]["page_number"] == 3, f"Expected citation on Page 3, got: {citations}"

    def test_question_3_learners_in_each_group(self):
        """Test 3: How many learners were in each group? -> 20 learners in each group (Page 3 ONLY)"""
        resp = client.post(
            "/api/v1/chat",
            json={
                "message": "How many learners were in each group?",
                "document_id": self.document_id
            },
            headers=AUTH_HEADERS
        )
        assert resp.status_code == 200
        data = resp.json()
        ans = data["assistant_message"]
        citations = data["citations"]

        assert "20" in ans, f"Expected 20 learners in answer, got: {ans}"
        assert len(citations) == 1, f"Expected Page 3 only, got {len(citations)}: {citations}"
        assert citations[0]["page_number"] == 3, f"Expected citation on Page 3, got: {citations}"

    def test_question_4_score_improvement_difference(self):
        """Test 4: What was the difference between the groups' average score improvements? -> 11 points (Page 3 ONLY)"""
        resp = client.post(
            "/api/v1/chat",
            json={
                "message": "What was the difference between the groups' average score improvements?",
                "document_id": self.document_id
            },
            headers=AUTH_HEADERS
        )
        assert resp.status_code == 200
        data = resp.json()
        ans = data["assistant_message"]
        citations = data["citations"]

        assert "11 points" in ans or "11" in ans, f"Expected 11 points in answer, got: {ans}"
        assert len(citations) == 1, f"Expected Page 3 only, got {len(citations)}: {citations}"
        assert citations[0]["page_number"] == 3, f"Expected citation on Page 3, got: {citations}"

    def test_question_5_greenfield_ceo(self):
        """Test 5: Who was Greenfield Learning Lab's CEO? -> This information is not available in the uploaded document. (Zero citations)"""
        resp = client.post(
            "/api/v1/chat",
            json={
                "message": "Who was Greenfield Learning Lab's CEO?",
                "document_id": self.document_id
            },
            headers=AUTH_HEADERS
        )
        assert resp.status_code == 200
        data = resp.json()
        ans = data["assistant_message"]
        citations = data["citations"]

        assert "This information is not available in the uploaded document" in ans, f"Expected unavailable notice, got: {ans}"
        assert len(citations) == 0, f"Expected zero citations for missing information, got: {citations}"

    def test_question_6_spaced_practice_review_intervals(self):
        """Test 6: What were the suggested spaced-practice review intervals? -> One day, three days, seven days, and fourteen days (Page 2 ONLY)"""
        resp = client.post(
            "/api/v1/chat",
            json={
                "message": "What were the suggested spaced-practice review intervals?",
                "document_id": self.document_id
            },
            headers=AUTH_HEADERS
        )
        assert resp.status_code == 200
        data = resp.json()
        ans = data["assistant_message"]
        citations = data["citations"]

        assert "fourteen days" in ans.lower() or "one day, three days" in ans.lower(), f"Expected review intervals, got: {ans}"
        assert len(citations) == 1, f"Expected Page 2 citation only, got {len(citations)}: {citations}"
        assert citations[0]["page_number"] == 2, f"Expected citation on Page 2, got: {citations}"

    def test_question_7_fictional_learning_center_name(self):
        """Test 7: What was the name of the fictional learning center? -> Greenfield Learning Lab (Page 3)"""
        resp = client.post(
            "/api/v1/chat",
            json={
                "message": "What was the name of the fictional learning center?",
                "document_id": self.document_id
            },
            headers=AUTH_HEADERS
        )
        assert resp.status_code == 200
        data = resp.json()
        ans = data["assistant_message"]
        citations = data["citations"]

        assert "Greenfield Learning Lab" in ans, f"Expected Greenfield Learning Lab in answer, got: {ans}"
        assert len(citations) >= 1, "Expected at least one citation"
        assert any(c["page_number"] == 3 for c in citations), f"Expected citation on Page 3, got: {citations}"
