"""FastAPI entrypoint: plan trips via Mistral AI API (fast, single-call)."""

from __future__ import annotations

import logging
import re
import time
from typing import Annotated, Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pydantic import BaseModel, ConfigDict, Field, field_validator

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Mistral AI client --------------------------------------------------------
import os
from pathlib import Path

try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).resolve().parent / ".env")
except ImportError:
    pass

MISTRAL_API_KEY = os.environ.get(
    "MISTRAL_API_KEY",
    "2Tvf5Wy2AXDI6r1oGApIXN9hdZ69NHSS",
)

_client = OpenAI(
    base_url="https://api.mistral.ai/v1",
    api_key=MISTRAL_API_KEY,
)

MODEL = "mistral-small-latest"

# ------------------------------------------------------------------------------


class PlanRequest(BaseModel):
    """Body shape from the Node trip form (field names preserved)."""

    model_config = ConfigDict(populate_by_name=True, str_strip_whitespace=True)

    userid: str
    destination: str
    days: str | int
    budget: str
    trip_type: Annotated[str, Field(alias="type", description="e.g. Couple, Family, Solo")]
    transport: str
    stay: str
    activities: str
    extra: str = ""

    @field_validator("days", mode="before")
    @classmethod
    def normalize_days(cls, value: Any) -> str:
        if value is None or value == "":
            return "1"
        return str(value).strip()

    @property
    def days_as_int(self) -> int:
        raw = str(self.days).strip()
        if raw.isdigit():
            return max(1, int(raw))
        m = re.search(r"\d+", raw)
        return max(1, int(m.group(0))) if m else 1


SYSTEM_PROMPT = """\
You are TripGenie, an expert AI travel planner. Given user trip details, produce a \
complete travel itinerary. Be concise but practical.

Include these sections:
1. **Trip Overview** — 2-3 sentence summary
2. **Day-by-Day Itinerary** — For each day: Morning, Afternoon, Evening activities with specific place names
3. **Transport** — How to get there and move around
4. **Stay & Food** — Where to stay and eat (with price ranges)
5. **Budget Breakdown** — Itemized costs in INR (₹)
6. **Tips** — 3 money-saving tips

Use real place names and realistic INR prices. Keep total near the stated budget.\
"""


def _build_user_prompt(body: PlanRequest) -> str:
    extra = body.extra.strip() if body.extra else "(none)"
    return (
        f"Plan a trip with these details:\n"
        f"- Destination: {body.destination}\n"
        f"- Duration: {body.days_as_int} day(s)\n"
        f"- Budget: ₹{body.budget}\n"
        f"- Trip type: {body.trip_type}\n"
        f"- Transport preference: {body.transport}\n"
        f"- Accommodation type: {body.stay}\n"
        f"- Preferred activities: {body.activities or 'General sightseeing'}\n"
        f"- Extra notes: {extra}\n\n"
        f"Generate a complete travel itinerary now."
    )


app = FastAPI(title="Synopsis trip planner", version="0.3.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/plan")
async def plan(body: PlanRequest) -> dict[str, Any]:
    logger.info("=== NEW TRIP PLAN REQUEST ===")
    logger.info(
        "Destination: %s | Days: %s | Budget: %s | Type: %s",
        body.destination, body.days_as_int, body.budget, body.trip_type,
    )

    start_time = time.time()

    try:
        logger.info("Calling Mistral API (%s)...", MODEL)

        completion = _client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": _build_user_prompt(body)},
            ],
            temperature=0.8,
            top_p=0.95,
            max_tokens=4096,
        )

        result_text = completion.choices[0].message.content
        elapsed = time.time() - start_time
        logger.info("Mistral responded in %.1fs (%d chars)", elapsed, len(result_text))

        if not result_text or not result_text.strip():
            raise HTTPException(
                status_code=500,
                detail="AI model returned empty response. Please try again.",
            )

    except HTTPException:
        raise
    except Exception as e:
        elapsed = time.time() - start_time
        logger.error("Mistral API FAILED after %.1fs: %s", elapsed, e)
        raise HTTPException(status_code=500, detail=f"AI model error: {e}")

    logger.info("=== PLAN GENERATED SUCCESSFULLY in %.1fs ===", time.time() - start_time)
    return {
        "userid": body.userid,
        "final_trip_plan": result_text,
    }
