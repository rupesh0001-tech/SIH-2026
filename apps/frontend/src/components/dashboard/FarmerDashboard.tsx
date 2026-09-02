import React, { useState, memo, useMemo } from "react";
import { Plus, History, LogOut } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store";
import { logout } from "../../store/slices/authSlice";

// Modular Dashboard Components
import { FarmerMetricsRow } from "./FarmerMetricsRow";
import { SuggestedMandisSection } from "./SuggestedMandisSection";
import { BookingsTableSection } from "./BookingsTableSection";
import { RecentMessagesSection } from "./RecentMessagesSection";
import { CreateBookingModal } from "./CreateBookingModal";
import { DigitalPassModal } from "./DigitalPassModal";

// ================= TYPES =================
export interface FarmerBookingItem {
  id: string;
  tokenId: string;
  mandiName: string;
  mandiCode: string;
  crop: string;
  quantityKg: number;
  quantityQuintals: number;
  slotDate: string;
  slotTime: string;
  bayAssigned: string;
  truckNumber: string;
  status: "PENDING" | "ACCEPTED" | "IN_TRANSIT" | "ARRIVED" | "VERIFIED" | "COMPLETED" | "CANCELLED";
  ratePerQtl: number;
  totalEstimatedPayout: number;
}

export interface SuggestedMandi {
  id: string;
  name: string;
  district: string;
  state: string;
  distanceKm: number;
  operatingHours: string;
  bestCrop: string;
  currentRateQtl: number;
  mspRateQtl: number;
  availableSlotsToday: number;
  recommendedSlotTime: string;
  badge?: string;
  lat: number;
  lng: number;
  imageUrl: string;
}

export interface YardMessage {
  id: string;
  title: string;
  time: string;
  type: "GATE" | "PAYMENT" | "PRICE_ALERT" | "INFO";
  content: string;
  isRead?: boolean;
}

// ================= STATIC MOCK DATA =================
export const INITIAL_BOOKINGS: FarmerBookingItem[] = [
  {
    id: "b-1",
    tokenId: "TKN-7821",
    mandiName: "Indore APMC Central Grain Yard",
    mandiCode: "APMC-IND-042",
    crop: "Wheat (Sharbati Gold)",
    quantityKg: 12000,
    quantityQuintals: 120,
    slotDate: "Today, 31 Aug 2026",
    slotTime: "10:00 AM - 11:30 AM",
    bayAssigned: "Bay 03 (Fast Hopper)",
    truckNumber: "MP-09-AB-4821",
    status: "ARRIVED",
    ratePerQtl: 2425,
    totalEstimatedPayout: 291000,
  },
  {
    id: "b-2",
    tokenId: "TKN-6410",
    mandiName: "Ujjain Grain Mandi",
    mandiCode: "APMC-UJJ-019",
    crop: "Soybean (Yellow JS-9560)",
    quantityKg: 8000,
    quantityQuintals: 80,
    slotDate: "Today, 31 Aug 2026",
    slotTime: "02:00 PM - 03:30 PM",
    bayAssigned: "Bay 01 (Bulk Intake)",
    truckNumber: "MP-09-CX-1934",
    status: "IN_TRANSIT",
    ratePerQtl: 4890,
    totalEstimatedPayout: 391200,
  },
  {
    id: "b-3",
    tokenId: "TKN-9102",
    mandiName: "Dewas APMC Yard",
    mandiCode: "APMC-DWS-011",
    crop: "Rice (Basmati 1121)",
    quantityKg: 6500,
    quantityQuintals: 65,
    slotDate: "Tomorrow, 01 Sep 2026",
    slotTime: "08:30 AM - 10:00 AM",
    bayAssigned: "Bay 02 (Silo Direct)",
    truckNumber: "MP-41-GA-3320",
    status: "ACCEPTED",
    ratePerQtl: 3850,
    totalEstimatedPayout: 250250,
  },
  {
    id: "b-4",
    tokenId: "TKN-3381",
    mandiName: "Dhar Krishi Upaj Mandi",
    mandiCode: "APMC-DHR-007",
    crop: "Mustard (Sarson Bold)",
    quantityKg: 8000,
    quantityQuintals: 80,
    slotDate: "02 Sep 2026",
    slotTime: "11:00 AM - 12:30 PM",
    bayAssigned: "Bay 04 (Oilseed Deck)",
    truckNumber: "MP-11-TR-9014",
    status: "PENDING",
    ratePerQtl: 5650,
    totalEstimatedPayout: 452000,
  },
  {
    id: "b-5",
    tokenId: "TKN-5510",
    mandiName: "Indore APMC Central Grain Yard",
    mandiCode: "APMC-IND-042",
    crop: "Wheat (Lokwan Premium)",
    quantityKg: 15000,
    quantityQuintals: 150,
    slotDate: "24 Aug 2026",
    slotTime: "09:00 AM - 11:00 AM",
    bayAssigned: "Bay 02",
    truckNumber: "MP-09-AB-4821",
    status: "COMPLETED",
    ratePerQtl: 2380,
    totalEstimatedPayout: 357000,
  },
  {
    id: "b-6",
    tokenId: "TKN-4190",
    mandiName: "Ujjain Grain Mandi",
    mandiCode: "APMC-UJJ-019",
    crop: "Gram / Chana (Desi)",
    quantityKg: 9000,
    quantityQuintals: 90,
    slotDate: "18 Aug 2026",
    slotTime: "01:30 PM - 03:00 PM",
    bayAssigned: "Bay 01",
    truckNumber: "MP-09-CX-1934",
    status: "COMPLETED",
    ratePerQtl: 5800,
    totalEstimatedPayout: 522000,
  },
  {
    id: "b-7",
    tokenId: "TKN-2884",
    mandiName: "Indore APMC Central Grain Yard",
    mandiCode: "APMC-IND-042",
    crop: "Soybean (Yellow JS-335)",
    quantityKg: 11000,
    quantityQuintals: 110,
    slotDate: "10 Aug 2026",
    slotTime: "10:30 AM - 12:00 PM",
    bayAssigned: "Bay 03",
    truckNumber: "MP-09-AB-4821",
    status: "COMPLETED",
    ratePerQtl: 4750,
    totalEstimatedPayout: 522500,
  },
];

