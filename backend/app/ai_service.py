from typing import Any

from loguru import logger

from .settings import settings


class AIService:
    def __init__(self) -> None:
        self.provider = settings.ai_provider
        self.api_key = settings.ai_api_key

    async def ask_question(self, user_context: dict[str, Any], question: str) -> dict[str, Any]:
        if not self.provider or not self.api_key:
            logger.warning("AI provider not configured; returning fallback response")
            return {
                "summary_text": "AI is not configured yet. Please set AI_PROVIDER and AI_API_KEY.",
                "suggested_charts": [],
                "insights": [],
            }

        # Placeholder for real LLM integration.
        # For now, echo back the question and show which aggregates were available.
        return {
            "summary_text": (
                "This is a placeholder AI response. "
                f"You asked: '{question}'. "
                "The backend has access to summary stats and weekly mileage."
            ),
            "suggested_charts": ["weekly_mileage"],
            "insights": [
                "Once AI is wired, this will contain personalized insights about your training."
            ],
        }


ai_service = AIService()

