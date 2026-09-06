import { useState, useEffect, type ReactNode } from "react";
import { AuthContext } from "./auth"; // Where your context is exported
import { getMe, logoutApi } from "../api/auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has a valid cookie on load
    const checkSession = async () => {
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
    } catch (err) {
      console.error(err);
    }
    setIsAuthenticated(false);
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
