import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { XStack, YStack, Text, View } from 'tamagui';
import { Image } from 'expo-image';
import { MapPin, ArrowRight } from '@tamagui/lucide-icons';
import { ViewpointLite } from '../../hooks/useViewpointsSync';
import { LinearGradient } from 'expo-linear-gradient';

type ViewpointCardProps = {
  viewpoint: ViewpointLite;
  onPress: () => void;
};

// Reuse map's icon logic to keep UI consistent
const getCategoryIcon = (category?: string) => {
  switch ((category || '').toLowerCase()) {
    case 'nature': return '🌲';
    case 'urban': return '🏙️';
    case 'historic': return '🏛️';
    case 'monument': return '🗿';
    default: return '📍';
  }
};

export function ViewpointCard({ viewpoint, onPress }: ViewpointCardProps) {
  // We use placeholder if there's no cover image
  const imageSource = viewpoint.cover_image_url
    ? { uri: viewpoint.cover_image_url }
    : require('../../assets/images/favicon.png'); // Fallback to an existing local asset

  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View
          borderRadius="$6"
          overflow="hidden"
          mb="$4"
          bg="$background"
          style={{
            elevation: 2,
            shadowColor: "black",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
          }}
          scale={pressed ? 0.98 : 1}
          animation="bouncy"
        >
          {/* Large Cover Image */}
          <View height={200} width="100%">
            <Image
              source={imageSource}
              style={styles.image}
              contentFit="cover"
              transition={300}
            />
            
            {/* Dark Gradient Overlay for Text Readability */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={StyleSheet.absoluteFillObject}
            />
            
            {/* Top Right Distance Badge */}
            {viewpoint.distance !== undefined && (
              <XStack 
                position="absolute"
                top="$3"
                right="$3"
                bg="rgba(0,0,0,0.5)"
                paddingHorizontal="$2"
                paddingVertical="$1"
                borderRadius="$4"
                alignItems="center"
                gap="$1"
                backdropFilter="blur(4px)" // Web only, native ignores gracefully
              >
                <MapPin size={12} color="white" />
                <Text color="white" fontSize="$2" fontWeight="600">
                  {viewpoint.distance < 1 
                    ? `${Math.round(viewpoint.distance * 1000)}m` 
                    : `${viewpoint.distance.toFixed(1)}km`}
                </Text>
              </XStack>
            )}

            {/* Bottom Content Area */}
            <YStack position="absolute" bottom={0} left={0} right={0} padding="$4" gap="$2">
              <XStack alignItems="center" gap="$2">
                <Text color="white" fontSize="$2">{getCategoryIcon(viewpoint.category_name)}</Text>
                <Text color="white" fontSize="$2" fontWeight="bold" textTransform="uppercase" letterSpacing={1}>
                  {viewpoint.category_name || 'Spot'}
                </Text>
              </XStack>
              
              <Text color="white" fontSize="$7" fontWeight="900" numberOfLines={2}>
                {viewpoint.name}
              </Text>
            </YStack>
          </View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
});
