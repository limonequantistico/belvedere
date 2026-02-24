import { forwardRef } from "react";
import type { ComponentRef } from "react";
import {
    Card,
    type CardProps,
    YStack,
    XStack,
    H3,
    Text,
    Separator,
    View,
    Image,
    type ImageProps,
} from "tamagui";
import { LinearGradient } from "expo-linear-gradient";

/**
 * THEMED CARD COMPONENT
 *
 * A production-ready card component that extends Tamagui's Card
 * with Mediterranean theme integration and specialized support for
 * background images with gradient overlays.
 *
 * Features:
 * - Multiple visual variants (elevated, flat, bordered, ghost)
 * - Background image support with gradient overlays
 * - Optional header with title and description
 * - Optional footer with actions
 * - Hover and press states
 * - Responsive padding sizes
 * - Full Tamagui Card API compatibility
 * - Compound component pattern (Background, Header, Body, Footer)
 *
 * @example
 * ```tsx
 * <ThemedCard variant="elevated" height={200}>
 *   <ThemedCard.Background
 *     imageUrl="https://example.com/food.jpg"
 *     gradientPosition="bottom"
 *   />
 *   <ThemedCard.Header>
 *     <Text>Header content</Text>
 *   </ThemedCard.Header>
 *   <ThemedCard.Footer>
 *     <Text>Footer content</Text>
 *   </ThemedCard.Footer>
 * </ThemedCard>
 * ```
 */

// ============================================================================
// TYPES
// ============================================================================

/**
 * Card visual variants
 */
export type ThemedCardVariant =
    | "elevated" // Card with shadow elevation (default)
    | "flat" // Flat card with subtle background
    | "bordered" // Card with border, no shadow
    | "ghost"; // Minimal, transparent background

/**
 * Gradient overlay positions for background images
 */
export type GradientPosition =
    | "top" // Gradient from top to transparent
    | "bottom" // Gradient from bottom to transparent
    | "both" // Gradient on both top and bottom
    | "full" // Full dark overlay
    | "none"; // No gradient

export interface ThemedCardProps extends Omit<CardProps, "variant"> {
    /**
     * Visual variant of the card
     * @default "elevated"
     */
    variant?: ThemedCardVariant;

    /**
     * Whether the card is interactive (adds hover/press states)
     * @default false
     */
    interactive?: boolean;

    /**
     * Whether the card is selected/active
     * @default false
     */
    isActive?: boolean;
}

export interface ThemedCardBackgroundProps {
    /**
     * Image URL for the background
     */
    imageUrl?: string;

    /**
     * Image source object (alternative to imageUrl)
     */
    imageSource?: ImageProps["source"];

    /**
     * Position of the gradient overlay
     * @default "bottom"
     */
    gradientPosition?: GradientPosition;

    /**
     * Custom gradient colors (from dark to transparent)
     * @default ["rgba(0,0,0,0.8)", "rgba(0,0,0,0.55)", "rgba(0,0,0,0.01)"]
     */
    gradientColors?: string[];

    /**
     * Gradient locations (0-1 values)
     * @default [0, 0.65, 1]
     */
    gradientLocations?: number[];

    /**
     * Image object fit
     * @default "cover"
     */
    objectFit?: ImageProps["objectFit"];

    /**
     * Custom children to overlay on the image (e.g., custom gradient)
     */
    children?: React.ReactNode;
}

export interface ThemedCardHeaderProps {
    /**
     * Title text
     */
    title?: string;

    /**
     * Description text below title
     */
    description?: string;

    /**
     * Optional icon/component to show before title
     */
    icon?: React.ReactNode;

    /**
     * Optional action component (button, etc) in the header
     */
    action?: React.ReactNode;

    /**
     * Custom children to fully override default layout
     */
    children?: React.ReactNode;

    /**
     * Positioning styles (useful for absolute positioning over images)
     */
    style?: any;
}

export interface ThemedCardBodyProps {
    children: React.ReactNode;
    /**
     * Positioning styles
     */
    style?: any;
}

export interface ThemedCardFooterProps {
    /**
     * Footer content (usually buttons or actions)
     */
    children: React.ReactNode;

    /**
     * Whether to add a separator above footer
     * @default false
     */
    separated?: boolean;

    /**
     * Flex direction
     * @default "row"
     */
    flexDirection?: "row" | "column";

