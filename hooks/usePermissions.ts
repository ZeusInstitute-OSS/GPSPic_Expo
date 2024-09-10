import { useState, useEffect } from 'react';
import { Camera } from 'expo-camera/legacy';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import { Platform } from 'react-native';

export default function usePermissions() {
  const [hasPermissions, setHasPermissions] = useState<boolean | null>(null);

  const requestPermissions = async () => {
    const cameraStatus = await Camera.requestCameraPermissionsAsync();
    const locationStatus = await Location.requestForegroundPermissionsAsync();
    let mediaLibraryStatus;
    if (Platform.OS !== 'web') {
      mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
    } else {
      mediaLibraryStatus = { status: 'granted' }; // assume granted on web
    }

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