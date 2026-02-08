"""Background task management for deep research."""

import threading
from datetime import datetime
from typing import Dict, List, Optional
from models.schemas import TaskStatus, FragranceRecommendation, ResearchResponse


class TaskManager:
    """In-memory task manager for background research tasks.

    Uses threading.Lock instead of asyncio.Lock for thread-safe access
    across different event loops.
    """

    def __init__(self):
        self._tasks: Dict[str, dict] = {}
        self._lock = threading.Lock()

    async def create_task(self, task_id: str, notes: List[str], preferences: str) -> dict:
        """Create a new research task."""
        with self._lock:
            task = {
                "task_id": task_id,
                "notes": notes,
                "preferences": preferences,
                "status": TaskStatus.PENDING,
                "progress": 0,
                "message": "Task created, waiting to start...",
                "recommendations": None,
                "error": None,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat(),
            }
            self._tasks[task_id] = task
            return task

    async def get_task(self, task_id: str) -> Optional[ResearchResponse]:
        """Get task status and results."""
        with self._lock:
            task = self._tasks.get(task_id)
            if not task:
                return None

            return ResearchResponse(
                task_id=task["task_id"],
                status=task["status"],
                progress=task["progress"],
                message=task["message"],
                recommendations=task["recommendations"],
                error=task["error"],
            )

    async def update_task(
        self,
        task_id: str,
        status: TaskStatus,
        progress: int,
        message: str
    ) -> None:
        """Update task progress."""
        with self._lock:
            if task_id in self._tasks:
                self._tasks[task_id].update({
                    "status": status,
                    "progress": progress,
                    "message": message,
                    "updated_at": datetime.utcnow().isoformat(),
                })

    async def complete_task(
        self,
        task_id: str,
        recommendations: List[FragranceRecommendation]
    ) -> None:
        """Mark task as completed with results."""
        with self._lock:
            if task_id in self._tasks:
                self._tasks[task_id].update({
                    "status": TaskStatus.COMPLETED,
                    "progress": 100,
                    "message": f"Found {len(recommendations)} recommendations",
                    "recommendations": recommendations,
                    "updated_at": datetime.utcnow().isoformat(),
                })

    async def fail_task(self, task_id: str, error: str) -> None:
        """Mark task as failed."""
        with self._lock:
            if task_id in self._tasks:
                self._tasks[task_id].update({
                    "status": TaskStatus.FAILED,
                    "message": "Research failed",
                    "error": error,
                    "updated_at": datetime.utcnow().isoformat(),
                })

    async def cancel_task(self, task_id: str) -> bool:
        """Cancel a running task."""
        with self._lock:
            if task_id in self._tasks:
                task = self._tasks[task_id]
                if task["status"] not in [TaskStatus.COMPLETED, TaskStatus.FAILED]:
                    task.update({
                        "status": TaskStatus.CANCELLED,
                        "message": "Task cancelled by user",
                        "updated_at": datetime.utcnow().isoformat(),
                    })
                    return True
            return False

    def cleanup_old_tasks(self, max_age_hours: int = 24) -> int:
        """Remove tasks older than max_age_hours. Returns count of removed tasks."""
        now = datetime.utcnow()
        to_remove = []

        for task_id, task in self._tasks.items():
            created = datetime.fromisoformat(task["created_at"])
            age_hours = (now - created).total_seconds() / 3600
            if age_hours > max_age_hours:
                to_remove.append(task_id)

        for task_id in to_remove:
            del self._tasks[task_id]

        return len(to_remove)
