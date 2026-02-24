import { InputField } from "@/components/reusable-ui/InputField";
import { useAuth } from "@/context/supabase-provider";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Button, H1, Paragraph, Spinner, Theme, YStack } from "tamagui";
import * as z from "zod";

const loginSchema = z.object({
    email: z.email("Please enter a valid email address."),
    password: z
        .string()
        .min(8, "Please enter at least 8 characters.")
        .max(64, "Please enter fewer than 64 characters."),
});

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loading, setLoading] = useState(false);

    const { session, signIn } = useAuth();

    const handleLogin = async () => {
        setEmailError("");
        setPasswordError("");

        const result = loginSchema.safeParse({ email, password });
        if (!result.success) {
            result.error.issues.forEach(err => {
                if (err.path.includes("email")) setEmailError(err.message);
                if (err.path.includes("password")) setPasswordError(err.message);
            });
            return;
        }

        setLoading(true);
        await signIn(email, password).finally(() => setLoading(false));
    };

    return (
        <>
            {!session && (
                <YStack mt="$6" px="$3" gap={"$2"}>
                    <H1
                        alignSelf="center"
                        size="$8"
                        $xs={{
                            size: "$7",
                        }}
                    >
                        Sign in to your account
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

                    <Theme inverse>
                        <Button mt="$4" onPress={handleLogin} disabled={loading}>
                            {loading ? <Spinner color="$color" /> : "Login"}
                        </Button>
                    </Theme>

                    <ForgotPasswordLink />
                </YStack>
            )}
        </>
    );
}

const ForgotPasswordLink = () => {
    return (
        <Link href="/auth/forgot-password" asChild>
            <Paragraph
                alignSelf="flex-end"
                color="grey"
                size="$1"
                marginTop="$2"
                hoverStyle={{
                    color: "darkgrey",
                    cursor: "pointer",
                    textDecorationLine: "underline",
                }}
            >
                Forgot your password?
            </Paragraph>
        </Link>
    );
};
