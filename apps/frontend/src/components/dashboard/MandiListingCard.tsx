import React, { memo, useState } from "react";
import { MapPin, ArrowRight, Wheat } from "lucide-react";
import type { SuggestedMandi } from "./FarmerDashboard";

interface MandiListingCardProps {
  mandi: SuggestedMandi;
  onBookMandi: (mandi: SuggestedMandi) => void;
  onSelectMandi: (mandi: SuggestedMandi) => void;
  isSelected: boolean;
}

const CROP_OPTIONS = ["Wheat", "Soybean", "Rice", "Mustard", "Chana"];

function rateForCrop(mandi: SuggestedMandi, crop: string): number {
  const base = crop === mandi.bestCrop.split(" ")[0]
    ? 1
    : crop === "Soybean"
      ? 0.92
      : crop === "Rice"
        ? 1.08
        : crop === "Chana"
          ? 0.95
          : 0.97;
  return Math.round(mandi.currentRateQtl * base);
}

function slotBadge(slots: number) {
  if (slots >= 10) return { label: "Low", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  if (slots >= 7) return { label: "Medium", cls: "bg-amber-50 text-amber-700 border-amber-200" };
  return { label: "High", cls: "bg-red-50 text-red-700 border-red-200" };
}

export const MandiListingCard = memo(function MandiListingCard({
  mandi,
  onBookMandi,
  onSelectMandi,
  isSelected,
}: MandiListingCardProps) {
  const [selectedCrop, setSelectedCrop] = useState(mandi.bestCrop.split(" ")[0] || "Wheat");
  const crowd = slotBadge(mandi.availableSlotsToday);

  return (
    <div
      onClick={() => onSelectMandi(mandi)}
      className={`group flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md cursor-pointer ${
        isSelected
          ? "border-emerald-400 ring-2 ring-emerald-100"
          : "border-[#E8EAEC] hover:border-emerald-300"
      }`}
    >
      {/* Image */}
      <div className="relative h-32 w-full overflow-hidden bg-[#F0F2F5]">
        <img
          src={mandi.imageUrl}
          alt={mandi.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {mandi.badge && (
          <span className="absolute right-2 top-2 rounded-md border border-emerald-200 bg-white/90 px-2 py-0.5 text-[10px] font-bold text-[#059669] backdrop-blur-sm">
            {mandi.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
        <div className="space-y-1.5">
          <h3 className="text-sm font-bold leading-tight text-[#0B2D1B] group-hover:text-[#059669] transition-colors">
            {mandi.name}
          </h3>
          <div className="flex items-center gap-1.5 text-[11px] text-[#5A6C5F]">
            <MapPin size={12} className="shrink-0 text-[#8A92A0]" />
            <span>{mandi.district} • {mandi.distanceKm} km away</span>
          </div>
        </div>

        {/* Crop + Rate */}
        <div className="space-y-1.5 rounded-xl border border-[#E8EAEC] bg-[#FCFCFA] p-2.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1 text-[#5A6C5F]">
              <Wheat size={12} className="text-[#8A92A0]" />
              Crop
            </span>
            <select
              value={selectedCrop}
              onChange={(e) => { e.stopPropagation(); setSelectedCrop(e.target.value); }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-[110px] rounded-md border border-[#E2E5E9] bg-white px-1.5 py-0.5 text-[11px] font-bold text-[#0B2D1B] cursor-pointer"
            >
              {CROP_OPTIONS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1 text-[#5A6C5F]">
              <span className="text-[#8A92A0]">₹</span>
              Market Rate
            </span>
            <strong className="text-[#059669]">₹{rateForCrop(mandi, selectedCrop)}/Qtl</strong>
          </div>
        </div>

        {/* Slots + CTA */}
        <div className="space-y-2 border-t border-[#E8EAEC] pt-2.5">
          <div className="flex items-center justify-between text-[11px] text-[#5A6C5F]">
            <span>Open Slots Today:</span>
            <div className="flex items-center gap-2">
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${crowd.cls}`}>
                {crowd.label}
              </span>
              <strong className="text-[#0B2D1B]">{mandi.availableSlotsToday} slots</strong>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onBookMandi(mandi); }}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#0B2D1B] px-3 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#06180E] cursor-pointer"
          >
            <span>Book Unloading Slot</span>
            <ArrowRight size={13} className="text-[#C8F52F]" />
          </button>
        </div>
      </div>
    </div>
  );
});
