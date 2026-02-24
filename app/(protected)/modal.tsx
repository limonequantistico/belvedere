import { ThemedText } from "@/components/reusable-ui/ThemedText";
import { H1, YStack } from "tamagui";

export default function Modal() {
    return (
        <YStack flex={1} alignItems="center" justifyContent="center" gap="$4" padding="$4">
            <H1 className="text-center">Modal</H1>
            <ThemedText variant="caption">This is a modal screen.</ThemedText>
        </YStack>
    );
}
