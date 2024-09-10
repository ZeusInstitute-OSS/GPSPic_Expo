import { useState, useEffect } from 'react';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';

export default function usePermissions() {
  const [hasPermissions, setHasPermissions] = useState<boolean | null>(null);

  const requestPermissions = async () => {
    const cameraStatus = await Camera.requestCameraPermissionsAsync();
    const locationStatus = await Location.requestForegroundPermissionsAsync();
    const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();

    setHasPermissions(
      cameraStatus.status === 'granted' &&
      locationStatus.status === 'granted' &&
      mediaLibraryStatus.status === 'granted'
    );
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  return { hasPermissions, requestPermissions };
}