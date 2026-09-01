import React, { memo, useEffect, useMemo, useState } from "react";
import { ArrowRight, LogOut } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store";
import { logout } from "../../store/slices/authSlice";
import type { User } from "../../interfaces";
import { FarmerSidebar, type FarmerRoute } from "./FarmerSidebar";
import {
  INITIAL_BOOKINGS,
  RECENT_MESSAGES,
  SUGGESTED_MANDIS,
  type FarmerBookingItem,
  type SuggestedMandi,
} from "./FarmerDashboard";
import { FarmerMetricsRow } from "./FarmerMetricsRow";
import { BookingsTableSection } from "./BookingsTableSection";
import { SuggestedMandisSection } from "./SuggestedMandisSection";
import { RecentMessagesSection } from "./RecentMessagesSection";
import { CreateBookingModal } from "./CreateBookingModal";
import { DigitalPassModal } from "./DigitalPassModal";

type Metrics = React.ComponentProps<typeof FarmerMetricsRow>;

function PageFrame({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto w-full max-w-6xl space-y-7 px-4 py-6 sm:px-6 sm:py-8">{children}</main>;
}

function SectionHeading({ title, route, onNavigate }: { title: string; route: FarmerRoute; onNavigate: (route: FarmerRoute) => void }) {
  return <div className="flex items-center justify-between gap-3"><h2 className="text-lg font-bold sm:text-xl">{title}</h2><button type="button" onClick={() => onNavigate(route)} className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[#059669] hover:underline">View all <ArrowRight size={13} /></button></div>;
}

function WelcomeBanner({ user, onCreateBooking }: { user: User | null; onCreateBooking: () => void }) {
  return <div className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-3xl border border-[#E8EAEC] bg-white p-6 shadow-sm sm:p-8 md:flex-row md:items-center"><div className="absolute right-0 top-0 h-64 w-64 rounded-bl-full bg-gradient-to-bl from-[#C8F52F]/20 via-[#E8F5E9]/30 to-transparent" /><div className="relative space-y-2"><span className="inline-flex rounded-full border border-emerald-200 bg-[#E8F5E9] px-3 py-1 text-xs font-bold text-[#059669]">APMC Indore & Ujjain Yards Operating Live</span><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Welcome back, {user?.name || "Ramesh Patel"}</h1><p className="max-w-xl text-xs text-[#5A6C5F] sm:text-sm">Schedule grain arrival slots, access direct weighbridge tokens, and track crop realizations without waiting in gate queues.</p></div><button type="button" onClick={onCreateBooking} className="relative inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#0B2D1B] px-5 py-3.5 text-xs font-bold text-white shadow-md"><span className="rounded-full bg-[#C8F52F] px-1.5 text-lg leading-5 text-[#0B2D1B]">+</span>Create New Booking</button></div>;
}

type SharedProps = { user: User | null; metrics: Metrics; currentBookings: FarmerBookingItem[]; previousBookings: FarmerBookingItem[]; activeTab: "current" | "previous"; setActiveTab: (tab: "current" | "previous") => void; onCreateBooking: () => void; onSelectBookingForQR: (booking: FarmerBookingItem) => void; onBookMandi: (mandi: SuggestedMandi) => void; onNavigate: (route: FarmerRoute) => void };

function DashboardPage({ user, metrics, currentBookings, onCreateBooking, onSelectBookingForQR, onBookMandi, onNavigate }: SharedProps) {
  return <PageFrame><WelcomeBanner user={user} onCreateBooking={onCreateBooking} /><FarmerMetricsRow {...metrics} /><section className="space-y-4"><SectionHeading title="Active Unloading Bookings" route="/bookings" onNavigate={onNavigate} /><BookingsTableSection hideHeader activeTab="current" onTabChange={() => undefined} displayedList={currentBookings.slice(0, 2)} currentBookingsCount={currentBookings.length} previousBookingsCount={0} onOpenCreateModal={onCreateBooking} onSelectBookingForQR={onSelectBookingForQR} /></section><section className="space-y-4"><SectionHeading title="Suggested Mandis with Open Arrival Slots" route="/find-mandi" onNavigate={onNavigate} /><SuggestedMandisSection hideHeader mandis={SUGGESTED_MANDIS.slice(0, 2)} onBookMandi={onBookMandi} /></section><section className="space-y-4"><SectionHeading title="Latest Alerts" route="/bookings" onNavigate={onNavigate} /><RecentMessagesSection messages={RECENT_MESSAGES.slice(0, 2)} /></section></PageFrame>;
}

function BookingsPage({ currentBookings, previousBookings, activeTab, setActiveTab, onCreateBooking, onSelectBookingForQR }: SharedProps) {
  return <PageFrame><div><h1 className="text-2xl font-bold">Bookings</h1><p className="mt-1 text-sm text-[#5A6C5F]">Manage active unloading slots, previous deliveries, and digital passes.</p></div><BookingsTableSection activeTab={activeTab} onTabChange={setActiveTab} displayedList={activeTab === "current" ? currentBookings : previousBookings} currentBookingsCount={currentBookings.length} previousBookingsCount={previousBookings.length} onOpenCreateModal={onCreateBooking} onSelectBookingForQR={onSelectBookingForQR} /></PageFrame>;
}

function FindMandiPage({ onBookMandi }: SharedProps) {
  return <PageFrame><div><h1 className="text-2xl font-bold">Find Mandi</h1><p className="mt-1 text-sm text-[#5A6C5F]">Compare live crop rates and open arrival slots across nearby yards.</p></div><SuggestedMandisSection mandis={SUGGESTED_MANDIS} onBookMandi={onBookMandi} /></PageFrame>;
}

function SettingsPage({ user }: { user: User | null }) {
  const [photo, setPhoto] = useState<string | null>(null);
  return <PageFrame><div><h1 className="text-2xl font-bold">Settings</h1><p className="mt-1 text-sm text-[#5A6C5F]">Keep your farmer profile and verification documents up to date.</p></div><div className="grid gap-5 lg:grid-cols-2"><section className="rounded-3xl border border-[#E8EAEC] bg-white p-6 shadow-sm"><h2 className="text-lg font-bold">Profile details</h2><div className="mt-5 flex items-center gap-4"><label className="relative flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-[#B6E7C5] bg-[#E8F5E9] text-2xl font-bold text-[#059669]">{photo ? <img src={photo} alt="Profile" className="h-full w-full object-cover" /> : (user?.name || "R").charAt(0)}<input type="file" accept="image/*" className="absolute inset-0 cursor-pointer opacity-0" onChange={(e) => { const file = e.target.files?.[0]; if (file) setPhoto(URL.createObjectURL(file)); }} /></label><div><div className="font-bold">{user?.name || "Ramesh Patel"}</div><div className="text-xs text-[#5A6C5F]">{user?.email || "farmer@agrovia.in"}</div><div className="mt-1 text-xs font-semibold text-[#059669]">Verified farmer account</div></div></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="text-xs font-semibold">Full name<input defaultValue={user?.name || "Ramesh Patel"} className="mt-1 w-full rounded-xl border border-[#E2E5E9] bg-[#F8F9FA] px-3 py-2.5 text-sm" /></label><label className="text-xs font-semibold">Phone number<input defaultValue={user?.phone || ""} className="mt-1 w-full rounded-xl border border-[#E2E5E9] bg-[#F8F9FA] px-3 py-2.5 text-sm" /></label></div><button type="button" className="mt-5 rounded-full bg-[#0B2D1B] px-5 py-2.5 text-xs font-bold text-white">Save profile</button></section><section className="space-y-5"><div className="rounded-3xl border border-[#E8EAEC] bg-white p-6 shadow-sm"><h2 className="text-lg font-bold">Verification documents</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="cursor-pointer rounded-2xl border border-dashed border-[#B6E7C5] bg-[#E8F5E9] p-4 text-xs font-bold text-[#059669]">Upload Aadhaar<input type="file" accept="image/*,.pdf" className="mt-2 block w-full text-xs" /></label><label className="cursor-pointer rounded-2xl border border-dashed border-[#DCE0E5] bg-[#FCFCFA] p-4 text-xs font-bold text-[#0B2D1B]">Upload legal documents<input type="file" accept="image/*,.pdf" multiple className="mt-2 block w-full text-xs" /></label></div></div><div className="rounded-3xl border border-[#E8EAEC] bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><h2 className="text-lg font-bold">Farmer rating</h2><span className="rounded-full border border-emerald-200 bg-[#E8F5E9] px-3 py-1 text-sm font-bold text-[#059669]">★ 4.8 / 5</span></div><p className="mt-2 text-xs text-[#5A6C5F]">Based on timely arrivals, verified produce, and mandi partner feedback.</p></div></section></div></PageFrame>;
}

export const FarmerDashboardShell = memo(function FarmerDashboardShell() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [route, setRoute] = useState<FarmerRoute>(() => {
    const path = window.location.pathname;
    return path === "/bookings" || path === "/find-mandi" || path === "/settings" ? path : "/";
  });
  const [activeTab, setActiveTab] = useState<"current" | "previous">("current");
  const [bookingsList, setBookingsList] = useState<FarmerBookingItem[]>(INITIAL_BOOKINGS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBookingForQR, setSelectedBookingForQR] = useState<FarmerBookingItem | null>(null);
  const [newCrop, setNewCrop] = useState("Wheat (Sharbati Gold)");
  const [newQuantityKg, setNewQuantityKg] = useState("5000");
  const [newMandi, setNewMandi] = useState("Indore APMC Central Grain Yard");
  const [newDate, setNewDate] = useState("Today â€¢ 03:00 PM - 04:30 PM");
  const [newTruck, setNewTruck] = useState("MP-09-AB-4821");
  useEffect(() => { const onPopState = () => { const path = window.location.pathname; setRoute(path === "/bookings" || path === "/find-mandi" || path === "/settings" ? path : "/"); }; window.addEventListener("popstate", onPopState); return () => window.removeEventListener("popstate", onPopState); }, []);
  const navigate = (nextRoute: FarmerRoute) => { window.history.pushState({}, "", nextRoute === "/" ? "/farmer/dashboard" : nextRoute); setRoute(nextRoute); };
  const currentBookings = useMemo(() => bookingsList.filter((b) => ["PENDING", "ACCEPTED", "IN_TRANSIT", "ARRIVED", "VERIFIED"].includes(b.status)), [bookingsList]);
  const previousBookings = useMemo(() => bookingsList.filter((b) => ["COMPLETED", "CANCELLED"].includes(b.status)), [bookingsList]);
  const metrics: Metrics = { totalBookingsCount: bookingsList.length, currentBookingsCount: currentBookings.length, previousBookingsCount: previousBookings.length, totalSalesKg: bookingsList.reduce((sum, b) => sum + b.quantityKg, 0), totalEstimatedRevenue: bookingsList.reduce((sum, b) => sum + b.totalEstimatedPayout, 0), arrivedCount: currentBookings.filter((b) => b.status === "ARRIVED" || b.status === "VERIFIED").length, inTransitCount: currentBookings.filter((b) => b.status === "IN_TRANSIT").length, scheduledCount: currentBookings.filter((b) => b.status === "ACCEPTED" || b.status === "PENDING").length };
  const onCreateBookingSubmit = (e: React.FormEvent) => { e.preventDefault(); const qtyKg = Number(newQuantityKg) || 1000; const item: FarmerBookingItem = { id: `b-${Date.now()}`, tokenId: `TKN-${Math.floor(1000 + Math.random() * 9000)}`, mandiName: newMandi, mandiCode: "APMC-IND-042", crop: newCrop, quantityKg: qtyKg, quantityQuintals: qtyKg / 100, slotDate: newDate.includes("Today") ? "Today, 31 Aug 2026" : "Tomorrow, 01 Sep 2026", slotTime: newDate.includes("â€¢") ? newDate.split("â€¢")[1]?.trim() || "11:00 AM - 12:30 PM" : "11:00 AM - 12:30 PM", bayAssigned: "Bay 02 (Direct Hopper)", truckNumber: newTruck.toUpperCase().trim() || "MP-09-KA-1122", status: "ACCEPTED", ratePerQtl: 2450, totalEstimatedPayout: (qtyKg / 100) * 2450 }; setBookingsList((items) => [item, ...items]); setShowCreateModal(false); setSelectedBookingForQR(item); };
  const onBookMandi = (mandi: SuggestedMandi) => { setNewMandi(mandi.name); setNewCrop(mandi.bestCrop); setNewDate(mandi.recommendedSlotTime); setShowCreateModal(true); };
  const shared: SharedProps = { user, metrics, currentBookings, previousBookings, activeTab, setActiveTab, onCreateBooking: () => setShowCreateModal(true), onSelectBookingForQR: setSelectedBookingForQR, onBookMandi, onNavigate: navigate };
  return <div className="min-h-screen bg-[#FCFCFA] text-[#0B2D1B] md:flex"><FarmerSidebar activeRoute={route} onNavigate={navigate} /><div className="min-w-0 flex-1 pb-16 md:pb-0"><header className="sticky top-0 z-30 border-b border-[#E8EAEC] bg-white/90 px-4 py-4 backdrop-blur-md sm:px-6"><div className="mx-auto flex max-w-6xl items-center justify-between"><div><div className="font-bold capitalize">{route === "/" ? "Dashboard" : route.slice(1).replace("-", " ")}</div><div className="text-xs text-[#5A6C5F]">Digital Mandi Unloading Gateway</div></div><div className="flex items-center gap-3"><span className="hidden text-xs font-semibold text-[#5A6C5F] sm:inline">{user?.name || "Ramesh Patel"}</span><button type="button" onClick={() => { dispatch(logout()); window.location.href = "/login"; }} className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E5E9] bg-white px-3.5 py-1.5 text-xs font-semibold shadow-xs"><LogOut size={13} /> Sign Out</button></div></div></header>{route === "/" && <DashboardPage {...shared} />}{route === "/bookings" && <BookingsPage {...shared} />}{route === "/find-mandi" && <FindMandiPage {...shared} />}{route === "/settings" && <SettingsPage user={user} />}</div><CreateBookingModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onSubmit={onCreateBookingSubmit} newMandi={newMandi} setNewMandi={setNewMandi} newCrop={newCrop} setNewCrop={setNewCrop} newQuantityKg={newQuantityKg} setNewQuantityKg={setNewQuantityKg} newTruck={newTruck} setNewTruck={setNewTruck} newDate={newDate} setNewDate={setNewDate} /><DigitalPassModal booking={selectedBookingForQR} onClose={() => setSelectedBookingForQR(null)} /></div>;
});
