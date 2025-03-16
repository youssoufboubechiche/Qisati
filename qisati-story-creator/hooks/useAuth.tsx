"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

// Define User type
interface User {
  id: number;
  email: string;
  name?: string;
}

// Define the context type explicitly
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ resetUrl?: string }>;
  completePasswordReset: (token: string, newPassword: string) => Promise<void>;
}

// Create the context with an initial default value
const defaultAuthContext: AuthContextType = {
  user: null,
  loading: true,
  login: async () => {
    throw new Error("AuthProvider not initialized");
  },
  register: async () => {
    throw new Error("AuthProvider not initialized");
  },
  logout: async () => {
    throw new Error("AuthProvider not initialized");
  },
  resetPassword: async () => {
    throw new Error("AuthProvider not initialized");
    return {};
  },
  completePasswordReset: async () => {
    throw new Error("AuthProvider not initialized");
  },
};

// Create the context with the default value
export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user when component mounts
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Auth functions
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Login failed");
      }

      const data = await res.json();
      setUser(data.user);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Registration failed");
      }

      // After registration, log the user in
      await login(email, password);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Password reset request failed");
      }

      const data = await res.json();
      return { resetUrl: data.resetUrl };
    } finally {
      setLoading(false);
    }
  };

  const completePasswordReset = async (token: string, newPassword: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Password reset failed");
      }

      router.push("/login?reset=success");
    } finally {
      setLoading(false);
    }
  };

  // Create the context value
  const contextValue: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    resetPassword,
    completePasswordReset,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  return context;
}
