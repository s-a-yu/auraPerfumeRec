"""Searcher Agent - Executes web searches and summarizes results using pydantic_ai."""

import asyncio
import os
from typing import List
from pydantic_ai import Agent

from models.schemas import SearchTask, SearchResult
from config import get_model_config

# using DuckDuckGo search, no API key required
try:
    from duckduckgo_search import DDGS
    HAS_DDGS = True
except ImportError:
    HAS_DDGS = False


SUMMARIZER_INSTRUCTIONS = """You are a perfume expert analyzing search results.
Summarize the key information about perfumes found in these search results.
Focus on:
- Specific perfume names and brands mentioned
- Fragrance notes described
- User reviews and ratings
- Price range if mentioned

Be concise but include specific product names."""


class SearcherAgent:
    """Agent that executes web searches and summarizes results."""

    def __init__(self):
        model_string, env_key, api_key = get_model_config()
        os.environ[env_key] = api_key

        self.summarizer = Agent(model_string, instructions=SUMMARIZER_INSTRUCTIONS, output_type=str)

    async def execute_searches(self, tasks: List[SearchTask]) -> List[SearchResult]:
        """Execute all searches in parallel."""
        search_coros = [self._search_and_summarize(task) for task in tasks]
        results = await asyncio.gather(*search_coros, return_exceptions=True)

        # filter out failed
        valid_results = []
        for result in results:
            if isinstance(result, SearchResult):
                valid_results.append(result)
            elif isinstance(result, Exception):
                print(f"Search error: {result}")

        return valid_results

    async def _search_and_summarize(self, task: SearchTask) -> SearchResult:
        """Execute a single search and summarize results."""
        # web search
        raw_results = await self._web_search(task.query)

        results_text = self._format_results_for_summary(raw_results)
        prompt = f"""Search query: {task.query}
Focus area: {task.focus}

Search results:
{results_text}

Summarize the perfume-related information found."""

        result = await self.summarizer.run(prompt)

        return SearchResult(
            query=task.query,
            results=raw_results,
            summary=result.output
        )

    async def _web_search(self, query: str, max_results: int = 8) -> List[dict]:
        """Perform web search using DuckDuckGo."""
        if not HAS_DDGS:
            return [{
                "title": f"Search result for: {query}",
                "body": "DuckDuckGo search not available. Install with: pip install duckduckgo-search",
                "href": "https://example.com"
            }]

        # run synchronous DuckDuckGo search in executor
        loop = asyncio.get_running_loop()
        results = await loop.run_in_executor(
            None,
            lambda: self._sync_search(query, max_results)
        )
        return results

    def _sync_search(self, query: str, max_results: int) -> List[dict]:
        """Synchronous DuckDuckGo search."""
        try:
            with DDGS() as ddgs:
                results = list(ddgs.text(query, max_results=max_results))
                return [
                    {
                        "title": r.get("title", ""),
                        "body": r.get("body", ""),
                        "href": r.get("href", "")
                    }
                    for r in results
                ]
        except Exception as e:
            print(f"DuckDuckGo search error: {e}")
            return []

    def _format_results_for_summary(self, results: List[dict]) -> str:
        """Format search results for the summarizer."""
        if not results:
            return "No search results found."

        formatted = []
        for i, r in enumerate(results, 1):
            formatted.append(f"{i}. {r.get('title', 'No title')}")
            formatted.append(f"   {r.get('body', 'No description')}")
            formatted.append(f"   URL: {r.get('href', 'No URL')}")
            formatted.append("")

        return "\n".join(formatted)
