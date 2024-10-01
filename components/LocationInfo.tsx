import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { Platform } from 'react-native';

interface LocationInfoProps {
  location: Location.LocationObject | null;
  address: Location.LocationGeocodedAddress | null;
}

export default function LocationInfo({ location, address }: LocationInfoProps) {
  if (!location || !address) return null;

  return (
    Platform.OS === 'ios' ? (
        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>{address.name}, {address.street}, {address.district}, {address.city}, {address.region}, {address.postalCode}, {address.country}</Text>
          <Text style={styles.locationText}>Lat: {location.coords.latitude.toFixed(6)}, Long: {location.coords.longitude.toFixed(6)}</Text>
          <Text style={styles.locationText}>{new Date().toLocaleString()}</Text>
      </View>
    ) : Platform.OS === 'android' ? (
      <View style={styles.locationContainer}>
          <Text style={styles.locationText}>{address.formattedAddress}</Text>
          <Text style={styles.locationText}>Lat: {location.coords.latitude.toFixed(6)}, Long: {location.coords.longitude.toFixed(6)}</Text>
          <Text style={styles.locationText}>{new Date().toLocaleString()}</Text>
      </View>
    ) : null
  )
};

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