import { ToastVariant } from "@/components/reusable-ui/toasts/ToastStyles";
import { useToastStore } from "@/context/toastStore";

interface ToastOptions {
    duration?: number;
    priority?: number;
}

export const useStyledToast = () => {
    const { addToast, clearQueue } = useToastStore();

    const showToast = (
        title: string,
        message?: string,
        variant: ToastVariant = "default",
        options?: ToastOptions
    ) => {
        addToast({
            title,
            message,
            variant,
            duration: options?.duration,
            priority: options?.priority,
        });
    };

    return {
        showSuccess: (title: string, message?: string, options?: ToastOptions) =>
            showToast(title, message, "success", options),

        showError: (title: string, message?: string, options?: ToastOptions) =>
            showToast(title, message, "error", options),

        showWarning: (title: string, message?: string, options?: ToastOptions) =>
            showToast(title, message, "warning", options),

        showDefault: (title: string, message?: string, options?: ToastOptions) =>
            showToast(title, message, "default", options),

        showUrgent: (title: string, message?: string, variant: ToastVariant = "error") =>
            showToast(title, message, variant, { priority: 100 }),

        showAchievement: (title: string, message?: string, options?: ToastOptions) =>
            showToast(title, message, "achievement", { priority: 99, duration: 6000, ...options }),

        clearAll: () => clearQueue(),
    };
};