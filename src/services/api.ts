import axios from "axios";
import { env } from "../config/env";
import { getAccessToken as getAccessTokenFromCookie } from "@/utils/cookie-manager";

export const axiosClient = axios.create({
  baseURL: env.API_SERVER + env.API_BASE_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    Accept: "text/plain",
  },
});

export const getAccessToken = () => {
  const token = getAccessTokenFromCookie();
  if (!token) {
    throw new Error("Access token not found");
  }
  return token;
};