    /**
     * Positioning styles (useful for absolute positioning over images)
     */
    style?: any;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * ThemedCard - A themeable card with multiple variants and background image support
 */
const ThemedCardBase = forwardRef<ComponentRef<typeof Card>, ThemedCardProps>(
    (
        { variant = "elevated", interactive = false, isActive = false, children, ...cardProps },
        ref,
    ) => {
        // Get variant-specific styles
        const variantStyles = getCardVariantStyles(variant, isActive);

        return (
            <Card
                ref={ref}
                // Base styles
                padding={0} // No default padding to support full-bleed images
                borderRadius="$4"
                // overflow="hidden"
                backgroundColor="$card"
                // Apply variant styles
                {...variantStyles}
                // Interactive states
                {...(interactive && {
                    cursor: "pointer",
                    animation: "bouncy",
                    hoverStyle: {
                        scale: 0.925,
                        borderColor: isActive ? "$primary" : "$borderColorHover",
                        ...variantStyles.hoverStyle,
                    },
                    pressStyle: {
                        scale: 0.875,
                        ...variantStyles.pressStyle,
                    },
                })}
                // Active state
                {...(isActive && {
                    borderColor: "$primary",
                    borderWidth: 2,
                })}
                // Allow prop overrides
                {...cardProps}
            >
                {children}
            </Card>
        );
    },
);

ThemedCardBase.displayName = "ThemedCard";

// ============================================================================
// SUB-COMPONENTS (Compound Component Pattern)
// ============================================================================

/**
 * Card Background with image and gradient overlay support
 */
const ThemedCardBackground = ({
    imageUrl,
    imageSource,
    gradientPosition = "bottom",
    gradientColors = ["rgba(0,0,0,0.8)", "rgba(0,0,0,0.55)", "rgba(0,0,0,0.01)"],
    gradientLocations = [0, 0.65, 1],
    objectFit = "cover",
    children,
}: ThemedCardBackgroundProps) => {
    const source = imageSource || (imageUrl ? { uri: imageUrl } : undefined);

    return (
        <Card.Background borderRadius="$4" borderBottomRightRadius={50}>
            {source && <Image objectFit={objectFit} width="100%" height="100%" source={source} />}
            {gradientPosition !== "none" && (
                <View
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        ...(gradientPosition === "top" && {
                            top: 0,
                            height: "50%",
                        }),
                        ...(gradientPosition === "bottom" && {
                            bottom: 0,
                            height: "50%",
                        }),
                        ...(gradientPosition === "both" && {
                            top: 0,
                            bottom: 0,
                            height: "100%",
                        }),
                        ...(gradientPosition === "full" && {
                            top: 0,
                            bottom: 0,
                            height: "100%",
                        }),
                    }}
                    pointerEvents="none"
                >
                    <LinearGradient
                        colors={
                            (gradientPosition === "top"
                                ? [...gradientColors].reverse()
                                : gradientColors) as [string, string, ...string[]]
                        }
                        locations={
                            (gradientPosition === "top"
                                ? [...gradientLocations].reverse()
                                : gradientLocations) as [number, number, ...number[]]
                        }
                        start={{ x: 0.5, y: gradientPosition === "top" ? 0 : 1 }}
                        end={{ x: 0.5, y: gradientPosition === "top" ? 1 : 0 }}
                        style={{ flex: 1 }}
                    />
                </View>
            )}
            {children}
        </Card.Background>
    );
};

/**
 * Card Header - Flexible header that can be absolutely positioned
 */
const ThemedCardHeader = ({
    title,
    description,
    icon,
    action,
    children,
    style,
}: ThemedCardHeaderProps) => {
    // If custom children provided, use those
    if (children) {
        return <Card.Header style={style}>{children}</Card.Header>;
    }

    return (
        <Card.Header style={style}>
            <YStack gap="$2">
                <XStack alignItems="center" justifyContent="space-between" gap="$3">
                    <XStack alignItems="center" gap="$3" flex={1}>
                        {icon && <YStack>{icon}</YStack>}
                        {title && (
                            <H3 size="$6" color="$color" numberOfLines={1} flex={1}>
                                {title}
                            </H3>
                        )}
                    </XStack>
                    {action && <YStack>{action}</YStack>}
                </XStack>
                {description && (
                    <Text fontSize="$3" color="$color" opacity={0.7} numberOfLines={2}>
                        {description}
                    </Text>
                )}
            </YStack>
        </Card.Header>
    );
};

/**
 * Card Body - Main content area
 */
const ThemedCardBody = ({ children, style }: ThemedCardBodyProps) => {
    return (
        <YStack flex={1} style={style}>
            {children}
        </YStack>
    );
};

/**
 * Card Footer - Actions area with flexible positioning
 */
