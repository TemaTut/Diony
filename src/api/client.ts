import axios, { AxiosHeaders, type AxiosRequestConfig } from "axios";

declare module "axios" {
  interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}

const AUTH_TOKEN_COOKIE_KEY = "access_token";
const AUTH_REQUEST_PATHS = new Set(["/auth/telegram"]);
const AUTH_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24;
const API_PREFIX = "/api/v1";

export function saveAccessToken(accessToken: string) {
  if (typeof document === "undefined") {
    return;
  }

  const secure = window.location.protocol === "https:" ? "; Secure" : "";

  document.cookie = `${AUTH_TOKEN_COOKIE_KEY}=${encodeURIComponent(
    accessToken,
  )}; Path=/; Max-Age=${AUTH_TOKEN_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

export function removeAccessToken() {
  if (typeof document === "undefined") {
    return;
  }

  const secure = window.location.protocol === "https:" ? "; Secure" : "";

  document.cookie = `${AUTH_TOKEN_COOKIE_KEY}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}

export function resetAuthAndGoHome() {
  removeAccessToken();

  if (typeof window !== "undefined" && window.location.pathname !== "/") {
    window.location.replace("/");
  }
}

export function getAccessToken() {
  if (typeof document === "undefined") {
    return null;
  }

  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${AUTH_TOKEN_COOKIE_KEY}=`));

  if (!cookie) {
    return null;
  }

  return decodeURIComponent(cookie.split("=").slice(1).join("="));
}

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

apiClient.interceptors.request.use((config) => {
  const url = config.url ?? "";
  const isRelative = !/^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(url);
  let endpoint = url;

  if (isRelative) {
    const path = `/${url.replace(/^\/+/, "")}`;
    endpoint = path === API_PREFIX ? "" : path.startsWith(`${API_PREFIX}/`) ? path.slice(API_PREFIX.length) : path;
    config.url = `${API_PREFIX}${endpoint}`;
  }

  const token = getAccessToken();

  if (!config.skipAuth && isRelative && token && !AUTH_REQUEST_PATHS.has(endpoint.split("?")[0])) {
    const headers = AxiosHeaders.from(config.headers);
    headers.set("Authorization", `Bearer ${token}`);
    config.headers = headers;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (!error.config?.skipAuth && (status === 401 || status === 403)) {
        resetAuthAndGoHome();
      }
    }

    return Promise.reject(error);
  },
);

const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T>(url, config),
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.post<T>(url, data, config),
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.put<T>(url, data, config),
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.patch<T>(url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<T>(url, config),
};

export default api;
