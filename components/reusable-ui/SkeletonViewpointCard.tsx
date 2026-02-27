import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { YStack, XStack, View as TamaguiView } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  interpolate 
} from 'react-native-reanimated';

export function SkeletonViewpointCard() {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      false
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(shimmer.value, [0, 1], [-200, 400]);
    return {
      transform: [{ translateX }],
    };
  });

  return (
    <TamaguiView
      borderRadius="$6"
      overflow="hidden"
      mb="$4"
      bg="$background"
      height={200}
      width="100%"
      style={{ elevation: 2 }}
      shadowColor="$shadowColor"
      shadowOffset={{ width: 0, height: 4 }}
      shadowOpacity={0.05}
      shadowRadius={12}
    >
      <View style={StyleSheet.absoluteFill}>
        {/* Base Background */}
        <TamaguiView flex={1} bg="$muted" opacity={0.3} />
        
        {/* Shimmer Overlay */}
        <Animated.View style={[StyleSheet.absoluteFill, shimmerStyle]}>
          <LinearGradient
            colors={['transparent', 'rgba(255,255,255,0.2)', 'transparent']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>

      {/* Top Badges */}
      <XStack position="absolute" top="$3" left="$3" right="$3" justifyContent="space-between">
        <TamaguiView width={40} height={40} borderRadius="$10" bg="$muted" opacity={0.5} />
        <TamaguiView width={60} height={20} borderRadius="$4" bg="$muted" opacity={0.5} />
      </XStack>

      {/* Bottom Content */}
      <YStack position="absolute" bottom={0} left={0} right={0} padding="$4" gap="$2">
        <TamaguiView width={80} height={16} borderRadius="$2" bg="$muted" opacity={0.5} />
        <TamaguiView width="70%" height={28} borderRadius="$2" bg="$muted" opacity={0.5} />
      </YStack>
    </TamaguiView>
  );
}

const styles = StyleSheet.create({});
