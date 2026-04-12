"""NVIDIA NIM DeepSeek model configuration for ADK (via LiteLLM)."""

import os
from pathlib import Path

try:
    from dotenv import load_dotenv
except ImportError:
    load_dotenv = None

# Load ai-agent/.env so NVIDIA_API_KEY can live in one file (never commit .env).
if load_dotenv is not None:
    _env = Path(__file__).resolve().parents[1] / ".env"
    load_dotenv(_env)

from google.adk.models.lite_llm import LiteLlm

# API Key (loaded from .env, falls back to hardcoded value)
NVIDIA_API_KEY = os.environ.get(
    "NVIDIA_API_KEY",
    "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",
)

DEEPSEEK = LiteLlm(
    model="openai/deepseek-ai/deepseek-v3.2",
    api_key=NVIDIA_API_KEY,
    api_base="https://integrate.api.nvidia.com/v1",
    temperature=1,
    top_p=0.95,
    max_tokens=8192,
    
)
