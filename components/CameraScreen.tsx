import React, { useState, useRef, useEffect } from 'react';
import { ImageBackground, Text, StyleSheet, View, TouchableOpacity, Alert, Dimensions, Platform, StatusBar } from 'react-native';
import { Camera } from 'expo-camera/legacy';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as MediaLibrary from 'expo-media-library';
import ViewShot from 'react-native-view-shot';
import * as IntentLauncher from 'expo-intent-launcher';
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
  const [cameraOverlay, setCameraOverlay] = useState(null);
  const cameraRef = useRef(null);
  const viewShotRef = useRef(null);
  const locationInfo = useLocation();
  const { cameraType, flashMode, zoom, toggleCameraType, toggleFlash, takePicture } = useCamera(cameraRef);
  const [isFlashPressed, setIsFlashPressed] = useState(false);

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
      // Take the picture
      const photo = await takePicture();
      if (!photo) {
        throw new Error("Failed to take picture");
      }

      // Create location text
      const locationText = [
        `${locationInfo.address?.city || ''}, ${locationInfo.address?.region || ''}, ${locationInfo.address?.country || ''}`,
        `${new Date().toLocaleString()}`,
        `Lat: ${locationInfo.location?.coords.latitude.toFixed(6) || ''}, Long: ${locationInfo.location?.coords.longitude.toFixed(6) || ''}`,
        `${locationInfo.address?.name || ''}`
      ].filter(Boolean).join('\n');

      // Create a promise to capture the ViewShot
      const captureViewShot = () => new Promise((resolve) => {
        viewShotRef.current.capture().then(resolve);
      });

      // Render the component with ImageBackground and capture it
      const overlayUri = await new Promise((resolve) => {
        const OverlayComponent = () => (
          <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 1 }}>
            <ImageBackground source={{ uri: photo.uri }} style={{ width: cameraDimensions.width, height: cameraDimensions.height }}>
              <View style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                padding: 10,
              }}>
                <Text style={{ color: 'white', fontSize: 12 }}>{locationText}</Text>
              </View>
            </ImageBackground>
          </ViewShot>
        );

        // Set the OverlayComponent to the state
        setCameraOverlay(<OverlayComponent />);

        // Capture the ViewShot after a short delay to ensure it's rendered
        setTimeout(async () => {
          const uri = await captureViewShot();
          setCameraOverlay(null);
          resolve(uri);
        }, 100);
      });

      // Save the final image to the gallery
      await MediaLibrary.saveToLibraryAsync(overlayUri);

      Alert.alert("Success", "Photo with location overlay saved to gallery!");
    } catch (error) {
      console.error("Error taking picture:", error);
      Alert.alert("Error", "Failed to take picture. Please try again.");
    }
  };
 
  const openGallery = async () => {
    if (hasMediaLibraryPermission) {
      try {
        if (Platform.OS === 'ios') {
          // For iOS, we'll use the photos app
          await MediaLibrary.presentPermissionsPickerAsync();
        } else if (Platform.OS === 'android') {
          // For Android, we'll use an intent to open the gallery
          await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
            data: 'content://media/internal/images/media',
            flags: 1,
          });
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
      case Camera.Constants.FlashMode.on: return 'flashlight-on';
      case Camera.Constants.FlashMode.off: return 'flashlight-off';
      case Camera.Constants.FlashMode.auto: return 'highlight';
    }
  };

  const handleFlashToggle = () => {
    setIsFlashPressed(true);
    setTimeout(() => {
      setIsFlashPressed(false);
      toggleFlash();
    }, 150);
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
        <TouchableOpacity 
            style={[styles.iconButton, isFlashPressed && styles.iconButtonPressed]} 
            onPress={handleFlashToggle}
          >
            <MaterialIcons name={getFlashIcon()} size={24} color="white" />
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
        <View style={styles.locationInfoContainer}>
          <LocationInfo location={locationInfo.location} address={locationInfo.address} />
        </View>
        {cameraOverlay}
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
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
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
  locationInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
  },
  cameraPreview: {
    flex: 0.8,
  },
});