import React from 'react';
import { View } from 'react-native';
import { Text } from 'tamagui';
import MapboxGL from '@rnmapbox/maps';
import { useMapStore } from '../../store/useMapStore';

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
    <MapboxGL.MarkerView id={id} coordinate={coordinate}>
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
          shadowOpacity: 0.5,
          shadowRadius: 5,
          elevation: 8,
        }}
      >
        <Text color="white" fontWeight="bold" fontSize={size > 45 ? "$5" : "$4"}>
          {pointCount}
        </Text>
      </View>
    </MapboxGL.MarkerView>
  );
}
