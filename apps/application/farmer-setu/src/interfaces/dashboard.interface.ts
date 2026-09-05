export type NavTabType = 'dashboard' | 'mandi' | 'bookings' | 'settings';

export type StatColorTheme = 'mint' | 'peach' | 'lavender' | 'softGray';

export interface StatCardItem {
  id: string;
  title: string;
  value: string;
  unit?: string;
  trendText?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  colorTheme: StatColorTheme;
  iconName: string;
  subtitle?: string;
  progressPercent?: number;
  badgeLabel?: string;
}

export type BookingStatus = 'in_progress' | 'confirmed' | 'completed' | 'cancelled';

export interface BookingItem {
  id: string;
  bookingCode: string;
  cropName: string;
  cropVariety: string;
  mandiName: string;
  gateNo: string;
  dateString: string;
  timeSlot: string;
  status: BookingStatus;
  statusLabel: string;
  progressPercent: number;
  progressLabel: string;
  inspectorName?: string;
  inspectorAvatar?: string;
  quantityQuintals: number;
  commentsCount?: number;
}

export interface SuggestionItem {
  id: string;
  title: string;
  description: string;
  badge: string;
  accentColor: 'lavender' | 'mint' | 'peach';
  actionLabel: string;
}

export interface MandiItem {
  id: string;
  name: string;
  district: string;
  distanceKm: number;
  topCrop: string;
  modalPrice: string;
  priceTrend: string;
  trendDirection: 'up' | 'down';
  estimatedQueueTime: string;
  isOpen: boolean;
  latitude: number;
  longitude: number;
  todayArrivalsQtl?: number;
  operatingHours?: string;
  activeFarmersCount: number;
  address?: string;
  contactPhone?: string;
}

export interface MandiFilterCriteria {
  searchQuery: string;
  selectedCrop: string;
  selectedLocation: string;
  selectedDate: string;
  manualDate: string;
  manualCrop: string;
  minFarmers: string;
  timeSlot: string;
}

export interface BookingsFilterCriteria {
  searchQuery: string;
  selectedCrop: string;
  manualDate: string;
  manualCrop: string;
  minFarmers: string;
  status: string;
}

export type BookingViewMode = 'table' | 'cards';

export interface DayPickerItem {
  dayName: string;
  dayNumber: string;
  dateKey: string;
  isToday?: boolean;
}


