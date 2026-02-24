import { useToastController, useToastState } from "@tamagui/toast";
import { useEffect, useRef, useState } from "react";
import { XStack, YStack } from "tamagui";
import {
    StyledToastContainer,
    StyledToastDescription,
    StyledToastTitle,
    ToastIcon,
    ToastVariant,
} from "@/components/reusable-ui/toasts/ToastStyles";
import { useToastStore } from "@/context/toastStore";
import { AnimatedBorder } from "./AnimatedBorder";

interface StyledToastProps {
    variant?: ToastVariant;
    showIcon?: boolean;
}

export const StyledToast = ({ variant: propVariant, showIcon = true }: StyledToastProps) => {
    const currentToast = useToastState();
    const toastController = useToastController();
    const { queue, shiftToast, removeToast } = useToastStore();

    const [isProcessing, setIsProcessing] = useState(false);
    const processingTimeoutRef = useRef<number | null>(null);
    const currentToastIdRef = useRef<string | null>(null);
    const isInterruptionPendingRef = useRef(false);

    useEffect(() => {
        const isToastShowing = currentToast && !currentToast.isHandledNatively;

        if (!isToastShowing) {
            isInterruptionPendingRef.current = false;
        }

        if (isToastShowing && processingTimeoutRef.current) {
            clearTimeout(processingTimeoutRef.current);
            processingTimeoutRef.current = null;
            setIsProcessing(false);
        }

        // Process next toast in queue
        if (!isToastShowing && queue.length > 0 && !isProcessing) {
            const nextToast = queue[0];

            // Only process if it's a different toast
            if (currentToastIdRef.current !== nextToast.id) {
                setIsProcessing(true);
                currentToastIdRef.current = nextToast.id;

                // Safeguard: reset processing state if toast doesn't appear
                processingTimeoutRef.current = setTimeout(() => {
                    console.warn("Toast processing timeout - forcing reset");
                    setIsProcessing(false);
                    shiftToast();
                }, 1000);

                // Small delay to ensure clean state transition
                requestAnimationFrame(() => {
                    toastController.show(nextToast.title, {
                        message: nextToast.message,
                        duration: nextToast.duration,
                        customData: {
                            variant: nextToast.variant,
                            id: nextToast.id,
                            priority: nextToast.priority,
                        },
                    });
                });
            }
        }

        if (isToastShowing && queue.length > 0 && !isInterruptionPendingRef.current) {
            const currentPriority = (currentToast.customData?.priority as number) ?? 0;
            const nextToast = queue[0];
            const nextPriority = nextToast.priority ?? 0;

            if (nextPriority > currentPriority && currentToast.customData?.id !== nextToast.id) {
                console.log(
                    `Interrupting toast ${currentToast.customData?.id} with higher priority toast ${nextToast.id}`
                );
                isInterruptionPendingRef.current = true;
                toastController.hide();
            }
        }

        if (!isToastShowing && isProcessing) {
            setIsProcessing(false);
        }
    }, [currentToast, queue, isProcessing, shiftToast, toastController]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (processingTimeoutRef.current) {
                clearTimeout(processingTimeoutRef.current);
            }
        };
    }, []);

    if (!currentToast || currentToast.isHandledNatively) return null;

    const variant = (currentToast.customData?.variant as ToastVariant) || propVariant || "default";

    const content = showIcon ? (
        <XStack alignItems="center" gap="$3" padding="$3">
            <ToastIcon variant={variant} />
            <YStack>
                <StyledToastTitle variant={variant}>{currentToast.title}</StyledToastTitle>
                {!!currentToast.message && (
                    <StyledToastDescription variant={variant}>
                        {currentToast.message}
                    </StyledToastDescription>
                )}
            </YStack>
        </XStack>
    ) : (
        <YStack padding="$3">
            <StyledToastTitle variant={variant}>{currentToast.title}</StyledToastTitle>
            {!!currentToast.message && (
                <StyledToastDescription variant={variant}>
                    {currentToast.message}
                </StyledToastDescription>
            )}
        </YStack>
    );

    return (
        <StyledToastContainer
            variant={variant}
            animation="200ms"
            key={currentToast.id}
            duration={currentToast.duration}
            enterStyle={{ opacity: 0, transform: [{ translateY: -100 }] }}
            exitStyle={{ opacity: 0, transform: [{ translateY: -100 }] }}
            transform={[{ translateY: 0 }]}
            opacity={1}
            scale={1}
            viewportName={currentToast.viewportName}
            onOpenChange={(open: boolean) => {
                if (!open) {
                    // Clear timeout when toast closes
                    if (processingTimeoutRef.current) {
                        clearTimeout(processingTimeoutRef.current);
                        processingTimeoutRef.current = null;
                    }

                    const toastId = currentToast.customData?.id;
                    if (toastId) {
                        removeToast(toastId);
                    } else {
                        shiftToast();
                    }

                    // Reset state
                    setIsProcessing(false);
                    currentToastIdRef.current = null;

                    // Hide via controller
                    toastController.hide();
                }
            }}
        >
            {variant === "achievement" ? (
                <AnimatedBorder borderRadius={28}>
                    <YStack backgroundColor="$background" borderRadius={28}>
                        {content}
                    </YStack>
                </AnimatedBorder>
            ) : (
                content
            )}
        </StyledToastContainer>
    );
};