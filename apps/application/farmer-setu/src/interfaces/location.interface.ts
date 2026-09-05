export interface UserCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  altitude?: number | null;
  heading?: number | null;
  speed?: number | null;
}

export type LocationPermissionStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'error';

export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface UserLocationState {
  coordinates: UserCoordinates;
  status: LocationPermissionStatus;
  errorMessage: string | null;
  isFallback: boolean;
  locationName: string;
}
