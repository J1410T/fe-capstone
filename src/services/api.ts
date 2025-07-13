import axios from "axios";
import { env } from "../config/env";
import { queryClient } from "@/lib/react-query";

export const axiosClient = axios.create({
  baseURL: env.API_SERVER + env.API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "text/plain",
  },
});

export const getAccessToken = () => {
  const token = queryClient.getQueryData(["access-token"]) as
    | string
    | undefined;
  if (!token) {
    throw new Error("Access token not found");
  }
  return token;
};
