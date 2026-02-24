// hooks/useThemePreference.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";

export type ThemeMode = "auto" | "light" | "dark";

const THEME_STORAGE_KEY = "app-theme-preference";

export function useThemePreference() {
    const systemColorScheme = useColorScheme();
    const [themeMode, setThemeMode] = useState<ThemeMode>("auto");

    // Load saved preference on mount
    useEffect(() => {
        loadThemePreference();
    }, []);

    const loadThemePreference = async () => {
        try {
            const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (saved && ["auto", "light", "dark"].includes(saved)) {
                setThemeMode(saved as ThemeMode);
            }
        } catch (error) {
            console.log("Error loading theme preference:", error);
        }
    };

    const updateThemeMode = async (mode: ThemeMode) => {
        try {
            setThemeMode(mode);
            await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
        } catch (error) {
            console.log("Error saving theme preference:", error);
        }
    };

    // Compute the current theme from preference and system scheme
    const currentTheme = themeMode === "auto" ? systemColorScheme || "light" : themeMode;

    return {
        themeMode,
        currentTheme,
        setThemeMode: updateThemeMode,
        systemColorScheme,
    };
}
