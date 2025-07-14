"use server";

import axios from "axios";
import { cookies } from "next/headers";

const getcooki = async () => ((await cookies()).get("access_token")?.value ?? null);

const api = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await getcooki();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: unknown) => void; }[] = [];

const processQueue = (error: unknown, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await fetch("http://localhost:4000/refreshtoken", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(await cookies()).get("refresh_token")?.value}`,
          },
        });

        if (refreshResponse.status !== 201) {
          throw new Error("Failed to refresh token");
        }

        // Handle setting new cookie
        const newCookies = cookies();
        const newAccessToken = (await refreshResponse.json()).accessToken;

        if (newAccessToken) {
          (await newCookies).set({
            name: "access_token",
            value: newAccessToken,
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "lax",
          });
        }

        // Update axios default
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
