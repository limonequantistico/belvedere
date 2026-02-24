import { forwardRef, ComponentRef } from "react";
import { Button, type ButtonProps, type ThemeName } from "tamagui";

/**
 * THEMED BUTTON COMPONENT
 *
 * A production-ready button component that extends Tamagui's Button
 * with active state management and semantic theming.
 *
 * Features:
 * - Active state styling with theme switching
 * - Full Tamagui Button API compatibility
 * - Type-safe props with proper inference
 * - Proper forwardRef for ref forwarding
 *
 * @example
 * ```tsx
 * <ThemedButton
 *   isActive={selectedId === 'home'}
 *   onPress={() => setSelectedId('home')}
 * >
 *   Home
 * </ThemedButton>
 *
 * <ThemedButton
 *   isActive={true}
 *   variant="primary"
 *   size="$4"
 *   icon={HomeIcon}
 * >
 *   Dashboard
 * </ThemedButton>
 * ```
 */

// ============================================================================
// TYPES
// ============================================================================

/**
 * Button variants that control theme and appearance
 */
export type ThemedButtonVariant =
    | "primary" // Uses primary theme colors
    | "secondary" // Uses secondary theme colors
    | "accent" // Uses accent theme colors
    | "success" // Uses success theme colors
    | "warning" // Uses warning theme colors
    | "error" // Uses error theme colors
    | "ghost" // Minimal styling, transparent background
    | "outline"; // Outline only, transparent background

export interface ThemedButtonProps extends Omit<ButtonProps, "theme" | "variant"> {
    /**
     * Whether the button is in active/selected state
     * When true, applies active styling (inverted colors, stronger emphasis)
     */
    isActive?: boolean;

    /**
     * Visual variant of the button
     * @default "primary"
     */
    variant?: ThemedButtonVariant;

    /**
     * Override the theme used for active state
     * By default, uses the variant theme
     */
    activeTheme?: ThemeName;

    /**
     * Override the theme used for inactive state
     */
    inactiveTheme?: ThemeName;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * ThemedButton - A themeable button with active state support
 */
export const ThemedButton = forwardRef<ComponentRef<typeof Button>, ThemedButtonProps>(
    (
        {
            isActive = false,
            variant = "primary",
            activeTheme,
            inactiveTheme,
            children,
            disabled,
            ...buttonProps
        },
        ref,
    ) => {
        // Determine the theme based on active state and variant
        const theme = getButtonTheme(isActive, variant, activeTheme, inactiveTheme);

        // Get variant-specific styles
        const variantStyles = getVariantStyles(variant, isActive);

        return (
            <Button
                ref={ref}
                theme={theme}
                disabled={disabled}
                // Active state styles
                {...(isActive && {
                    opacity: disabled ? 0.5 : 1,
                    pressStyle: {
                        scale: 0.97,
                        opacity: disabled ? 0.5 : 0.9,
                    },
                })}
                // Inactive state styles
                {...(!isActive && {
                    opacity: disabled ? 0.3 : 1,
                    pressStyle: {
                        scale: 0.95,
                        opacity: disabled ? 0.3 : 0.85,
                    },
                })}
                // Apply variant-specific styles
                {...variantStyles}
                // Allow prop overrides
                {...buttonProps}
            >
                {children}
            </Button>
        );
    },
);

ThemedButton.displayName = "ThemedButton";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Determines the appropriate theme based on button state
 */
function getButtonTheme(
    isActive: boolean,
    variant: ThemedButtonVariant,
    activeTheme?: ThemeName,
    inactiveTheme?: ThemeName,
): ThemeName | undefined {
    // Use explicit theme overrides if provided
    if (isActive && activeTheme) return activeTheme;
    if (!isActive && inactiveTheme) return inactiveTheme;

    // For ghost and outline variants, don't apply sub-themes
    if (variant === "ghost" || variant === "outline") {
        return undefined;
    }

    // For semantic variants, use their sub-theme when active
    if (isActive) {
        switch (variant) {
            case "primary":
                return undefined; // Use default theme
            case "secondary":
                return undefined; // Secondary uses base theme
            case "accent":
                return "accent" as ThemeName;
            case "success":
                return "success" as ThemeName;
            case "warning":
                return "warning" as ThemeName;
            case "error":
                return "error" as ThemeName;
            default:
                return undefined;
        }
    }

    return undefined;
}

/**
 * Returns variant-specific styling
 */
function getVariantStyles(variant: ThemedButtonVariant, isActive: boolean): Partial<ButtonProps> {
    const baseStyles: Partial<ButtonProps> = {
        // Smooth transitions for all variants
        animation: "quick",
    };

    switch (variant) {
        case "primary":
            return {
                ...baseStyles,
                backgroundColor: isActive ? "$primary" : "$background",
                color: isActive ? "$primaryForeground" : "$color",
                borderWidth: 0,
                hoverStyle: {
                    backgroundColor: isActive ? "$primaryHover" : "$backgroundHover",
                },
            };

        case "secondary":
            return {
                ...baseStyles,
                backgroundColor: isActive ? "$secondary" : "$background",
                color: isActive ? "$secondaryForeground" : "$color",
                borderWidth: 0,
                hoverStyle: {
                    backgroundColor: isActive ? "$secondaryHover" : "$backgroundHover",
                },
            };

        case "accent":
            return {
                ...baseStyles,
                backgroundColor: isActive ? "$accent" : "$background",
                color: isActive ? "$accentForeground" : "$color",
                borderWidth: 0,
                hoverStyle: {
                    backgroundColor: isActive ? "$accentHover" : "$backgroundHover",
                },
            };

        case "success":
            return {
                ...baseStyles,
                backgroundColor: isActive ? "$success" : "$background",
                color: isActive ? "$successForeground" : "$color",
                borderWidth: 0,
                hoverStyle: {
                    backgroundColor: isActive ? "$successHover" : "$backgroundHover",
                },
            };

        case "warning":
            return {
                ...baseStyles,
                backgroundColor: isActive ? "$warning" : "$background",
                color: isActive ? "$warningForeground" : "$color",
                borderWidth: 0,
                hoverStyle: {
                    backgroundColor: isActive ? "$warningHover" : "$backgroundHover",
                },
            };

        case "error":
            return {
                ...baseStyles,
                backgroundColor: isActive ? "$error" : "$background",
                color: isActive ? "$errorForeground" : "$color",
                borderWidth: 0,
                hoverStyle: {
                    backgroundColor: isActive ? "$errorHover" : "$backgroundHover",
                },
            };

        case "ghost":
            return {
                ...baseStyles,
                backgroundColor: "transparent",
                color: isActive ? "$primary" : "$color",
                borderWidth: 0,
                hoverStyle: {
                    backgroundColor: isActive ? "$backgroundHover" : "$backgroundHover",
                },
            };

        case "outline":
            return {
                ...baseStyles,
                backgroundColor: "transparent",
                color: isActive ? "$primary" : "$color",
                borderWidth: 1,
                borderColor: isActive ? "$primary" : "$borderColor",
                hoverStyle: {
                    backgroundColor: isActive ? "$backgroundHover" : "$backgroundHover",
                    borderColor: isActive ? "$primaryHover" : "$borderColorHover",
                },
            };

        default:
            return baseStyles;
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default ThemedButton;
