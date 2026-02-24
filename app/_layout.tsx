import { GlobalLoader } from "@/components/reusable-ui/GlobalLoader";
import { StyledToast } from "@/components/reusable-ui/toasts/StyledToast";
import { LoaderProvider } from "@/context/LoaderContext";
import { ManualThemeProvider } from "@/context/ManualThemeProvider";
import { AuthProvider } from "@/context/supabase-provider";
import { ThemeProvider } from "@react-navigation/native";
import { PortalProvider } from "@tamagui/portal";
import { ToastProvider, ToastViewport } from "@tamagui/toast";
import { Stack } from "expo-router";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { useReactNavigationTheme } from "@/hooks/useReactNavigationTheme";
import { StatusBar } from "react-native";
import { useStyledToast } from "@/hooks/useStyledToast";
import { triggerLightImpact } from "@/services/hapticsService";
import ThemedButton from "@/components/reusable-ui/ThemedButton";
import { Bug } from "@tamagui/lucide-icons";
import {
    useFonts,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
} from "@expo-google-fonts/nunito";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

// Prevent splash screen from auto-hiding until fonts are loaded
SplashScreen.preventAutoHideAsync();

function AppContent() {
    const { left, top, right } = useSafeAreaInsets();
    const navigationTheme = useReactNavigationTheme();

    return (
        <>
            <StatusBar />
            <SafeAreaProvider>
                <PortalProvider>
                    <ThemeProvider value={navigationTheme}>
                        <LoaderProvider>
                            <ToastProvider swipeDirection="up">
                                <StyledToast />
                                <AuthProvider>
                                    <Stack
                                        screenOptions={{
                                            headerShown: false,
                                            gestureEnabled: false,
                                        }}
                                    >
                                        <Stack.Screen name="(protected)" />
                                        <Stack.Screen name="welcome" />
                                        <Stack.Screen
                                            name="auth/login"
                                            options={{
                                                headerBackTitle: "Back",
                                                headerShown: true,
                                                headerTitle: "",
                                                gestureEnabled: true,
                                            }}
                                        />
                                        <Stack.Screen
                                            name="auth/signup"
                                            options={{
                                                headerBackTitle: "Back",
                                                headerShown: true,
                                                headerTitle: "",
                                                gestureEnabled: true,
                                            }}
                                        />
                                        <Stack.Screen
                                            name="auth/forgot-password"
                                            options={{
                                                headerBackTitle: "Back",
                                                headerShown: true,
                                                headerTitle: "",
                                                gestureEnabled: true,
                                            }}
                                        />
                                    </Stack>
                                </AuthProvider>
                                <ToastViewport top={24 + top} left={left} right={right} />
                            </ToastProvider>
                            <GlobalLoader />
                        </LoaderProvider>
                    </ThemeProvider>
                </PortalProvider>
            </SafeAreaProvider>
        </>
    );
}

export default function RootLayout() {
    const toast = useStyledToast();

    const [fontsLoaded, fontError] = useFonts({
        Nunito_400Regular,
        Nunito_500Medium,
        Nunito_600SemiBold,
        Nunito_700Bold,
    });

    useEffect(() => {
        if (fontsLoaded || fontError) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    // Don't render until fonts are loaded
    if (!fontsLoaded && !fontError) {
        return null;
    }

    function generateMd() {
        toast.showDefault("Debug Active", "Basic app layout is functioning.");
        triggerLightImpact();
        console.log("Template Debug trigger fired");
    }

    return (
        <ManualThemeProvider>
            <AppContent />
            {__DEV__ && (
                <ThemedButton
                    onPress={generateMd}
                    variant="outline"
                    size="$5"
                    circular
                    icon={Bug}
                    position="absolute"
                    bottom="$13"
                    right="$4"
                    backgroundColor="$background"
                    elevate
                    opacity={0.7}
                />
            )}
        </ManualThemeProvider>
    );
}
