import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

const isHapticsSupported = Platform.OS !== "web";

// --- IMPACT ---
export const triggerImpact = (
    style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium,
) => {
    if (isHapticsSupported) {
        Haptics.impactAsync(style);
    }
};
export const triggerLightImpact = () => triggerImpact(Haptics.ImpactFeedbackStyle.Light);
export const triggerMediumImpact = () => triggerImpact(Haptics.ImpactFeedbackStyle.Medium);
export const triggerHeavyImpact = () => triggerImpact(Haptics.ImpactFeedbackStyle.Heavy);

// --- NOTIFICATION ---
export const triggerNotification = (
    type: Haptics.NotificationFeedbackType = Haptics.NotificationFeedbackType.Success,
) => {
    if (isHapticsSupported) {
        Haptics.notificationAsync(type);
    }
};

export const triggerSuccessNotification = () =>
    triggerNotification(Haptics.NotificationFeedbackType.Success);
export const triggerWarningNotification = () =>
    triggerNotification(Haptics.NotificationFeedbackType.Warning);
export const triggerErrorNotification = () =>
    triggerNotification(Haptics.NotificationFeedbackType.Error);

// --- SELECTION ---
export const triggerSelection = () => {
    if (isHapticsSupported) {
        Haptics.selectionAsync();
    }
};
