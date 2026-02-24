import { SafeScrollView } from "@/components/reusable-ui/SafeScrollView";
import { YStack, Text, H2 } from "tamagui";

export default function Home() {
    return (
        <SafeScrollView flex={1}>
            <YStack f={1} ai="center" jc="center" p="$4" gap="$4">
                <H2 ta="center">Welcome to your app</H2>
                <Text ta="center" color="$color11">
                    This is a basic Expo + Supabase + Tamagui template.
                </Text>
            </YStack>
        </SafeScrollView>
    );
}
