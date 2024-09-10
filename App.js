import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import CameraScreen from './components/CameraScreen';
import usePermissions from './hooks/usePermissions';

export default function App() {
  const { hasPermissions, requestPermissions } = usePermissions();

  if (hasPermissions === null) {
    return <View style={styles.container}><StatusBar style="light" /></View>;
  }

  if (!hasPermissions) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <Text style={styles.text}>We need your permissions to use the app</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermissions}>
          <Text style={styles.buttonText}>Grant Permissions</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <CameraScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});