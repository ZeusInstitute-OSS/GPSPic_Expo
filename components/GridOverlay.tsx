import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

interface GridOverlayProps {
  type: 'none' | 'thirds' | 'golden';
}

export default function GridOverlay({ type }: GridOverlayProps) {
  if (type === 'none') return null;

  const { width, height } = Dimensions.get('window');

  const goldenRatio = 1.618;

  return (
    <View style={styles.gridContainer}>
      {type === 'thirds' && (
        <>
          <View style={[styles.gridLine, { left: '33.33%' }]} />
          <View style={[styles.gridLine, { left: '66.66%' }]} />
          <View style={[styles.gridLine, { top: '33.33%', width: '100%', height: 1 }]} />
          <View style={[styles.gridLine, { top: '66.66%', width: '100%', height: 1 }]} />
        </>
      )}
      {type === 'golden' && (
        <>
          <View style={[styles.gridLine, { left: `${100 / goldenRatio}%` }]} />
          <View style={[styles.gridLine, { left: `${100 - (100 / goldenRatio)}%` }]} />
          <View style={[styles.gridLine, { top: `${100 / goldenRatio}%`, width: '100%', height: 1 }]} />
          <View style={[styles.gridLine, { top: `${100 - (100 / goldenRatio)}%`, width: '100%', height: 1 }]} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
});