"""Analyzer Agent - Synthesizes search results into recommendations using pydantic_ai."""

import os
from typing import List, Optional
from pydantic import BaseModel, Field
from pydantic_ai import Agent

from models.schemas import SearchResult, FragranceRecommendation
from config import get_model_config


class RecommendationOutput(BaseModel):
    """A single perfume recommendation."""
    Name: str = Field(..., description="The exact perfume name (e.g., 'Bleu de Chanel')")
    Brand: str = Field(..., description="The brand/house name (e.g., 'Chanel')")
    Notes: str = Field(..., description="Key fragrance notes, comma-separated")
    reasoning: str = Field(..., description="Why this matches the user's preferences")


class AnalysisOutput(BaseModel):
    """Structured output for the analyzer agent."""
    recommendations: List[RecommendationOutput] = Field(
        default_factory=list,
        description="List of 3-5 perfume recommendations",
        max_length=5
    )


ANALYZER_INSTRUCTIONS = """You are a perfume expert analyzing web research results to recommend fragrances.

Based on the search results provided, identify and recommend 3-5 specific perfumes that match the user's preferences.

IMPORTANT: You MUST always provide at least 1 recommendation. If the search results don't contain specific perfumes, recommend well-known classics that match the requested fragrance notes.

For each recommendation, provide:
- Name: The exact perfume name (e.g., "Bleu de Chanel")
- Brand: The brand/house name (e.g., "Chanel")
- Notes: Key fragrance notes, comma-separated (e.g., "bergamot, cedar, sandalwood")
- reasoning: Brief explanation of why this matches the user's preferences

Be specific with perfume names. Never return an empty recommendations list."""


class AnalyzerAgent:
    """Agent that synthesizes search results into fragrance recommendations."""

    def __init__(self):
        model_string, env_key, api_key = get_model_config()
        os.environ[env_key] = api_key

        self.agent = Agent(
            model_string,
            instructions=ANALYZER_INSTRUCTIONS,
            output_type=AnalysisOutput,
        )

    async def synthesize(
        self,
        notes: List[str],
        preferences: str,
        search_results: List[SearchResult]
    ) -> List[FragranceRecommendation]:
        """Analyze search results and generate recommendations."""

        context_parts = []
        for result in search_results:
            context_parts.append(f"Search: {result.query}")
            context_parts.append(f"Summary: {result.summary}")
            context_parts.append("")

        context = "\n".join(context_parts)

        prompt = f"""User wants perfumes with these fragrance notes: {', '.join(notes)}
Additional preferences: {preferences or 'None specified'}

Research findings:
{context}

Based on this research, recommend 3-5 specific perfumes that match."""

        try:
            result = await self.agent.run(prompt)
            analysis = result.output

            # convert recs to objects
            recommendations = [
                FragranceRecommendation(
                    Name=rec.Name,
                    Brand=rec.Brand,
                    Notes=rec.Notes,
                    reasoning=rec.reasoning
                )
                for rec in analysis.recommendations
            ]

            # If empty, provide a fallback
            if not recommendations:
                return self._get_fallback_recommendations(notes)

            return recommendations[:5]

        except Exception as e:
            print(f"Analysis error: {e}")
            return self._get_fallback_recommendations(notes, str(e))

    def _get_fallback_recommendations(
        self, notes: List[str], error: str = None
    ) -> List[FragranceRecommendation]:
        """Provide fallback recommendations when analysis fails."""
        notes_str = ", ".join(notes)
        reason = f"Based on your interest in {notes_str} notes"
        if error:
            reason = f"Could not complete full research ({error[:50]}...). Suggesting classics with {notes_str}"

        # Common perfumes by note category
        fallbacks = {
            "vanilla": ("Black Opium", "Yves Saint Laurent", "vanilla, coffee, white flowers"),
            "rose": ("Portrait of a Lady", "Frederic Malle", "rose, oud, incense"),
            "oud": ("Oud Wood", "Tom Ford", "oud, sandalwood, vetiver"),
            "citrus": ("Acqua di Gio", "Giorgio Armani", "bergamot, neroli, green tangerine"),
            "woody": ("Santal 33", "Le Labo", "sandalwood, cedar, cardamom"),
            "musk": ("Glossier You", "Glossier", "musk, ambrette, iris"),
            "floral": ("Miss Dior", "Dior", "rose, peony, lily of the valley"),
        }

        # Find matching fallback
        for note in notes:
            note_lower = note.lower()
            for key, (name, brand, note_list) in fallbacks.items():
                if key in note_lower:
                    return [FragranceRecommendation(
                        Name=name, Brand=brand, Notes=note_list, reasoning=reason
                    )]

        # Default fallback
        return [FragranceRecommendation(
            Name="Bleu de Chanel",
            Brand="Chanel",
            Notes="bergamot, mint, cedar, sandalwood",
            reasoning=reason
        )]