export const SUGGESTED_MANDIS: SuggestedMandi[] = [
  {
    id: "m-1",
    name: "Indore APMC Central Grain Yard",
    district: "Indore, MP",
    state: "Madhya Pradesh",
    distanceKm: 4.8,
    operatingHours: "07:00 AM - 06:00 PM",
    bestCrop: "Wheat (Sharbati)",
    currentRateQtl: 2425,
    mspRateQtl: 2275,
    availableSlotsToday: 8,
    recommendedSlotTime: "Today • 03:00 PM - 04:30 PM",
    badge: "Fastest Clearance",
    lat: 22.7196,
    lng: 75.8577,
    imageUrl: "/images/mandis/indore.jpg",
  },
  {
    id: "m-2",
    name: "Ujjain Krishi Upaj Mandi",
    district: "Ujjain, MP",
    state: "Madhya Pradesh",
    distanceKm: 14.2,
    operatingHours: "08:00 AM - 05:30 PM",
    bestCrop: "Soybean (Yellow)",
    currentRateQtl: 4890,
    mspRateQtl: 4600,
    availableSlotsToday: 5,
    recommendedSlotTime: "Today • 04:00 PM - 05:30 PM",
    badge: "Highest Bidder",
    lat: 23.1765,
    lng: 75.7885,
    imageUrl: "/images/mandis/ujjain.jpg",
  },
  {
    id: "m-3",
    name: "Dewas APMC Terminal",
    district: "Dewas, MP",
    state: "Madhya Pradesh",
    distanceKm: 18.6,
    operatingHours: "07:30 AM - 06:00 PM",
    bestCrop: "Wheat (Lokwan)",
    currentRateQtl: 3850,
    mspRateQtl: 3200,
    availableSlotsToday: 12,
    recommendedSlotTime: "Tomorrow • 09:00 AM - 10:30 AM",
    badge: "Zero Gate Line",
    lat: 22.9623,
    lng: 76.0508,
    imageUrl: "/images/mandis/dewas.jpg",
  },
  {
    id: "m-4",
    name: "Dhar District Grain Mandi",
    district: "Dhar, MP",
    state: "Madhya Pradesh",
    distanceKm: 28.0,
    operatingHours: "08:00 AM - 04:30 PM",
    bestCrop: "Mustard (Sarson)",
    currentRateQtl: 5650,
    mspRateQtl: 5450,
    availableSlotsToday: 9,
    recommendedSlotTime: "Tomorrow • 11:30 AM - 01:00 PM",
    lat: 22.5977,
    lng: 75.3025,
    imageUrl: "/images/mandis/dhar.jpg",
  },
  {
    id: "m-5",
    name: "Ratlam APMC Mandi",
    district: "Ratlam, MP",
    state: "Madhya Pradesh",
    distanceKm: 36.0,
    operatingHours: "07:00 AM - 05:00 PM",
    bestCrop: "Chana (Gram)",
    currentRateQtl: 4620,
    mspRateQtl: 4400,
    availableSlotsToday: 6,
    recommendedSlotTime: "Tomorrow • 10:00 AM - 11:30 AM",
    lat: 23.3340,
    lng: 75.0367,
    imageUrl: "/images/mandis/ratlam.jpg",
  },
  {
    id: "m-6",
    name: "Khargone Mandi",
    district: "Khargone, MP",
    state: "Madhya Pradesh",
    distanceKm: 52.0,
    operatingHours: "08:00 AM - 04:00 PM",
    bestCrop: "Soybean (JS-9560)",
    currentRateQtl: 4780,
    mspRateQtl: 4600,
    availableSlotsToday: 4,
    recommendedSlotTime: "Tomorrow • 08:30 AM - 10:00 AM",
    badge: "Reliable Yard",
    lat: 21.8235,
    lng: 75.6164,
    imageUrl: "/images/mandis/khargone.jpg",
  },
];

