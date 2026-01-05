import axios, { AxiosError } from "axios";
import { refreshAccessToken } from "./auth";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const api = axios.create({
  //baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"
  baseURL: VITE_API_BASE_URL,
  timeout: 15000, // Increase timeout to 15 seconds
});

const PUBLIC_ENDPOINTS = ["/auth/register", "/auth/login"];

// interceptors
api.interceptors.request.use((myConfig) => {
  //myConfig.headers  // headers eliyta ganna puluvan
  //myConfig.url      // inne kothanada kiyl blgnna puluvan (URL)

  const token = localStorage.getItem("accessToken");

  const isPublic = PUBLIC_ENDPOINTS.some((url) => myConfig.url?.includes(url));

  if (token && !isPublic) {
    myConfig.headers.Authorization = `Bearer ${token}`;
  }

  return myConfig;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (err: AxiosError) => {
    const originalRequest: any = err.config;

    const isPublic = PUBLIC_ENDPOINTS.some((url) =>
      originalRequest.url?.includes(url)
    );

    // Initialize retry counters
    if (!originalRequest.__retryCount) {
      originalRequest.__retryCount = 0;
    }

    // ============ HANDLE 401 - TOKEN EXPIRED ============
    if (err.response?.status === 401 && !isPublic && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("Oooppss.. No refresh token available..!");
        }

        const res = await refreshAccessToken(refreshToken);
        //localStorage.setItem("accessToken", res.accessToken)
        //localStorage.setItem("accessToken", res.data.accessToken)

        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        //originalRequest.headers.Authorization = `Bearer ${res.accessToken}`
        //originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axios(originalRequest);
      } catch (error) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";

        console.error("Token refresh failed:", error);
        return Promise.reject(error);
      }
    }

    // ============ HANDLE TIMEOUTS & 5XX ERRORS - RETRY ============
    // Retry on timeout (ECONNABORTED) or 503 Service Unavailable
    // But NOT on 401 (token refresh above handles that)
    if (
      originalRequest.__retryCount < 3 &&
      (err.code === "ECONNABORTED" || err.response?.status === 503)
    ) {
      originalRequest.__retryCount += 1;

      // Exponential backoff: 2s, 4s, 8s
      const delay = Math.pow(2, originalRequest.__retryCount) * 1000;

      console.log(
        `⚠️ Retrying request (attempt ${originalRequest.__retryCount})...`
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
      return api(originalRequest);
    }

    // Return error if all retries exhausted
    // time consume
    return Promise.reject(err);
  }
);

export default api;
