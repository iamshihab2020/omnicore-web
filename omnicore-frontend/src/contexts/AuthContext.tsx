"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authApi, User, AuthResponse, setAuthTokens } from "@/lib/api";

interface AuthContextType {
  currentUser: User | null;
  signup: (email: string, password: string) => Promise<AuthResponse>;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  return useContext(AuthContext) as AuthContextType;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function signup(email: string, password: string) {
    const response = await authApi.register(email, password);
    setAuthTokens(response);
    await fetchCurrentUser(); // Get user profile after registration
    return response;
  }
  async function login(email: string, password: string) {
    const response = await authApi.login(email, password);

    // Store tokens in localStorage (for backward compatibility)
    setAuthTokens(response);

    // Also store in cookies (new method)
    const Cookies = (await import("js-cookie")).default;
    Cookies.set("access", response.access);
    Cookies.set("refresh", response.refresh);

    // If the response includes tenant info, store selected workspace
    if (response.tenants && response.tenants.length > 0) {
      const defaultTenant = response.tenants[0];
      Cookies.set("workspace", defaultTenant.slug || defaultTenant.name);
    }

    await fetchCurrentUser(); // Get user profile after login
    return response;
  }  async function logout() {
    // Use the centralized logout function
    await authApi.logout();
    
    // Update the UI state
    setCurrentUser(null);
    return Promise.resolve();
  }

  async function resetPassword(email: string) {
    return authApi.resetPassword(email);
  }  // Fetch the current user's profile
  async function fetchCurrentUser() {
    try {
      // Import Cookies
      const Cookies = (await import("js-cookie")).default;
      const tokenInCookies = Cookies.get("access");
      const tokenInStorage = localStorage.getItem("accessToken");

      // If we don't have any tokens, don't even try
      if (!tokenInCookies && !tokenInStorage) {
        console.log("No authentication tokens found, skipping profile fetch");
        return null;
      }

      // If we have a token in cookies but not in localStorage, set it for backward compatibility
      if (tokenInCookies && !tokenInStorage) {
        localStorage.setItem("accessToken", tokenInCookies);
      }
      // If we have a token in localStorage but not in cookies, set it for newer code
      else if (!tokenInCookies && tokenInStorage) {
        Cookies.set("access", tokenInStorage);
      }

      const user = await authApi.getUserProfile();
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
        // Look for specific error indicating expired token that couldn't be refreshed
      // The error might be from axios or fetch, handle both cases
      const axiosError = error as { response?: { status: number } };
      const fetchError = error as { status?: number };
      if (axiosError.response?.status === 401 || fetchError.status === 401) {
        console.log("Authentication failed - session likely expired");
        // Ensure we're logged out if token refresh failed
        authApi.logout();
      }
      
      return null;
    }
  }
  useEffect(() => {
    async function loadUser() {
      try {
        // Check for tokens in either localStorage or cookies
        const Cookies = (await import("js-cookie")).default;
        const tokenInCookies = Cookies.get("access");
        const tokenInStorage = localStorage.getItem("accessToken");

        if (tokenInCookies || tokenInStorage) {
          // If we have a token in either place, try to get the user
          await fetchCurrentUser();
        }
      } catch (error) {
        console.error("Error during authentication:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    loading,
  };
  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex min-h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
