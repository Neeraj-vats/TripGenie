"""Root trip-planning agent: sequential planning, parallel specialists, cost, assembly."""

from google.adk.agents.parallel_agent import ParallelAgent
from google.adk.agents.sequential_agent import SequentialAgent

from agents import (
    activity_planner,
    cost_optimizer,
    final_assembler,
    food_stay_planner,
    planning_agent,
    travel_route_planner,
)

_parallel_specialists = ParallelAgent(
    name="parallel_specialists",
    sub_agents=[
        activity_planner,
        travel_route_planner,
        food_stay_planner,
    ],
    description=(
        "Runs activity, route, and food/stay planners concurrently; "
        "each writes its own output_key in session state."
    ),
)

root_agent = SequentialAgent(
    name="root_agent",
    sub_agents=[
        planning_agent,
        _parallel_specialists,
        cost_optimizer,
        final_assembler,
    ],
    description=(
        "Planning brief → parallel specialists (activities, routes, food/stay) → "
        "cost optimization → final itinerary assembly."
    ),
)
