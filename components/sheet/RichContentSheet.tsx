import React, { useMemo, useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { YStack, Text, useThemeName, useTheme } from 'tamagui';
import { useViewpointsSync } from '../../hooks/useViewpointsSync';
import { FeaturedList } from './FeaturedList';
import { POIDetail } from './POIDetail';
import { useMapStore } from '../../store/useMapStore';
import { useLocationStore } from '../../store/useLocationStore';
import { calculateDistance } from '../../lib/locationUtils';
import { useBottomSheetSpringConfigs } from '@gorhom/bottom-sheet';
import { triggerSelection } from '../../services/hapticsService';

export function RichContentSheet() {
  const theme = useTheme();
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['20%', '50%', '85%'], []);
  const { data: viewpoints = [], isLoading } = useViewpointsSync();
  const { selectedViewpointId, setSelectedViewpoint, setCameraPosition } = useMapStore();
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

  const selectedViewpoint = useMemo(() => {
    if (!selectedViewpointId) return null;
    return viewpoints.find(vp => vp.id === selectedViewpointId) || null;
  }, [selectedViewpointId, viewpoints]);

  // Snap sheet when a viewpoint is selected
  useEffect(() => {
    if (selectedViewpointId) {
      // Snap to 50% when a marker is tapped
      sheetRef.current?.snapToIndex(1);
    }
  }, [selectedViewpointId]);

  const themeName = useThemeName();
  const isDark = themeName.startsWith('dark');

  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    overshootClamping: true,
    stiffness: 500,
  });

  return (
    <BottomSheet
      ref={sheetRef}
      index={1} // Start at 50%
      snapPoints={snapPoints}
      animationConfigs={animationConfigs}
      onChange={(index) => triggerSelection()}

      backgroundStyle={[styles.background, {
        backgroundColor: theme.background.val,
        borderRadius: 24,
      }]}
      handleIndicatorStyle={
        selectedViewpoint
          ? [styles.indicator, { 
              backgroundColor: isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)', 
              shadowColor: theme.shadowColor?.get() as string, 
              shadowOffset: { width: 0, height: 1 }, 
              shadowOpacity: 0.3, 
              shadowRadius: 2, 
              elevation: 3 
            }]
          : [styles.indicator, { backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }]
      }
      handleStyle={
        selectedViewpoint
          ? { position: 'absolute', zIndex: 999, top: 0, width: '100%' }
          : undefined
      }
    >
      {selectedViewpoint ? (
        <POIDetail 
          viewpoint={selectedViewpoint} 
          onClose={() => {
            setSelectedViewpoint(null);
            setCameraPosition({ pitch: 0, zoomLevel: 12 });
          }} 
        />
      ) : (
        <>
          <YStack padding="$4" gap="$2" paddingBottom="$2">
            <Text fontSize="$6" fontWeight="bold" color="$color">Featured Near You</Text>
            <Text color="$color">Discover viewpoints around you</Text>
          </YStack>

          {/* We use Gorhom's internal scrollable to prevent gesture conflicts */}
          <FeaturedList 
            viewpoints={featuredViewpoints}
            isLoading={isLoading}
            onViewpointPress={(vp) => {
              setSelectedViewpoint(vp.id);
              setCameraPosition({
                centerCoordinate: [vp.lng, vp.lat],
                zoomLevel: 15,
                pitch: 45,
              });
            }}
          />
        </>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  background: {
    // backgroundColor: '#fff',
    // borderRadius: 24,
  },
  indicator: {
    // backgroundColor: 'rgba(0,0,0,0.2)',
    width: 40,
  },
});
