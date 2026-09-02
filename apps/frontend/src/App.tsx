import React, { useState, useEffect } from "react";
import { useAppSelector } from "./store";
import { AuthPageContent } from "./components/AuthPageContent";
import { FarmerDashboardShell } from "./components/dashboard/FarmerDashboardShell";
import { MandiOperatorDashboard } from "./components/dashboard/MandiOperatorDashboard";

export function App() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // 1. Root route '/' -> Navigate to external Landing Page
  if (currentPath === "/") {
    const landingUrl = import.meta.env.VITE_LANDING_URL || "http://localhost:3000";
    window.location.replace(landingUrl);
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFCFA] text-[#0B2D1B]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#059669] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-[#5A6C5F]">Redirecting to Agrovia Portal...</span>
        </div>
      </div>
    );
  }

  const isUserAuthenticated = Boolean(isAuthenticated && user);

  // 2. Unauthenticated user handling & Protected Routes
  if (!isUserAuthenticated) {
    if (currentPath === "/register") {
      return <AuthPageContent initialMode="REGISTER" />;
    }

    // If unauthorized user accesses any protected path (e.g. /farmer/dashboard, /bookings, /mandi, etc.)
    // Replace URL in browser address bar to /login so the URL doesn't stay as the protected path
    if (currentPath !== "/login") {
      window.history.replaceState(null, "", "/login");
    }

    return <AuthPageContent initialMode="LOGIN" />;
  }

  // 3. Authenticated user accessing auth pages (/login, /register) -> redirect to their dashboard
  if (currentPath === "/login" || currentPath === "/register") {
    const targetDashboard =
      user?.role === "MANDI_OPERATOR" ? "/mandi/dashboard" : "/farmer/dashboard";
    window.history.replaceState(null, "", targetDashboard);
    return user?.role === "MANDI_OPERATOR" ? (
      <MandiOperatorDashboard />
    ) : (
      <FarmerDashboardShell />
    );
  }

  // 4. Mandi Operator routes
  if (user?.role === "MANDI_OPERATOR" || currentPath.startsWith("/mandi")) {
    return <MandiOperatorDashboard />;
  }

  // 5. Farmer Dashboard & sub-routes (/farmer/dashboard, /bookings, /find-mandi, /settings)
  return <FarmerDashboardShell />;
}
