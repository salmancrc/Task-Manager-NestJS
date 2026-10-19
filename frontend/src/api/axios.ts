import axios from "axios";
import { PENDING_TOAST_STORAGE_KEY } from "../context/toast";

const apiClient = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const publicPaths = ["/signin", "/signup"];

let isRefreshing = false;

let requestQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}> = [];

let onApiError: ((message: string) => void) | null = null;

export function setApiErrorHandler(handler: ((message: string) => void) | null) {
  onApiError = handler;
}

function redirectWithToast(path: string, message: string) {
  if (window.location.pathname === path) {
    onApiError?.(message);
    return;
  }
  sessionStorage.setItem(PENDING_TOAST_STORAGE_KEY, message);
  window.location.href = path;
}

function flushQueue(error: unknown) {
  requestQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(null);
  });
  requestQueue = [];
}

function normalizeMessage(error: unknown): string {
  const raw =
    (error as { response?: { data?: { message?: unknown } } })?.response?.data?.message ??
    (error as Error).message ??
    "Something went wrong";
  return Array.isArray(raw) ? raw.join(", ") : String(raw);
}

function getErrorStatus(error: unknown): number | undefined {
  if (!error || typeof error !== "object") return undefined;
  if ("status" in error && typeof error.status === "number") return error.status;
  if (
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "status" in error.response &&
    typeof error.response.status === "number"
  ) {
    return error.response.status;
  }
  return undefined;
}

function createApiError(error: unknown, message: string): Error & { status?: number } {
  const normalizedError = new Error(message) as Error & { status?: number };
  normalizedError.status = getErrorStatus(error);
  return normalizedError;
}

apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const message = normalizeMessage(error);

    const isAuthEndpoint =
      originalRequest.url?.includes("/auth/signin") ||
      originalRequest.url?.includes("/auth/signup") ||
      originalRequest.url?.includes("/auth/refresh");

    if (status === 403) {
      redirectWithToast("/", message);
      return Promise.reject(createApiError(error, message));
    }

    if (typeof status === "number" && status >= 500) {
      redirectWithToast("/error", message);
      return Promise.reject(createApiError(error, message));
    }

    if (
      status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      if (isRefreshing) {
        originalRequest._retry = true;
        return new Promise((resolve, reject) => {
          requestQueue.push({ resolve, reject });
        }).then(() => apiClient(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;
      let refreshError: unknown;
      let refreshFailed = false;

      try {
        await apiClient.post("/auth/refresh");
        flushQueue(null);
      } catch (error) {
        refreshFailed = true;
        refreshError = error;
        flushQueue(refreshError);
      } finally {
        isRefreshing = false;
      }

      if (refreshFailed) {
        const refreshMessage = normalizeMessage(refreshError);
        const refreshStatus = getErrorStatus(refreshError);
        if (refreshStatus === 401) {
          const sessionExpiredMessage = "Session expired. Please sign in again.";
          if (publicPaths.includes(window.location.pathname)) {
            onApiError?.(sessionExpiredMessage);
          } else {
            redirectWithToast("/signin", sessionExpiredMessage);
          }
        } else if (refreshStatus === undefined) {
          onApiError?.(refreshMessage);
        }
        return Promise.reject(createApiError(refreshError, refreshMessage));
      }

      return apiClient(originalRequest);
    }

    if (!isAuthEndpoint) onApiError?.(message);
    return Promise.reject(createApiError(error, message));
  },
);

export default apiClient;
