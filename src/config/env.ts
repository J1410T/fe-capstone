/**
 * Environment configuration
 */
export const env = Object.freeze({
  NODE_ENV: import.meta.env.MODE,
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "/api",
  API_SERVER: import.meta.env.VITE_API_SERVER || "http://localhost:4000",
  SIGNALR_HUB_URL:
    import.meta.env.VITE_SIGNALR_HUB_URL ||
    `${
      import.meta.env.VITE_API_SERVER || "http://localhost:4000"
    }/notificationhub`,
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
  VITE_CRYPTO_SECRET_KEY: import.meta.env.VITE_CRYPTO_SECRET_KEY,
} as const);
