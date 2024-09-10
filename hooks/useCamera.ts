import { useState, useRef } from 'react';
//import { Camera, CameraType, FlashMode } from 'expo-camera';
import { Camera, CameraType, FlashMode } from 'expo-camera/legacy';
import * as MediaLibrary from 'expo-media-library';
import * as ImageManipulator from 'expo-image-manipulator';

export default function useCamera(cameraRef: React.RefObject<Camera>) {
  const [cameraType, setCameraType] = useState<CameraType>(CameraType.back);
  const [flashMode, setFlashMode] = useState<FlashMode>(FlashMode.off);
  const [zoom, setZoom] = useState(0);

  const toggleCameraType = () => {
    setCameraType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  };

  const toggleFlash = () => {
    setFlashMode(current => {
      switch (current) {
        case FlashMode.off: return FlashMode.on;
        case FlashMode.on: return FlashMode.auto;
        default: return FlashMode.off;
      }
    });
  };

  const takePicture = async (location, address) => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      const manipulatedImage = await addExifData(photo.uri, location, address);
      await MediaLibrary.createAssetAsync(manipulatedImage.uri);
    }
  };

  const addExifData = async (uri, location, address) => {
    const locationString = `${location?.coords.latitude},${location?.coords.longitude}`;
    const addressString = `${address?.city}, ${address?.region}, ${address?.country}`;
    const dateTimeString = new Date().toISOString();

    return ImageManipulator.manipulateAsync(
      uri,
      [],
      {
        exif: {
          GPSLatitude: location?.coords.latitude,
          GPSLongitude: location?.coords.longitude,
          GPSLatitudeRef: location?.coords.latitude >= 0 ? 'N' : 'S',
          GPSLongitudeRef: location?.coords.longitude >= 0 ? 'E' : 'W',
          DateTimeOriginal: dateTimeString,
          UserComment: `Location: ${locationString}\nAddress: ${addressString}`,
        }
      }
    );
  };

  return { cameraType, flashMode, zoom, toggleCameraType, toggleFlash, takePicture };
}