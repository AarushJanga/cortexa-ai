import pytest
import asyncio
from unittest.mock import patch, AsyncMock, MagicMock
from app.services.ai_provider import AIProviderManager, ProviderCircuitBreaker
from app.services.embeddings import EmbeddingAdapter


# ── Circuit Breaker Tests ──────────────────────────────────────
class TestCircuitBreaker:
    def test_initial_state_closed(self):
        cb = ProviderCircuitBreaker(failure_threshold=3, cooldown_seconds=60)
        assert cb.state == "CLOSED"
        assert cb.can_attempt()

    def test_trips_open_after_threshold(self):
        cb = ProviderCircuitBreaker(failure_threshold=2, cooldown_seconds=60)
        cb.record_failure()
        assert cb.state == "CLOSED"
        cb.record_failure()
        assert cb.state == "OPEN"
        assert not cb.can_attempt()

    def test_reset_on_success(self):
        cb = ProviderCircuitBreaker(failure_threshold=2, cooldown_seconds=60)
        cb.record_failure()
        cb.record_failure()
        assert cb.state == "OPEN"
        cb.record_success()
        assert cb.state == "CLOSED"
        assert cb.can_attempt()


# ── AI Provider Tests ──────────────────────────────────────────
class TestAIProviderManager:
    def test_mock_completion_quiz(self):
        manager = AIProviderManager()
        result = manager._generate_mock_completion([
            {"role": "user", "content": "Generate a quiz about data structures"}
        ])
        assert len(result) > 0
        assert "question" in result.lower() or "[" in result

    def test_mock_completion_flashcard(self):
        manager = AIProviderManager()
        result = manager._generate_mock_completion([
            {"role": "user", "content": "Create flashcards about algorithms"}
        ])
        assert "front" in result.lower()

    def test_mock_completion_resume(self):
        manager = AIProviderManager()
        result = manager._generate_mock_completion([
            {"role": "user", "content": "Give resume feedback and analysis"}
        ])
        assert "score" in result.lower() or "strengths" in result.lower()

    def test_mock_completion_generic(self):
        manager = AIProviderManager()
        result = manager._generate_mock_completion([
            {"role": "user", "content": "What is machine learning?"}
        ])
        assert len(result) > 20

    @pytest.mark.asyncio
    async def test_fallback_to_local_when_no_keys(self):
        manager = AIProviderManager()
        result = await manager.generate_completion([
            {"role": "user", "content": "Tell me about neural networks"}
        ])
        assert "content" in result
        assert "provider" in result
        assert "latency_ms" in result
        assert len(result["content"]) > 0


# ── Embedding Adapter Tests ────────────────────────────────────
class TestEmbeddingAdapter:
    def test_deterministic_vector_length(self):
        adapter = EmbeddingAdapter()
        vec = adapter._generate_deterministic_vector("test sentence about AI and machine learning")
        assert len(vec) == adapter.dimensions

    def test_deterministic_vector_normalized(self):
        import math
        adapter = EmbeddingAdapter()
        vec = adapter._generate_deterministic_vector("test sentence")
        magnitude = math.sqrt(sum(x * x for x in vec))
        assert abs(magnitude - 1.0) < 1e-6

    def test_deterministic_same_input_same_output(self):
        adapter = EmbeddingAdapter()
        text = "reproducible embedding test"
        v1 = adapter._generate_deterministic_vector(text)
        v2 = adapter._generate_deterministic_vector(text)
        assert v1 == v2

    def test_different_inputs_different_vectors(self):
        adapter = EmbeddingAdapter()
        v1 = adapter._generate_deterministic_vector("machine learning fundamentals")
        v2 = adapter._generate_deterministic_vector("cooking recipes for beginners")
        assert v1 != v2

    @pytest.mark.asyncio
    async def test_get_embedding_offline_no_key(self):
        adapter = EmbeddingAdapter()
        adapter.api_key = None  # Force offline mode
        vec = await adapter.get_embedding("test query without API key")
        assert len(vec) == adapter.dimensions

    @pytest.mark.asyncio
    async def test_embed_chunks_batch(self):
        adapter = EmbeddingAdapter()
        adapter.api_key = None
        chunks = ["chunk one text", "chunk two text", "chunk three text"]
        results = await adapter.embed_chunks(chunks)
        assert len(results) == 3
        for vec in results:
            assert len(vec) == adapter.dimensions
