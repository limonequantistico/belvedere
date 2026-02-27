import React from 'react';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { ViewpointLite } from '../../hooks/useViewpointsSync';
import { ViewpointCard } from './ViewpointCard';
import { YStack } from 'tamagui';
import { SkeletonViewpointCard } from '../reusable-ui/SkeletonViewpointCard';
import { EmptyState } from '../reusable-ui/EmptyState';
import { Search } from '@tamagui/lucide-icons';

type FeaturedListProps = {
  viewpoints: ViewpointLite[];
  isLoading?: boolean;
  onViewpointPress: (viewpoint: ViewpointLite) => void;
};

export function FeaturedList({ viewpoints, isLoading, onViewpointPress }: FeaturedListProps) {
  if (isLoading) {
    return (
      <YStack paddingHorizontal="$4" gap="$1">
        {[1, 2, 3].map((i) => (
          <SkeletonViewpointCard key={i} />
        ))}
      </YStack>
    );
  }

  if (viewpoints.length === 0) {
    return (
      <EmptyState 
        icon={Search}
        title="No viewpoints found"
        description="Try adjusting your filters or exploring a different area."
      />
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
