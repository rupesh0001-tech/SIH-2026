"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, LogOut, LayoutDashboard, User as UserIcon } from "lucide-react";

interface NavbarProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

interface StoredUser {
  id: string;
  name: string;
  email: string;
  role?: string;
}

const navItems = [
  "Home",
  "About Platform",
  "Mandi Solutions",
  "Procurement",
  "Farmer Stories",
];

export default function Navbar({ activeTab = "Home", onSelectTab }: NavbarProps) {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<StoredUser | null>(null);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:5173";

  useEffect(() => {
    try {
      // 1. Check document.cookie for mandi_user
      const match = document.cookie.match(/(?:^|;\s*)mandi_user=([^;]*)/);
      if (match && match[1]) {
        const parsed = JSON.parse(decodeURIComponent(match[1]));
        if (parsed && parsed.name) {
          setUser(parsed);
          return;
        }
      }
      // 2. Fallback: check localStorage
      const local = localStorage.getItem("mandi_current_user");
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed && parsed.name) {
          setUser(parsed);
        }
      }
    } catch {
      setUser(null);
    }
  }, []);

  const handleSignOut = () => {
    document.cookie = "mandi_user=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "mandi_access_token=; path=/; max-age=0; SameSite=Lax";
    try {
      localStorage.removeItem("mandi_current_user");
      localStorage.removeItem("mandi_access_token");
    } catch {}
    setUser(null);
  };

  const handleTabClick = (item: string) => {
    setCurrentTab(item);
    if (onSelectTab) onSelectTab(item);
    setMobileMenuOpen(false);
  };

  const dashboardUrl =
    user?.role === "MANDI_OPERATOR"
      ? `${appUrl}/mandi/dashboard`
      : `${appUrl}/farmer/dashboard`;

  return (
    <header className="relative z-30 w-full pt-6 md:pt-8 px-6 sm:px-8 md:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#home"
          className="flex items-center gap-2.5 group cursor-pointer"
          aria-label="Agrovia Home"
        >
          <div className="w-8 h-8 md:w-9 md:h-9 bg-[#C8F52F] rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
            {/* Stylized Leaf / Agri Mark */}
            <svg
              className="w-5 h-5 text-[#0B2D1B]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 16h10" />
              <path d="M9 12h10" />
              <path d="M5 8h10" />
            </svg>
          </div>
          <span className="text-white font-semibold text-xl tracking-tight">
            Agrovia Mandi
          </span>
        </a>

        {/* Desktop Center Navigation Pill */}
        <nav
          className="hidden md:flex items-center bg-black/25 backdrop-blur-md border border-white/15 rounded-full p-1 shadow-lg shadow-black/15"
          aria-label="Main Navigation"
        >
          {navItems.map((item) => {
            const isActive = currentTab === item;
            return (
              <button
                key={item}
                onClick={() => handleTabClick(item)}
                className={`relative px-4 py-1.5 text-sm rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-white text-[#0B2D1B] font-semibold shadow-sm scale-100"
                    : "text-white/80 hover:text-white font-normal hover:bg-white/10"
                }`}
              >
                {item}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Buttons or User Profile */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2.5">
              {/* User Profile Pill */}
              <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-white shadow-xs">
                <div className="w-7 h-7 rounded-full bg-[#C8F52F] text-[#0B2D1B] font-bold text-xs flex items-center justify-center shadow-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="text-left pr-1">
                  <div className="text-xs font-semibold leading-tight text-white max-w-[120px] truncate">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-[#C8F52F] font-semibold leading-none mt-0.5">
                    {user.role === "MANDI_OPERATOR" ? "Operator" : "Kisan"}
                  </div>
                </div>
              </div>

              {/* Dashboard Button */}
              <a
                href={dashboardUrl}
                className="inline-flex items-center gap-1.5 bg-[#C8F52F] text-[#0B2D1B] font-semibold px-5 py-2.5 rounded-full text-sm shadow-md hover:bg-[#b8e624] hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
              >
                <LayoutDashboard size={14} />
                <span>Dashboard</span>
              </a>

              {/* Sign Out Button */}
              <button
                type="button"
                onClick={handleSignOut}
                title="Sign Out"
                className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <>
              <a
                href={`${appUrl}/login`}
                className="text-white/80 hover:text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-white/10 transition-all duration-200"
              >
                Sign In
              </a>
              <a
                href={`${appUrl}/register`}
                className="bg-[#C8F52F] text-[#0B2D1B] font-semibold px-5 py-2.5 rounded-full text-sm shadow-md hover:bg-[#b8e624] hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
              >
                Book Slot
              </a>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white cursor-pointer"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="max-w-7xl mx-auto md:hidden mt-3 p-4 bg-[#06180E]/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl flex flex-col gap-2 animate-fadeIn">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => handleTabClick(item)}
              className={`text-left px-4 py-2.5 rounded-xl text-sm transition-colors ${
                currentTab === item
                  ? "bg-[#C8F52F] text-[#0B2D1B] font-semibold"
                  : "text-white/90 hover:bg-white/10"
              }`}
            >
              {item}
            </button>
          ))}
          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            {user ? (
              <>
                <div className="flex items-center gap-3 p-2 rounded-xl bg-white/10 text-white">
                  <div className="w-8 h-8 rounded-full bg-[#C8F52F] text-[#0B2D1B] font-bold text-sm flex items-center justify-center">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{user.name}</div>
                    <div className="text-xs text-[#C8F52F]">
                      {user.role === "MANDI_OPERATOR" ? "Operator" : "Kisan"}
                    </div>
                  </div>
                </div>
                <a
                  href={dashboardUrl}
                  className="w-full bg-[#C8F52F] text-[#0B2D1B] font-semibold py-2.5 rounded-xl text-sm text-center shadow-md flex items-center justify-center gap-1.5"
                >
                  <LayoutDashboard size={16} />
                  <span>Go to Dashboard</span>
                </a>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full text-center py-2.5 rounded-xl text-sm text-red-300 bg-red-950/40 font-medium hover:bg-red-900/50 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <a
                  href={`${appUrl}/login`}
                  className="w-full text-center py-2.5 rounded-xl text-sm text-white/90 bg-white/10 font-medium"
                >
                  Sign In
                </a>
                <a
                  href={`${appUrl}/register`}
                  className="w-full bg-[#C8F52F] text-[#0B2D1B] font-semibold py-2.5 rounded-xl text-sm text-center shadow-md"
                >
                  Book Slot / Register
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
