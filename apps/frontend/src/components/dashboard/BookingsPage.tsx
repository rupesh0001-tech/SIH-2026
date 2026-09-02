import React, { memo, useState, useMemo, useCallback } from "react";
import {
  Search,
  Calendar,
  Clock,
  QrCode,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  MoreHorizontal,
  MapPin,
  Truck,
  Headphones,
  CheckCircle2,
  Timer,
  ArrowUpDown,
  Pencil,
  Trash2,
} from "lucide-react";
import type { FarmerBookingItem } from "../../interfaces";

interface BookingsPageProps {
  currentBookings: FarmerBookingItem[];
  previousBookings: FarmerBookingItem[];
  activeTab: "current" | "previous";
  setActiveTab: (tab: "current" | "previous") => void;
  onCreateBooking: () => void;
  onSelectBookingForQR: (booking: FarmerBookingItem) => void;
}

const ITEMS_PER_PAGE = 6;

const STATUS_OPTIONS = [
  "All Statuses",
  "Pending",
  "Accepted",
  "In Transit",
  "Arrived",
  "Completed",
];

const DATE_OPTIONS = ["All Dates", "Today", "Tomorrow", "This Week"];

function statusLabel(status: FarmerBookingItem["status"]): string {
  if (status === "ARRIVED" || status === "VERIFIED") return "Gate Arrived";
  if (status === "IN_TRANSIT") return "In Transit";
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function statusBadgeClass(status: FarmerBookingItem["status"]): string {
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

function matchesStatusFilter(
  status: FarmerBookingItem["status"],
  filter: string
): boolean {
  if (filter === "All Statuses") return true;
  const label = statusLabel(status).toLowerCase();
  return label === filter.toLowerCase();
}

function matchesDateFilter(slotDate: string, filter: string): boolean {
  if (filter === "All Dates") return true;
  const lower = slotDate.toLowerCase();
  if (filter === "Today") return lower.includes("today");
  if (filter === "Tomorrow") return lower.includes("tomorrow");
  return true;
}

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

export const BookingsPage = memo(function BookingsPage({
  currentBookings,
  previousBookings,
  activeTab,
  setActiveTab,
  onCreateBooking,
  onSelectBookingForQR,
}: BookingsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [mandiFilter, setMandiFilter] = useState("All Mandis");
  const [cropFilter, setCropFilter] = useState("All Crops");
  const [dateFilter, setDateFilter] = useState("All Dates");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const allBookings = useMemo(
    () => [...currentBookings, ...previousBookings],
    [currentBookings, previousBookings]
  );

  const sourceList = activeTab === "current" ? currentBookings : previousBookings;

  // Extract unique values for dropdowns
  const uniqueMandis = useMemo(() => {
    const set = new Set(allBookings.map((b) => b.mandiName));
    return ["All Mandis", ...Array.from(set)];
  }, [allBookings]);

  const uniqueCrops = useMemo(() => {
    const set = new Set(allBookings.map((b) => b.crop));
    return ["All Crops", ...Array.from(set)];
  }, [allBookings]);

  // Filtered list
  const filteredList = useMemo(() => {
    let result = [...sourceList];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.tokenId.toLowerCase().includes(q) ||
          b.mandiName.toLowerCase().includes(q) ||
          b.crop.toLowerCase().includes(q) ||
          b.truckNumber.toLowerCase().includes(q) ||
          b.mandiCode.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "All Statuses") {
      result = result.filter((b) => matchesStatusFilter(b.status, statusFilter));
    }

    if (mandiFilter !== "All Mandis") {
      result = result.filter((b) => b.mandiName === mandiFilter);
    }

    if (cropFilter !== "All Crops") {
      result = result.filter((b) => b.crop === cropFilter);
    }

    if (dateFilter !== "All Dates") {
      result = result.filter((b) => matchesDateFilter(b.slotDate, dateFilter));
    }

    return result;
  }, [sourceList, searchQuery, statusFilter, mandiFilter, cropFilter, dateFilter]);

  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE) || 1;

  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredList.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredList, currentPage]);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter("All Statuses");
    setMandiFilter("All Mandis");
    setCropFilter("All Crops");
    setDateFilter("All Dates");
    setCurrentPage(1);
  }, []);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    statusFilter !== "All Statuses" ||
    mandiFilter !== "All Mandis" ||
    cropFilter !== "All Crops" ||
    dateFilter !== "All Dates";

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedList.map((b) => b.id));
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
    paginatedList.length > 0 && selectedIds.length === paginatedList.length;

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 text-left">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0B2D1B] sm:text-3xl">
            Unload Order Bookings
          </h1>
          <p className="mt-1 text-xs text-[#5A6C5F] sm:text-sm">
            Track and manage gate arrivals, assigned hoppers, and settlement records.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateBooking}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0B2D1B] px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-black transition-colors cursor-pointer"
        >
          <span className="rounded-full bg-[#C8F52F] px-1.5 text-base leading-4 text-[#0B2D1B]">
            +
          </span>
          Create New Booking
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-3xl border border-[#E8EAEC] bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3">
          {/* Search Input */}
          <div className="relative w-full">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A92A0]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by order number, crop, mandi name, or vehicle number..."
              className="w-full rounded-2xl border border-[#E2E5E9] bg-[#F8F9FA] py-2.5 pl-10 pr-4 text-xs text-[#0B2D1B] placeholder-[#8A92A0] focus:border-[#059669] focus:bg-white focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8A92A0] hover:text-[#0B2D1B]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            <FilterDropdown
              value={statusFilter}
              onChange={(v) => {
                setStatusFilter(v);
                setCurrentPage(1);
              }}
              options={STATUS_OPTIONS}
            />

            <FilterDropdown
              value={mandiFilter}
              onChange={(v) => {
                setMandiFilter(v);
                setCurrentPage(1);
              }}
              options={uniqueMandis}
            />

            <FilterDropdown
              value={cropFilter}
              onChange={(v) => {
                setCropFilter(v);
                setCurrentPage(1);
              }}
              options={uniqueCrops}
            />

            <FilterDropdown
              value={dateFilter}
              onChange={(v) => {
                setDateFilter(v);
                setCurrentPage(1);
              }}
              options={DATE_OPTIONS}
            />

            {/* Clear Filters */}
            <button
              type="button"
              onClick={clearFilters}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[11px] font-bold transition-colors cursor-pointer ${
                hasActiveFilters
                  ? "border-[#059669] bg-white text-[#059669] hover:bg-[#E8F5E9]"
                  : "border-[#E2E5E9] bg-[#F8F9FA] text-[#8A92A0]"
              }`}
            >
              <RefreshCw size={12} />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Info + Tabs */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-[#5A6C5F]">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span>
            Showing{" "}
            <strong className="text-[#0B2D1B]">{filteredList.length}</strong> of{" "}
            <strong className="text-[#0B2D1B]">
              {currentBookings.length + previousBookings.length}
            </strong>{" "}
            orders
          </span>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1 rounded-full border border-[#E2E5E9] bg-white p-1 shadow-xs">
          <button
            type="button"
            onClick={() => {
              setActiveTab("current");
              setCurrentPage(1);
            }}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-bold transition-colors cursor-pointer ${
              activeTab === "current"
                ? "bg-[#059669] text-white shadow-sm"
                : "text-[#5A6C5F] hover:text-[#0B2D1B]"
            }`}
          >
            <CheckCircle2 size={13} />
            Active Bookings ({currentBookings.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("previous");
              setCurrentPage(1);
            }}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-bold transition-colors cursor-pointer ${
              activeTab === "previous"
                ? "bg-[#059669] text-white shadow-sm"
                : "text-[#5A6C5F] hover:text-[#0B2D1B]"
            }`}
          >
            <Timer size={13} />
            Previous History ({previousBookings.length})
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="w-full bg-white rounded-3xl border border-[#E8EAEC] shadow-sm text-left overflow-hidden">
        {paginatedList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Calendar size={32} className="text-[#B6E7C5]" />
            <p className="mt-3 text-sm font-semibold text-[#5A6C5F]">
              No bookings found
            </p>
            <p className="text-xs text-[#8A92A0]">
              {hasActiveFilters
                ? "Try adjusting your search or filters"
                : "Create a new booking to get started"}
            </p>
            {!hasActiveFilters && (
              <button
                type="button"
                onClick={onCreateBooking}
                className="mt-4 rounded-full bg-[#0B2D1B] px-5 py-2.5 text-xs font-bold text-white cursor-pointer hover:bg-black transition-colors"
              >
                Create a Slot Booking Now
              </button>
            )}
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
                {paginatedList.map((booking) => {
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

                      {/* Order Number */}
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
                        <div>
                          {booking.slotDate.replace("Today, ", "").replace("Tomorrow, ", "")}
                        </div>
                        <div className="text-[11px] text-[#8A92A0]">
                          {booking.slotTime}
                        </div>
                      </td>

                      {/* Status Pill Badge */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusBadgeClass(
                            booking.status
                          )}`}
                        >
                          {statusLabel(booking.status)}
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
                            onClick={onCreateBooking}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E5E9] bg-white text-[#5A6C5F] transition-colors hover:bg-[#F4F4F2] disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft size={14} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                page === currentPage
                  ? "bg-[#059669] text-white shadow-sm"
                  : "border border-[#E2E5E9] bg-white text-[#5A6C5F] hover:bg-[#F4F4F2]"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E5E9] bg-white text-[#5A6C5F] transition-colors hover:bg-[#F4F4F2] disabled:opacity-40 cursor-pointer"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Need Help? Support Card */}
      <div className="rounded-2xl border border-[#E8EAEC] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E8F5E9] text-[#059669]">
            <Headphones size={22} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-[#0B2D1B]">Need Help?</h3>
            <p className="text-xs text-[#5A6C5F]">
              Our support team is here to help you.
            </p>
          </div>
          <button
            type="button"
            className="rounded-xl bg-[#059669] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#047857] cursor-pointer"
          >
            Contact Support
          </button>
        </div>
      </div>
    </main>
  );
});

/* ─── Filter Dropdown Helpers ─────────────────────────────────── */
function FilterDropdown({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-xl border border-[#E2E5E9] bg-[#F8F9FA] px-3 py-2 text-[11px] font-semibold text-[#0B2D1B] focus:outline-none cursor-pointer"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
