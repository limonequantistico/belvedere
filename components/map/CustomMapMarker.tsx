import React from 'react';
import { View, Dimensions } from 'react-native';
import { Text } from 'tamagui';
import MapboxGL from '@rnmapbox/maps';
import { useMapStore } from '../../store/useMapStore';

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
  const isActive = selectedViewpointId === id;

  const handlePress = () => {
    if (isActive) {
      // Deselect: reset pitch to flat view
      setSelectedViewpoint(null);
      setCameraPosition({ pitch: 0, padding: { paddingBottom: 0 } });
    } else {
      // Select: fly to marker with 3D pitch and padding to put it in upper half
      setSelectedViewpoint(id);
      setCameraPosition({
        centerCoordinate: coordinate,
        zoomLevel: 15,
        pitch: 45,
        padding: { paddingBottom: windowHeight * 0.4 },
      });
    }
  };

  return (
    <MapboxGL.MarkerView id={id} coordinate={coordinate}>
      <View
        onTouchEnd={handlePress}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isActive ? '#E65100' : 'white', // $primary
          borderRadius: 24,
          width: isActive ? 48 : 40,
          height: isActive ? 48 : 40,
          borderColor: isActive ? 'white' : '#E65100',
          borderWidth: 3,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.5,
          shadowRadius: 5,
          elevation: 8,
        }}
      >
        <Text fontSize={isActive ? "$6" : "$5"}>{getCategoryIcon(category)}</Text>
      </View>
    </MapboxGL.MarkerView>
  );
}