export const RECENT_MESSAGES: YardMessage[] = [
  {
    id: "msg-1",
    title: "Gate 02 Entry Pass Verified",
    time: "10 mins ago",
    type: "GATE",
    content:
      "Token TKN-7821 for vehicle MP-09-AB-4821 checked-in at Indore Gate 02. Proceed directly to Weighbridge Platform #03.",
    isRead: false,
  },
  {
    id: "msg-2",
    title: "Price Alert: Sharbati Wheat Surged +₹45",
    time: "45 mins ago",
    type: "PRICE_ALERT",
    content:
      "Indore APMC wholesale benchmark increased to ₹2,425/Qtl due to strong flour mill procurement bids.",
    isRead: false,
  },
  {
    id: "msg-3",
    title: "Direct DBT Payment Settled (₹3,91,200)",
    time: "Yesterday, 06:30 PM",
    type: "PAYMENT",
    content:
      "NEFT settlement for 80 Qtl Soybean produce deposited directly into Bank of India Account ending **4329.",
    isRead: true,
  },
  {
    id: "msg-4",
    title: "Moisture Sensor Calibration Update",
    time: "28 Aug 2026",
    type: "INFO",
    content:
      "All APMC yard weighbridges have completed electronic moisture testing calibration under Agmarknet standards.",
    isRead: true,
  },
];

