import React from 'react';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { ViewpointLite } from '../../hooks/useViewpointsSync';
import { ViewpointCard } from './ViewpointCard';
import { YStack, Text } from 'tamagui';

type FeaturedListProps = {
  viewpoints: ViewpointLite[];
  onViewpointPress: (viewpoint: ViewpointLite) => void;
};

export function FeaturedList({ viewpoints, onViewpointPress }: FeaturedListProps) {
  if (viewpoints.length === 0) {
    return (
      <YStack padding="$4" alignItems="center" justifyContent="center" opacity={0.5}>
        <Text color="$color">No viewpoints found.</Text>
      </YStack>
    );
  }

  return (
    <BottomSheetFlatList
      data={viewpoints}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ViewpointCard 
          viewpoint={item} 
          onPress={() => onViewpointPress(item)} 
        />
      )}
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
      ItemSeparatorComponent={() => <YStack height={8} />}
    />
  );
}
