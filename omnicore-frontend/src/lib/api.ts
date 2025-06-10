// API client for interacting with Django backend
const API_URL = "http://localhost:8000/api/v1";

export interface AuthResponse {
  access: string; // JWT access token
  refresh: string; // JWT refresh token
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
    const response = await fetch(`${API_URL}/auth/token/`, {
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
  },
  // Get the current user's profile
  async getUserProfile(): Promise<User> {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetchWithAuth(`${API_URL}/auth/me/`);

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
