// import { useAuth } from "@/context/supabase-provider";
import { triggerLightImpact } from "@/services/hapticsService";
import { Home, User } from "@tamagui/lucide-icons";
import { Tabs } from "expo-router";
import { GetThemeValueForKey, View } from "tamagui";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { useAppTheme } from "@/context/ManualThemeProvider";

export default function TabsLayout() {
    // const { session } = useAuth();
    const { currentTheme } = useAppTheme();
    const insets = useSafeAreaInsets();
    // const avatarUrl =
    //     session?.user?.user_metadata?.avatar_url || session?.user?.user_metadata?.picture || null;
    /**
     * Since Expo's tabBarActiveTintColor/tabBarInactiveTintColor don't accept
     * Tamagui tokens like "$accent10", we access the theme directly for those values.
     */

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: "absolute",
                    elevation: 0,
                    borderTopWidth: 0,
                    backgroundColor:
                        currentTheme === "light" ? "rgba(255,255,255,0.56)" : "transparent",
                    height: 48 + insets.bottom,
                    paddingBottom: insets.bottom,
                },

                tabBarBackground: () => (
                    <BlurView
                        tint={currentTheme}
                        intensity={100}
                        style={{
                            ...StyleSheet.absoluteFillObject,
                            borderTopWidth: 0.5,
                            borderColor: "rgba(255,255,255,0.01)",
                        }}
                    />
                ),

                tabBarIconStyle: {
                    marginTop: 16,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                listeners={{
                    tabPress: () => {
                        triggerLightImpact();
                    },
                }}
                options={{
                    title: "Home",
                    tabBarIcon: ({ size, color, focused }) => (
                        <View
                            backgroundColor={focused ? "rgba(201, 122, 90, 0.08)" : "transparent"}
                            shadowColor={focused ? "rgba(201, 122, 90, 1)" : "transparent"}
                            shadowRadius={focused ? 9 : undefined}
                            shadowOpacity={2}
                            padding="$2.5"
                            borderRadius="$9"
                        >
                            <Home size={size} color={color as GetThemeValueForKey<"color">} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                listeners={{
                    tabPress: () => {
                        triggerLightImpact();
                    },
                }}
                options={{
                    title: "Profile",
                    tabBarIcon: ({ size, color, focused }) => (
                        <View
                            backgroundColor={focused ? "rgba(201, 122, 90, 0.08)" : "transparent"}
                            shadowColor={focused ? "rgba(201, 122, 90, 1)" : "transparent"}
                            shadowRadius={focused ? 9 : undefined}
                            shadowOpacity={2}
                            padding="$2.5"
                            borderRadius="$9"
                        >
                            <User size={size} color={color as GetThemeValueForKey<"color">} />
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}

// import { useAuth } from "@/context/supabase-provider";
// import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
// import { useTheme } from "tamagui";

// export default function TabLayout() {
//     const { session } = useAuth();
//     const avatarUrl =
//         session?.user?.user_metadata?.avatar_url ||
//         session?.user?.user_metadata?.picture ||
//         null;
//         /**
//          * Qui non essendoci la possibilità di passare alle proprietà di expo "tabBarActiveTintColor" e "tabBarInactiveTintColor"
//          * le proprietà di tamagui tipo "$accent10" dobbiamo accedere al tema per recuperarne i valori
//          */
//     const theme = useTheme();
//     const activeTintColor = theme.color12?.val || "#007AFF";
//     const inactiveTintColor = theme.color8?.val || "#999";

//   return (
//     <NativeTabs>
//       <NativeTabs.Trigger
//       name="index"

//       >
//         <Label>Home</Label>
//         <Icon sf="house.fill" drawable="custom_android_drawable" />
//       </NativeTabs.Trigger>
//       <NativeTabs.Trigger name="profile">
//         <Icon sf="gear" drawable="custom_settings_drawable" />
//         <Label>Settings</Label>
//       </NativeTabs.Trigger>
//     </NativeTabs>
//   );
// }
