import { InputField } from "@/components/reusable-ui/InputField";
import { useAuth } from "@/context/supabase-provider";
import { router } from "expo-router";
import React, { useState } from "react";
import { Button, H1, Spinner, Theme, YStack } from "tamagui";
import * as z from "zod";

const signupSchema = z
    .object({
        email: z.email("Please enter a valid email address."),
        password: z
            .string()
            .min(8, "Please enter at least 8 characters.")
            .max(64, "Please enter fewer than 64 characters."),
        confirmPassword: z.string(),
    })
    .refine(data => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const { session, signUp } = useAuth();

    const handleSignup = async () => {
        // Pulisce errori precedenti
        setEmailError("");
        setPasswordError("");
        setConfirmPasswordError("");

        // Valida i dati
        const result = signupSchema.safeParse({ email, password, confirmPassword });

        if (!result.success) {
            result.error.issues.forEach(err => {
                if (err.path.includes("email")) {
                    setEmailError(err.message);
                } else if (err.path.includes("password")) {
                    setPasswordError(err.message);
                } else if (err.path.includes("confirmPassword")) {
                    setConfirmPasswordError(err.message);
                }
            });
            return;
        }

        // Se valido, esegui login
        setLoading(true);
        await signUp(email, password).finally(() => setLoading(false));
    };

    return (
        <>
            {!session && (
                <YStack mt="$6" px="$3" gap={"$2"}>
                    <H1 alignSelf="center" size="$8" $xs={{ size: "$7" }}>
                        Sign Up with your email
                    </H1>

                    <InputField
                        label="Email"
                        id="email"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="email@address.com"
                        keyboardType="email-address"
                        error={emailError}
                    />

                    <InputField
                        label="Password"
                        id="password"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Password"
                        secureTextEntry
                        error={passwordError}
                    />

                    <InputField
                        label="Confirm Password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Repeat password"
                        secureTextEntry
                        error={confirmPasswordError}
                    />

                    <Theme inverse>
                        <Button mt="$4" onPress={handleSignup} disabled={loading}>
                            {loading ? <Spinner color="$color" /> : "Sign Up"}
                        </Button>
                        <Button
                            mt="$4"
                            onPress={() => {
                                router.replace("/auth/signup-verification");
                            }}
                            disabled={loading}
                        >
                            {loading ? <Spinner color="$color" /> : "Test signup confirmation"}
                        </Button>
                    </Theme>
                </YStack>
            )}
        </>
    );
}
