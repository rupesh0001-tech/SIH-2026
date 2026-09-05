import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import * as Location from 'expo-location';
import type { UserLocationState, UserCoordinates } from '@/interfaces';
import { FALLBACK_COORDINATES } from '@/utils/location.utils';

export function useUserLocation() {
  const [locationState, setLocationState] = useState<UserLocationState>({
    coordinates: FALLBACK_COORDINATES,
    status: 'idle',
    errorMessage: null,
    isFallback: true,
    locationName: 'Nashik Agri Belt, MH',
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchLocation = useCallback(async () => {
    setIsLoading(true);
    setLocationState((prev) => ({ ...prev, status: 'requesting', errorMessage: null }));

    try {
      // 1. Request foreground permission
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setLocationState({
          coordinates: FALLBACK_COORDINATES,
          status: 'denied',
          errorMessage: 'Location permission was denied. Showing standard Maharashtra APMC Agri Hub.',
          isFallback: true,
          locationName: 'Nashik APMC Zone (Default)',
        });
        setIsLoading(false);
        return;
      }

      // 2. Fetch current position
      const position = await Location.getCurrentPositionAsync({
        accuracy: Platform.OS === 'android' ? Location.Accuracy.Balanced : Location.Accuracy.High,
      });

      const userCoords: UserCoordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude,
        heading: position.coords.heading,
        speed: position.coords.speed,
      };

      // 3. Reverse geocode asynchronously for friendly district name if possible
      let friendlyName = 'Live Farm Location';
      try {
        const reverseResults = await Location.reverseGeocodeAsync({
          latitude: userCoords.latitude,
          longitude: userCoords.longitude,
        });
        if (reverseResults && reverseResults.length > 0) {
          const first = reverseResults[0];
          const parts = [first.district || first.city || first.subregion, first.region].filter(Boolean);
          if (parts.length > 0) {
            friendlyName = parts.join(', ');
          }
        }
      } catch {
        // Reverse geocoding optional fallback
      }

      setLocationState({
        coordinates: userCoords,
        status: 'granted',
        errorMessage: null,
        isFallback: false,
        locationName: friendlyName,
      });
    } catch (err: any) {
      setLocationState({
        coordinates: FALLBACK_COORDINATES,
        status: 'error',
        errorMessage: err?.message || 'Could not retrieve GPS location. Using default APMC hub.',
        isFallback: true,
        locationName: 'Nashik APMC Zone (Fallback)',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return {
    ...locationState,
    isLoading,
    refreshLocation: fetchLocation,
  };
}
