import { useState, useRef } from 'react';
import { Camera, CameraType, FlashMode } from 'expo-camera/legacy';

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

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      return photo;
    }
    return null;
  };

  return { cameraType, flashMode, zoom, toggleCameraType, toggleFlash, takePicture };
}