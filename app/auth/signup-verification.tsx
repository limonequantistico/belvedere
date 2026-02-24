import { ThemedText } from "@/components/reusable-ui/ThemedText";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Theme, YStack } from "tamagui";

export default function SignupVerification() {
    return (
        <>
            <SafeAreaView style={{ flex: 1 }}>
                <YStack flex={1} alignItems="center" justifyContent="center" gap="$4" padding="$4">
                    <ThemedText variant="h1">Signup Successful! 🎉</ThemedText>
                    <ThemedText variant="caption" color="muted">
                        We’ve sent you a confirmation email. Please check your inbox to verify your
                        account before logging in.
                    </ThemedText>
                    <Theme inverse>
                        <Button
                            marginTop="$4"
                            onPress={() => {
                                router.replace("/auth/login");
                            }}
                        >
                            Go to Login
                        </Button>
                    </Theme>
                </YStack>
            </SafeAreaView>
        </>
    );
}
