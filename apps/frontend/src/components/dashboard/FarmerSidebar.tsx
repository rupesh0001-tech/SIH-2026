import React, { memo } from "react";
import { BarChart3, CalendarDays, MapPinned, Settings } from "lucide-react";

import type { FarmerRoute } from "../../interfaces";

type FarmerSidebarProps = {
  activeRoute: FarmerRoute;
  onNavigate: (route: FarmerRoute) => void;
};

const items: { route: FarmerRoute; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { route: "/farmer/dashboard", label: "Dashboard", icon: BarChart3 },
  { route: "/bookings", label: "Bookings", icon: CalendarDays },
  { route: "/find-mandi", label: "Find Mandi", icon: MapPinned },
  { route: "/settings", label: "Settings", icon: Settings },
];

export const FarmerSidebar = memo(function FarmerSidebar({
  activeRoute,
  onNavigate,
}: FarmerSidebarProps) {
  return (
    <aside className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#DCE8DF] bg-white/95 p-2 backdrop-blur-md md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:border-r md:border-t-0 md:bg-white md:p-5">
      <div className="hidden items-center gap-3 px-2 pb-7 pt-2 md:flex">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0B2D1B] text-lg font-bold text-[#C8F52F] shadow-sm">
          🌾
        </div>
        <div>
          <div className="font-bold leading-none tracking-tight text-[#0B2D1B]">Agrovia Kisan</div>
          <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-[#5A6C5F]">APMC Portal</div>
        </div>
      </div>

      <nav className="mx-auto grid max-w-md grid-cols-4 gap-1 md:block md:max-w-none md:space-y-2">
        {items.map(({ route, label, icon: Icon }) => {
          const active = activeRoute === route;
          return (
            <button
              key={route}
              type="button"
              onClick={() => onNavigate(route)}
              className={`flex w-full flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2 text-[10px] font-bold transition-colors md:flex-row md:justify-start md:gap-3 md:px-3 md:py-3 md:text-sm ${
                active
                  ? "border-[#B6E7C5] bg-[#E8F5E9] text-[#059669]"
                  : "border-transparent text-[#5A6C5F] hover:border-[#E8EAEC] hover:bg-[#FCFCFA] hover:text-[#0B2D1B]"
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
});

export type { FarmerRoute };
