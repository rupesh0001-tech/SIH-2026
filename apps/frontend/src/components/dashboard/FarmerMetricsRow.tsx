import React, { memo } from "react";
import { Calendar, Scale, Truck, TrendingUp } from "lucide-react";

interface FarmerMetricsRowProps {
  totalBookingsCount: number;
  currentBookingsCount: number;
  previousBookingsCount: number;
  totalSalesKg: number;
  totalEstimatedRevenue: number;
  arrivedCount: number;
  inTransitCount: number;
  scheduledCount: number;
  avgRealization?: number;
}

export const FarmerMetricsRow = memo(function FarmerMetricsRow({
  totalBookingsCount,
  currentBookingsCount,
  previousBookingsCount: _previousBookingsCount,
  totalSalesKg,
  totalEstimatedRevenue: _totalEstimatedRevenue,
  arrivedCount: _arrivedCount,
  inTransitCount: _inTransitCount,
  scheduledCount: _scheduledCount,
  avgRealization = 2425,
}: FarmerMetricsRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 text-left">
      {/* 1. Total Bookings */}
      <div className="bg-white rounded-2xl border border-[#E8EAEC] p-5 space-y-2 shadow-xs hover:border-[#DDE1E6] transition-colors">
        <div className="flex items-center justify-between text-xs font-semibold text-[#5A6C5F]">
          <span>Total Bookings</span>
          <div className="w-8 h-8 rounded-xl bg-[#E8F5E9] text-[#059669] flex items-center justify-center">
            <Calendar size={16} />
          </div>
        </div>
        <div className="text-3xl font-bold text-[#0B2D1B]">
          {totalBookingsCount} <span className="text-xs font-semibold text-[#5A6C5F]">Slots</span>
        </div>
      </div>

      {/* 2. Total Sales in KG */}
      <div className="bg-white rounded-2xl border border-[#E8EAEC] p-5 space-y-2 shadow-xs hover:border-[#DDE1E6] transition-colors">
        <div className="flex items-center justify-between text-xs font-semibold text-[#5A6C5F]">
          <span>Total Produce Sales</span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Scale size={16} />
          </div>
        </div>
        <div className="text-3xl font-bold text-[#0B2D1B]">
          {totalSalesKg.toLocaleString("en-IN")}{" "}
          <span className="text-xs font-semibold text-[#5A6C5F]">KG</span>
        </div>
      </div>

      {/* 3. Active Booking Status */}
      <div className="bg-white rounded-2xl border border-[#E8EAEC] p-5 space-y-2 shadow-xs hover:border-[#DDE1E6] transition-colors">
        <div className="flex items-center justify-between text-xs font-semibold text-[#5A6C5F]">
          <span>Active Booking Status</span>
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Truck size={16} />
          </div>
        </div>
        <div className="text-3xl font-bold text-[#0B2D1B]">
          {currentBookingsCount}{" "}
          <span className="text-xs font-semibold text-[#5A6C5F]">In Pipeline</span>
        </div>
      </div>

      {/* 4. Average Mandi Price Realization */}
      <div className="bg-white rounded-2xl border border-[#E8EAEC] p-5 space-y-2 shadow-xs hover:border-[#DDE1E6] transition-colors">
        <div className="flex items-center justify-between text-xs font-semibold text-[#5A6C5F]">
          <span>Avg APMC Realization</span>
          <div className="w-8 h-8 rounded-xl bg-[#E8F5E9] text-[#059669] flex items-center justify-center">
            <TrendingUp size={16} />
          </div>
        </div>
        <div className="text-3xl font-bold text-[#0B2D1B]">
          ₹ {avgRealization.toLocaleString("en-IN")}{" "}
          <span className="text-xs font-semibold text-[#5A6C5F]">/ Qtl</span>
        </div>
      </div>
    </div>
  );
});
