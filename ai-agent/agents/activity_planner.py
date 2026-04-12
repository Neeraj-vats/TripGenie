"""Day-wise activity planning agent with places and weather tools."""

from google.adk.agents.llm_agent import LlmAgent
from google.adk.tools.function_tool import FunctionTool

from models.deepseek_config import DEEPSEEK


def get_places(
    area: str,
    place_type: str,
    limit: int = 5,
) -> dict:
    """Look up notable places (attractions, venues, neighborhoods) for trip planning.

    Args:
        area: City, region, or neighborhood to search.
        place_type: What to find, e.g. museum, park, restaurant, viewpoint, shopping.
        limit: Max number of suggestions to return (default 5).

    Returns:
        A dict with suggested place names and short notes (stub data if no backend).
    """
    return {
        "area": area,
        "place_type": place_type,
        "places": [
            {"name": f"{place_type.title()} suggestion {i + 1} in {area}", "note": "Verify hours and bookings."}
            for i in range(min(max(limit, 1), 10))
        ],
    }


def get_weather(
    location: str,
    when: str,
) -> dict:
    """Fetch a short weather outlook for scheduling outdoor activities.

    Args:
        location: City or area name.
        when: Relative or absolute time hint, e.g. Day 2 morning or 2026-04-01.

    Returns:
        A dict with conditions summary (stub if no live weather API is configured).
    """
    return {
        "location": location,
        "when": when,
        "summary": "Conditions: mild, low chance of rain—confirm with a live forecast before locking outdoor-only plans.",
    }


get_places_tool = FunctionTool(get_places)
get_weather_tool = FunctionTool(get_weather)

ActivityPlanner = LlmAgent(
    name="ActivityPlanner",
    model=DEEPSEEK,
    description=(
        "Builds a JSON array of day-wise activities using places and weather tools, "
        "grounded in parsed_request from session state."
    ),
    instruction="""
You are an itinerary activities specialist.

**Parsed trip request (from session state):**
{parsed_request}

Use `get_places` for concrete venue/area ideas and `get_weather` when outdoor timing matters.
Honor trip type (e.g. couple), must-do activities/themes, transport style where it affects
day pacing, stay tier vibes, and extra notes (e.g. romantic date night) from `parsed_request`.

**Output format (strict):**
Return **only** valid JSON: a JSON **array**. One object per day, in order (Day 1, Day 2, …).
Each day object must have:
- "day": integer (1-based)
- "morning": string (activity description; may cite places)
- "afternoon": string
- "evening": string
- "places": array of strings (specific place names or areas visited that day)

No markdown fences, no commentary before or after the JSON.
""",
    tools=[get_places_tool, get_weather_tool],
    output_key="activity_plan",
)
