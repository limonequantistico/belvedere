import React from 'react';
import { YStack, Button } from 'tamagui';
import { Navigation, Layers } from '@tamagui/lucide-icons';
import { useLocationStore } from '../../store/useLocationStore';

export function MapFABs() {
  const { requestLocation, isLoading } = useLocationStore();

  const handleLocateMe = async () => {
    await requestLocation();
    // In a real app, this would also tell the map camera to fly to the new coordinates
  };

  return (
    <YStack
      position="absolute"
      bottom={120} // Above the bottom sheet
      right={16}
      zIndex={10}
      gap="$3"
    >
      <Button
        size="$4"
        circular
        elevation={2}
        shadowColor="black"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.2}
        shadowRadius={4}
        bg="$background"
        icon={<Layers size={20} color="$color" />}
        onPress={() => console.log('Toggle Map Layers')}
      />
      
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
