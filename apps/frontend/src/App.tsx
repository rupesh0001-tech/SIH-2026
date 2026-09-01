import React, { useState, useEffect } from "react";
import { useAppSelector } from "./store";
import { AuthPageContent } from "./components/AuthPageContent";
import { FarmerDashboardShell } from "./components/dashboard/FarmerDashboardShell";
import { MandiOperatorDashboard } from "./components/dashboard/MandiOperatorDashboard";

export function App() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Determine which page to render based on auth state & current path
  if (currentPath === "/register") {
    return <AuthPageContent initialMode="REGISTER" />;
  }

  if (currentPath === "/login" || (!isAuthenticated && !user)) {
    return <AuthPageContent initialMode="LOGIN" />;
  }

  // Authenticated route rendering
  if (user?.role === "MANDI_OPERATOR" || currentPath.startsWith("/mandi")) {
    return <MandiOperatorDashboard />;
  }

  // Default to Farmer Dashboard
  return <FarmerDashboardShell />;
}
