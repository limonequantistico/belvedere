import { create } from "zustand";
import { ToastVariant } from "@/components/reusable-ui/toasts/ToastStyles";

let toastIdCounter = 0;
const generateToastId = () => `toast_${Date.now()}_${++toastIdCounter}`;

export type ToastRequest = {
    id: string;
    title: string;
    message?: string;
    variant: ToastVariant;
    duration?: number;
    priority?: number;
};

type ToastStore = {
    queue: ToastRequest[];
    addToast: (toast: Omit<ToastRequest, "id">) => void;
    shiftToast: () => void;
    clearQueue: () => void;
    removeToast: (id: string) => void;
};

const MAX_QUEUE_SIZE = 10;
const DEFAULT_DURATION = 4000;

export const useToastStore = create<ToastStore>((set, get) => ({
    queue: [],

    addToast: toast => {
        const newToast: ToastRequest = {
            ...toast,
            id: generateToastId(),
            duration: toast.duration ?? DEFAULT_DURATION,
            priority: toast.priority ?? 0,
        };

        set(state => {
            // Prevent duplicates (same title and message within 1 second)
            const isDuplicate = state.queue.some(
                t =>
                    t.title === newToast.title &&
                    t.message === newToast.message &&
                    parseInt(t.id.split("_")[1]) > Date.now() - 1000,
            );

            if (isDuplicate) {
                console.warn("Duplicate toast prevented:", newToast.title);
                return state;
            }

            // Limit queue size
            let updatedQueue = [...state.queue, newToast];
            if (updatedQueue.length > MAX_QUEUE_SIZE) {
                console.warn("Toast queue full, removing oldest toast");
                updatedQueue = updatedQueue.slice(1);
            }

            // Sort by priority (higher first)
            updatedQueue.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

            return { queue: updatedQueue };
        });
    },

    shiftToast: () => set(state => ({ queue: state.queue.slice(1) })),

    clearQueue: () => set({ queue: [] }),

    removeToast: id =>
        set(state => ({
            queue: state.queue.filter(t => t.id !== id),
        })),
}));
