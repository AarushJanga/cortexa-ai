import hashlib
import math
import logging
from typing import List
import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)


class EmbeddingAdapter:
    def __init__(self):
        self.dimensions = settings.EMBEDDING_DIMENSIONS
        self.provider = settings.EMBEDDING_PROVIDER.lower()
        self.api_key = settings.EMBEDDING_API_KEY or settings.GEMINI_API_KEY

    def _generate_deterministic_vector(self, text: str) -> List[float]:
        """
        Creates a deterministic 1536-dimensional normalized vector from text hash
        for testing and offline local execution without requiring live API keys.
        """
        raw_hash = hashlib.sha256(text.encode("utf-8")).digest()
        # Expand hash into required dimensions
        vector = []
        for i in range(self.dimensions):
            byte_val = raw_hash[i % len(raw_hash)]
            val = math.sin((byte_val + i) * 0.1)
            vector.append(val)

        # Normalize to unit length
        norm = math.sqrt(sum(x * x for x in vector))
        if norm > 0:
            vector = [x / norm for x in vector]
        return vector

    async def get_embedding(self, text: str) -> List[float]:
        # If no API key configured, use deterministic embedding
        if not self.api_key:
            return self._generate_deterministic_vector(text)

        # Gemini Embedding API
        if self.provider == "gemini":
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.EMBEDDING_MODEL}:embedContent?key={self.api_key}"
                payload = {
                    "model": f"models/{settings.EMBEDDING_MODEL}",
                    "content": {"parts": [{"text": text[:2000]}]}
                }
                async with httpx.AsyncClient(timeout=10.0) as client:
                    resp = await client.post(url, json=payload)
                    if resp.status_code == 200:
                        values = resp.json().get("embedding", {}).get("values", [])
                        # Pad or truncate to desired dimension
                        if len(values) < self.dimensions:
                            values.extend([0.0] * (self.dimensions - len(values)))
                        return values[:self.dimensions]
                    else:
                        logger.warning(f"Gemini embedding failed with {resp.status_code}, falling back to local adapter")
            except Exception as e:
                logger.warning(f"Error calling Gemini embedding: {e}")

        # Default fallback
        return self._generate_deterministic_vector(text)

    async def embed_chunks(self, chunks: List[str]) -> List[List[float]]:
        results = []
        for c in chunks:
            vec = await self.get_embedding(c)
            results.append(vec)
        return results


embedding_service = EmbeddingAdapter()
