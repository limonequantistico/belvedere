import { useAuth } from "@/context/supabase-provider";
import { ChevronRight, LogOut, Settings, Settings2 } from "@tamagui/lucide-icons";
import { ListItem, Separator, YGroup } from "tamagui";

export default function SettingsList() {
    const { signOut } = useAuth();

    return (
        <>
            <YGroup bordered width="100%" size="$5" separator={<Separator />}>
                <ListItem
                    hoverTheme
                    pressTheme
                    icon={Settings}
                    title="Settings"
                    subTitle="Manage your account settings"
                    borderRadius="$4"
                    marginBottom="$1"
                    iconAfter={ChevronRight}
                />
                <ListItem
                    hoverTheme
                    pressTheme
                    icon={Settings2}
                    title="Other Settings"
                    subTitle="Manage your settings"
                    borderRadius="$4"
                    marginBottom="$1"
                    iconAfter={ChevronRight}
                />

                <ListItem
                    hoverTheme
                    pressTheme
                    icon={LogOut}
                    title="Logout"
                    subTitle="End session"
                    borderRadius="$4"
                    marginBottom="$1"
                    onPress={signOut}
                />
            </YGroup>
        </>
    );
}
