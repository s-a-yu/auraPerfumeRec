/**
 * useDeepResearch Hook
 *
 * Custom React hook for managing deep research state,
 * polling, and API interactions.
 */

import { useState, useCallback, useRef, useEffect } from 'react';

const POLL_INTERVAL = 2000; // Poll every 2 seconds
const API_BASE = 'http://localhost:8080/api/research';

export const useDeepResearch = () => {
    const [taskId, setTaskId] = useState(null);
    const [status, setStatus] = useState(null);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const pollRef = useRef(null);

    // Start a new research task
    const startResearch = useCallback(async (notes, preferences = '') => {
        // Reset state
        setIsLoading(true);
        setError(null);
        setRecommendations([]);
        setProgress(0);
        setMessage('Starting research...');
        setStatus('pending');

        try {
            const response = await fetch(`${API_BASE}/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notes, preferences })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to start research');
            }

            setTaskId(data.task_id);
            startPolling(data.task_id);

        } catch (err) {
            setError(err.message);
            setIsLoading(false);
            setStatus('failed');
        }
    }, []);

    // Start polling for task status
    const startPolling = useCallback((id) => {
        // Clear any existing poll
        if (pollRef.current) {
            clearInterval(pollRef.current);
        }

        pollRef.current = setInterval(async () => {
            try {
                const response = await fetch(`${API_BASE}/status/${id}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to get status');
                }

                setStatus(data.status);
                setProgress(data.progress || 0);
                setMessage(data.message || '');

                // Check if task is complete
                if (data.status === 'completed') {
                    setRecommendations(data.recommendations || []);
                    setIsLoading(false);
                    clearInterval(pollRef.current);
                    pollRef.current = null;
                } else if (data.status === 'failed') {
                    setError(data.error || 'Research failed');
                    setIsLoading(false);
                    clearInterval(pollRef.current);
                    pollRef.current = null;
                } else if (data.status === 'cancelled') {
                    setMessage('Research cancelled');
                    setIsLoading(false);
                    clearInterval(pollRef.current);
                    pollRef.current = null;
                }

            } catch (err) {
                console.error('Polling error:', err);
                // Don't stop polling on transient errors
            }
        }, POLL_INTERVAL);
    }, []);

    // Cancel the current research task
    const cancelResearch = useCallback(async () => {
        if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
        }

        if (taskId) {
            try {
                await fetch(`${API_BASE}/cancel/${taskId}`, {
                    method: 'POST'
                });
            } catch (err) {
                console.error('Cancel error:', err);
            }
        }

        setIsLoading(false);
        setStatus('cancelled');
        setMessage('Research cancelled');
        setTaskId(null);
    }, [taskId]);

    // Reset state for a new search
    const reset = useCallback(() => {
        if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
        }
        setTaskId(null);
        setStatus(null);
        setProgress(0);
        setMessage('');
        setRecommendations([]);
        setError(null);
        setIsLoading(false);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (pollRef.current) {
                clearInterval(pollRef.current);
            }
        };
    }, []);

    return {
        // Actions
        startResearch,
        cancelResearch,
        reset,
        // State
        taskId,
        isLoading,
        status,
        progress,
        message,
        recommendations,
        error
    };
};

export default useDeepResearch;
