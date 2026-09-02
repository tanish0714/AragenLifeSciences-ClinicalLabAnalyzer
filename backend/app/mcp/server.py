from mcp.server import MCPServer

from app.mcp.tools import (
    build_lab_context,
    reference_range_lookup,
)


mcp = MCPServer(
    "Clinical Lab Analyzer MCP Server"
)


@mcp.tool(
    name="lookup_reference_range",
    description=(
        "Look up the reference range and critical threshold "
        "for a laboratory test."
    ),
)
def lookup_reference_range(test_name: str) -> dict:
    """
    Look up laboratory reference information.
    """

    return reference_range_lookup(test_name)


@mcp.tool(
    name="create_lab_context",
    description=(
        "Create structured clinical context for explaining "
        "a laboratory result."
    ),
)
def create_lab_context(
    test_name: str,
    value: float,
    unit: str,
    severity: str,
    classification: str,
    reference_range: str,
) -> dict:
    """
    Build structured context for the AI explanation layer.
    """

    return build_lab_context(
        test_name=test_name,
        value=value,
        unit=unit,
        severity=severity,
        classification=classification,
        reference_range=reference_range,
    )