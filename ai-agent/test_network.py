"""Diagnose: is the Mistral API endpoint reachable at all?"""
import socket
import time

targets = [
    ("api.mistral.ai", 443),
    ("google.com", 443),
]

for host, port in targets:
    start = time.time()
    try:
        sock = socket.create_connection((host, port), timeout=5)
        sock.close()
        elapsed = time.time() - start
        print(f"OK {host}:{port} -- reachable in {elapsed:.2f}s")
    except Exception as e:
        elapsed = time.time() - start
        print(f"FAIL {host}:{port} -- FAILED after {elapsed:.1f}s: {e}")

# Now try an actual HTTPS GET to Mistral
print("\n--- Testing HTTPS to Mistral API ---")
import urllib.request
try:
    req = urllib.request.Request(
        "https://api.mistral.ai/v1/models",
        headers={"Authorization": "Bearer 2Tvf5Wy2AXDI6r1oGApIXN9hdZ69NHSS"}
    )
    start = time.time()
    r = urllib.request.urlopen(req, timeout=15)
    elapsed = time.time() - start
    data = r.read().decode()
    print(f"OK -- Mistral API responded in {elapsed:.1f}s")
    print(f"Status: {r.status}")
    print(f"Response length: {len(data)} chars")
    print("API KEY IS VALID!")
except Exception as e:
    elapsed = time.time() - start
    print(f"FAIL -- HTTPS request failed after {elapsed:.1f}s: {e}")

# Now try a simple chat completion using raw urllib
print("\n--- Testing Chat Completion (raw HTTP) ---")
import json
try:
    body = json.dumps({
        "model": "mistral-small-latest",
        "messages": [{"role": "user", "content": "Say hello"}],
        "max_tokens": 20,
    }).encode()
    req = urllib.request.Request(
        "https://api.mistral.ai/v1/chat/completions",
        data=body,
        headers={
            "Authorization": "Bearer 2Tvf5Wy2AXDI6r1oGApIXN9hdZ69NHSS",
            "Content-Type": "application/json",
        },
    )
    start = time.time()
    r = urllib.request.urlopen(req, timeout=30)
    elapsed = time.time() - start
    data = json.loads(r.read().decode())
    text = data["choices"][0]["message"]["content"]
    print(f"OK -- Chat responded in {elapsed:.1f}s")
    print(f"Model: {data.get('model')}")
    print(f"Reply: {text}")
except Exception as e:
    elapsed = time.time() - start
    print(f"FAIL -- Chat request failed after {elapsed:.1f}s: {e}")
