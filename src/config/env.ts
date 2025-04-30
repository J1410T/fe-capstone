/**
 * Cấu hình biến môi trường
 */
export const env = Object.freeze({
  NODE_ENV: import.meta.env.MODE,
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  API_SERVER: import.meta.env.VITE_API_SERVER || 'http://localhost:4000',
} as const);