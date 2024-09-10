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
    let isMounted = true;

    const getLocationAsync = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({});
        const [address] = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        if (isMounted) {
          setLocationInfo({ location, address });
        }
      } catch (error) {
        console.error("Error getting location:", error);
      }
    };

    getLocationAsync();

    return () => {
      isMounted = false;
    };
  }, []);

  return locationInfo;
}