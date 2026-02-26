import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { YStack, Text } from 'tamagui';

export function RichContentSheet() {
  const snapPoints = useMemo(() => ['20%', '50%', '85%'], []);

  return (
    <BottomSheet
      index={1} // Start at 50%
      snapPoints={snapPoints}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.indicator}
    >
      <BottomSheetView style={styles.contentContainer}>
        <YStack padding="$4" gap="$2">
          <Text fontSize="$6" fontWeight="bold">Featured Near You</Text>
          <Text color="$color">Discover viewpoints around you</Text>
        </YStack>
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  background: {
    backgroundColor: '#fff',
    borderRadius: 24,
  },
  indicator: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    width: 40,
  },
});
