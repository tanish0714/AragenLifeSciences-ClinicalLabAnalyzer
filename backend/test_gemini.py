import asyncio

from app.ai.gemini import generate_explanation


async def main():
    result = await generate_explanation(
        test_name="Hemoglobin",
        value=5,
        unit="g/dL",
        reference_range="12 – 16 g/dL",
        severity="Critical",
        classification="Critically below reference range",
    )

    print("\n=== GEMINI RESPONSE ===")
    print("Explanation:")
    print(result.explanation)

    print("\nNext step:")
    print(result.next_step)


if __name__ == "__main__":
    asyncio.run(main())