// ================= ORCHESTRATOR COMPONENT =================
export const FarmerDashboard = memo(function FarmerDashboard() {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);

  // View state: "current" vs "previous"
  const [activeTab, setActiveTab] = useState<"current" | "previous">("current");
  const [bookingsList, setBookingsList] = useState<FarmerBookingItem[]>(INITIAL_BOOKINGS);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBookingForQR, setSelectedBookingForQR] = useState<FarmerBookingItem | null>(null);

  // New Booking Form State
  const [newCrop, setNewCrop] = useState("Wheat (Sharbati Gold)");
  const [newQuantityKg, setNewQuantityKg] = useState("5000");
  const [newMandi, setNewMandi] = useState("Indore APMC Central Grain Yard");
  const [newDate, setNewDate] = useState("Today • 03:00 PM - 04:30 PM");
  const [newTruck, setNewTruck] = useState("MP-09-AB-4821");

  // Calculations & Metrics
  const currentBookings = useMemo(
    () =>
      bookingsList.filter((b) =>
        ["PENDING", "ACCEPTED", "IN_TRANSIT", "ARRIVED", "VERIFIED"].includes(b.status)
      ),
    [bookingsList]
  );

  const previousBookings = useMemo(
    () => bookingsList.filter((b) => ["COMPLETED", "CANCELLED"].includes(b.status)),
    [bookingsList]
  );

  const totalBookingsCount = bookingsList.length;
  const currentBookingsCount = currentBookings.length;
  const previousBookingsCount = previousBookings.length;

  // Total Sales in KG
  const totalSalesKg = useMemo(() => {
    return bookingsList.reduce((acc, b) => acc + b.quantityKg, 0);
  }, [bookingsList]);

  const totalEstimatedRevenue = useMemo(() => {
    return bookingsList.reduce((acc, b) => acc + b.totalEstimatedPayout, 0);
  }, [bookingsList]);

  // Active status breakdown
  const arrivedCount = currentBookings.filter(
    (b) => b.status === "ARRIVED" || b.status === "VERIFIED"
  ).length;
  const inTransitCount = currentBookings.filter((b) => b.status === "IN_TRANSIT").length;
  const scheduledCount = currentBookings.filter(
    (b) => b.status === "ACCEPTED" || b.status === "PENDING"
  ).length;

  const handleLogout = () => {
    dispatch(logout());
    window.history.pushState({}, "", "/login");
    window.location.href = "/login";
  };

  const handleCreateBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qtyKg = Number(newQuantityKg) || 1000;
    const qtyQtl = qtyKg / 100;
    const rate = 2450;

    const newBookingItem: FarmerBookingItem = {
      id: `b-${Date.now()}`,
      tokenId: `TKN-${Math.floor(1000 + Math.random() * 9000)}`,
      mandiName: newMandi,
      mandiCode: "APMC-IND-042",
      crop: newCrop,
      quantityKg: qtyKg,
      quantityQuintals: qtyQtl,
      slotDate: newDate.includes("Today") ? "Today, 31 Aug 2026" : "Tomorrow, 01 Sep 2026",
      slotTime: newDate.includes("•")
        ? newDate.split("•")[1]?.trim() || "11:00 AM - 12:30 PM"
        : "11:00 AM - 12:30 PM",
      bayAssigned: "Bay 02 (Direct Hopper)",
      truckNumber: newTruck.toUpperCase().trim() || "MP-09-KA-1122",
      status: "ACCEPTED",
      ratePerQtl: rate,
      totalEstimatedPayout: qtyQtl * rate,
    };

    setBookingsList([newBookingItem, ...bookingsList]);
    setShowCreateModal(false);
    setSelectedBookingForQR(newBookingItem);
  };

  const handleQuickBookSuggested = (mandi: SuggestedMandi) => {
    setNewMandi(mandi.name);
    setNewCrop(mandi.bestCrop);
    setNewDate(mandi.recommendedSlotTime);
    setShowCreateModal(true);
  };

  const displayedList = activeTab === "current" ? currentBookings : previousBookings;

  return (
    <div className="min-h-screen w-full bg-[#FCFCFA] text-[#0B2D1B] font-sans flex flex-col justify-between selection:bg-[#C8F52F] selection:text-[#0B2D1B]">
      {/* 1. TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-[#E8EAEC] select-none">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0B2D1B] text-[#C8F52F] rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm">
              🌾
            </div>
            <div>
              <div className="text-base font-bold text-[#0B2D1B] leading-none tracking-tight flex items-center gap-2">
                <span>Agrovia Kisan</span>
                <span className="text-[10px] font-bold text-[#059669] bg-[#E8F5E9] px-2 py-0.5 rounded-full border border-emerald-200">
                  APMC Portal
                </span>
              </div>
              <span className="text-[11px] text-[#5A6C5F] font-medium">
                Digital Mandi Unloading Gateway
              </span>
            </div>
          </div>

          {/* Navigation Links & User Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F4F4F2] border border-[#E8EAEC] text-xs font-semibold text-[#0B2D1B]">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>{authUser?.name || "Ramesh Patel"}</span>
              <span className="text-[#8A92A0]">• Kisan ID: MP-8842</span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#F4F4F2] border border-[#E2E5E9] text-xs font-semibold text-[#0B2D1B] shadow-xs transition-colors cursor-pointer"
            >
              <LogOut size={13} className="text-[#5A6C5F]" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN DASHBOARD CONTENT */}
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-7 flex-1">
        {/* ================= SECTION A: HERO WELCOME & ACTION BAR ================= */}
        <div className="w-full bg-white rounded-3xl border border-[#E8EAEC] p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#C8F52F]/20 via-[#E8F5E9]/30 to-transparent rounded-bl-full pointer-events-none" />

          <div className="space-y-1 relative z-10 text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0B2D1B]">
              Welcome back, {authUser?.name || "Ramesh Patel"}
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 relative z-10 shrink-0">
            {/* Create New Booking Button */}
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="group inline-flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-[#0B2D1B] hover:bg-[#06180E] text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-[#C8F52F] text-[#0B2D1B] flex items-center justify-center text-xs font-black group-hover:rotate-90 transition-transform">
                <Plus size={14} strokeWidth={3} />
              </div>
              <span>Create New Booking</span>
            </button>

            {/* Previous Bookings Button */}
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === "current" ? "previous" : "current")}
              className={`inline-flex items-center gap-2 px-4.5 py-3.5 rounded-full border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "previous"
                  ? "bg-[#E8F5E9] text-[#059669] border-emerald-300 shadow-xs"
                  : "bg-white hover:bg-[#F4F4F2] text-[#23382B] border-[#DCE0E5]"
              }`}
            >
              <History size={15} className="text-[#5A6C5F]" />
              <span>{activeTab === "previous" ? "View Active Bookings" : "Previous Bookings"}</span>
            </button>
          </div>
        </div>

        {/* ================= SECTION B: 4 KPI METRIC CARDS ================= */}
        <FarmerMetricsRow
          totalBookingsCount={totalBookingsCount}
          currentBookingsCount={currentBookingsCount}
          previousBookingsCount={previousBookingsCount}
          totalSalesKg={totalSalesKg}
          totalEstimatedRevenue={totalEstimatedRevenue}
          arrivedCount={arrivedCount}
          inTransitCount={inTransitCount}
          scheduledCount={scheduledCount}
        />

        {/* ================= SECTION C: SUGGESTED MANDI WITH AVAILABLE SLOTS ================= */}
        <SuggestedMandisSection
          mandis={SUGGESTED_MANDIS}
          onBookMandi={handleQuickBookSuggested}
        />

        {/* ================= SECTION D: BOOKINGS MANAGEMENT TABLE ================= */}
        <BookingsTableSection
          activeTab={activeTab}
          onTabChange={setActiveTab}
          displayedList={displayedList}
          currentBookingsCount={currentBookingsCount}
          previousBookingsCount={previousBookingsCount}
          onOpenCreateModal={() => setShowCreateModal(true)}
          onSelectBookingForQR={setSelectedBookingForQR}
        />

        {/* ================= SECTION E: RECENT MESSAGES & YARD NOTIFICATIONS ================= */}
        <RecentMessagesSection messages={RECENT_MESSAGES} />
      </main>

      {/* 3. FOOTER */}
      <footer className="w-full border-t border-[#E8EAEC] py-6 px-6 text-center text-xs text-[#5A6C5F] bg-white">
        © {new Date().getFullYear()} Agrovia Kisan Cloud Ecosystem • Built for Indian APMC Mandis &
        Farmers
      </footer>

      {/* ================= MODAL 1: CREATE NEW BOOKING ================= */}
      <CreateBookingModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateBookingSubmit}
        newMandi={newMandi}
        setNewMandi={setNewMandi}
        newCrop={newCrop}
        setNewCrop={setNewCrop}
        newQuantityKg={newQuantityKg}
        setNewQuantityKg={setNewQuantityKg}
        newTruck={newTruck}
        setNewTruck={setNewTruck}
        newDate={newDate}
        setNewDate={setNewDate}
      />

      {/* ================= MODAL 2: DIGITAL QR PASS & SLIP ================= */}
      <DigitalPassModal
        booking={selectedBookingForQR}
        onClose={() => setSelectedBookingForQR(null)}
      />
    </div>
  );
});