const ThemedCardFooter = ({
    children,
    separated = false,
    flexDirection = "row",
    style,
}: ThemedCardFooterProps) => {
    return (
        <Card.Footer flexDirection={flexDirection} style={style}>
            <YStack width="100%" gap="$2">
                {separated && <Separator marginBottom="$2" />}
                {children}
            </YStack>
        </Card.Footer>
    );
};

// Type augmentation for compound component pattern
export interface ThemedCardComponent
    extends React.ForwardRefExoticComponent<
        ThemedCardProps & React.RefAttributes<ComponentRef<typeof Card>>
    > {
    Background: typeof ThemedCardBackground;
    Header: typeof ThemedCardHeader;
    Body: typeof ThemedCardBody;
    Footer: typeof ThemedCardFooter;
}

// Create compound component with sub-components attached
export const ThemedCard = Object.assign(ThemedCardBase, {
    Background: ThemedCardBackground,
    Header: ThemedCardHeader,
    Body: ThemedCardBody,
    Footer: ThemedCardFooter,
}) as ThemedCardComponent;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Returns variant-specific styling for cards
 */
function getCardVariantStyles(variant: ThemedCardVariant, isActive: boolean): Partial<CardProps> {
    const baseStyles: Partial<CardProps> = {
        backgroundColor: "$card",
    };

    switch (variant) {
        case "elevated":
            return {
                ...baseStyles,
                backgroundColor: "$card",
                borderWidth: 0,
                // Elevated shadow using Tamagui's elevation system
                shadowColor: "$shadowColor",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 1,
                shadowRadius: 8,
                elevation: 3,
                hoverStyle: {
                    shadowColor: "$shadowColorHover",
                    shadowOffset: { width: 0, height: 4 },
                    shadowRadius: 12,
                    elevation: 6,
                },
                pressStyle: {
                    shadowColor: "$shadowColorPress",
                    shadowOffset: { width: 0, height: 1 },
                    shadowRadius: 4,
                    elevation: 1,
                },
            };

        case "flat":
            return {
                ...baseStyles,
                backgroundColor: "$background",
                borderWidth: 0,
                shadowColor: "transparent",
                shadowOpacity: 0,
                elevation: 0,
                hoverStyle: {
                    backgroundColor: "$backgroundHover",
                },
                pressStyle: {
                    backgroundColor: "$backgroundPress",
                },
            };

        case "bordered":
            return {
                ...baseStyles,
                backgroundColor: "$card",
                borderWidth: 1,
                borderColor: "$borderColor",
                shadowColor: "transparent",
                shadowOpacity: 0,
                elevation: 0,
                hoverStyle: {
                    borderColor: "$borderColorHover",
                    backgroundColor: "$backgroundHover",
                },
                pressStyle: {
                    borderColor: "$borderColorPress",
                    backgroundColor: "$backgroundPress",
                },
            };

        case "ghost":
            return {
                backgroundColor: "transparent",
                borderWidth: 0,
                shadowColor: "transparent",
                shadowOpacity: 0,
                elevation: 0,
                hoverStyle: {
                    backgroundColor: "$backgroundHover",
                },
                pressStyle: {
                    backgroundColor: "$backgroundPress",
                },
            };

        default:
            return baseStyles;
    }
}

// ============================================================================
// PRESET CARD VARIANTS
// ============================================================================

/**
 * Pre-configured card for food items with image background
 */
export const FoodCard = forwardRef<ComponentRef<typeof Card>, ThemedCardProps>((props, ref) => (
    <ThemedCard ref={ref} variant="elevated" interactive {...props} borderBottomRightRadius={50} />
));

FoodCard.displayName = "FoodCard";

/**
 * Pre-configured card for product listings
 */
export const ProductCard = forwardRef<ComponentRef<typeof Card>, ThemedCardProps>((props, ref) => (
    <ThemedCard ref={ref} variant="elevated" interactive {...props} />
));

ProductCard.displayName = "ProductCard";

/**
 * Pre-configured card for feature highlights
 */
export const FeatureCard = forwardRef<ComponentRef<typeof Card>, ThemedCardProps>((props, ref) => (
    <ThemedCard ref={ref} variant="bordered" {...props} />
));

FeatureCard.displayName = "FeatureCard";

/**
 * Pre-configured card for stats/metrics
 */
export const StatCard = forwardRef<ComponentRef<typeof Card>, ThemedCardProps>((props, ref) => (
    <ThemedCard ref={ref} variant="flat" {...props} />
));

StatCard.displayName = "StatCard";

// ============================================================================
// EXPORTS
// ============================================================================

export default ThemedCard;
