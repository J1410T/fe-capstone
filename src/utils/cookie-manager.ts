/**
 * Cookie management utilities with encryption support
 * Handles secure storage and retrieval of authentication data
 */

import Cookies from "js-cookie";
import { encryptData, decryptData, encryptJSON, decryptJSON } from "./crypto";

// Cookie configuration
const COOKIE_CONFIG = {
  // Cookie expires in 24 hours by default
  expires: 1,
  // Secure cookies in production
  secure: process.env.NODE_ENV === "production",
  // SameSite policy for CSRF protection
  sameSite: "strict" as const,
  // Cookie path
  path: "/",
} as const;

// Cookie keys
export const COOKIE_KEYS = {
  AUTH_RESPONSE: "auth_response_encrypted",
  ACCESS_TOKEN: "access_token_encrypted",
  LAST_ACTIVITY: "last_activity_encrypted",
} as const;

/**
 * Set an encrypted cookie with string data
 * @param key - Cookie key
 * @param value - String value to encrypt and store
 * @param options - Additional cookie options
 */
export const setEncryptedCookie = (
  key: string,
  value: string,
  options?: Cookies.CookieAttributes
): void => {
  try {
    const encryptedValue = encryptData(value);
    const cookieOptions = { ...COOKIE_CONFIG, ...options };
    Cookies.set(key, encryptedValue, cookieOptions);
  } catch (error) {
    console.error(`Failed to set encrypted cookie ${key}:`, error);
    throw new Error(`Failed to set encrypted cookie: ${key}`);
  }
};

/**
 * Get and decrypt a cookie with string data
 * @param key - Cookie key
 * @returns Decrypted string value or null if not found
 */
export const getEncryptedCookie = (key: string): string | null => {
  try {
    const encryptedValue = Cookies.get(key);
    if (!encryptedValue) {
      return null;
    }

    // Additional validation for encrypted value
    if (typeof encryptedValue !== "string" || encryptedValue.length === 0) {
      console.warn(`Invalid encrypted cookie value for ${key}`);
      removeCookie(key);
      return null;
    }

    return decryptData(encryptedValue);
  } catch (error) {
    console.error(`Failed to get encrypted cookie ${key}:`, error);
    // If decryption fails, remove the corrupted cookie
    try {
      removeCookie(key);
    } catch (removeError) {
      console.error(`Failed to remove corrupted cookie ${key}:`, removeError);
    }
    return null;
  }
};

/**
 * Set an encrypted cookie with JSON data
 * @param key - Cookie key
 * @param value - Object to encrypt and store
 * @param options - Additional cookie options
 */
export const setEncryptedJSONCookie = <T extends object>(
  key: string,
  value: T,
  options?: Cookies.CookieAttributes
): void => {
  try {
    const encryptedValue = encryptJSON(value);
    const cookieOptions = { ...COOKIE_CONFIG, ...options };
    Cookies.set(key, encryptedValue, cookieOptions);
  } catch (error) {
    console.error(`Failed to set encrypted JSON cookie ${key}:`, error);
    throw new Error(`Failed to set encrypted JSON cookie: ${key}`);
  }
};

/**
 * Get and decrypt a cookie with JSON data
 * @param key - Cookie key
 * @returns Decrypted object or null if not found
 */
export const getEncryptedJSONCookie = <T>(key: string): T | null => {
  try {
    const encryptedValue = Cookies.get(key);
    if (!encryptedValue) {
      return null;
    }
    return decryptJSON<T>(encryptedValue);
  } catch (error) {
    console.error(`Failed to get encrypted JSON cookie ${key}:`, error);
    // If decryption fails, remove the corrupted cookie
    removeCookie(key);
    return null;
  }
};

/**
 * Remove a cookie
 * @param key - Cookie key to remove
 */
export const removeCookie = (key: string): void => {
  try {
    Cookies.remove(key, { path: COOKIE_CONFIG.path });
  } catch (error) {
    console.error(`Failed to remove cookie ${key}:`, error);
  }
};

/**
 * Check if a cookie exists
 * @param key - Cookie key to check
 * @returns True if cookie exists
 */
export const cookieExists = (key: string): boolean => {
  return Cookies.get(key) !== undefined;
};

/**
 * Clear all authentication-related cookies
 */
export const clearAuthCookies = (): void => {
  try {
    Object.values(COOKIE_KEYS).forEach((key) => {
      removeCookie(key);
    });
    console.log("All authentication cookies cleared");
  } catch (error) {
    console.error("Failed to clear authentication cookies:", error);
  }
};

/**
 * Set access token in encrypted cookie
 * @param token - Access token to store
 */
export const setAccessToken = (token: string): void => {
  setEncryptedCookie(COOKIE_KEYS.ACCESS_TOKEN, token);
};

/**
 * Get access token from encrypted cookie
 * @returns Access token or null if not found
 */
export const getAccessToken = (): string | null => {
  return getEncryptedCookie(COOKIE_KEYS.ACCESS_TOKEN);
};

/**
 * Set auth response data in encrypted cookie
 * @param authResponse - Auth response object to store
 */
export const setAuthResponse = <T extends object>(authResponse: T): void => {
  setEncryptedJSONCookie(COOKIE_KEYS.AUTH_RESPONSE, authResponse);
};

/**
 * Get auth response data from encrypted cookie
 * @returns Auth response object or null if not found
 */
export const getAuthResponse = <T>(): T | null => {
  console.log(
    "🍪 Getting auth response from cookie:",
    COOKIE_KEYS.AUTH_RESPONSE
  );
  const result = getEncryptedJSONCookie<T>(COOKIE_KEYS.AUTH_RESPONSE);
  console.log("🍪 Auth response result:", result ? "Found" : "Not found");
  return result;
};

/**
 * Set last activity timestamp in encrypted cookie
 * @param timestamp - Timestamp to store
 */
export const setLastActivity = (timestamp: number): void => {
  setEncryptedCookie(COOKIE_KEYS.LAST_ACTIVITY, timestamp.toString());
};

/**
 * Get last activity timestamp from encrypted cookie
 * @returns Timestamp or null if not found
 */
export const getLastActivity = (): number | null => {
  const timestamp = getEncryptedCookie(COOKIE_KEYS.LAST_ACTIVITY);
  return timestamp ? parseInt(timestamp, 10) : null;
};
