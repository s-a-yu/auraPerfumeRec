"""
Deep Research Server ~~~~ FastMCP-style background tasks for perfume recommendations.

This server provides REST endpoints for:
- Starting deep research tasks
- Polling task status
- Getting results

"""

import asyncio
import uuid
import sys
import os
from contextlib import asynccontextmanager

from flask import Flask, request, jsonify
from flask_cors import CORS

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config import HOST, PORT, validate_config, LLM_PROVIDER
from models.schemas import TaskStatus, FragranceRecommendation
from tasks.background import TaskManager
from agents.planner import PlannerAgent
from agents.searcher import SearcherAgent
from agents.analyzer import AnalyzerAgent

app = Flask(__name__)
CORS(app)


task_manager = TaskManager()

_background_tasks = {}


def run_async(coro):
    """Run an async coroutine from sync context.

    Creates a new event loop for each call. For simple operations only.
    """
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        return loop.run_until_complete(coro)
    finally:
        # properly shutdown async generators and pending tasks
        try:
            loop.run_until_complete(loop.shutdown_asyncgens())
        except Exception:
            pass
        loop.close()


async def run_research_pipeline(task_id: str, notes: list, preferences: str):
    """Execute the full research pipeline as a background task."""
    try:
        # Phase 1: Planning (10%)
        await task_manager.update_task(
            task_id, TaskStatus.PLANNING, 10, "Creating search plan..."
        )

        planner = PlannerAgent()
        plan = await planner.create_plan(notes, preferences)

        # Phase 2: Searching (30-70%)
        await task_manager.update_task(
            task_id, TaskStatus.SEARCHING, 30,
            f"Searching web ({len(plan.search_tasks)} queries)..."
        )

        searcher = SearcherAgent()
        search_results = await searcher.execute_searches(plan.search_tasks)

        # Update progress during search
        await task_manager.update_task(
            task_id, TaskStatus.SEARCHING, 60,
            f"Found {len(search_results)} results, analyzing..."
        )

        # Phase 3: Analysis (70-100%)
        await task_manager.update_task(
            task_id, TaskStatus.ANALYZING, 75,
            "Analyzing results and generating recommendations..."
        )

        analyzer = AnalyzerAgent()
        recommendations = await analyzer.synthesize(notes, preferences, search_results)

        # Complete
        await task_manager.complete_task(task_id, recommendations)

    except Exception as e:
        print(f"Research pipeline error for task {task_id}: {e}")
        await task_manager.fail_task(task_id, str(e))


def start_background_task(task_id: str, notes: list, preferences: str):
    """Start a background research task in a new thread.

    Creates a dedicated event loop for the entire pipeline to ensure
    pydantic_ai's async clients have a stable loop throughout execution.
    """
    import threading

    def run_in_thread():
        # create new event loop for thread
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        try:
            # Run entire pipeline in this loop
            loop.run_until_complete(run_research_pipeline(task_id, notes, preferences))
        except Exception as e:
            print(f"Background task error: {e}")
            # Try to mark task as failed
            try:
                loop.run_until_complete(task_manager.fail_task(task_id, str(e)))
            except Exception:
                pass
        finally:
            # Properly cleanup loop
            try:
                # Cancel pending tasks
                pending = asyncio.all_tasks(loop)
                for task in pending:
                    task.cancel()
                # Run pending cancellations
                if pending:
                    loop.run_until_complete(asyncio.gather(*pending, return_exceptions=True))
                # Shutdown async generators
                loop.run_until_complete(loop.shutdown_asyncgens())
            except Exception:
                pass
            finally:
                loop.close()

    thread = threading.Thread(target=run_in_thread, daemon=True)
    thread.start()
    _background_tasks[task_id] = thread


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok", "service": "deep-research"})


@app.route('/api/research/start', methods=['POST'])
def start_research():
    """Start a new deep research task."""
    try:
        data = request.get_json()
        notes = data.get('notes', [])
        preferences = data.get('preferences', '')

        if not notes or not isinstance(notes, list):
            return jsonify({"error": "notes array is required"}), 400

        task_id = str(uuid.uuid4())
        run_async(task_manager.create_task(task_id, notes, preferences))

        start_background_task(task_id, notes, preferences)

        return jsonify({
            "task_id": task_id,
            "status": "pending",
            "message": "Research task started"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/research/status/<task_id>', methods=['GET'])
def get_status(task_id):
    """Get status of a research task."""
    try:
        result = run_async(task_manager.get_task(task_id))

        if not result:
            return jsonify({"error": "Task not found"}), 404

        response = {
            "task_id": result.task_id,
            "status": result.status.value,
            "progress": result.progress,
            "message": result.message,
            "error": result.error,
        }

        if result.recommendations:
            response["recommendations"] = [
                {
                    "Name": r.Name,
                    "Brand": r.Brand,
                    "Notes": r.Notes,
                    "reasoning": r.reasoning,
                }
                for r in result.recommendations
            ]

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/research/cancel/<task_id>', methods=['POST'])
def cancel_research(task_id):
    """Cancel a running research task."""
    try:
        cancelled = run_async(task_manager.cancel_task(task_id))

        if cancelled:
            return jsonify({"message": "Task cancelled"})
        else:
            return jsonify({"error": "Task not found or already completed"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    print("=" * 60)
    print("Deep Research Server")
    print("=" * 60)

    try:
        validate_config()
        print(f"Using provider: {LLM_PROVIDER}")
    except ValueError as e:
        print(f"\nConfiguration Error: {e}")
        print("\nSetup instructions:")
        print("  1. Copy .env.example to .env")
        print("  2. Add GROQ_API_KEY (free) or GEMINI_API_KEY")
        print("  3. Run: pip install -r requirements.txt")
        sys.exit(1)

    print(f"\nStarting server on http://{HOST}:{PORT}")
    print("\nEndpoints:")
    print(f"  POST /api/research/start - Start research")
    print(f"  GET  /api/research/status/<task_id> - Get status")
    print(f"  POST /api/research/cancel/<task_id> - Cancel task")
    print("=" * 60)

    app.run(host=HOST, port=PORT, debug=True)
