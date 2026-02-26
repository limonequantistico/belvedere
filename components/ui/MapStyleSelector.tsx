import React from 'react';
import { Button, Popover, YStack, XStack, Text } from 'tamagui';
import { Layers } from '@tamagui/lucide-icons';
import { useMapStore } from '../../store/useMapStore';
import { StyleURL } from '@rnmapbox/maps';

// Define the available styles
const MAP_STYLES = [
  { id: 'auto', name: 'Auto', url: 'auto' },
  { id: 'streets', name: 'Street', url: StyleURL.Street },
  { id: 'dark', name: 'Dark', url: StyleURL.Dark },
  { id: 'light', name: 'Light', url: StyleURL.Light },
  { id: 'outdoors', name: 'Outdoors', url: StyleURL.Outdoors },
  { id: 'satellite', name: 'Satellite', url: StyleURL.Satellite },
  { id: 'satellite-street', name: 'Satellite Street', url: StyleURL.SatelliteStreet },
  { id: 'traffic-day', name: 'Traffic Day', url: StyleURL.TrafficDay },
  { id: 'traffic-night', name: 'Traffic Night', url: StyleURL.TrafficNight },
];

export function MapStyleSelector() {
  const { mapStyle, setMapStyle } = useMapStore();

  return (
    <Popover size="$5" allowFlip placement="left">
      <Popover.Trigger asChild>
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
        />
      </Popover.Trigger>

      <Popover.Content
        borderWidth={1}
        borderColor="$borderColor"
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        elevate
        animation={[
          'quick',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
      >
        <Popover.Arrow borderWidth={1} borderColor="$borderColor" />

        <YStack space="$2" padding="$3">
          <Text fontWeight="bold" paddingBottom="$2">Map Style</Text>
          {MAP_STYLES.map((style) => (
            <Button
              key={style.id}
              size="$3"
              chromeless={mapStyle !== style.url}
              theme={mapStyle === style.url ? 'active' as any : undefined}
              onPress={() => setMapStyle(style.url)}
              justifyContent="flex-start"
            >
              {style.name}
            </Button>
          ))}
        </YStack>
      </Popover.Content>
    </Popover>
  );
}
