import { defaultConfig } from "@tamagui/config/v4";
import { createFont, createTamagui } from "tamagui";
import { themes } from "./themes";

// Nunito font family — loaded via @expo-google-fonts/nunito in _layout.tsx
const nunitoFont = createFont({
    family: "Nunito_400Regular",
    size: {
        1: 13,
        2: 14,
        3: 15,
        4: 16,
        5: 18,
        6: 20,
        7: 24,
        8: 28,
        9: 32,
        10: 40,
        true: 16,
    },
    lineHeight: {
        1: 18,
        2: 20,
        3: 22,
        4: 24,
        5: 26,
        6: 28,
        7: 32,
        8: 36,
        9: 40,
        10: 48,
        true: 24,
    },
    weight: {
        4: "400",  // Regular
        5: "500",  // Medium
        6: "600",  // SemiBold
        7: "700",  // Bold
        true: "400",
    },
    letterSpacing: {
        4: 0,
        5: 0,
        true: 0,
    },
    face: {
        400: { normal: "Nunito_400Regular" },
        500: { normal: "Nunito_500Medium" },
        600: { normal: "Nunito_600SemiBold" },
        700: { normal: "Nunito_700Bold" },
    },
});

/**
 * TAMAGUI CONFIGURATION
 *
 * This configuration follows:
 * - Tamagui v1.138.5 configuration standards
 * - Enhanced media queries for responsive design
 * - Proper theme integration
 * - Type-safe configuration
 * - Comprehensive media queries for mobile/tablet/desktop
 * - Proper theme nesting
 * - Configuration for optimal performance
 * - Custom shorthands while preserving defaults
 */

export const tamaguiConfig = createTamagui({
    // Inherit all defaults from @tamagui/config/v4
    ...defaultConfig,

    // Override themes with Belvedere palette
    themes: {
        ...defaultConfig.themes,
        ...themes,
    },

    // Use Nunito as the primary font
    fonts: {
        ...defaultConfig.fonts,
        body: nunitoFont,
        heading: nunitoFont,
    },

    // Enhanced media queries for better responsive design
    media: {
        ...defaultConfig.media,

        // Custom breakpoints following modern standards
        xs: { maxWidth: 660 }, // Mobile portrait
        sm: { maxWidth: 800 }, // Mobile landscape / Small tablet
        md: { maxWidth: 1020 }, // Tablet
        lg: { maxWidth: 1280 }, // Desktop
        xl: { maxWidth: 1420 }, // Large desktop
        xxl: { maxWidth: 1640 }, // Extra large desktop

        // Greater than breakpoints
        gtXs: { minWidth: 660 + 1 },
        gtSm: { minWidth: 800 + 1 },
        gtMd: { minWidth: 1020 + 1 },
        gtLg: { minWidth: 1280 + 1 },
        gtXl: { minWidth: 1420 + 1 },

        // Height-based queries for compact layouts
        short: { maxHeight: 820 },
        tall: { minHeight: 820 + 1 },

        // Interaction media queries
        hoverNone: { hover: "none" },
        hoverAvailable: { hover: "hover" },
        pointerCoarse: { pointer: "coarse" },
        pointerFine: { pointer: "fine" },
    },

    // Settings for optimal behavior
    settings: {
        // Allow both full property names and shorthands
        onlyAllowShorthands: false,

        // Type strictness for style values (recommended for production)
        // "somewhat-strict-web" allows tokens + some flexibility for web-specific values
        allowedStyleValues: "somewhat-strict-web",

        // Autocomplete for specific tokens (improves DX)
        // "except-special" shows specific tokens only for non-standard categories
        autocompleteSpecificTokens: "except-special",

        // Maximum dark/light theme nesting depth (default is 3)
        // Increase if you nest dark/light themes more deeply
        maxDarkLightNesting: 3,

        // Generate @media (prefers-color-scheme) CSS rules
        shouldAddPrefersColorThemes: true,

        // Default font to use when none specified
        defaultFont: "body",

        // For SSR: determines which media queries are active on first render
        // This prevents hydration mismatches
        mediaQueryDefaultActive: {
            xs: true,
            sm: true,
            md: false,
            lg: false,
            xl: false,
            xxl: false,
            gtXs: false,
            gtSm: false,
            gtMd: true,
            gtLg: true,
            gtXl: true,
            short: false,
            tall: true,
            hoverNone: false,
            hoverAvailable: true,
            pointerCoarse: false,
            pointerFine: true,
        },

        // CSS output formatting (use "\n" for debugging, "" for production)
        cssStyleSeparator: "",

        // Selection styles for text highlighting on web
        selectionStyles: theme => ({
            backgroundColor: theme.primary || "#C97A5A",
            color: theme.primaryForeground || "#FFFFFF",
        }),

        // Set to true if using next-themes or similar that adds theme class to <html>
        themeClassNameOnRoot: false,

        // iOS optimization: use DynamicColorIOS for faster scheme changes
        // Only enable if defaultTheme matches system scheme on iOS
        fastSchemeChange: false,

        // Container type for group styles (web only)
        webContainerType: "inline-size",
    },

    // Optional: Add custom shorthands while preserving defaults
    shorthands: {
        ...defaultConfig.shorthands,
        // Examples of useful custom shorthands:
        // px: "paddingHorizontal",    // Already in default config
        // py: "paddingVertical",      // Already in default config
        // mx: "marginHorizontal",     // Already in default config
        // my: "marginVertical",       // Already in default config
    },
});

// Export type for use throughout the app
export default tamaguiConfig;
export type Conf = typeof tamaguiConfig;

// Augment Tamagui's types with our configuration
declare module "tamagui" {
    // This makes TypeScript aware of our custom config
    // Essential for proper type inference in styled components
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface TamaguiCustomConfig extends Conf {}
}
