import React, { memo, useState } from "react";
import {
  ArrowUpDown,
  Pencil,
  Trash2,
  MoreHorizontal,
  QrCode,
  Calendar,
} from "lucide-react";
import type { FarmerBookingItem } from "../../interfaces";

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

function statusBadgeStyle(status: FarmerBookingItem["status"]) {
  switch (status) {
    case "ARRIVED":
    case "VERIFIED":
      return "bg-[#E6F4EA] text-[#0D652D] border border-emerald-200";
    case "IN_TRANSIT":
      return "bg-[#F3E8FF] text-[#7C3AED] border border-purple-200";
    case "ACCEPTED":
      return "bg-[#E8F0FE] text-[#1967D2] border border-blue-200";
    case "COMPLETED":
      return "bg-[#E8F5E9] text-[#059669] border border-emerald-200";
    case "CANCELLED":
      return "bg-[#FEE2E2] text-[#DC2626] border border-red-200";
    case "PENDING":
    default:
      return "bg-[#FEF3C7] text-[#D97706] border border-amber-200";
  }
}

function statusText(status: FarmerBookingItem["status"]) {
  if (status === "ARRIVED" || status === "VERIFIED") return "Gate Arrived";
  if (status === "IN_TRANSIT") return "In Transit";
  return status.charAt(0) + status.slice(1).toLowerCase();
}

