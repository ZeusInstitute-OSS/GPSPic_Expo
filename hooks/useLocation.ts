import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export default function useLocation() {
  const [locationInfo, setLocationInfo] = useState<{
    location: Location.LocationObject | null,
    address: Location.LocationGeocodedAddress | null
  }>({
    location: null,
    address: null
  });

  useEffect(() => {
    updateLocation();
  }, []);

  const updateLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setLocationInfo({ location, address });
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  return () => locationInfo;
}