import React from 'react';
import { View, Dimensions } from 'react-native';
import { Text, useThemeName, useTheme } from 'tamagui';
import MapboxGL from '@rnmapbox/maps';
import { useMapStore } from '../../store/useMapStore';
import { triggerMediumImpact } from '../../services/hapticsService';
import { Heart } from '@tamagui/lucide-icons';
import { useFavorites } from '../../hooks/useFavorites';

const { height: windowHeight } = Dimensions.get('window');

type CustomMapMarkerProps = {
  id: string;
  coordinate: [number, number];
  title: string;
  category: string;
};

// Map category to an emoji/icon (fallback logic)
const getCategoryIcon = (category?: string) => {
  switch ((category || '').toLowerCase()) {
    case 'nature': return '🌲';
    case 'urban': return '🏙️';
    case 'historic': return '🏛️';
    case 'monument': return '🗿';
    default: return '📍';
  }
};

export function CustomMapMarker({ id, coordinate, title, category }: CustomMapMarkerProps) {
  const { selectedViewpointId, setSelectedViewpoint, setCameraPosition } = useMapStore();
  const { data: favorites = [] } = useFavorites();
  const isActive = selectedViewpointId === id;
  const isFavorite = favorites.includes(id);
  const theme = useTheme();
  const themeName = useThemeName();
  const isDark = themeName.startsWith('dark');
  
  const markerBg = isActive ? theme.primary?.get() as string : theme.background?.get() as string;
  const markerBorder = isActive ? theme.background?.get() as string : theme.primary?.get() as string;

  const handlePress = () => {
    triggerMediumImpact();
    if (isActive) {
      // Deselect: reset pitch to flat view
      setSelectedViewpoint(null);
      setCameraPosition({ pitch: 0, zoomLevel: 12});
    } else {
      // Select: fly to marker with 3D pitch and padding to put it in upper half
      setSelectedViewpoint(id);
      setCameraPosition({
        centerCoordinate: coordinate,
        zoomLevel: 15,
        pitch: 45,
        padding: { paddingBottom: windowHeight * 0.35 },
      });
    }
  };

  return (
    <MapboxGL.MarkerView id={id} coordinate={coordinate}>
      <View
        onTouchEnd={handlePress}
        accessible={true}
        accessibilityLabel={`${title}, category: ${category}${isActive ? ', selected' : ''}`}
        accessibilityRole="button"
        accessibilityHint="Tap to view details for this spot on the map."
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: markerBg,
          borderRadius: 24,
          width: isActive ? 48 : 44, // Increased from 40 to 44 for touch target
          height: isActive ? 48 : 44, // Increased from 40 to 44
          borderColor: markerBorder,
          borderWidth: 3,
          shadowColor: theme.shadowColor?.get() as string,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.5,
          shadowRadius: 5,
          elevation: 8,
        }}
      >
        <Text fontSize={isActive ? "$6" : "$5"}>{getCategoryIcon(category)}</Text>
        {isFavorite && (
          <View
            style={{
              position: 'absolute',
              top: -6,
              right: -6,
              backgroundColor: markerBg,
              borderRadius: 12,
              width: 24,
              height: 24,
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: markerBorder,
              borderWidth: 2,
              shadowColor: theme.shadowColor?.get() as string,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 2,
              elevation: 4,
            }}
          >
            <Heart size={12} color={isActive ? "$background" : "$primary"} fill={isActive ? "$background" : "$primary"} />
          </View>
        )}
      </View>
    </MapboxGL.MarkerView>
  );
}
