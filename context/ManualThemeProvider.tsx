import { ThemeMode, useThemePreference } from "@/hooks/useThemePreference";
import { tamaguiConfig } from "@/tamagui.config";
import React, { createContext, useContext } from "react";
import { TamaguiProvider, Theme } from "tamagui";

interface ThemeContextType {
    themeMode: ThemeMode;
    currentTheme: "light" | "dark";
    setThemeMode: (mode: ThemeMode) => void;
    systemColorScheme: "light" | "dark" | null | undefined;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useAppTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useAppTheme must be used within ManualThemeProvider");
    }
    return context;
}

interface ManualThemeProviderProps {
    children: React.ReactNode;
}

export function ManualThemeProvider({ children }: ManualThemeProviderProps) {
    const themeData = useThemePreference();

    return (
        <ThemeContext.Provider value={themeData}>
            <TamaguiProvider config={tamaguiConfig}>
                <Theme name={themeData.currentTheme}>{children}</Theme>
            </TamaguiProvider>
        </ThemeContext.Provider>
    );
}
