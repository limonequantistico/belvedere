import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from 'tamagui';
import MapboxGL from '@rnmapbox/maps';
import { triggerMediumImpact } from '../../services/hapticsService';

type ClusterMarkerProps = {
  id: string;
  coordinate: [number, number];
  pointCount: number;
  onPress: () => void;
};

export function ClusterMarker({ id, coordinate, pointCount, onPress }: ClusterMarkerProps) {
  const theme = useTheme();
  // Scale size slightly based on point count
  const size = Math.max(40, Math.min(60, 35 + (pointCount * 2)));

  const handlePress = () => {
    triggerMediumImpact();
    onPress();
  };

  return (
    <MapboxGL.PointAnnotation 
      id={id} 
      coordinate={coordinate}
      onSelected={handlePress}
    >
      <View
        onTouchEnd={handlePress}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.primary?.get() as string, // Primary mapped
          justifyContent: 'center',
          alignItems: 'center',
          borderColor: theme.background?.get() as string,
          borderWidth: 3,
          shadowColor: theme.shadowColor?.get() as string,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 1, // Mapbox snapshotting requires fully opaque views sometimes
          shadowRadius: 5,
          elevation: 8,
          overflow: 'hidden',
        }}
      >
        <Text style={{ color: theme.background?.get() as string, fontWeight: "bold", fontSize: size > 45 ? 16 : 14, textAlign: 'center', includeFontPadding: false }}>
          {pointCount}
        </Text>
      </View>
    </MapboxGL.PointAnnotation>
  );
}
