"""Pydantic models for Deep Research API."""

from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field


class TaskStatus(str, Enum):
    """Status of a research task."""
    PENDING = "pending"
    PLANNING = "planning"
    SEARCHING = "searching"
    ANALYZING = "analyzing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class SearchTask(BaseModel):
    """Individual search task from the planner."""
    query: str = Field(..., description="The search query to execute")
    focus: str = Field(..., description="What aspect to focus on (e.g., 'fragrance notes', 'brand reviews')")


class ResearchPlan(BaseModel):
    """Output from plan_research agent."""
    original_query: str = Field(..., description="The original user query")
    search_tasks: List[SearchTask] = Field(..., description="List of search tasks to execute")
    reasoning: str = Field(..., description="Explanation of the search strategy")


class SearchResult(BaseModel):
    """Output from a single web search."""
    query: str = Field(..., description="The search query that was executed")
    results: List[dict] = Field(default_factory=list, description="Raw search results")
    summary: str = Field(..., description="LLM-generated summary of results")


class FragranceRecommendation(BaseModel):
    """Final output format - matches existing save format."""
    Name: str = Field(..., description="The perfume name")
    Brand: str = Field(..., description="The brand/house name")
    Notes: str = Field(..., description="Key fragrance notes, comma-separated")
    source_url: Optional[str] = Field(None, description="URL where this was found")
    confidence: Optional[float] = Field(None, description="Confidence score 0-1")
    reasoning: Optional[str] = Field(None, description="Why this matches the user's preferences")


class ResearchResponse(BaseModel):
    """API response for task status."""
    task_id: str = Field(..., description="Unique task identifier")
    status: TaskStatus = Field(..., description="Current task status")
    progress: int = Field(0, ge=0, le=100, description="Progress percentage 0-100")
    message: str = Field("", description="Human-readable status message")
    recommendations: Optional[List[FragranceRecommendation]] = Field(None, description="Results when completed")
    error: Optional[str] = Field(None, description="Error message if failed")


class StartResearchRequest(BaseModel):
    """Input to start research."""
    notes: List[str] = Field(..., min_length=1, description="Selected fragrance notes")
    preferences: Optional[str] = Field("", description="Optional text query like 'summer scent under $100'")
