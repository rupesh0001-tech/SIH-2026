import React, { memo, useState, useMemo, useCallback } from "react";
import {
  Search,
  Calendar,
  Clock,
  QrCode,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  MoreVertical,
  MapPin,
  Truck,
  Headphones,
  CheckCircle2,
  Timer,
} from "lucide-react";
import type { FarmerBookingItem } from "./FarmerDashboard";

interface BookingsPageProps {
  currentBookings: FarmerBookingItem[];
  previousBookings: FarmerBookingItem[];
  activeTab: "current" | "previous";
  setActiveTab: (tab: "current" | "previous") => void;
  onCreateBooking: () => void;
  onSelectBookingForQR: (booking: FarmerBookingItem) => void;
}

const ITEMS_PER_PAGE = 4;

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
  if (status === "ARRIVED" || status === "VERIFIED")
    return "bg-teal-50 text-teal-700 border-teal-200";
  if (status === "IN_TRANSIT")
    return "bg-purple-50 text-purple-700 border-purple-200";
  if (status === "ACCEPTED")
    return "bg-blue-50 text-blue-700 border-blue-200";
  if (status === "PENDING")
    return "bg-amber-50 text-amber-700 border-amber-200";
  if (status === "COMPLETED")
    return "bg-[#E8F5E9] text-[#059669] border-emerald-200";
  if (status === "CANCELLED")
    return "bg-red-50 text-red-700 border-red-200";
  return "bg-gray-50 text-gray-700 border-gray-200";
}

function matchesStatusFilter(
  status: FarmerBookingItem["status"],
  filter: string
): boolean {
  if (filter === "All Statuses") return true;
  const label = statusLabel(status).toLowerCase();
  return label === filter.toLowerCase();
}

