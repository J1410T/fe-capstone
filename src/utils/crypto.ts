/**
 * Crypto utilities for encrypting and decrypting sensitive data
 * Used for securing authentication data stored in cookies
 */

import { env } from "@/config/env";
import CryptoJS from "crypto-js";

// Secret key for encryption - in production, this should come from environment variables
const SECRET_KEY =
  env.VITE_CRYPTO_SECRET_KEY || "default-secret-key-change-in-production";

/**
 * Encrypt data using AES encryption
 * @param data - The data to encrypt (string or object)
 * @returns Encrypted string
 */
export const encryptData = (data: string | object): string => {
  try {
    if (!data) {
      throw new Error("Data to encrypt cannot be empty");
    }

    const dataString = typeof data === "string" ? data : JSON.stringify(data);
    if (!dataString) {
      throw new Error("Failed to serialize data");
    }

    const encrypted = CryptoJS.AES.encrypt(dataString, SECRET_KEY).toString();
    if (!encrypted) {
      throw new Error("Encryption returned empty result");
    }

    return encrypted;
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Failed to encrypt data");
  }
};

/**
 * Decrypt data using AES decryption
 * @param encryptedData - The encrypted string to decrypt
 * @returns Decrypted string
 */
export const decryptData = (encryptedData: string): string => {
  try {
    if (!encryptedData || typeof encryptedData !== "string") {
      throw new Error("Invalid encrypted data provided");
    }

    const decrypted = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    if (!decrypted) {
      throw new Error("Decryption failed - invalid data or key");
    }

    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
    if (!decryptedString) {
      throw new Error(
        "Decryption resulted in empty string - data may be corrupted"
      );
    }

    return decryptedString;
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Failed to decrypt data");
  }
};

/**
 * Encrypt and parse JSON data
 * @param data - The object to encrypt
 * @returns Encrypted string
 */
export const encryptJSON = (data: object): string => {
  return encryptData(JSON.stringify(data));
};

/**
 * Decrypt and parse JSON data
 * @param encryptedData - The encrypted string to decrypt and parse
 * @returns Parsed object
 */
export const decryptJSON = <T = unknown>(encryptedData: string): T => {
  try {
    const decryptedString = decryptData(encryptedData);
    return JSON.parse(decryptedString) as T;
  } catch (error) {
    console.error("JSON decryption failed:", error);
    throw new Error("Failed to decrypt and parse JSON data");
  }
};

/**
 * Validate if a string is properly encrypted
 * @param data - The string to validate
 * @returns True if the string appears to be encrypted
 */
export const isEncrypted = (data: string): boolean => {
  try {
    // Try to decrypt - if it fails, it's not properly encrypted
    decryptData(data);
    return true;
  } catch {
    return false;
  }
};

/**
 * Generate a secure random key for encryption
 * @param length - Length of the key (default: 32)
 * @returns Random key string
 */
export const generateSecureKey = (length: number = 32): string => {
  return CryptoJS.lib.WordArray.random(length).toString();
};
