import type { UserCoordinates, MandiItem } from '@/interfaces';

export const FALLBACK_COORDINATES: UserCoordinates = {
  latitude: 19.9975,
  longitude: 73.7898,
  accuracy: 10,
};

/**
 * Calculates Great-Circle distance between two coordinates in kilometers using Haversine formula.
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

/**
 * Formats distance into a clean readable string.
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Base mock mandis/shops around Maharashtra / India agriculture hubs.
 */
export const DEFAULT_MOCK_MANDIS: MandiItem[] = [
  {
    id: 'mandi-1',
    name: 'Nashik APMC Mandi',
    district: 'Nashik, Maharashtra',
    distanceKm: 3.2,
    topCrop: 'Onion (Red) & Grapes',
    modalPrice: '₹2,680 / qtl',
    priceTrend: '+₹120 today',
    trendDirection: 'up',
    estimatedQueueTime: '25 mins wait',
    isOpen: true,
    latitude: 19.9975,
    longitude: 73.7898,
    activeFarmersCount: 142,
    todayArrivalsQtl: 4500,
    operatingHours: '06:00 AM - 07:00 PM',
    address: 'Dindori Road, Panchavati, Nashik 422003',
    contactPhone: '+91 253 251 2288',
  },
  {
    id: 'mandi-2',
    name: 'Lasalgaon APMC Market',
    district: 'Lasalgaon, Maharashtra',
    distanceKm: 14.8,
    topCrop: 'Onion (Garva) & Wheat',
    modalPrice: '₹2,850 / qtl',
    priceTrend: '+₹190 today',
    trendDirection: 'up',
    estimatedQueueTime: '45 mins wait',
    isOpen: true,
    latitude: 20.1444,
    longitude: 74.2253,
    activeFarmersCount: 210,
    todayArrivalsQtl: 8200,
    operatingHours: '05:30 AM - 08:00 PM',
    address: 'Station Road, Lasalgaon, Niphad 422306',
    contactPhone: '+91 2550 266 123',
  },
  {
    id: 'mandi-3',
    name: 'Pimpalgaon Baswant Onion Yard',
    district: 'Pimpalgaon, Maharashtra',
    distanceKm: 8.5,
    topCrop: 'Tomato (Hybrid) & Onion',
    modalPrice: '₹2,720 / qtl',
    priceTrend: '+₹80 today',
    trendDirection: 'up',
    estimatedQueueTime: '20 mins wait',
    isOpen: true,
    latitude: 20.1697,
    longitude: 73.9856,
    activeFarmersCount: 115,
    todayArrivalsQtl: 3800,
    operatingHours: '06:00 AM - 06:30 PM',
    address: 'NH-3 Highway Market Yard, Pimpalgaon 422209',
    contactPhone: '+91 2554 232 450',
  },
  {
    id: 'mandi-4',
    name: 'Dindori Farmer Produce Hub',
    district: 'Dindori, Maharashtra',
    distanceKm: 11.2,
    topCrop: 'Grapes & Pomegranate',
    modalPrice: '₹5,400 / qtl',
    priceTrend: '+₹310 today',
    trendDirection: 'up',
    estimatedQueueTime: '15 mins wait',
    isOpen: true,
    latitude: 20.2012,
    longitude: 73.8341,
    activeFarmersCount: 94,
    todayArrivalsQtl: 2100,
    operatingHours: '07:00 AM - 05:00 PM',
    address: 'Vani Road, Dindori 422202',
    contactPhone: '+91 2557 221 004',
  },
  {
    id: 'mandi-5',
    name: 'Sinnar Grain & Pulse Mandi',
    district: 'Sinnar, Maharashtra',
    distanceKm: 18.0,
    topCrop: 'Bajra, Soybean & Maize',
    modalPrice: '₹3,450 / qtl',
    priceTrend: '+₹95 today',
    trendDirection: 'up',
    estimatedQueueTime: '30 mins wait',
    isOpen: true,
    latitude: 19.8458,
    longitude: 73.9982,
    activeFarmersCount: 78,
    todayArrivalsQtl: 1950,
    operatingHours: '06:30 AM - 06:00 PM',
    address: 'Shirdi Highway, Sinnar 422103',
    contactPhone: '+91 2551 220 180',
  },
  {
    id: 'mandi-6',
    name: 'Yeola Agro Auction Center',
    district: 'Yeola, Maharashtra',
    distanceKm: 26.4,
    topCrop: 'Cotton & Groundnut',
    modalPrice: '₹6,800 / qtl',
    priceTrend: '-₹50 today',
    trendDirection: 'down',
    estimatedQueueTime: '35 mins wait',
    isOpen: true,
    latitude: 20.0422,
    longitude: 74.4842,
    activeFarmersCount: 130,
    todayArrivalsQtl: 3200,
    operatingHours: '06:00 AM - 07:00 PM',
    address: 'Nagar-Manmad Road, Yeola 423401',
    contactPhone: '+91 2559 267 890',
  },
];

/**
 * Dynamically computes/offsets mock mandis/shops relative to user's resolved live coordinates,
 * so markers are always visible nearby on the map regardless of where the device is located.
 */
export function getNearbyMandisForUser(userCoords: UserCoordinates): MandiItem[] {
  const { latitude, longitude } = userCoords;

  // Offsets in degrees (approx 2km - 20km from user)
  const offsets = [
    { dLat: 0.015, dLng: 0.022 },
    { dLat: -0.025, dLng: 0.035 },
    { dLat: 0.038, dLng: -0.028 },
    { dLat: -0.018, dLng: -0.032 },
    { dLat: 0.045, dLng: 0.018 },
    { dLat: -0.042, dLng: 0.048 },
  ];

  return DEFAULT_MOCK_MANDIS.map((mandi, idx) => {
    const offset = offsets[idx % offsets.length];
    const mandiLat = latitude + offset.dLat;
    const mandiLng = longitude + offset.dLng;
    const distanceKm = calculateDistanceKm(latitude, longitude, mandiLat, mandiLng);

    return {
      ...mandi,
      latitude: mandiLat,
      longitude: mandiLng,
      distanceKm,
    };
  });
}
