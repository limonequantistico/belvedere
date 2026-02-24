import { styled, XStack } from "tamagui";
import { Toast } from "@tamagui/toast";
import { AlertTriangle, Check, Info, Trophy, X } from "@tamagui/lucide-icons";

export type ToastVariant = "default" | "success" | "error" | "warning" | "achievement";

export const StyledToastContainer = styled(Toast, {
    borderRadius: "$11",
    borderWidth: 1,
    padding: "$3",
    shadowColor: "$shadowColor",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,

    variants: {
        variant: {
            default: {
                backgroundColor: "$background",
                borderColor: "$primary",
            },
            success: {
                backgroundColor: "$background",
                borderColor: "$success",
            },
            error: {
                backgroundColor: "$background",
                borderColor: "$error",
            },
            warning: {
                backgroundColor: "$background",
                borderColor: "$warning",
            },
            achievement: {
                backgroundColor: "transparent",
                borderColor: "transparent",
                borderWidth: 0,
                padding: 0,
                shadowOpacity: 0,
                elevation: 0,
            },
        },
    } as const,

    defaultVariants: {
        variant: "default",
    },
});

export const StyledToastTitle = styled(Toast.Title, {
    fontSize: "$4",
    fontWeight: "600",
    marginBottom: "$1",

    variants: {
        variant: {
            default: {
                color: "$color",
            },
            success: {
                color: "$success",
            },
            error: {
                color: "$error",
            },
            warning: {
                color: "$warning",
            },
            achievement: {
                color: "$warning",
            },
        },
    } as const,
});

export const StyledToastDescription = styled(Toast.Description, {
    fontSize: "$3",
    lineHeight: "$2",

    variants: {
        variant: {
            default: {
                color: "$color",
            },
            success: {
                color: "$color",
            },
            error: {
                color: "$color",
            },
            warning: {
                color: "$color",
            },
            achievement: {
                color: "$color",
            },
        },
    } as const,
});

export const ToastIcon = ({ variant }: { variant: ToastVariant }) => {
    const iconProps = { size: 18 };

    switch (variant) {
        case "success":
            return <Check {...iconProps} color="$success" />;
        case "error":
            return <X {...iconProps} color="$error" />;
        case "warning":
            return <AlertTriangle {...iconProps} color="$warning" />;
        case "achievement":
            return <AchievementIcon />;
        default:
            return <Info {...iconProps} color="$color" />;
    }
};

const AchievementIcon = () => {
    return (
        <XStack
            width={32}
            height={32}
            alignItems="center"
            justifyContent="center"
            position="relative"
        >
            <XStack
                position="absolute"
                width="100%"
                height="100%"
                borderRadius="$10"
                borderWidth={1.5}
                borderColor="$warning"
                animation="bouncy"
                enterStyle={{ scale: 0, opacity: 0 }}
                opacity={0.5}
            />
            {/* Inner rotating/pulsing ring */}
            <XStack
                position="absolute"
                width="120%"
                height="120%"
                borderRadius="$10"
                borderWidth={1}
                borderColor="$warning"
                animation="superBouncy"
                enterStyle={{ scale: 0.8, opacity: 0 }}
                opacity={0.3}
                scale={1.2}
            />
            <Trophy size={18} color="$warning" />
        </XStack>
    );
};
