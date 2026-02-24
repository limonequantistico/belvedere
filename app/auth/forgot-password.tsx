import { InputField } from "@/components/reusable-ui/InputField";
import { ThemedText } from "@/components/reusable-ui/ThemedText";
import { useAuth } from "@/context/supabase-provider";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Theme, YStack } from "tamagui";
import * as z from "zod";

const recoverySchema = z.object({
    email: z.email("Please enter a valid email address."),
});

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [loading, setLoading] = useState(false);
    const { resetPassword } = useAuth();

    const handleRecovery = async () => {
        // Pulisce errori precedenti
        setEmailError("");

        // Valida i dati
        const result = recoverySchema.safeParse({ email });

        if (!result.success) {
            result.error.issues.forEach(err => {
                if (err.path.includes("email")) {
                    setEmailError(err.message);
                }
            });
            return;
        }

        setLoading(true);
        await resetPassword(email).finally(() => setLoading(false));
    };

    return (
        <>
            <SafeAreaView style={{ flex: 1 }}>
                <YStack marginTop="$6" paddingHorizontal="$3">
                    <ThemedText variant="h4">Forgot your password?</ThemedText>
                    <ThemedText variant="caption" color="muted">
                        No sweat! Let&apos;s set a new one :)
                    </ThemedText>

                    <InputField
                        label="Email"
                        id="email"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="email@address.com"
                        keyboardType="email-address"
                        error={emailError}
                    />

                    <Theme name={"accent"}>
                        <Button
                            marginTop="$2"
                            onPress={() => {
                                handleRecovery();
                            }}
                            disabled={loading}
                        >
                            Get recovery email
                        </Button>
                    </Theme>
                </YStack>
            </SafeAreaView>
        </>
    );
}
