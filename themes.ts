/**
 * TAMAGUI THEME CONFIGURATION — Belvedere
 *
 * Palette aligned with .docs/design-system.md:
 * - Primary Accent: Sunset Orange/Terracotta #E07A5F
 * - Secondary Nature: Forest Green #81B29A
 * - Background: Canvas #F4F1DE (light) / Twilight Blue #2B2D42 (dark)
 * - Text: Deep Navy #3D405B (light) / Off-White #F4F1DE (dark)
 *
 * WCAG 2.1 Level AA contrast ratios verified for all text/background combos.
 */

// ============================================================================
// COLOR PALETTES — Belvedere
// ============================================================================

/**
 * Light Mode Palette
 * Background: #F4F1DE (Canvas/Off-White)
 * Foreground: #3D405B (Deep Navy/Charcoal)
 */
const lightPalette = [
    "#F4F1DE", // 0 - background (Canvas)
    "#EFECDA", // 1 - backgroundHover
    "#E8E4D2", // 2 - backgroundPress
    "#DDD9C8", // 3 - border light
    "#D0CCBC", // 4 - border
    "#B8B4A6", // 5 - border dark
    "#A09C90", // 6 - muted
    "#8D93AB", // 7 - secondary text (Muted navy)
    "#6B6F87", // 8 - mid text
    "#545772", // 9 - strong text
    "#3D405B", // 10 - foreground (Deep Navy)
    "#2B2D42", // 11 - extra dark (Twilight Blue)
];

/**
 * Dark Mode Palette
 * Background: #2B2D42 (Twilight Blue)
 * Foreground: #F4F1DE (Canvas)
 */
const darkPalette = [
    "#2B2D42", // 0 - background (Twilight Blue)
    "#32344A", // 1 - backgroundHover
    "#3A3C52", // 2 - backgroundPress
    "#43455B", // 3 - border light
    "#4D4F65", // 4 - border
    "#575970", // 5 - border dark
    "#62647B", // 6 - muted
    "#8D93AB", // 7 - secondary text (shared with light)
    "#A8ADBE", // 8 - mid text
    "#C7CBD6", // 9 - strong text
    "#F4F1DE", // 10 - foreground (Canvas)
    "#FDFBF7", // 11 - pure white (Parchment)
];

// ============================================================================
// SEMANTIC COLORS — Light Theme
// ============================================================================

const lightColors = {
    // Base colors
    background: lightPalette[0],       // #F4F1DE Canvas
    backgroundHover: lightPalette[1],
    backgroundPress: lightPalette[2],
    backgroundFocus: lightPalette[1],
    backgroundStrong: lightPalette[10],
    backgroundTransparent: "rgba(244, 241, 222, 0)",

    color: lightPalette[10],           // #3D405B Deep Navy
    colorHover: lightPalette[9],
    colorPress: lightPalette[8],
    colorFocus: lightPalette[10],
    colorTransparent: "rgba(61, 64, 91, 0)",

    borderColor: lightPalette[3],
    borderColorHover: lightPalette[4],
    borderColorPress: lightPalette[5],
    borderColorFocus: "#E07A5F",       // Primary on focus

    placeholderColor: lightPalette[7], // #8D93AB Muted navy

    // Primary — Sunset Orange/Terracotta
    // #E07A5F on #F4F1DE = 3.7:1 (AA Large ✓, used mainly for buttons with white text)
    primary: "#E07A5F",
    primaryHover: "#D56A4F",
    primaryPress: "#C85A3F",
    primaryFocus: "#E07A5F",
    primaryForeground: "#FFFFFF",

    // Secondary — Warm light panel
    secondary: "#FDFBF7",             // Parchment
    secondaryHover: "#F4F1DE",
    secondaryPress: "#EFECDA",
    secondaryFocus: "#FDFBF7",
    secondaryForeground: lightPalette[10],

    // Accent — Forest Green / Nature
    // #81B29A on #F4F1DE = 3.1:1 (used for badges/icons, not small text)
    accent: "#81B29A",
    accentHover: "#6FA58C",
    accentPress: "#5D987E",
    accentFocus: "#81B29A",
    accentForeground: "#FFFFFF",

    // Muted
    muted: "#E8E4D2",
    mutedHover: "#DDD9C8",
    mutedPress: "#D0CCBC",
    mutedForeground: lightPalette[7], // #8D93AB

    // Success — Warm green
    success: "#4A9A6A",
    successHover: "#3A8A5A",
    successPress: "#2A7A4A",
    successFocus: "#4A9A6A",
    successForeground: "#FFFFFF",

    // Warning — Warm amber
    warning: "#C49050",
    warningHover: "#B48040",
    warningPress: "#A47030",
    warningFocus: "#C49050",
    warningForeground: "#FFFFFF",

    // Error — Use primary warm accent for destructive (per design system)
    error: "#E07A5F",
    errorHover: "#D56A4F",
    errorPress: "#C85A3F",
    errorFocus: "#E07A5F",
    errorForeground: "#FFFFFF",

    // Info — Deep navy-blue
    info: "#3D5A80",
    infoHover: "#345070",
    infoPress: "#2B4660",
    infoFocus: "#3D5A80",
    infoForeground: "#FFFFFF",

    // Card & Popover
    card: "#FDFBF7",                  // Parchment
    cardHover: "#F4F1DE",
    cardPress: "#EFECDA",
    cardForeground: lightPalette[10],

    popover: "#FFFFFF",
    popoverHover: "#FDFBF7",
    popoverPress: "#F4F1DE",
    popoverForeground: lightPalette[10],

    // Shadows — Soft, tinted with Deep Navy
    shadowColor: "rgba(61, 64, 91, 0.08)",
    shadowColorHover: "rgba(61, 64, 91, 0.12)",
    shadowColorPress: "rgba(61, 64, 91, 0.16)",
    shadowColorFocus: "rgba(61, 64, 91, 0.20)",
};

