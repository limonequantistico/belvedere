import React from 'react';
import { YStack, Button } from 'tamagui';
import { Navigation, Layers, RefreshCw } from '@tamagui/lucide-icons';
import { useLocationStore } from '../../store/useLocationStore';
import { useMapStore } from '../../store/useMapStore';
import { useForceSyncViewpoints } from '../../hooks/useViewpointsSync';
import { MapStyleSelector } from './MapStyleSelector';

export function MapFABs() {
  const { requestLocation, isLoading } = useLocationStore();
  const { setCameraPosition } = useMapStore();
  const forceSync = useForceSyncViewpoints();

  const handleLocateMe = async () => {
    await requestLocation();
    const state = useLocationStore.getState();
    if (state.location) {
      setCameraPosition({
        centerCoordinate: [state.location.coords.longitude, state.location.coords.latitude],
        zoomLevel: 14,
      });
    }
  };

  return (
    <YStack
      position="absolute"
      bottom={200} // Above the bottom sheet
      right={16}
      zIndex={10}
      gap="$3"
    >
      {__DEV__ && (
        <Button
          size="$4"
          circular
          elevation={2}
          shadowColor="black"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.2}
          shadowRadius={4}
          bg="$background"
          icon={<RefreshCw size={20} color="$warning" />}
          onPress={forceSync}
        />
      )}
      
      <MapStyleSelector />
      
      <Button
        size="$4"
        circular
        elevation={2}
        shadowColor="black"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.2}
        shadowRadius={4}
        bg="$background"
        icon={<Navigation size={20} color={isLoading ? '$placeholderColor' : '$primary'} />}
        onPress={handleLocateMe}
        disabled={isLoading}
      />
    </YStack>
  );
}
