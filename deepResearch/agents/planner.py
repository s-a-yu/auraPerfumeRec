"""Planner Agent - Creates search plan from fragrance notes using pydantic_ai."""

import os
from typing import List
from pydantic import BaseModel, Field
from pydantic_ai import Agent

from models.schemas import ResearchPlan, SearchTask
from config import get_model_config


class PlanOutput(BaseModel):
    """Structured output for the planner agent."""
    search_tasks: List[SearchTask] = Field(
        ...,
        description="List of search queries to execute",
        max_length=4
    )
    reasoning: str = Field(
        ...,
        description="Brief explanation of the search strategy"
    )


PLANNER_INSTRUCTIONS = """You are a perfume research planner. Given fragrance notes and optional preferences,
create a focused search plan to find the best perfume recommendations.

Generate exactly 3-4 specific search queries that will help find:
1. Perfumes featuring the specified notes prominently
2. Expert reviews and fragrance community recommendations
3. Similar fragrances from well-known brands

Each search should have a clear focus area. Be specific and include the fragrance notes in queries."""


class PlannerAgent:
    """Agent that creates a research plan from user's fragrance preferences."""

    def __init__(self):
        model_string, env_key, api_key = get_model_config()
        os.environ[env_key] = api_key

        # create agent with structured output
        self.agent = Agent(
            model_string,
            instructions=PLANNER_INSTRUCTIONS,
            output_type=PlanOutput,
        )

    async def create_plan(self, notes: List[str], preferences: str = "") -> ResearchPlan:
        """Create a research plan based on fragrance notes and preferences."""
        notes_str = ", ".join(notes)
        query = f"Find perfumes with these fragrance notes: {notes_str}"
        if preferences:
            query += f". Additional preferences: {preferences}"

        result = await self.agent.run(query)
        plan_output = result.output

        #check that there is at least one search tsk
        if not plan_output.search_tasks:
            plan_output.search_tasks = [
                SearchTask(
                    query=f"best perfumes with {notes_str} notes",
                    focus="fragrance notes match"
                ),
                SearchTask(
                    query=f"{notes_str} fragrance recommendations 2024",
                    focus="recent recommendations"
                ),
                SearchTask(
                    query=f"top rated {notes[0]} perfumes reviews",
                    focus="expert reviews"
                ),
            ]

        return ResearchPlan(
            original_query=query,
            search_tasks=plan_output.search_tasks[:4],
            reasoning=plan_output.reasoning
        )
