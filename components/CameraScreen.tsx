import React, { useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import useLocation from '../hooks/useLocation';
import useCamera from '../hooks/useCamera';
import GridOverlay from './GridOverlay';
import LocationInfo from './LocationInfo';

export default function CameraScreen() {
  const [gridType, setGridType] = useState('none');
  const cameraRef = useRef<Camera>(null);
  const getLocationInfo = useLocation();
  const { cameraType, flashMode, zoom, toggleCameraType, toggleFlash, takePicture } = useCamera(cameraRef);

  const handleCapture = async () => {
    try {
      const { location, address } = getLocationInfo();
      await takePicture(location, address);
      Alert.alert("Success", "Photo saved to gallery!");
    } catch (error) {
      console.error("Error taking picture:", error);
      Alert.alert("Error", "Failed to take picture. Please try again.");
    }
  };

  const { location, address } = getLocationInfo();

  return (
    <Camera 
      style={styles.camera} 
      type={cameraType}
      flashMode={flashMode}
      zoom={zoom}
      ref={cameraRef}
    >
      <View style={styles.topButtonContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={toggleFlash}>
          <Ionicons name={`flash-${flashMode}`} size={24} color="white" />
        </TouchableOpacity>
        <Picker
          selectedValue={gridType}
          style={styles.picker}
          onValueChange={(itemValue) => setGridType(itemValue)}
        >
          <Picker.Item label="No Grid" value="none" />
          <Picker.Item label="Rule of Thirds" value="thirds" />
          <Picker.Item label="Golden Ratio" value="golden" />
        </Picker>
      </View>
      <GridOverlay type={gridType} />
      <LocationInfo location={location} address={address} />
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={() => {/* TODO: Implement gallery opening logic */}}>
          <Ionicons name="images" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={toggleCameraType}>
          <Ionicons name="camera-reverse" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </Camera>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  topButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  picker: {
    width: 150,
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});