function matchesDateFilter(
  slotDate: string,
  filter: string
): boolean {
  if (filter === "All Dates") return true;
  const lower = slotDate.toLowerCase();
  if (filter === "Today") return lower.includes("today");
  if (filter === "Tomorrow") return lower.includes("tomorrow");
  // "This Week" matches everything for simplicity since all mock data is this week
  return true;
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

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredList.length / ITEMS_PER_PAGE));
  const paginatedList = useMemo(
    () =>
      filteredList.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      ),
    [filteredList, currentPage]
  );

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter("All Statuses");
    setMandiFilter("All Mandis");
    setCropFilter("All Crops");
    setDateFilter("All Dates");
    setCurrentPage(1);
  }, []);

  const hasActiveFilters =
    searchQuery.trim() ||
    statusFilter !== "All Statuses" ||
    mandiFilter !== "All Mandis" ||
    cropFilter !== "All Crops" ||
    dateFilter !== "All Dates";

  // Reset page on filter change
  const updateFilter = <T,>(setter: React.Dispatch<React.SetStateAction<T>>) => (val: T) => {
    setter(val);
    setCurrentPage(1);
  };

  return (
    <main className="mx-auto w-full max-w-6xl space-y-5 px-4 py-6 sm:px-6 sm:py-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0B2D1B]">Bookings</h1>
        <p className="mt-1 text-sm text-[#5A6C5F]">
          Manage active unloading slots, previous deliveries, and digital passes.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-2xl border border-[#E8EAEC] bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A92A0]"
            />
            <input
              type="text"
              placeholder="Search by booking ID, mandi, crop or vehicle..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-[#E2E5E9] bg-[#F8F9FA] py-2.5 pl-10 pr-3 text-xs text-[#0B2D1B] placeholder-[#8A92A0] focus:border-[#059669] focus:outline-none"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            <FilterDropdown
              value={statusFilter}
              onChange={updateFilter(setStatusFilter)}
              options={STATUS_OPTIONS}
            />
            <FilterDropdown
              value={mandiFilter}
              onChange={updateFilter(setMandiFilter)}
              options={uniqueMandis}
            />
            <FilterDropdown
              value={cropFilter}
              onChange={updateFilter(setCropFilter)}
              options={uniqueCrops}
            />
            <FilterDropdownWithIcon
              icon={<Calendar size={13} className="text-[#8A92A0]" />}
              value={dateFilter}
              onChange={updateFilter(setDateFilter)}
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
            bookings
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

      {/* Booking Rows */}
      <div className="space-y-3">
        {paginatedList.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#DCE0E5] bg-white py-16 text-center">
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
                className="mt-4 rounded-full bg-[#0B2D1B] px-5 py-2.5 text-xs font-bold text-white cursor-pointer"
              >
                Create a Slot Booking Now
              </button>
            )}
          </div>
        ) : (
          paginatedList.map((booking) => (
            <BookingRow
              key={booking.id}
              booking={booking}
              onSelectBookingForQR={onSelectBookingForQR}
            />
          ))
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

/* ─── Individual Booking Row ──────────────────────────────────── */
const BookingRow = memo(function BookingRow({
  booking,
  onSelectBookingForQR,
}: {
  booking: FarmerBookingItem;
  onSelectBookingForQR: (booking: FarmerBookingItem) => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#E8EAEC] bg-white p-4 shadow-sm transition-colors hover:border-emerald-200 hover:shadow-md sm:p-5 lg:flex-row lg:items-center lg:justify-between">
      {/* Left: Slot + Crop Details */}
      <div className="flex items-start gap-4 sm:items-center">
        {/* Slot Number Box */}
        <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl border border-[#E8EAEC] bg-[#F8F9FA]">
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#8A92A0]">
            SLOT
          </span>
          <span className="font-mono text-base font-bold leading-tight text-[#0B2D1B]">
            {booking.tokenId.slice(-4)}
          </span>
        </div>

        {/* Crop & Details */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-[#E2E5E9] bg-[#F4F4F2] px-2 py-0.5 font-mono text-[11px] font-bold text-[#0B2D1B]">
              {booking.tokenId}
            </span>
            <strong className="text-sm font-bold text-[#0B2D1B]">
              {booking.crop}
            </strong>
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusBadgeClass(
                booking.status
              )}`}
            >
              {statusLabel(booking.status)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-[#5A6C5F]">
            <span className="inline-flex items-center gap-1">
              <MapPin size={11} className="text-[#8A92A0]" />
              {booking.mandiName}
            </span>
            <span className="text-[#DCE0E5]">•</span>
            <span className="inline-flex items-center gap-1">
              <Truck size={11} className="text-[#8A92A0]" />
              {booking.quantityKg.toLocaleString("en-IN")} KG (
              {booking.quantityQuintals} Qtl)
            </span>
            <span className="text-[#DCE0E5]">•</span>
            <span>
              Vehicle:{" "}
              <strong className="font-mono text-[#0B2D1B]">
                {booking.truckNumber}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Middle: Schedule + Bay */}
      <div className="flex items-center gap-5 pl-[4.5rem] text-xs text-[#5A6C5F] lg:pl-0">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 font-semibold text-[#0B2D1B]">
            <Calendar size={13} className="text-[#059669]" />
            <span>{booking.slotDate}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#5A6C5F]">
            <Clock size={11} className="text-[#8A92A0]" />
            <span>{booking.slotTime}</span>
          </div>
        </div>

        <div className="space-y-0.5 border-l border-[#E8EAEC] pl-5">
          <div className="text-[10px] font-medium text-[#8A92A0]">
            Assigned Hopper
          </div>
          <div className="text-xs font-bold text-[#059669]">
            {booking.bayAssigned}
          </div>
        </div>
      </div>

      {/* Right: Amount + Actions */}
      <div className="flex items-center gap-3 pl-[4.5rem] lg:pl-0">
        <div className="mr-1 text-right">
          <div className="text-sm font-bold text-[#0B2D1B]">
            ₹{booking.totalEstimatedPayout.toLocaleString("en-IN")}
          </div>
          <div className="text-[10px] text-[#5A6C5F]">
            @ ₹{booking.ratePerQtl}/Qtl
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSelectBookingForQR(booking)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E5E9] bg-white px-3.5 py-2 text-xs font-bold text-[#0B2D1B] shadow-xs transition-colors hover:bg-[#F4F4F2] cursor-pointer"
        >
          <QrCode size={14} className="text-[#059669]" />
          <span>Digital Pass</span>
        </button>

        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E5E9] bg-white text-[#8A92A0] transition-colors hover:bg-[#F4F4F2] cursor-pointer"
        >
          <MoreVertical size={14} />
        </button>
      </div>
    </div>
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

function FilterDropdownWithIcon({
  icon,
  value,
  onChange,
  options,
}: {
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E5E9] bg-[#F8F9FA] px-2.5 py-1.5">
      {icon}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-[11px] font-semibold text-[#0B2D1B] focus:outline-none cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
