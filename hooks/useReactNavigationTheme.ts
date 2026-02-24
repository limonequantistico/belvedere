import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { useTheme, getVariableValue } from "tamagui";
import { useAppTheme } from "@/context/ManualThemeProvider";

/**
 * Custom hook that creates React Navigation themes synchronized with Tamagui theme.
 * This ensures React Navigation components (like headers, cards, modals) match Tamagui's theme colors.
 *
 * @returns React Navigation theme object matching the current Tamagui theme
 */
export function useReactNavigationTheme() {
    const tamaguiTheme = useTheme();
    const { currentTheme } = useAppTheme();

    // Extract theme colors from Tamagui theme
    // Using getVariableValue with fallbacks to handle undefined values
    const backgroundColor = (getVariableValue(tamaguiTheme.background) ||
        getVariableValue(tamaguiTheme.color1)) as string;
    const cardColor = (getVariableValue(tamaguiTheme.card) || backgroundColor) as string;
    const textColor = (getVariableValue(tamaguiTheme.color) ||
        getVariableValue(tamaguiTheme.color11) ||
        getVariableValue(tamaguiTheme.color1)) as string;
    const borderColor = (getVariableValue(tamaguiTheme.borderColor) ||
        getVariableValue(tamaguiTheme.border) ||
        getVariableValue(tamaguiTheme.color7)) as string;
    const primaryColor = (getVariableValue(tamaguiTheme.primary) ||
        getVariableValue(tamaguiTheme.color9)) as string;
    const notificationColor = primaryColor;

    // Create React Navigation theme matching Tamagui theme
    const isDark = currentTheme === "dark";
    const baseTheme = isDark ? DarkTheme : DefaultTheme;

    return {
        ...baseTheme,
        colors: {
            ...baseTheme.colors,
            // Map Tamagui theme colors to React Navigation theme
            // This ensures headers, modals, cards, and other RN components match Tamagui
            background: backgroundColor,
            card: cardColor,
            text: textColor,
            border: borderColor,
            primary: primaryColor,
            notification: notificationColor,
        },
    };
}
