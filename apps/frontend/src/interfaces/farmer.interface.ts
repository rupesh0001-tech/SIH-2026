export interface FarmerProfileData {
  id?: string;
  userId?: string;
  addressLine1?: string | null;
  addressLine2?: string | null;
  village?: string | null;
  taluka?: string | null;
  district?: string | null;
  state?: string | null;
  pincode?: string | null;
  landSizeAcres?: number | null;
  mainCrops?: string[];
  secondaryCrops?: string[];
  irrigationType?: string | null;
  farmLocation?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface FarmerFullProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
  farmerProfile?: FarmerProfileData | null;
}

export interface UpdateFarmerProfilePayload {
  name?: string;
  phone?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  village?: string | null;
  taluka?: string | null;
  district?: string | null;
  state?: string | null;
  pincode?: string | null;
  landSizeAcres?: number | null;
  mainCrops?: string[];
  secondaryCrops?: string[];
  irrigationType?: string | null;
  farmLocation?: string | null;
}

export type FarmerRoute = "/farmer/dashboard" | "/bookings" | "/find-mandi" | "/settings";

export type FarmerBookingStatus =
  | "PENDING"
  | "ACCEPTED"
  | "IN_TRANSIT"
  | "ARRIVED"
  | "VERIFIED"
  | "COMPLETED"
  | "CANCELLED";

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
  status: FarmerBookingStatus;
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
