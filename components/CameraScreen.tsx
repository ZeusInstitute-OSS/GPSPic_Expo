import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, Dimensions, Platform, StatusBar } from 'react-native';
import { Camera } from 'expo-camera/legacy';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { captureRef } from 'react-native-view-shot';
import useLocation from '../hooks/useLocation';
import useCamera from '../hooks/useCamera';
import GridOverlay from './GridOverlay';
import LocationInfo from './LocationInfo';

const DESIRED_RATIO = '16:9';
const CONTROL_HEIGHT = 100;

export default function CameraScreen() {
  const [gridType, setGridType] = useState('none');
  const [isRatioSet, setIsRatioSet] = useState(false);
  const [cameraDimensions, setCameraDimensions] = useState({ width: 0, height: 0 });
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(false);
  const cameraRef = useRef(null);
  const previewRef = useRef(null);
  const locationInfo = useLocation();
  const { cameraType, flashMode, zoom, toggleCameraType, toggleFlash, takePicture } = useCamera(cameraRef);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(status === 'granted');
    })();

    const updateCameraDimensions = () => {
      const screenWidth = Dimensions.get('window').width;
      const screenHeight = Dimensions.get('window').height;
      const statusBarHeight = StatusBar.currentHeight || 0;
      const availableHeight = screenHeight - CONTROL_HEIGHT - statusBarHeight;

      let width, height;
      if (availableHeight / screenWidth > 16/9) {
        width = screenWidth;
        height = (screenWidth * 16) / 9;
      } else {
        height = availableHeight;
        width = (availableHeight * 9) / 16;
      }

      setCameraDimensions({ width, height });
    };

    updateCameraDimensions();
    const subscription = Dimensions.addEventListener('change', updateCameraDimensions);

    return () => subscription.remove();
  }, []);

  const prepareRatio = async () => {
    if (Platform.OS === 'android' && cameraRef.current) {
      const ratios = await cameraRef.current.getSupportedRatiosAsync();
      const desiredRatio = ratios.find((ratio) => ratio === DESIRED_RATIO) || ratios[ratios.length - 1];
      setIsRatioSet(true);
      return desiredRatio;
    }
    return DESIRED_RATIO;
  };

  const handleCapture = async () => {
    try {
      const photo = await takePicture();
      if (photo) {
        await MediaLibrary.saveToLibraryAsync(photo.uri);
        Alert.alert("Success", "Photo saved to gallery!");
      } else {
        throw new Error("Failed to take picture");
      }
    } catch (error) {
      console.error("Error taking picture:", error);
      Alert.alert("Error", "Failed to take picture. Please try again.");
    }
  };

  const openGallery = async () => {
    if (hasMediaLibraryPermission) {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          aspect: [4, 3],
          quality: 1,
        });

        if (!result.canceled) {
          // Here you can handle the selected image
          // For example, you could display it or send it to a server
          console.log(result.assets[0].uri);
          Alert.alert("Success", "Image selected from gallery!");
        }
      } catch (error) {
        console.error("Error opening gallery:", error);
        Alert.alert("Error", "Failed to open gallery. Please try again.");
      }
    } else {
      Alert.alert("Permission Required", "Please grant permission to access your media library.");
    }
  };

  const getFlashIcon = () => {
    switch (flashMode) {
      case Camera.Constants.FlashMode.on: return 'bolt';
      case Camera.Constants.FlashMode.off: return 'xmark';
      case Camera.Constants.FlashMode.auto: return 'cloud-bolt';
    }
  };

  const renderGalleryButton = () => {
    if (Platform.OS === 'web') {
      return null;
    }

    return (
      <TouchableOpacity style={styles.iconButton} onPress={openGallery}>
        <FontAwesome name="image" size={24} color="white" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View 
        style={[
          styles.cameraContainer,
          { width: cameraDimensions.width, height: cameraDimensions.height }
        ]}
      >
        <Camera 
          style={StyleSheet.absoluteFillObject}
          type={cameraType}
          flashMode={flashMode}
          zoom={zoom}
          ref={cameraRef}
          ratio={isRatioSet ? DESIRED_RATIO : undefined}
          onCameraReady={prepareRatio}
        />
        <GridOverlay type={gridType} />
        <View style={styles.topButtonContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleFlash}>
            <FontAwesome name={getFlashIcon()} size={24} color="white" />
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
        <LocationInfo location={locationInfo.location} address={locationInfo.address} />
      </View>
      <View style={styles.bottomButtonContainer}>
        {renderGalleryButton()}
        <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={toggleCameraType}>
          <FontAwesome name="repeat" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  cameraContainer: {
    alignSelf: 'center',
    marginTop: StatusBar.currentHeight,
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
    height: CONTROL_HEIGHT,
    backgroundColor: 'black',
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