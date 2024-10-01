import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { FlashMode } from 'expo-camera/legacy';
import { useState, useRef } from 'react';

export default function useCamera(cameraRef: React.RefObject<CameraView>) {
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [flashMode, setFlashMode] = useState<FlashMode>(FlashMode.off);
  const [zoom, setZoom] = useState(0);
  const [permission, requestPermission] = useCameraPermissions();

  const toggleCameraType = () => {
    setCameraType(current => (current === 'back' ? 'front' : 'back'));
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

  const takePicture = async () => {
    if (cameraRef.current && permission.granted) {
      const photo = await cameraRef.current.takePictureAsync();
      return photo;
    }
    return null;
  };

  return { cameraType, flashMode, zoom, toggleCameraType, toggleFlash, takePicture, permission, requestPermission };
}