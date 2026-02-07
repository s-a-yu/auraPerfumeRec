/**
 * Research Routes - Proxy to Deep Research Service
 *
 * These routes proxy requests to the Python deep research service
 * running on port 5001.
 */

const express = require('express');
const router = express.Router();

const DEEP_RESEARCH_URL = process.env.DEEP_RESEARCH_URL || 'http://localhost:5001';

/**
 * Start a new deep research task
 * POST /api/research/start
 * Body: { notes: string[], preferences?: string }
 */
router.post('/start', async (req, res) => {
    try {
        const { notes, preferences } = req.body;

        if (!notes || !Array.isArray(notes) || notes.length === 0) {
            return res.status(400).json({ error: "notes array is required" });
        }

        const response = await fetch(`${DEEP_RESEARCH_URL}/api/research/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notes, preferences: preferences || '' })
        });

        const data = await response.json();
        res.status(response.status).json(data);

    } catch (err) {
        console.error('Deep research start error:', err);
        res.status(503).json({
            error: 'Deep research service unavailable. Make sure the service is running on port 5001.'
        });
    }
});

/**
 * Get task status
 * GET /api/research/status/:taskId
 */
router.get('/status/:taskId', async (req, res) => {
    try {
        const { taskId } = req.params;

        const response = await fetch(`${DEEP_RESEARCH_URL}/api/research/status/${taskId}`);
        const data = await response.json();

        res.status(response.status).json(data);

    } catch (err) {
        console.error('Deep research status error:', err);
        res.status(503).json({
            error: 'Deep research service unavailable'
        });
    }
});

/**
 * Cancel a running task
 * POST /api/research/cancel/:taskId
 */
router.post('/cancel/:taskId', async (req, res) => {
    try {
        const { taskId } = req.params;

        const response = await fetch(`${DEEP_RESEARCH_URL}/api/research/cancel/${taskId}`, {
            method: 'POST'
        });
        const data = await response.json();

        res.status(response.status).json(data);

    } catch (err) {
        console.error('Deep research cancel error:', err);
        res.status(503).json({
            error: 'Deep research service unavailable'
        });
    }
});

module.exports = router;
