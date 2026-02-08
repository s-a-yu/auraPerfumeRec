"""Configuration for Deep Research service."""

import os
from dotenv import load_dotenv

load_dotenv()

LLM_PROVIDER = os.getenv("LLM_PROVIDER", "groq")

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "5001"))


def get_model_config():
    """Get the model string and API key based on configured provider."""
    if LLM_PROVIDER == "groq":
        if not GROQ_API_KEY:
            raise ValueError("GROQ_API_KEY required. Get free key at https://console.groq.com")
        return f"groq:{GROQ_MODEL}", "GROQ_API_KEY", GROQ_API_KEY
    elif LLM_PROVIDER == "gemini":
        if not GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY required for Gemini provider.")
        return f"google-gla:{GEMINI_MODEL}", "GEMINI_API_KEY", GEMINI_API_KEY
    else:
        raise ValueError(f"Unknown LLM_PROVIDER: {LLM_PROVIDER}. Use 'groq' or 'gemini'")


def validate_config():
    """Validate that required API keys are set."""
    get_model_config()  # this will raise if config is invalid
