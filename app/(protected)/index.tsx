import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { useLocationStore } from '../../store/useLocationStore';
import { useMapStore } from '../../store/useMapStore';
import { useViewpointsSync } from '../../hooks/useViewpointsSync';
import { FloatingSearch } from '../../components/ui/FloatingSearch';
import { FilterPills } from '../../components/ui/FilterPills';
import { MapFABs } from '../../components/ui/MapFABs';
import { CustomMapMarker } from '../../components/map/CustomMapMarker';
import { ClusterMarker } from '../../components/map/ClusterMarker';
import useSupercluster from 'use-supercluster';
import { useStyledToast } from '@/hooks/useStyledToast';
import { RichContentSheet } from '../../components/sheet/RichContentSheet';
import { YStack, useThemeName, useTheme } from 'tamagui';
import { useAppTheme } from '@/context/ManualThemeProvider';

// Set Mapbox access token
MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || process.env.EXPO_PUBLIC_MAPBOX_KEY || '');

export default function MapScreen() {
  const mapRef = useRef<MapboxGL.MapView>(null);
  const cameraRef = useRef<any>(null); // Use any for MapboxGL.Camera ref
  const { location, requestLocation } = useLocationStore();
  const { cameraPosition, activeCategory, verifiedOnly, mapStyle } = useMapStore();
  const [hasSetInitialLocation, setHasSetInitialLocation] = useState(false);
  const previousCameraPosition = useRef(cameraPosition);

  const { themeMode } = useAppTheme();
  const tamaguiThemeName = useThemeName();
  const theme = useTheme();
  
  // Decide Mapbox style based on Tamagui active theme (or explicit themeMode)
  const isDarkMode = tamaguiThemeName.startsWith('dark');
  const autoStyle = isDarkMode ? MapboxGL.StyleURL.TrafficNight : MapboxGL.StyleURL.Outdoors;
  const resolvedMapStyle = (!mapStyle || mapStyle === 'auto') ? autoStyle : mapStyle;

  const toast = useStyledToast();
  
  // Clustering state
  const [bounds, setBounds] = useState<[number, number, number, number]>([-180, -85, 180, 85]);
  const [zoom, setZoom] = useState(1);

  // Fetch the entire viewpoints global dataset from local MMKV storage
  // (Or from Supabase if it's the first launch/syncing)
  const { data: viewpoints = [] } = useViewpointsSync();

  useEffect(() => {
    // Request location on mount
    requestLocation();
  }, []);

  useEffect(() => {
    // Fly to user location *once* when it's first acquired
    if (location && !hasSetInitialLocation) {
      const { height: windowHeight } = Dimensions.get('window');
      cameraRef.current?.setCamera({
        centerCoordinate: [location.coords.longitude, location.coords.latitude],
        zoomLevel: 12,
        animationDuration: 1500,
        padding: { paddingBottom: windowHeight * 0.35 },
      });
      setHasSetInitialLocation(true);
    }
  }, [location, hasSetInitialLocation]);

  useEffect(() => {
    // Only imperative moves when search result triggers `setCameraPosition`
    if (previousCameraPosition.current !== cameraPosition) {
      cameraRef.current?.setCamera({
        centerCoordinate: cameraPosition.centerCoordinate as [number, number],
        zoomLevel: cameraPosition.zoomLevel,
        pitch: cameraPosition.pitch || 0,
        heading: cameraPosition.heading || 0,
        padding: cameraPosition.padding || { paddingBottom: 0 },
        animationDuration: 1500,
      });
      previousCameraPosition.current = cameraPosition;
    }
  }, [cameraPosition]);

  const handleRegionIsChanging = (feature: any) => {
    // Extract zoom level during camera animations/panning for fluid cluster expansion
    const zoomLevel = feature?.properties?.zoomLevel;
    if (zoomLevel !== undefined && zoomLevel !== zoom) {
      setZoom(zoomLevel);
    }
  };

  const handleRegionDidChange = async () => {
    if (!mapRef.current) return;
    try {
      const zoomLevel = await mapRef.current.getZoom();
      
      // Update zoom on idle for final precision
      setZoom(zoomLevel);
    } catch (e) {
      console.warn("Could not calculate zoom for clustering", e);
    }
  };

  // Filter viewpoint logic
  const filteredViewpoints = viewpoints.filter(vp => {
    if (activeCategory && vp.category_name !== activeCategory) return false;
    if (verifiedOnly && !vp.verified) return false;
    return true;
  });

  // Prepare points for supercluster
  const points = filteredViewpoints.map(vp => ({
    type: 'Feature' as const,
    properties: {
      cluster: false,
      viewpointId: vp.id,
      category: vp.category_name,
      name: vp.name,
      verified: vp.verified
    },
    geometry: {
      type: 'Point' as const,
      coordinates: [vp.lng, vp.lat]
    }
  }));

  // Cluster data
  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 60, maxZoom: 16 }
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background?.get() as string }]}>
      <MapboxGL.MapView 
        ref={mapRef}
        style={styles.map} 
        styleURL={resolvedMapStyle}
        logoEnabled={false}
        attributionEnabled={false}
        pitchEnabled={true}
        rotateEnabled={false}
        onMapIdle={handleRegionDidChange}
        onCameraChanged={handleRegionIsChanging}
        onDidFinishLoadingMap={handleRegionDidChange}
      >
        <MapboxGL.Camera
          ref={cameraRef}
          defaultSettings={{
            centerCoordinate: cameraPosition.centerCoordinate as [number, number],
            zoomLevel: cameraPosition.zoomLevel,
            pitch: cameraPosition.pitch || 0,
            heading: cameraPosition.heading || 0,
          }}
        />
        
        {location && (
          <MapboxGL.UserLocation 
            visible={true} 
            showsUserHeadingIndicator={true}
          />
        )}
        
        {/* Dynamic Clustered Markers */}
        {clusters.map((cluster) => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const { cluster: isCluster, point_count: pointCount } = cluster.properties;

          if (isCluster) {
             return (
               <ClusterMarker
                 key={`cluster-${cluster.id}`}
                 id={`cluster-${cluster.id}`}
                 coordinate={[longitude, latitude] as [number, number]}
                 pointCount={pointCount}
                 onPress={() => {
                   const expansionZoom = Math.min(
                     supercluster.getClusterExpansionZoom(cluster.id),
                     18
                   );
                   cameraRef.current?.setCamera({
                     centerCoordinate: [longitude, latitude],
                     zoomLevel: expansionZoom,
                     animationDuration: 1500, // Cluster to POIs zoom animation duration
                   });
                 }}
               />
             );
          }

          return (
            <CustomMapMarker
              key={`vp-${cluster.properties.viewpointId}`}
              id={cluster.properties.viewpointId}
              coordinate={[longitude, latitude] as [number, number]}
              title={cluster.properties.name}
              category={cluster.properties.category}
            />
          );
        })}
      </MapboxGL.MapView>

      {/* Floating UI Overlays */}
      <FloatingSearch />
      <FilterPills />
      <MapFABs />
      <YStack position="absolute" top={0} bottom={0} left={0} right={0} zIndex={100} pointerEvents="box-none">
        <RichContentSheet />
      </YStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
