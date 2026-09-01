import React, { memo } from "react";
import { Calendar, Clock, QrCode } from "lucide-react";
import type { FarmerBookingItem } from "./FarmerDashboard";

interface BookingsTableSectionProps {
  activeTab: "current" | "previous";
  onTabChange: (tab: "current" | "previous") => void;
  displayedList: FarmerBookingItem[];
  currentBookingsCount: number;
  previousBookingsCount: number;
  onOpenCreateModal: () => void;
  onSelectBookingForQR: (booking: FarmerBookingItem) => void;
  hideHeader?: boolean;
}

function statusLabel(status: FarmerBookingItem["status"]) {
  if (status === "ARRIVED" || status === "VERIFIED") return "Gate Arrived";
  if (status === "IN_TRANSIT") return "In Transit";
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function statusClass(status: FarmerBookingItem["status"]) {
  if (status === "PENDING") return "bg-amber-50 text-amber-700 border-amber-200";
  if (status === "ACCEPTED") return "bg-blue-50 text-blue-700 border-blue-200";
  if (status === "IN_TRANSIT") return "bg-purple-50 text-purple-700 border-purple-200";
  if (status === "ARRIVED" || status === "VERIFIED") return "bg-teal-50 text-teal-700 border-teal-200";
  return "bg-[#E8F5E9] text-[#059669] border-emerald-200";
}

export const BookingsTableSection = memo(function BookingsTableSection({
  activeTab,
  onTabChange,
  displayedList,
  currentBookingsCount,
  previousBookingsCount,
  onOpenCreateModal,
  onSelectBookingForQR,
  hideHeader = false,
}: BookingsTableSectionProps) {
  return (
    <div className={`w-full bg-white rounded-3xl border border-[#E8EAEC] ${hideHeader ? "p-4 sm:p-5" : "p-6 sm:p-7 space-y-5"} shadow-sm text-left`}>
      {/* Header & Tabs */}
      {!hideHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F1F3F5] pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#0B2D1B] flex items-center gap-2">
              <span>
                {activeTab === "current"
                  ? "Active Unloading Bookings"
                  : "Previous Bookings History"}
              </span>
              <span className="text-xs font-bold text-[#059669] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full border border-emerald-200">
                {displayedList.length} Records
              </span>
            </h2>
            <p className="text-xs text-[#5A6C5F] mt-0.5">
              {activeTab === "current"
                ? "Track live gate arrivals, allocated weighbridge hoppers, and download e-tokens."
                : "Review historical produce deliveries, weighbridge slips, and settled payouts."}
            </p>
          </div>

          {/* Tab Pill Switcher */}
          <div className="flex p-1 bg-[#F4F4F2] border border-[#E8EAEC] rounded-xl self-start sm:self-auto">
            <button
              type="button"
              onClick={() => onTabChange("current")}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === "current"
                  ? "bg-white text-[#0B2D1B] shadow-xs"
                  : "text-[#5A6C5F] hover:text-[#0B2D1B]"
              }`}
            >
              Active Bookings ({currentBookingsCount})
            </button>
            <button
              type="button"
              onClick={() => onTabChange("previous")}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === "previous"
                  ? "bg-[#0B2D1B] text-white shadow-xs"
                  : "text-[#5A6C5F] hover:text-[#0B2D1B]"
              }`}
            >
              Previous History ({previousBookingsCount})
            </button>
          </div>
        </div>
      )}

      {/* Bookings List Table */}
      {displayedList.length === 0 ? (
        <div className="py-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#F4F4F2] text-[#8A92A0] flex items-center justify-center mx-auto">
            <Calendar size={22} />
          </div>
          <p className="text-sm font-semibold text-[#5A6C5F]">No bookings found in this category.</p>
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="px-4 py-2 bg-[#0B2D1B] text-white rounded-full text-xs font-bold cursor-pointer"
          >
            Create a Slot Booking Now
          </button>
        </div>
      ) : (
        <div className="divide-y divide-[#F1F3F5] overflow-x-auto">
          {displayedList.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col gap-4 rounded-2xl border border-[#E8EAEC] bg-white p-4 transition-colors hover:bg-[#FCFCFA] md:border-0 md:px-2 md:py-4.5 lg:flex-row lg:items-center lg:justify-between"
            >
              {/* Left: Token & Crop Details */}
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#F4F4F2] border border-[#E8EAEC] flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-[#8A92A0] uppercase">Slot</span>
                  <span className="font-mono text-xs font-bold text-[#0B2D1B]">
                    {booking.tokenId.slice(-4)}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[#F4F4F2] border border-[#E2E5E9] rounded-md text-[#0B2D1B]">
                      {booking.tokenId}
                    </span>
                    <strong className="text-sm font-bold text-[#0B2D1B]">{booking.crop}</strong>

                    {/* Status Badge */}
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                        booking.status === "ARRIVED" || booking.status === "VERIFIED"
                          ? "bg-teal-50 text-teal-700 border-teal-200"
                          : booking.status === "IN_TRANSIT"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : booking.status === "COMPLETED"
                          ? "bg-[#E8F5E9] text-[#059669] border-emerald-200"
                          : booking.status === "ACCEPTED"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {statusLabel(booking.status)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#5A6C5F] flex-wrap">
                    <span>{booking.mandiName}</span>
                    <span>•</span>
                    <span className="font-semibold text-[#0B2D1B]">
                      {booking.quantityKg.toLocaleString("en-IN")} KG ({booking.quantityQuintals} Qtl)
                    </span>
                    <span>•</span>
                    <span>
                      Vehicle: <strong className="font-mono text-[#0B2D1B]">{booking.truckNumber}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Middle: Slot Schedule & Bay */}
              <div className="flex items-center gap-4 text-xs text-[#5A6C5F] pl-15 lg:pl-0">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-semibold text-[#0B2D1B]">
                    <Clock size={13} className="text-[#059669]" />
                    <span>{booking.slotDate}</span>
                  </div>
                  <div className="text-[11px] text-[#5A6C5F]">{booking.slotTime}</div>
                </div>

                <div className="border-l border-[#E8EAEC] pl-4 space-y-0.5">
                  <div className="text-[11px] text-[#8A92A0]">Assigned Hopper</div>
                  <div className="font-bold text-[#059669]">{booking.bayAssigned}</div>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2.5 pl-15 lg:pl-0 shrink-0">
                <div className="mr-2 text-right">
                  <div className="text-xs font-bold text-[#0B2D1B]">
                    ₹{booking.totalEstimatedPayout.toLocaleString("en-IN")}
                  </div>
                  <div className="text-[10px] text-[#5A6C5F]">@ ₹{booking.ratePerQtl}/Qtl</div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectBookingForQR(booking)}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F4F4F2] border border-[#E2E5E9] text-xs font-bold text-[#0B2D1B] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <QrCode size={14} className="text-[#059669]" />
                  <span>Digital Pass</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
