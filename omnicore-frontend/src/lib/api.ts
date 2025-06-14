// API client for interacting with Django backend
const API_URL = "http://localhost:8000/api";

export interface Tenant {
  id: string;
  name: string;
  slug?: string;
  role?: string;
}

export interface AuthResponse {
  access: string; // JWT access token
  refresh: string; // JWT refresh token
  user?: User;
  tenants?: Tenant[];
}

export interface User {
  id: string;
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}

// Handle authentication with the Django backend
export const authApi = {
  // Login with email and password
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to login");
    }

    return response.json();
  },

  // Register a new user
  async register(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to register");
    }

    return response.json();
  }, // Get the current user's profile
  async getUserProfile(): Promise<User> {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetchWithAuth(`${API_URL}/auth/user/`);

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    return response.json();
  },
  // Refresh the access token using the refresh token
  async refreshToken(): Promise<{ access: string }> {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token found");
    }

    const response = await fetch(`${API_URL}/auth/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    return response.json();
  },
  // Reset password - sends email with reset link
  async resetPassword(email: string): Promise<void> {
    const response = await fetch(`${API_URL}/auth/password-reset/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Failed to send password reset email");
    }

    return;
  },

  // Logout - clears tokens from localStorage
  logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};

// Utility function to set auth tokens in localStorage
export function setAuthTokens(tokens: AuthResponse) {
  localStorage.setItem("accessToken", tokens.access);
  localStorage.setItem("refreshToken", tokens.refresh);
}

// Utility function to get the current access token
export function getAccessToken(): string | null {
  return localStorage.getItem("accessToken");
}

// A helper function to handle API requests with authentication
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Get the token
  const token = localStorage.getItem("accessToken");

  // Add token to headers if it exists
  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Make the request with the token
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // If the request was unauthorized, try to refresh the token
  if (response.status === 401) {
    try {
      // Try to refresh the token
      const refreshed = await authApi.refreshToken();

      // Save the new token
      localStorage.setItem("accessToken", refreshed.access);

      // Retry the original request with the new token
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${refreshed.access}`,
        },
      });
    } catch {
      // If refresh fails, logout and redirect to login
      authApi.logout();
      window.location.href = "/login";
      return response;
    }
  }

  return response;
}

import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import Cookies from "js-cookie";

type ApiRequestOptions<T> = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  data?: T | FormData;
  headers?: Record<string, string | undefined>;
};

const getBaseUrl = (): string => {
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  if (hostname === "localhost") {
    return "http://localhost:8000/api/";
  } else if (hostname === "www.omnicore.app") {
    return "https://www.omnicore.app/api/";
  } else if (hostname === "omnicore.app") {
    return "https://omnicore.app/api/";
  } else {
    return `${process.env.NEXT_PUBLIC_DJANGO_API || ""}/api/`;
  }
};

const BASE_URL = getBaseUrl();

interface Router {
  push: (url: string) => Promise<boolean | void>;
}

export const apiRequest = async <Req, Res>(
  endpoint: string,
  router: Router,
  options: ApiRequestOptions<Req> = {},
  requireAuth = true
): Promise<Res> => {
  // First try to get token from cookies
  let token = Cookies.get("access") || "";
  const workspaceName = Cookies.get("workspace");

  // If not found in cookies, try localStorage as fallback (for compatibility)
  if (!token) {
    const localToken = localStorage.getItem("accessToken");
    if (localToken) {
      token = localToken;
      // Also set it as a cookie for future requests
      Cookies.set("access", localToken);
    }
  }

  // If we still don't have a token and auth is required, redirect to login
  if (requireAuth && !token) {
    console.log("No authentication token found. Redirecting to login.");
    await router.push("/login");
    throw new Error("Authentication error. Please log in again.");
  }

  // For now, if workspaceName is missing but we have a token, let's try to continue
  // The backend will handle tenant selection for single-tenant users
  if (requireAuth && !workspaceName && token) {
    console.log(
      "No workspace selected, but token exists. Backend will try to auto-select tenant."
    );
  } // Default headers
  const headers: Record<string, string> = {
    Authorization: token ? `Bearer ${token}` : "",
    "X-Tenant-Slug": workspaceName || "",
    "Content-Type": "application/json", // Default Content-Type
    ...options.headers,
  };

  // Debug info
  console.log(`API Request to ${endpoint}:`, {
    auth: token ? `Bearer ${token.substring(0, 10)}...` : "No token",
    workspace: workspaceName || "No workspace",
  });

  // Handle FormData
  if (options.data instanceof FormData) {
    delete headers["Content-Type"]; // Let browser set correct boundary
  }

  const config: AxiosRequestConfig = {
    url: `${BASE_URL}${endpoint}`,
    method: options.method || "GET",
    headers,
    data: options.data || undefined, // Axios automatically serializes JSON
  };

  try {
    const response: AxiosResponse<Res> = await axios(config);
    return response.data;
  } catch (error: unknown) {
    // Type guard to check if error is an AxiosError
    const axiosError = error as AxiosError;

    // Handle 401 Unauthorized by attempting token refresh
    if (axiosError.response?.status === 401 && requireAuth) {
      const refreshToken = Cookies.get("refresh");
      if (!refreshToken) {
        await router.push("/login");
        throw new Error("Session expired. Please log in again.");
      }

      try {
        const refreshResponse = await axios.post(
          `${BASE_URL}auth/token/refresh/`, // Updated endpoint to match backend
          {
            refresh: refreshToken,
          }
        );

        const newAccessToken = refreshResponse.data.access;

        // Update token in cookies
        Cookies.set("access", newAccessToken);

        // Also update in localStorage for backward compatibility
        localStorage.setItem("accessToken", newAccessToken);

        // Retry the original request with updated token
        config.headers = {
          ...headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        const retryResponse: AxiosResponse<Res> = await axios(config);
        return retryResponse.data;
      } catch {
        await router.push("/login");
        throw new Error("Session expired. Please log in again.");
      }
    }

    // Propagate backend errors
    if (axiosError.response) {
      console.error("API Error Response:", axiosError.response.data); // Log the error payload
      throw axiosError.response; // Throw the full response for frontend handling
    }

    // Handle unexpected issues (e.g., network errors)
    console.error("Network error or other issue:", error);
    throw new Error("A network error occurred. Please check your connection.");
  }
};
