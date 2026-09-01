import React, { memo, useState } from "react";
import { Building2, MapPin, Sparkles, ArrowRight } from "lucide-react";
import type { SuggestedMandi } from "./FarmerDashboard";

interface SuggestedMandisSectionProps {
  mandis: SuggestedMandi[];
  onBookMandi: (mandi: SuggestedMandi) => void;
  hideHeader?: boolean;
}

export const SuggestedMandisSection = memo(function SuggestedMandisSection({
  mandis,
  onBookMandi,
  hideHeader = false,
}: SuggestedMandisSectionProps) {
  const [selectedCrops, setSelectedCrops] = useState<Record<string, string>>({});
  const cropOptions = ["Wheat", "Soybean", "Rice", "Mustard"];
  const rateForCrop = (mandi: SuggestedMandi, crop: string) => {
    const adjustment = crop === mandi.bestCrop.split(" ")[0] ? 1 : crop === "Soybean" ? 0.92 : crop === "Rice" ? 1.08 : 0.97;
    return Math.round(mandi.currentRateQtl * adjustment);
  };
  const crowdForSlots = (slots: number) => slots >= 10 ? { label: "Low", className: "bg-emerald-50 text-emerald-700 border-emerald-200" } : slots >= 7 ? { label: "Medium", className: "bg-amber-50 text-amber-700 border-amber-200" } : { label: "High", className: "bg-red-50 text-red-700 border-red-200" };
  return (
    <div className={`w-full bg-white rounded-3xl border border-[#E8EAEC] ${hideHeader ? "p-4 sm:p-5" : "p-6 sm:p-7 space-y-5"} shadow-sm text-left`}>
      {!hideHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1F3F5] pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#0B2D1B] flex items-center gap-2">
              <Building2 size={20} className="text-[#059669]" />
              <span>Suggested Mandis with Open Arrival Slots</span>
            </h2>
            <p className="text-xs text-[#5A6C5F] mt-0.5">
              AI recommended APMC yards sorted by proximity, best wholesale rates, and fast-track unloading hoppers.
            </p>
          </div>

          <div className="inline-flex items-center gap-1 text-xs font-bold text-[#059669] bg-[#E8F5E9] px-3 py-1.5 rounded-full border border-emerald-200">
            <Sparkles size={13} />
            <span>Real-Time Mandi Board Feed</span>
          </div>
        </div>
      )}

      {/* Mandi Cards Grid */}
      <div className="flex flex-wrap gap-5">
        {mandis.map((mandi) => {
          const selectedCrop = selectedCrops[mandi.id] || mandi.bestCrop.split(" ")[0];
          const crowd = crowdForSlots(mandi.availableSlotsToday);
          const currentRate = rateForCrop(mandi, selectedCrop);

          const nameWords = mandi.name.split(" ");
          const line1 = nameWords.length > 2 ? nameWords.slice(0, 2).join(" ") : mandi.name;
          const line2 = nameWords.length > 2 ? nameWords.slice(2).join(" ") : "";

          return (
            <div
              key={mandi.id}
              className="w-full sm:w-[325px] bg-white rounded-3xl border border-[#E8EAEC] p-4 sm:p-5 shadow-xs hover:border-[#DDE1E6] hover:shadow-sm transition-all flex flex-col justify-between space-y-4 text-left group"
            >
              <div className="space-y-3">
                {/* Header & Badge */}
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-base sm:text-lg text-[#0B2D1B] leading-snug">
                    {line2 ? (
                      <>
                        <span className="block">{line1}</span>
                        <span className="block">{line2}</span>
                      </>
                    ) : (
                      mandi.name
                    )}
                  </h3>
                  {mandi.badge && (
                    <span className="px-2.5 py-1 rounded-full bg-[#E8F5E9] text-[#059669] text-xs font-semibold shrink-0 border border-emerald-200 whitespace-nowrap">
                      {mandi.badge}
                    </span>
                  )}
                </div>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-xs text-[#5A6C5F]">
                  <MapPin size={14} className="text-[#8A92A0] shrink-0" />
                  <span>
                    {mandi.district} • {mandi.distanceKm} km away
                  </span>
                </div>

                {/* Middle Crop & Market Rate Box */}
                <div className="rounded-2xl bg-[#F8F9FA] border border-[#E8EAEC] p-3.5 sm:p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#5A6C5F]">Crop:</span>
                    <select
                      value={selectedCrop}
                      onChange={(e) =>
                        setSelectedCrops((current) => ({
                          ...current,
                          [mandi.id]: e.target.value,
                        }))
                      }
                      className="bg-white border border-[#D1D5DB] rounded-lg px-3 py-1.5 text-sm font-bold text-[#0B2D1B] focus:outline-none cursor-pointer shadow-2xs"
                    >
                      {cropOptions.map((crop) => (
                        <option key={crop} value={crop}>
                          {crop}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="border-b border-[#E5E7EB]" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#5A6C5F]">Market Rate:</span>
                    <span className="text-lg sm:text-xl font-bold text-[#0B2D1B]">
                      ₹{currentRate.toLocaleString("en-IN")}/Qtl
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between gap-2 text-xs sm:text-sm text-[#5A6C5F]">
                  <span className="font-medium text-[#5A6C5F] whitespace-nowrap">
                    Open Slots Today:
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${crowd.className}`}
                    >
                      {crowd.label}
                    </span>
                    <strong className="text-sm font-bold text-[#0B2D1B] whitespace-nowrap">
                      {mandi.availableSlotsToday} slots
                    </strong>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  type="button"
                  onClick={() => onBookMandi(mandi)}
                  className="w-full py-3 sm:py-3.5 px-4 rounded-2xl bg-[#0B2D1B] hover:bg-[#06180E] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all cursor-pointer"
                >
                  <span>Book Unloading Slot</span>
                  <ArrowRight size={15} className="text-[#C8F52F]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