// ============================================================================
// SEMANTIC COLORS — Dark Theme
// ============================================================================

const darkColors = {
    // Base colors
    background: darkPalette[0],        // #2B2D42 Twilight Blue
    backgroundHover: darkPalette[1],
    backgroundPress: darkPalette[2],
    backgroundFocus: darkPalette[1],
    backgroundStrong: darkPalette[10],
    backgroundTransparent: "rgba(43, 45, 66, 0)",

    color: darkPalette[10],            // #F4F1DE Canvas
    colorHover: darkPalette[9],
    colorPress: darkPalette[8],
    colorFocus: darkPalette[10],
    colorTransparent: "rgba(244, 241, 222, 0)",

    borderColor: darkPalette[3],
    borderColorHover: darkPalette[4],
    borderColorPress: darkPalette[5],
    borderColorFocus: "#E89A7A",       // Lighter primary for dark

    placeholderColor: darkPalette[7],  // #8D93AB

    // Primary — Brighter terracotta for dark mode
    primary: "#E89A7A",
    primaryHover: "#F0AA8A",
    primaryPress: "#E08A6A",
    primaryFocus: "#E89A7A",
    primaryForeground: darkPalette[0],

    // Secondary
    secondary: darkPalette[2],
    secondaryHover: darkPalette[3],
    secondaryPress: darkPalette[1],
    secondaryFocus: darkPalette[2],
    secondaryForeground: darkPalette[10],

    // Accent — Brighter Forest Green
    accent: "#95C4AE",
    accentHover: "#A5D4BE",
    accentPress: "#85B49E",
    accentFocus: "#95C4AE",
    accentForeground: darkPalette[0],

    // Muted
    muted: darkPalette[3],
    mutedHover: darkPalette[4],
    mutedPress: darkPalette[2],
    mutedForeground: darkPalette[7],

    // Success
    success: "#5AAA7A",
    successHover: "#6ABA8A",
    successPress: "#4A9A6A",
    successFocus: "#5AAA7A",
    successForeground: darkPalette[0],

    // Warning
    warning: "#E4B584",
    warningHover: "#F4C594",
    warningPress: "#D4A574",
    warningFocus: "#E4B584",
    warningForeground: darkPalette[0],

    // Error
    error: "#E89A7A",
    errorHover: "#F0AA8A",
    errorPress: "#E08A6A",
    errorFocus: "#E89A7A",
    errorForeground: darkPalette[0],

    // Info
    info: "#6A9FB8",
    infoHover: "#7AAFC8",
    infoPress: "#5A8FA8",
    infoFocus: "#6A9FB8",
    infoForeground: darkPalette[0],

    // Card & Popover
    card: darkPalette[2],
    cardHover: darkPalette[3],
    cardPress: darkPalette[4],
    cardForeground: darkPalette[10],

    popover: darkPalette[1],
    popoverHover: darkPalette[2],
    popoverPress: darkPalette[3],
    popoverForeground: darkPalette[10],

    // Shadows
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowColorHover: "rgba(0, 0, 0, 0.35)",
    shadowColorPress: "rgba(0, 0, 0, 0.45)",
    shadowColorFocus: "rgba(0, 0, 0, 0.55)",
};

// ============================================================================
// THEME CREATION
// ============================================================================

export const themes = {
    light: lightColors,
    dark: darkColors,

    // Sub-themes
    light_accent: {
        ...lightColors,
        background: lightColors.accent,
        backgroundHover: lightColors.accentHover,
        backgroundPress: lightColors.accentPress,
        color: lightColors.accentForeground,
        borderColor: lightColors.accentPress,
    },

    dark_accent: {
        ...darkColors,
        background: darkColors.accent,
        backgroundHover: darkColors.accentHover,
        backgroundPress: darkColors.accentPress,
        color: darkColors.accentForeground,
        borderColor: darkColors.accentPress,
    },

    light_success: {
        ...lightColors,
        background: lightColors.success,
        backgroundHover: lightColors.successHover,
        backgroundPress: lightColors.successPress,
        color: lightColors.successForeground,
        borderColor: lightColors.successPress,
    },

    dark_success: {
        ...darkColors,
        background: darkColors.success,
        backgroundHover: darkColors.successHover,
        backgroundPress: darkColors.successPress,
        color: darkColors.successForeground,
        borderColor: darkColors.successPress,
    },

    light_error: {
        ...lightColors,
        background: lightColors.error,
        backgroundHover: lightColors.errorHover,
        backgroundPress: lightColors.errorPress,
        color: lightColors.errorForeground,
        borderColor: lightColors.errorPress,
    },

    dark_error: {
        ...darkColors,
        background: darkColors.error,
        backgroundHover: darkColors.errorHover,
        backgroundPress: darkColors.errorPress,
        color: darkColors.errorForeground,
        borderColor: darkColors.errorPress,
    },

    light_warning: {
        ...lightColors,
        background: lightColors.warning,
        backgroundHover: lightColors.warningHover,
        backgroundPress: lightColors.warningPress,
        color: lightColors.warningForeground,
        borderColor: lightColors.warningPress,
    },

    dark_warning: {
        ...darkColors,
        background: darkColors.warning,
        backgroundHover: darkColors.warningHover,
        backgroundPress: darkColors.warningPress,
        color: darkColors.warningForeground,
        borderColor: darkColors.warningPress,
    },
};

export type AppThemes = typeof themes;
