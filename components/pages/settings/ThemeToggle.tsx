import { ThemedButton } from "@/components/reusable-ui/ThemedButton";
import { useAppTheme } from "@/context/ManualThemeProvider";
import { ThemeMode } from "@/hooks/useThemePreference";
import { Ionicons } from "@expo/vector-icons";
import { Button, XStack, useTheme } from "tamagui";

export function ThemeToggle() {
    const { themeMode, setThemeMode } = useAppTheme();

    const options: { mode: ThemeMode; label: string; icon: string }[] = [
        { mode: "auto", label: "Auto", icon: "phone-portrait-outline" },
        { mode: "light", label: "Chiaro", icon: "sunny-outline" },
        { mode: "dark", label: "Scuro", icon: "moon-outline" },
    ];

    return (
        <XStack flex={1} justifyContent={"center"} alignItems="center">
            <XStack
                gap="$2"
                backgroundColor="$card"
                borderRadius="$4"
                shadowRadius={3}
                shadowColor="$shadowColor"
            >
                {options.map(({ mode, label, icon }) => {
                    const isActive = themeMode === mode;

                    return (
                        // <Theme key={mode} name={"accent"}>
                        <ThemedButton
                            key={mode}
                            size="$3"
                            variant={isActive ? "outline" : "ghost"}
                            backgroundColor={isActive ? "$background" : "transparent"}
                            borderColor={isActive ? "$primary" : "transparent"}
                            onPress={() => setThemeMode(mode)}
                        >
                            <Ionicons name={icon as any} size={16} />
                            {/*<ThemedText*/}
                            {/*    type='default'*/}
                            {/*    fontSize="$3"*/}
                            {/*    color={isActive ? "$accent10" : "$color10"}*/}
                            {/*    fontWeight={isActive ? "600" : "400"}*/}
                            {/*>*/}
                            {/*    {label}*/}
                            {/*    {mode === 'auto' && (*/}
                            {/*        <ThemedText fontSize="$2" color="$color8">*/}
                            {/*            {` (${systemColorScheme === 'dark' ? 'scuro' : 'chiaro'})`}*/}
                            {/*        </ThemedText>*/}
                            {/*    )}*/}
                            {/*</ThemedText>*/}
                        </ThemedButton>
                        // </Theme>
                    );
                })}
            </XStack>
        </XStack>
    );
}

export function ThemeToggle2() {
    const { themeMode, setThemeMode } = useAppTheme();
    const theme = useTheme(); // ✅ Accesso ai valori dei token

    const options: { mode: ThemeMode; label: string; icon: string }[] = [
        { mode: "auto", label: "Auto", icon: "phone-portrait-outline" },
        { mode: "light", label: "Chiaro", icon: "sunny-outline" },
        { mode: "dark", label: "Scuro", icon: "moon-outline" },
    ];

    return (
        <XStack
            backgroundColor="$card"
            borderRadius="$4"
            shadowRadius={3}
            shadowColor="$shadowColor"
            gap="$2"
        >
            {options.map(({ mode, label, icon }) => {
                const isActive = themeMode === mode;

                return (
                    <Button
                        key={mode}
                        flex={1}
                        size="$3"
                        backgroundColor={isActive ? "$background" : "transparent"}
                        borderColor={isActive ? "$primary" : "transparent"}
                        borderRadius="$3"
                        shadowColor={isActive ? "$shadowColor" : "transparent"}
                        shadowOffset={isActive ? { width: 0, height: 1 } : { width: 0, height: 0 }}
                        shadowOpacity={isActive ? 0.1 : 0}
                        shadowRadius={isActive ? 2 : 0}
                        elevation={isActive ? 2 : 0}
                        onPress={() => setThemeMode(mode)}
                        animation="quick"
                        animateOnly={["backgroundColor", "shadowOpacity"]}
                    >
                        <Ionicons
                            name={icon as any}
                            size={16}
                            color={isActive ? theme.color12?.val : theme.color10?.val} // ✅ Usa .val
                        />
                    </Button>
                );
            })}
        </XStack>
    );
}
