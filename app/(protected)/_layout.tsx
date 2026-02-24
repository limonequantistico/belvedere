import { Redirect, Stack } from "expo-router";

import { useAuth } from "@/context/supabase-provider";

export default function ProtectedLayout() {
    const { initialized, session } = useAuth();

    if (!initialized) {
        return null;
    }

    if (!session) {
        return <Redirect href="/welcome" />;
    }

    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen
                name="modal"
                options={{
                    presentation: "modal",
                    headerShown: true,
                    headerTitle: "Test Modal",
                    gestureEnabled: true,
                }}
            />
        </Stack>
    );
}
