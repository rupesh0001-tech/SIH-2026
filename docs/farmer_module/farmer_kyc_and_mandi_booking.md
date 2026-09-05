# Farmer KYC & Mandi Booking Architecture

## 1. Overview
The Farmer Details and Booking Flow ensures that farmers can register quickly and explore market prices, but must complete mandatory KYC compliance before booking auction slots at APMC mandis.

---

## 2. Key Architecture Features

### Sequential Farmer Identification Code
- Format: `FAR` + 3-digit sequential integer (e.g. `FAR001`, `FAR002`, `FAR010`).
- Generated automatically during profile creation or fallback calculation based on database sequential count.

### Mandatory KYC Verification Guard
- Required Fields:
  - Full Address
  - Date of Birth (`YYYY-MM-DD`)
  - Government ID Type: `AADHAAR_CARD`, `PAN_CARD`, `DRIVING_LICENSE`, `VOTER_ID`, `KISAN_CREDIT_CARD`
  - Government ID Number
  - Optional Avatar URL
- Status Flag: `isProfileComplete: boolean`
- Guard Behavior:
  - Dashboard shows a persistent warning banner when `isProfileComplete === false`.
  - When a farmer taps "Book Auction Slot" at any mandi, the app blocks the booking and opens `ProfileCompletionModal`.
  - Backend `/api/v1/farmer/bookings` validates `isProfileComplete` and rejects unverified bookings with `403 Forbidden` (`PROFILE_INCOMPLETE`).

---

## 3. Real Maharashtra APMC Mandi Cluster (20+ Seeded Mandis)
Seeded with live coordinates and real APMC auction operational slots:
- **Pimpri-Chinchwad & Morwadi**:
  - Morwadi APMC Sub-Yard (Near Dr. D.Y. Patil Institute of Technology)
  - Pimpri Central Vegetable Market
  - Chinchwad APMC Yard
  - Bhosari APMC Sub-Yard
  - Akurdi APMC Yard
  - Nigdi Pradhikaran Farmers Yard
  - Moshi APMC Main Yard
  - Ravet Agro Terminal
  - Sangvi Sub-Market Yard
  - Rahatani APMC Yard
  - Wakad Farmers Direct Center
- **Pune APMC Main & Sub-Yards**:
  - Gultekdi Market Yard (Pune Main APMC)
  - Hadapsar APMC Vegetable Yard
  - Khadki Cantonment APMC Yard
  - Manchar APMC Main Market
  - Junnar APMC (Narayangaon Tomato Yard)
  - Khed (Chakan) APMC Onion-Potato Yard
  - Baramati APMC Yard
  - Daund APMC Yard
  - Shirur APMC Yard
  - Bhor APMC Yard
  - Saswad APMC Yard

---

## 4. Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/farmer/profile` | Farmer JWT | Returns farmer info, `farmerCode`, and `isProfileComplete` |
| `PUT` | `/api/v1/farmer/profile` | Farmer JWT | Updates KYC data and computes `isProfileComplete` |
| `GET` | `/api/v1/farmer/mandis` | Farmer JWT | Fetches active approved mandis with live rates & slots |
| `GET` | `/api/v1/mandi/list` | Public | Public mandi listing for discovery and map |
| `POST` | `/api/v1/farmer/bookings` | Farmer JWT | Books an auction slot (enforces KYC check) |
| `GET` | `/api/v1/farmer/bookings` | Farmer JWT | Lists farmer booked slot passes |
