import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import * as Location from 'expo-location';
import { Platform } from 'react-native';

interface LocationInfoProps {
  location: Location.LocationObject | null;
  address: Location.LocationGeocodedAddress | null;
  style?: ViewStyle;
}

export default function LocationInfo({ location, address, style }: LocationInfoProps) {
  if (!location || !address) return null;

  return (
    Platform.OS === 'ios' ? (
        <View style={[styles.locationContainer, style]}>
          <Text style={styles.locationText}>{address.name}, {address.street}, {address.district}, {address.city}, {address.region}, {address.postalCode}, {address.country}</Text>
          <Text style={styles.locationText}>Lat: {location.coords.latitude.toFixed(6)}, Long: {location.coords.longitude.toFixed(6)}</Text>
          <Text style={styles.locationText}>{new Date().toLocaleString()}</Text>
      </View>
    ) : Platform.OS === 'android' ? (
      <View style={[styles.locationContainer, style]}>
          <Text style={styles.locationText}>{address.formattedAddress}</Text>
          <Text style={styles.locationText}>Lat: {location.coords.latitude.toFixed(6)}, Long: {location.coords.longitude.toFixed(6)}</Text>
          <Text style={styles.locationText}>{new Date().toLocaleString()}</Text>
      </View>
    ) : null
  )
};

const styles = StyleSheet.create({
  locationContainer: {
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