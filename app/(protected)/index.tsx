import { YStack, H2, Text } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Map Screen — The heart of Belvedere.
 *
 * This is a placeholder that will be replaced with the full-screen Mapbox map
 * + floating search bar + filter pills + bottom sheet in Phase 2.
 */
export default function MapScreen() {
    const insets = useSafeAreaInsets();

    return (
        <YStack
            flex={1}
            alignItems="center"
            justifyContent="center"
            backgroundColor="$background"
            paddingTop={insets.top}
            paddingBottom={insets.bottom}
            gap="$4"
        >
            <H2 textAlign="center">🗺️ Map Coming Soon</H2>
            <Text textAlign="center" color="$placeholderColor" paddingHorizontal="$6">
                The full-screen Mapbox map with floating search bar, filter pills, and
                bottom content sheet will live here.
            </Text>
        </YStack>
    );
}
