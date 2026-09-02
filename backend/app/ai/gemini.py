from functools import lru_cache

from langchain_google_genai import ChatGoogleGenerativeAI

from app.ai.prompts import SYSTEM_PROMPT, build_explanation_prompt
from app.ai.schemas import AIExplanation
from app.config import settings


@lru_cache(maxsize=1)
def get_gemini_model() -> ChatGoogleGenerativeAI:
    """
    Create and cache the Gemini model used by the explanation layer.
    """

    if not settings.gemini_api_key:
        raise RuntimeError(
            "GEMINI_API_KEY is not configured. "
            "Add it to backend/.env before using the AI layer."
        )

    model = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=settings.gemini_api_key,
        temperature=0.2,
        max_retries=2,
    )

    return model.with_structured_output(AIExplanation)


async def generate_explanation(
    test_name: str,
    value: float,
    unit: str,
    reference_range: str,
    severity: str,
    classification: str,
    context: dict | None = None,
) -> AIExplanation:
    model = get_gemini_model()

    user_prompt = build_explanation_prompt(
        test_name=test_name,
        value=value,
        unit=unit,
        reference_range=reference_range,
        severity=severity,
        classification=classification,
    )

    if context:
        user_prompt += f"""

Additional MCP-provided laboratory context:
{context}

Use this context as supporting information. Do not change the
application-assigned severity or classification.
"""

    response = await model.ainvoke(
        [
            ("system", SYSTEM_PROMPT),
            ("human", user_prompt),
        ]
    )

    return response