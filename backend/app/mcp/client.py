import json
from typing import Any

from mcp import Client

from app.mcp.server import mcp


async def list_mcp_tools() -> list[dict[str, Any]]:
    """
    Discover all tools exposed by the Clinical Lab MCP server.
    """

    async with Client(mcp) as client:
        result = await client.list_tools()

        return [
            {
                "name": tool.name,
                "description": tool.description,
                "input_schema": tool.input_schema,
            }
            for tool in result.tools
        ]


def _extract_tool_result(result: Any) -> dict[str, Any]:
    """
    Extract application data from an MCP CallToolResult.

    MCP may provide structured data through structured_content,
    or serialize the tool response through content/text.
    """

    # Preferred MCP structured output.
    if result.structured_content is not None:
        structured = result.structured_content

        if isinstance(structured, dict):
            return structured

    # Fallback: MCP content blocks.
    for item in result.content:
        text = getattr(item, "text", None)

        if not text:
            continue

        try:
            parsed = json.loads(text)

            if isinstance(parsed, dict):
                return parsed

        except json.JSONDecodeError:
            continue

    raise RuntimeError(
        "MCP tool returned no usable structured data."
    )


async def call_mcp_tool(
    tool_name: str,
    arguments: dict[str, Any],
) -> dict[str, Any]:
    """
    Call an MCP tool and return its application-level result.
    """

    async with Client(mcp) as client:
        result = await client.call_tool(
            tool_name,
            arguments,
        )

        if result.is_error:
            raise RuntimeError(
                f"MCP tool '{tool_name}' returned an error."
            )

        return _extract_tool_result(result)


async def get_reference_range_from_mcp(
    test_name: str,
) -> dict[str, Any]:
    """
    Convenience wrapper for the reference-range MCP tool.
    """

    return await call_mcp_tool(
        "lookup_reference_range",
        {
            "test_name": test_name,
        },
    )


async def get_lab_context_from_mcp(
    test_name: str,
    value: float,
    unit: str,
    severity: str,
    classification: str,
    reference_range: str,
) -> dict[str, Any]:
    """
    Convenience wrapper for the laboratory-context MCP tool.
    """

    return await call_mcp_tool(
        "create_lab_context",
        {
            "test_name": test_name,
            "value": value,
            "unit": unit,
            "severity": severity,
            "classification": classification,
            "reference_range": reference_range,
        },
    )