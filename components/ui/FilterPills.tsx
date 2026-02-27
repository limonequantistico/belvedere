import React from 'react';
import { ScrollView } from 'react-native';
import { Button, XStack, Text, View } from 'tamagui';
import { useMapStore } from '../../store/useMapStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { triggerLightImpact } from '../../services/hapticsService';

const CATEGORIES = [
  { id: 'Nature', label: 'Nature', icon: '🌲' },
  { id: 'Urban', label: 'Urban', icon: '🏙️' },
  { id: 'Historic', label: 'Historic', icon: '🏛️' },
  { id: 'Monument', label: 'Monument', icon: '🗿' },
  { id: 'Panorama', label: 'Panorama', icon: '🌄' },
];

export function FilterPills() {
  const { 
    activeCategory, setActiveCategory, 
    verifiedOnly, setVerifiedOnly
  } = useMapStore();
  
  const insets = useSafeAreaInsets();

  return (
    <XStack
      position="absolute"
      top={insets.top + 70} // Below the search bar
      left={0}
      right={0}
      zIndex={10}
      pointerEvents="box-none"
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 8 }}
        keyboardShouldPersistTaps="handled"
      >
        <Button
          size="$3"
          circular={false}
          borderRadius="$8"
          backgroundColor={activeCategory === null && !verifiedOnly ? '$primary' : '$background'}
          borderColor={activeCategory === null && !verifiedOnly ? '$primary' : '$borderColor'}
          borderWidth={1}
          onPress={() => {
            triggerLightImpact();
            setActiveCategory(null);
            setVerifiedOnly(false);
          }}
          paddingHorizontal="$4"
          icon={<Text>🌍</Text>}
        >
          <Text
            color={activeCategory === null && !verifiedOnly ? '$primaryForeground' : '$color'}
            fontWeight={activeCategory === null && !verifiedOnly ? 'bold' : 'normal'}
          >
            All
          </Text>
        </Button>

        <View width={1} height="60%" backgroundColor="$borderColor" alignSelf="center" marginHorizontal="$2" />

        {/* Categories */}
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;

          return (
            <Button
              key={cat.id}
              size="$3"
              circular={false}
              borderRadius="$8"
              backgroundColor={isActive ? '$primary' : '$background'}
              borderColor={isActive ? '$primary' : '$borderColor'}
              borderWidth={1}
              onPress={() => {
                triggerLightImpact();
                setActiveCategory(isActive ? null : cat.id);
              }}
              paddingHorizontal="$4"
              icon={<Text>{cat.icon}</Text>}
            >
              <Text
                color={isActive ? '$primaryForeground' : '$color'}
                fontWeight={isActive ? 'bold' : 'normal'}
              >
                {cat.label}
              </Text>
            </Button>
          );
        })}
        {/* Removed distance pills row as the map now displays all points globally seamlessly */}
      </ScrollView>
    </XStack>
  );
}
