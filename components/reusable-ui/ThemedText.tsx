import { ComponentRef, forwardRef } from "react";
import { Text, type TextProps } from "tamagui";

/**
 * THEMED TEXT COMPONENT
 *
 * A production-ready text component that extends Tamagui's Text
 * with Mediterranean theme integration and modern typography scale.
 *
 * Features:
 * - Complete typography scale (display, h1-h4, body variants, labels, captions)
 * - Semantic color variants using theme tokens
 * - Force color options for overlay text (light/dark backgrounds)
 * - Fully type-safe with proper prop inference
 * - Optimized for React Native + Expo
 * - No useMemo (performance optimized via Tamagui compiler)
 * - Proper forwardRef for ref forwarding
 *
 * @example
 * ```tsx
 * <ThemedText variant="h1">Page Title</ThemedText>
 * <ThemedText variant="body" color="muted">Description text</ThemedText>
 * <ThemedText variant="label" forceColor="light">Button Label</ThemedText>
 * ```
 */

// ============================================================================
// TYPES
// ============================================================================

/**
 * Typography variants following modern design system hierarchy
 */
export type ThemedTextVariant =
    | "display" // Hero/Landing sections (44px)
    | "h1" // Page titles (36px)
    | "h2" // Section titles (32px)
    | "h3" // Subsection titles (28px)
    | "h4" // Card titles (24px)
    | "body" // Default text (18px)
    | "bodyLarge" // Emphasized body (20px)
    | "bodySmall" // Secondary body (16px)
    | "label" // Buttons, inputs (16px, uppercase)
    | "labelLarge" // Prominent labels (18px)
    | "caption" // Helper text, metadata (14px)
    | "overline"; // Eyebrow text, categories (14px, uppercase)

/**
 * Semantic color variants using theme tokens
 */
export type ThemedTextColor =
    | "default" // Primary text color from theme
    | "muted" // Subdued text for secondary content
    | "primary" // Primary brand color
    | "secondary" // Secondary color
    | "accent" // Accent color
    | "success" // Success state
    | "warning" // Warning state
    | "error" // Error state
    | "info"; // Info state

/**
 * Force color for text on specific backgrounds (images, overlays)
 */
export type ThemedTextForceColor =
    | "light" // White text for dark backgrounds
    | "lightMuted" // Muted white for dark backgrounds
    | "dark" // Dark text for light backgrounds
    | "darkMuted"; // Muted dark for light backgrounds

export interface ThemedTextProps extends Omit<TextProps, "color"> {
    /**
     * Typography variant
     * @default "body"
     */
    variant?: ThemedTextVariant;

    /**
     * Semantic color from theme
     * Can also pass custom Tamagui color tokens as string
     */
    color?: ThemedTextColor | string;

    /**
     * Force specific color regardless of theme (useful for overlays)
     */
    forceColor?: ThemedTextForceColor;

