import { useState, useEffect, type ReactNode } from "react";
import { AuthContext } from "./auth"; // Where your context is exported
import { getMe, logoutApi } from "../api/auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const publicPaths = ["/signin", "/signup"];
      if (publicPaths.includes(window.location.pathname)) {
        setIsLoading(false);
        return;
      }

      try {
        await getMe();
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      setIsAuthenticated(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ token: null, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
