import React from 'react';
import { View, Text } from 'react-native';
import MapboxGL from '@rnmapbox/maps';

type ClusterMarkerProps = {
  id: string;
  coordinate: [number, number];
  pointCount: number;
  onPress: () => void;
};

export function ClusterMarker({ id, coordinate, pointCount, onPress }: ClusterMarkerProps) {
  // Scale size slightly based on point count
  const size = Math.max(40, Math.min(60, 35 + (pointCount * 2)));

  return (
    <MapboxGL.PointAnnotation 
      id={id} 
      coordinate={coordinate}
      onSelected={onPress}
    >
      <View
        onTouchEnd={onPress}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: '#E65100', // Primary mapped
          justifyContent: 'center',
          alignItems: 'center',
          borderColor: 'white',
          borderWidth: 3,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 1, // Mapbox snapshotting requires fully opaque views sometimes
          shadowRadius: 5,
          elevation: 8,
          overflow: 'hidden',
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: size > 45 ? 16 : 14, textAlign: 'center', includeFontPadding: false }}>
          {pointCount}
        </Text>
      </View>
    </MapboxGL.PointAnnotation>
  );
}
