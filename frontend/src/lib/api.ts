/**
 * Base URL của backend API.
 * Set NEXT_PUBLIC_API_URL trong .env.local (mặc định: http://localhost:8000)
 */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
