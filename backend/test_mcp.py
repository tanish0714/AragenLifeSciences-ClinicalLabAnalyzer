import asyncio

from app.mcp.client import call_mcp_tool


async def main():
    print("=== MCP DATASET LOOKUP ===")

    result = await call_mcp_tool(
        "lookup_reference_range",
        {
            "test_name": "Ferritin",
        },
    )

    print(result)

    print("\n=== VALIDATION ===")
    print("Test:", result["test_name"])
    print("Source:", result["source"])
    print("Reference:", result["reference_range"])
    print("Minimum:", result["minimum"])
    print("Maximum:", result["maximum"])
    print("Unit:", result["unit"])


if __name__ == "__main__":
    asyncio.run(main())