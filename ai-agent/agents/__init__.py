"""Trip-planning LlmAgents that write outputs to session state via output_key."""

from google.adk.agents.llm_agent import LlmAgent

from models.deepseek_config import DEEPSEEK

from .activity_planner import ActivityPlanner

activity_planner = ActivityPlanner

planning_agent = LlmAgent(
    name="planning_agent",
    model=DEEPSEEK,
    description="Turns the Node form-derived parsed_request into an internal trip brief.",
    instruction="""
You are a travel planning lead.

**Structured trip form (from the booking UI — session state key parsed_request):**
{parsed_request}

Produce a concise internal trip brief the downstream agents will use. Include:
- destination focus, number of days, budget reality-check
- party type (e.g. couple) and any romance / family constraints
- transport and stay tier implications (train vs flight; luxury vs budget)
- must-do activities/themes and extra notes woven into priorities

Output only the brief as clear bullet-style sections. Do not invent conflicting preferences.
""",
    output_key="planning_brief",
)

travel_route_planner = LlmAgent(
    name="travel_route_planner",
    model=DEEPSEEK,
    description="Plans transport segments; honors form transport preference.",
    instruction="""
From the trip brief and the guest's stated transport preference, outline how they
reach the destination and move locally: legs, modes (train, flight, drive, taxi, ferry),
rough duration/order. Prefer the transport style from the form when feasible.

**Original form (parsed_request):**
{parsed_request}

**Trip brief:**
{planning_brief}
""",
    output_key="travel_route_plan",
)

food_stay_planner = LlmAgent(
    name="food_stay_planner",
    model=DEEPSEEK,
    description="Suggests lodging and dining; honors stay tier and extras (e.g. date night).",
    instruction="""
From the trip brief and the form's stay tier, suggest stay areas (neighborhoods or
hotel class), dining, and any special experiences (e.g. romantic evening) implied by
extra notes. Match budget and pace.

**Original form (parsed_request):**
{parsed_request}

**Trip brief:**
{planning_brief}
""",
    output_key="food_stay_plan",
)

cost_optimizer = LlmAgent(
    name="cost_optimizer",
    model=DEEPSEEK,
    description="Estimates and trims cost across parallel plans.",
    instruction="""
You receive a planning brief and three specialist outputs (activities, routes,
food/stay). Produce a unified cost view: major buckets, rough estimates, 3–5 concrete
tradeoffs to save money without ruining the trip. Use only the supplied content.
Anchor totals to the budget figure in parsed_request when present.

**Original form (parsed_request):**
{parsed_request}

**Trip brief:**
{planning_brief}

**Activities:**
{activity_plan}

**Routes / transport:**
{travel_route_plan}

**Food & stay:**
{food_stay_plan}
""",
    output_key="cost_optimized_plan",
)

final_assembler = LlmAgent(
    name="final_assembler",
    model=DEEPSEEK,
    description="Assembles the final traveler-facing itinerary document.",
    instruction="""
Combine the following into one polished itinerary for the traveler: narrative flow,
day-by-day structure, embedded transport and food/stay notes, and a closing section with
the cost optimization summary. Resolve obvious contradictions briefly; prefer the cost
optimizer's tradeoffs when budgeting conflicts appear. Honor party type, transport,
stay tier, must-do activities, and extra notes from the original form.

**Original form (parsed_request):**
{parsed_request}

**Trip brief:**
{planning_brief}

**Activities:**
{activity_plan}

**Routes / transport:**
{travel_route_plan}

**Food & stay:**
{food_stay_plan}

**Cost optimization:**
{cost_optimized_plan}
""",
    output_key="final_trip_plan",
)

__all__ = [
    "planning_agent",
    "activity_planner",
    "ActivityPlanner",
    "travel_route_planner",
    "food_stay_planner",
    "cost_optimizer",
    "final_assembler",
]