    /**
     * Quick prop for font weight
     */
    fontWeight?: TextProps["fontWeight"];
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * ThemedText - A themeable text component with typography scale
 */
export const ThemedText = forwardRef<ComponentRef<typeof Text>, ThemedTextProps>(
    (
        { variant = "body", color = "default", forceColor, fontWeight, children, ...textProps },
        ref,
    ) => {
        // Get variant-specific styles
        const variantStyles = getVariantStyles(variant);

        // Get color styles
        const colorStyles = getColorStyles(color, forceColor);

        return (
            <Text
                ref={ref}
                // Apply variant styles
                {...variantStyles}
                // Apply color styles
                {...colorStyles}
                // Apply font weight if provided
                {...(fontWeight && { fontWeight })}
                // Allow prop overrides
                {...textProps}
            >
                {children}
            </Text>
        );
    },
);

ThemedText.displayName = "ThemedText";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Returns typography styles based on variant
 */
function getVariantStyles(variant: ThemedTextVariant): Partial<TextProps> {
    switch (variant) {
        case "display":
            return {
                fontSize: "$11" as any, // ~44px
                lineHeight: "$11" as any,
                fontWeight: "700",
                letterSpacing: -0.5,
            };

        case "h1":
            return {
                fontSize: "$9", // ~36px
                lineHeight: "$9",
                fontWeight: "600",
                letterSpacing: -0.25,
            };

        case "h2":
            return {
                fontSize: "$8", // ~32px
                lineHeight: "$8",
                fontWeight: "600",
                letterSpacing: -0.2,
            };

        case "h3":
            return {
                fontSize: "$7", // ~28px
                lineHeight: "$7",
                fontWeight: "500",
                letterSpacing: 0,
            };

        case "h4":
            return {
                fontSize: "$6", // ~24px
                lineHeight: "$6",
                fontWeight: "500",
                letterSpacing: 0,
            };

        case "body":
            return {
                fontSize: "$5", // ~18px
                lineHeight: "$7",
                fontWeight: "400",
                letterSpacing: 0.15,
            };

        case "bodyLarge":
            return {
                fontSize: "$6", // ~20px
                lineHeight: "$8",
                fontWeight: "400",
                letterSpacing: 0.15,
            };

        case "bodySmall":
            return {
                fontSize: "$4", // ~16px
                lineHeight: "$5",
                fontWeight: "400",
                letterSpacing: 0.25,
            };

        case "label":
            return {
                fontSize: "$4", // ~16px
                lineHeight: "$5",
                fontWeight: "500",
                letterSpacing: 0.5,
                textTransform: "uppercase",
            };

        case "labelLarge":
            return {
                fontSize: "$5", // ~18px
                lineHeight: "$6",
                fontWeight: "500",
                letterSpacing: 0.4,
            };

        case "caption":
            return {
                fontSize: "$3", // ~14px
                lineHeight: "$4",
                fontWeight: "400",
                letterSpacing: 0.4,
            };

        case "overline":
            return {
                fontSize: "$3", // ~14px
                lineHeight: "$4",
                fontWeight: "600",
                letterSpacing: 1,
                textTransform: "uppercase",
            };

        default:
            return {};
    }
}

/**
 * Returns color styles based on semantic color or force color
 */
function getColorStyles(
    color: ThemedTextColor | string,
    forceColor?: ThemedTextForceColor,
): Partial<TextProps> {
    // Force color takes precedence (for overlays on images)
    if (forceColor) {
        switch (forceColor) {
            case "light":
                return {
                    color: "rgba(255, 255, 255, 1)",
                };
            case "lightMuted":
                return {
                    color: "rgba(255, 255, 255, 0.7)",
                };
            case "dark":
                return {
                    color: "rgba(0, 0, 0, 0.9)",
                };
            case "darkMuted":
                return {
                    color: "rgba(0, 0, 0, 0.6)",
                };
        }
    }

    // Semantic colors using theme tokens
    switch (color) {
        case "default":
            return {
                color: "$color",
            };

        case "muted":
            return {
                color: "$mutedForeground",
            };

        case "primary":
            return {
                color: "$primary",
            };

        case "secondary":
            return {
                color: "$secondary",
            };

        case "accent":
            return {
                color: "$accent",
            };

        case "success":
            return {
                color: "$success",
            };

        case "warning":
            return {
                color: "$warning",
            };

        case "error":
            return {
                color: "$error",
            };

        case "info":
            return {
                color: "$info",
            };

        default:
            // Allow passing custom Tamagui color tokens or hex values
            return {
                color: color as any,
            };
    }
}

// ============================================================================
// CONVENIENCE EXPORTS
// ============================================================================

/**
 * Pre-configured text components for common use cases
 */
export const DisplayText = forwardRef<ComponentRef<typeof Text>, Omit<ThemedTextProps, "variant">>(
    (props, ref) => <ThemedText ref={ref} variant="display" {...props} />,
);
DisplayText.displayName = "DisplayText";

export const H1 = forwardRef<ComponentRef<typeof Text>, Omit<ThemedTextProps, "variant">>(
    (props, ref) => <ThemedText ref={ref} variant="h1" {...props} />,
);
H1.displayName = "H1";

export const H2 = forwardRef<ComponentRef<typeof Text>, Omit<ThemedTextProps, "variant">>(
    (props, ref) => <ThemedText ref={ref} variant="h2" {...props} />,
);
H2.displayName = "H2";

export const H3 = forwardRef<ComponentRef<typeof Text>, Omit<ThemedTextProps, "variant">>(
    (props, ref) => <ThemedText ref={ref} variant="h3" {...props} />,
);
H3.displayName = "H3";

export const H4 = forwardRef<ComponentRef<typeof Text>, Omit<ThemedTextProps, "variant">>(
    (props, ref) => <ThemedText ref={ref} variant="h4" {...props} />,
);
H4.displayName = "H4";

export const BodyText = forwardRef<ComponentRef<typeof Text>, Omit<ThemedTextProps, "variant">>(
    (props, ref) => <ThemedText ref={ref} variant="body" {...props} />,
);
BodyText.displayName = "BodyText";

export const CaptionText = forwardRef<ComponentRef<typeof Text>, Omit<ThemedTextProps, "variant">>(
    (props, ref) => <ThemedText ref={ref} variant="caption" {...props} />,
);
CaptionText.displayName = "CaptionText";

export const LabelText = forwardRef<ComponentRef<typeof Text>, Omit<ThemedTextProps, "variant">>(
    (props, ref) => <ThemedText ref={ref} variant="label" {...props} />,
);
LabelText.displayName = "LabelText";

// ============================================================================
// EXPORTS
// ============================================================================

export default ThemedText;
