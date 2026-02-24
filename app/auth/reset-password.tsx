import { InputField } from "@/components/reusable-ui/InputField";
import { ThemedText } from "@/components/reusable-ui/ThemedText";
import { useAuth } from "@/context/supabase-provider";
import { useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Theme, YStack } from "tamagui";
import * as z from "zod";

const recoverySchema = z
    .object({
        password: z.string().min(8, "Please enter at least 8 characters."),
        confirmPassword: z.string(),
    })
    .refine(data => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const [loading, setLoading] = useState(false);
    const { updatePassword, session } = useAuth();
    const router = useRouter();

    // Controlla se l'utente ha una sessione valida per il reset
    if (!session) {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <YStack marginTop="$6" paddingHorizontal="$3">
                    <ThemedText variant="h1">Invalid Session</ThemedText>
                    <ThemedText variant="caption" color="muted">
                        Please use the reset link from your email or request a new password reset.
                    </ThemedText>
                    <Theme inverse>
                        <Button
                            marginTop="$2"
                            onPress={() => router.replace("/auth/forgot-password")}
                        >
                            Back to Password Reset
                        </Button>
                    </Theme>
                </YStack>
            </SafeAreaView>
        );
    }

    const handlePasswordReset = async () => {
        const result = recoverySchema.safeParse({ password, confirmPassword });

        if (!result.success) {
            result.error.issues.forEach(err => {
                if (err.path.includes("password")) {
                    setPasswordError(err.message);
                } else if (err.path.includes("confirmPassword")) {
                    setConfirmPasswordError(err.message);
                }
            });
            return;
        }

        setLoading(true);
        await updatePassword(password).finally(() => setLoading(false));
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <YStack marginTop="$6" paddingHorizontal="$3">
                <ThemedText variant="h1">Set New Password</ThemedText>
                <ThemedText variant="caption" color="muted">
                    Enter your new password below.
                </ThemedText>

                <InputField
                    label="New Password"
                    id="password"
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter new password"
                    secureTextEntry
                    error={passwordError}
                />

                <InputField
                    label="Confirm Password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm new password"
                    secureTextEntry
                    error={confirmPasswordError}
                />

                <Theme inverse>
                    <Button marginTop="$2" onPress={handlePasswordReset} disabled={loading}>
                        {loading ? "Setting Password..." : "Set New Password"}
                    </Button>
                </Theme>
            </YStack>
        </SafeAreaView>
    );
}
