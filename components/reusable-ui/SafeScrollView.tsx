import { ReactNode } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView, YStack } from "tamagui";

interface SafeScrollViewProps {
    children: ReactNode;
    contentContainerStyle?: any;
}

export function SafeScrollView({ children, contentContainerStyle, ...props }: SafeScrollViewProps) {
    const insets = useSafeAreaInsets();

    return (
        <YStack flex={1} paddingTop={insets.top}>
            <ScrollView
                flex={1}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    // PYT-160
                    // padding: 16,
                    paddingBottom: 72 + insets.bottom,
                    backgroundColor: "transparent",
                    ...contentContainerStyle,
                }}
                {...props}
            >
                {children}
            </ScrollView>
        </YStack>
    );
}
