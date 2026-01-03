/**
 * Base API URL for the backend.
 * Uses the VITE_API_URL environment variable if available (Production),
 * otherwise falls back to localhost (Development).
 * 
 * Note: The backend URL should include the /api prefix if that's how your routes are set up.
 * e.g., https://your-backend.onrender.com/api
 */
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