// Avatar color helper based on crop name
function getCropAvatar(crop: string) {
  if (crop.toLowerCase().includes("wheat")) {
    return { bg: "bg-amber-100 text-amber-800", emoji: "🌾" };
  }
  if (crop.toLowerCase().includes("rice") || crop.toLowerCase().includes("basmati")) {
    return { bg: "bg-emerald-100 text-emerald-800", emoji: "🍚" };
  }
  if (crop.toLowerCase().includes("soybean")) {
    return { bg: "bg-yellow-100 text-yellow-800", emoji: "🌱" };
  }
  if (crop.toLowerCase().includes("maize") || crop.toLowerCase().includes("corn")) {
    return { bg: "bg-orange-100 text-orange-800", emoji: "🌽" };
  }
  return { bg: "bg-teal-100 text-teal-800", emoji: "📦" };
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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(displayedList.map((b) => b.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const allSelected =
    displayedList.length > 0 && selectedIds.length === displayedList.length;

  return (
    <div className="w-full bg-white rounded-3xl border border-[#E8EAEC] shadow-sm text-left overflow-hidden">
      {/* Header & Tabs */}
      {!hideHeader && (
        <div className="p-6 sm:p-7 pb-4 border-b border-[#F1F3F5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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

          {/* Tab Switcher */}
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

      {/* Table Content */}
      {displayedList.length === 0 ? (
        <div className="py-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#F4F4F2] text-[#8A92A0] flex items-center justify-center mx-auto">
            <Calendar size={22} />
          </div>
          <p className="text-sm font-semibold text-[#5A6C5F]">
            No bookings found in this category.
          </p>
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="px-4 py-2 bg-[#0B2D1B] text-white rounded-full text-xs font-bold cursor-pointer hover:bg-black transition-colors"
          >
            Create a Slot Booking Now
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-left text-xs">
            {/* Table Header Row */}
            <thead>
              <tr className="border-b border-[#E8EAEC] bg-[#FCFCFA] text-[#6C727F]">
                <th className="w-12 py-3.5 pl-5 pr-2">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-[#DCE0E5] text-[#0B2D1B] focus:ring-0 cursor-pointer accent-[#0B2D1B]"
                  />
                </th>
                <th className="px-4 py-3.5 font-semibold whitespace-nowrap">
                  <div className="inline-flex items-center gap-1 cursor-pointer select-none">
                    <span>Order Number</span>
                    <ArrowUpDown size={12} className="text-[#9EA5B1]" />
                  </div>
                </th>
                <th className="px-4 py-3.5 font-semibold whitespace-nowrap">
                  <div className="inline-flex items-center gap-1 cursor-pointer select-none">
                    <span>Customer Name</span>
                    <ArrowUpDown size={12} className="text-[#9EA5B1]" />
                  </div>
                </th>
                <th className="px-4 py-3.5 font-semibold whitespace-nowrap">
                  <div className="inline-flex items-center gap-1 cursor-pointer select-none">
                    <span>Order Date</span>
                    <ArrowUpDown size={12} className="text-[#9EA5B1]" />
                  </div>
                </th>
                <th className="px-4 py-3.5 font-semibold whitespace-nowrap">
                  <div className="inline-flex items-center gap-1 cursor-pointer select-none">
                    <span>Status</span>
                    <ArrowUpDown size={12} className="text-[#9EA5B1]" />
                  </div>
                </th>
                <th className="px-4 py-3.5 font-semibold whitespace-nowrap">
                  <div className="inline-flex items-center gap-1 cursor-pointer select-none">
                    <span>Total Amount</span>
                    <ArrowUpDown size={12} className="text-[#9EA5B1]" />
                  </div>
                </th>
                <th className="px-4 py-3.5 font-semibold whitespace-nowrap">
                  <div className="inline-flex items-center gap-1 cursor-pointer select-none">
                    <span>Payment Status</span>
                    <ArrowUpDown size={12} className="text-[#9EA5B1]" />
                  </div>
                </th>
                <th className="py-3.5 pl-4 pr-6 font-semibold text-right whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>

            {/* Table Body Rows */}
            <tbody className="divide-y divide-[#F1F3F5] bg-white">
              {displayedList.map((booking) => {
                const isSelected = selectedIds.includes(booking.id);
                const avatar = getCropAvatar(booking.crop);
                const paymentStatus =
                  booking.status === "COMPLETED"
                    ? "Paid"
                    : booking.status === "ARRIVED"
                    ? "In Process"
                    : "Unpaid";

                return (
                  <tr
                    key={booking.id}
                    className={`transition-colors hover:bg-[#F9FAFB] ${
                      isSelected ? "bg-[#F4F9F5]" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-4 pl-5 pr-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleRow(booking.id)}
                        className="h-4 w-4 rounded border-[#DCE0E5] text-[#0B2D1B] focus:ring-0 cursor-pointer accent-[#0B2D1B]"
                      />
                    </td>

                    {/* Order / Token Number */}
                    <td className="px-4 py-4 font-semibold text-[#111315] whitespace-nowrap">
                      #{booking.tokenId.replace("TKN-", "ORD")}
                    </td>

                    {/* Customer / Crop with Avatar */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${avatar.bg}`}
                        >
                          <span>{avatar.emoji}</span>
                        </div>
                        <div>
                          <div className="font-semibold text-[#111315]">
                            {booking.crop}
                          </div>
                          <div className="text-[11px] text-[#8A92A0]">
                            {booking.mandiName}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Order Date */}
                    <td className="px-4 py-4 text-[#5A6C5F] whitespace-nowrap">
                      <div>{booking.slotDate.replace("Today, ", "").replace("Tomorrow, ", "")}</div>
                      <div className="text-[11px] text-[#8A92A0]">{booking.slotTime}</div>
                    </td>

                    {/* Status Pill Badge */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusBadgeStyle(
                          booking.status
                        )}`}
                      >
                        {statusText(booking.status)}
                      </span>
                    </td>

                    {/* Total Amount */}
                    <td className="px-4 py-4 font-semibold text-[#111315] whitespace-nowrap">
                      ₹{booking.totalEstimatedPayout.toLocaleString("en-IN")}
                    </td>

                    {/* Payment Status */}
                    <td className="px-4 py-4 font-medium text-[#5A6C5F] whitespace-nowrap">
                      <span
                        className={
                          paymentStatus === "Paid"
                            ? "text-[#059669] font-semibold"
                            : paymentStatus === "In Process"
                            ? "text-[#2563EB] font-semibold"
                            : "text-[#5A6C5F]"
                        }
                      >
                        {paymentStatus}
                      </span>
                    </td>

                    {/* Action Icons */}
                    <td className="py-4 pl-4 pr-6 whitespace-nowrap text-right">
                      <div className="inline-flex items-center justify-end gap-2.5 text-[#6C727F]">
                        {/* Digital Pass (QR modal) */}
                        <button
                          type="button"
                          onClick={() => onSelectBookingForQR(booking)}
                          title="Digital Pass (QR Code)"
                          className="p-1 hover:text-[#059669] transition-colors cursor-pointer"
                        >
                          <QrCode size={15} />
                        </button>

                        {/* Edit icon */}
                        <button
                          type="button"
                          onClick={onOpenCreateModal}
                          title="Edit Booking"
                          className="p-1 hover:text-[#111315] transition-colors cursor-pointer"
                        >
                          <Pencil size={15} />
                        </button>

                        {/* Trash icon */}
                        <button
                          type="button"
                          title="Cancel Booking"
                          className="p-1 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>

                        {/* More menu icon */}
                        <button
                          type="button"
                          title="More options"
                          className="p-1 hover:text-[#111315] transition-colors cursor-pointer"
                        >
                          <MoreHorizontal size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
});
