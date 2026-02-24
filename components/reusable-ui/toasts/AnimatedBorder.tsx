import React, { useEffect } from "react";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    Easing,
    interpolate,
    withSequence,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme, View } from "tamagui";

const AnimatedView = Animated.createAnimatedComponent(View);

interface AnimatedBorderProps {
    children: React.ReactNode;
    borderRadius?: number;
    borderWidth?: number;
}

export const AnimatedBorder = ({
    children,
    borderRadius = 28,
    borderWidth = 2,
}: AnimatedBorderProps) => {
    const theme = useTheme();
    const rotation = useSharedValue(0);
    const glowScale = useSharedValue(1);

    const warningColor = theme.warning.get();

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, {
                duration: 3000,
                easing: Easing.linear,
            }),
            -1,
            false
        );

        glowScale.value = withRepeat(
            withSequence(
                withTiming(1.02, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    const glowStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: glowScale.value }],
            opacity: interpolate(glowScale.value, [1, 1.05], [0.3, 0.6]),
        };
    });

    return (
        <View position="relative" justifyContent="center" alignItems="center" borderRadius={borderRadius}>
            {/* Pulsing Glow Background */}
            <AnimatedView
                position="absolute"
                top={-4}
                left={-4}
                right={-4}
                bottom={-4}
                borderRadius={borderRadius + 4}
                backgroundColor="$warning"
                shadowColor="$warning"
                shadowOffset={{ width: 0, height: 0 }}
                shadowOpacity={0.8}
                shadowRadius={15}
                style={glowStyle}
            />

            {/* Rotating Gradient Border Container */}
            <View
                overflow="hidden"
                position="relative"
                backgroundColor="transparent"
                borderRadius={borderRadius}
                padding={borderWidth}
            >
                {/* Rotating Gradient Wrapper */}
                <AnimatedView
                    position="absolute"
                    top="-50%"
                    left="-50%"
                    width="200%"
                    height="200%"
                    style={animatedStyle}
                >
                    <LinearGradient
                        colors={[warningColor, "transparent", warningColor, "transparent"]}
                        style={{ flex: 1 }}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    />
                </AnimatedView>

                {/* Content Mask */}
                <View backgroundColor="transparent" overflow="hidden" borderRadius={borderRadius - borderWidth}>
                    {children}
                </View>
            </View>
        </View>
    );
};
