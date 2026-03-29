"""Quick test: verify Mistral API key works and measure response time."""

import time
import httpx
from openai import OpenAI

API_KEY = "2Tvf5Wy2AXDI6r1oGApIXN9hdZ69NHSS"

# Use a 30-second timeout so it doesn't hang forever
http_client = httpx.Client(timeout=30.0)

client = OpenAI(
    base_url="https://api.mistral.ai/v1",
    api_key=API_KEY,
    http_client=http_client,
)

print("Testing Mistral API (mistral-small-latest)...")
print("Timeout set to 30 seconds")
print("-" * 50)

start = time.time()

try:
    resp = client.chat.completions.create(
        model="mistral-small-latest",
        messages=[
            {"role": "user", "content": "Say hello in 10 words or less."},
        ],
        max_tokens=50,
    )

    elapsed = time.time() - start
    text = resp.choices[0].message.content

    print(f"✅ SUCCESS in {elapsed:.1f}s")
    print(f"Model: {resp.model}")
    print(f"Response: {text}")

except httpx.TimeoutException:
    elapsed = time.time() - start
    print(f"❌ TIMEOUT after {elapsed:.1f}s - network issue or API unreachable")

except Exception as e:
    elapsed = time.time() - start
    print(f"❌ FAILED after {elapsed:.1f}s")
    print(f"Error type: {type(e).__name__}")
    print(f"Error: {e}")
