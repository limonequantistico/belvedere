import ProfileAvatar from "@/components/pages/settings/ProfileAvatar";
import SettingsList from "@/components/pages/settings/SettingsList";
import { ThemeToggle, ThemeToggle2 } from "@/components/pages/settings/ThemeToggle";
import { SafeScrollView } from "@/components/reusable-ui/SafeScrollView";
import { YStack } from "tamagui";

export default function Profile() {
    return (
        <YStack flex={1}>
            <SafeScrollView>
                <YStack gap={"$3"}>
                    <ThemeToggle />
                    <ProfileAvatar />

                    <ThemeToggle2 />

                    <SettingsList />
                </YStack>
            </SafeScrollView>
        </YStack>
    );
}
