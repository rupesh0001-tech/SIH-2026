import React, { memo, useState, useMemo, useCallback } from "react";
import { Search, MapPin, ChevronLeft, ChevronRight, List, Map as MapIcon } from "lucide-react";
import type { SuggestedMandi } from "./FarmerDashboard";
import { SUGGESTED_MANDIS } from "./FarmerDashboard";
import { MandiListingCard } from "./MandiListingCard";
import { FindMandiMap } from "./FindMandiMap";

interface FindMandiPageProps {
  onBookMandi: (mandi: SuggestedMandi) => void;
}

const ITEMS_PER_PAGE = 6;
const ALL_STATES = ["Madhya Pradesh", "Maharashtra", "Rajasthan"];
const ALL_CROPS = ["All Crops", "Wheat", "Soybean", "Rice", "Mustard", "Chana"];
const SORT_OPTIONS = ["Nearest First", "Highest Rate", "Most Slots"];

export const FindMandiPage = memo(function FindMandiPage({ onBookMandi }: FindMandiPageProps) {
  // Search & filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("Madhya Pradesh");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [selectedCrop, setSelectedCrop] = useState("All Crops");
  const [rateMin, setRateMin] = useState("");
  const [rateMax, setRateMax] = useState("");
  const [sorting, setSorting] = useState("Nearest First");

  // View and selection state
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [selectedMandiId, setSelectedMandiId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Extract unique districts from data
  const districts = useMemo(() => {
    const uniqueDistricts = Array.from(new Set(SUGGESTED_MANDIS.map((m) => m.district.split(",")[0]!.trim())));
    return ["All Districts", ...uniqueDistricts];
  }, []);

  // Filtered mandis
  const filteredMandis = useMemo(() => {
    let result = [...SUGGESTED_MANDIS];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.district.toLowerCase().includes(q) ||
          m.bestCrop.toLowerCase().includes(q)
      );
    }

    // State filter
    if (selectedState && selectedState !== "All States") {
      result = result.filter((m) => m.state === selectedState);
    }

    // District filter
    if (selectedDistrict && selectedDistrict !== "All Districts") {
      result = result.filter((m) => m.district.startsWith(selectedDistrict));
    }

    // Crop filter
    if (selectedCrop && selectedCrop !== "All Crops") {
      result = result.filter((m) => m.bestCrop.toLowerCase().includes(selectedCrop.toLowerCase()));
    }

    // Rate filter
    const min = Number(rateMin);
    const max = Number(rateMax);
    if (min > 0) result = result.filter((m) => m.currentRateQtl >= min);
    if (max > 0) result = result.filter((m) => m.currentRateQtl <= max);

    // Sorting
    if (sorting === "Nearest First") result.sort((a, b) => a.distanceKm - b.distanceKm);
    else if (sorting === "Highest Rate") result.sort((a, b) => b.currentRateQtl - a.currentRateQtl);
    else if (sorting === "Most Slots") result.sort((a, b) => b.availableSlotsToday - a.availableSlotsToday);

    return result;
  }, [searchQuery, selectedState, selectedDistrict, selectedCrop, rateMin, rateMax, sorting]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredMandis.length / ITEMS_PER_PAGE));
  const paginatedMandis = useMemo(
    () => filteredMandis.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [filteredMandis, currentPage]
  );

  const handleSelectMandi = useCallback((mandi: SuggestedMandi) => {
    setSelectedMandiId((prev) => (prev === mandi.id ? null : mandi.id));
  }, []);

  const handleSearch = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return (
    <main className="mx-auto w-full max-w-6xl space-y-5 px-4 py-6 sm:px-6 sm:py-8">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0B2D1B] text-lg text-[#C8F52F] shadow-sm">
          <img src="https://www.flaticon.com/free-icon/gps_14035502"/>
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#0B2D1B] sm:text-2xl">Find Mandi</h1>
          <p className="text-xs text-[#5A6C5F] sm:text-sm">Digital Mandi Unloading Gateway</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-2xl border border-[#E8EAEC] bg-white p-4 shadow-sm sm:p-5">
        {/* Search Row */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A92A0]" />
            <input
              type="text"
              placeholder="Search mandi by name, district or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full rounded-xl border border-[#E2E5E9] bg-[#F8F9FA] py-2.5 pl-10 pr-3 text-xs text-[#0B2D1B] placeholder-[#8A92A0] focus:border-[#059669] focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={handleSearch}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#059669] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#047857] cursor-pointer"
          >
            <Search size={14} />
            Search
          </button>
        </div>

        {/* Filter Row */}
        <div className="mt-3 flex flex-wrap items-center gap-2.5 border-t border-[#F1F3F5] pt-3">
          <FilterSelect
            icon=""
            label="State"
            value={selectedState}
            onChange={(v) => { setSelectedState(v); setCurrentPage(1); }}
            options={ALL_STATES}
          />
          <FilterSelect
            icon=""
            label="District"
            value={selectedDistrict}
            onChange={(v) => { setSelectedDistrict(v); setCurrentPage(1); }}
            options={districts}
          />
          <FilterSelect
            icon=""
            label="Crop"
            value={selectedCrop}
            onChange={(v) => { setSelectedCrop(v); setCurrentPage(1); }}
            options={ALL_CROPS}
          />
          <div className="flex items-center gap-1.5 rounded-xl border border-[#E2E5E9] bg-[#F8F9FA] px-2.5 py-1.5">
            <span className="text-[11px] text-[#5A6C5F]">₹</span>
            <input
              type="number"
              placeholder="Min"
              value={rateMin}
              onChange={(e) => { setRateMin(e.target.value); setCurrentPage(1); }}
              className="w-14 bg-transparent text-[11px] text-[#0B2D1B] placeholder-[#8A92A0] focus:outline-none"
            />
            <span className="text-[10px] text-[#8A92A0]">-</span>
            <input
              type="number"
              placeholder="Max"
              value={rateMax}
              onChange={(e) => { setRateMax(e.target.value); setCurrentPage(1); }}
              className="w-14 bg-transparent text-[11px] text-[#0B2D1B] placeholder-[#8A92A0] focus:outline-none"
            />
          </div>
          <FilterSelect
            icon=""
            label="Sorting"
            value={sorting}
            onChange={(v) => { setSorting(v); setCurrentPage(1); }}
            options={SORT_OPTIONS}
          />
        </div>
      </div>

      {/* Listings Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-[#0B2D1B] sm:text-lg">
            Mandi Listings ({filteredMandis.length} found)
          </h2>
          <p className="text-[11px] text-[#5A6C5F]">Live crop rates, open slots and real-time info</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-[#E2E5E9] bg-white p-1 shadow-xs">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-colors cursor-pointer ${
              viewMode === "list"
                ? "bg-[#059669] text-white shadow-sm"
                : "text-[#5A6C5F] hover:text-[#0B2D1B]"
            }`}
          >
            <List size={13} />
            List View
          </button>
          <button
            type="button"
            onClick={() => setViewMode("map")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-colors cursor-pointer ${
              viewMode === "map"
                ? "bg-[#059669] text-white shadow-sm"
                : "text-[#5A6C5F] hover:text-[#0B2D1B]"
            }`}
          >
            <MapIcon size={13} />
            Map View
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex flex-col gap-5 lg:flex-row">
        {/* Left: Mandi Cards */}
        <div className={`space-y-4 ${viewMode === "map" ? "hidden lg:block" : ""} w-full lg:w-[62%]`}>
          {paginatedMandis.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-[#DCE0E5] bg-[#FCFCFA] text-center">
              <MapPin size={28} className="text-[#B6E7C5]" />
              <p className="mt-2 text-sm font-semibold text-[#5A6C5F]">No mandis found</p>
              <p className="text-xs text-[#8A92A0]">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {paginatedMandis.map((mandi) => (
                <MandiListingCard
                  key={mandi.id}
                  mandi={mandi}
                  onBookMandi={onBookMandi}
                  onSelectMandi={handleSelectMandi}
                  isSelected={selectedMandiId === mandi.id}
                />
              ))}
            </div>
          )}

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
        </div>

        {/* Right: Map */}
        <div className={`${viewMode === "list" ? "hidden lg:block" : ""} w-full lg:w-[38%] lg:sticky lg:top-24 lg:self-start`}>
          <FindMandiMap
            mandis={filteredMandis}
            selectedMandiId={selectedMandiId}
            onSelectMandi={handleSelectMandi}
          />
        </div>
      </div>
    </main>
  );
});

/* ─── Small filter dropdown helper ─────────────────────────────── */
function FilterSelect({
  icon,
  label,
  value,
  onChange,
  options,
}: {
  icon: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-xl border border-[#E2E5E9] bg-[#F8F9FA] px-2.5 py-1.5">
      <span className="text-sm">{icon}</span>
      <span className="hidden text-[11px] text-[#5A6C5F] sm:inline">{label}</span>
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
