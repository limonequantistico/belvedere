import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { YStack, Text } from 'tamagui';
import { useViewpointsSync } from '../../hooks/useViewpointsSync';
import { FeaturedList } from './FeaturedList';
import { useMapStore } from '../../store/useMapStore';
import { useLocationStore } from '../../store/useLocationStore';
import { calculateDistance } from '../../lib/locationUtils';

export function RichContentSheet() {
  const snapPoints = useMemo(() => ['20%', '50%', '85%'], []);
  const { data: viewpoints = [] } = useViewpointsSync();
  const { setSelectedViewpoint, setCameraPosition } = useMapStore();
  const { location } = useLocationStore();

  const featuredViewpoints = useMemo(() => {
    if (!location) return viewpoints.slice(0, 10); // fallback if no location

    const withDistance = viewpoints.map(vp => {
      const distance = calculateDistance(
        location.coords.latitude,
        location.coords.longitude,
        vp.lat,
        vp.lng
      );
      return { ...vp, distance };
    });

    // Sort by distance and take top 10 within reasonable range (e.g. 50km)
    return withDistance
      .filter(vp => vp.distance <= 50)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10);
  }, [viewpoints, location]);

  return (
    <BottomSheet
      index={1} // Start at 50%
      snapPoints={snapPoints}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.indicator}
    >
      <YStack padding="$4" gap="$2" paddingBottom="$2">
        <Text fontSize="$6" fontWeight="bold">Featured Near You</Text>
        <Text color="$color">Discover viewpoints around you</Text>
      </YStack>

      {/* We use Gorhom's internal scrollable to prevent gesture conflicts */}
      <FeaturedList 
        viewpoints={featuredViewpoints}
        onViewpointPress={(vp) => {
          setSelectedViewpoint(vp.id);
          setCameraPosition({
            centerCoordinate: [vp.lng, vp.lat],
            zoomLevel: 15,
            pitch: 45,
          });
        }}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  background: {
    backgroundColor: '#fff',
    borderRadius: 24,
  },
  indicator: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    width: 40,
  },
});
