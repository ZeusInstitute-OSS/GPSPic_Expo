import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Location from 'expo-location';

interface LocationInfoProps {
  location: Location.LocationObject | null;
  address: Location.LocationGeocodedAddress | null;
}

export default function LocationInfo({ location, address }: LocationInfoProps) {
  if (!location || !address) return null;

  return (
    <View style={styles.locationContainer}>
      <Text style={styles.locationText}>{address.city}, {address.region}, {address.country}</Text>
      <Text style={styles.locationText}>{new Date().toLocaleString()}</Text>
      <Text style={styles.locationText}>Lat: {location.coords.latitude.toFixed(6)}, Long: {location.coords.longitude.toFixed(6)}</Text>
      <Text style={styles.locationText}>{address.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  locationContainer: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 10,
  },
  locationText: {
    color: 'white',
    fontSize: 12,
    marginBottom: 5,
  },
});