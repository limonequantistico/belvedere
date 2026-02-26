import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, XStack, ScrollView, Separator, Text, Button, H2, H4 } from 'tamagui';
import { ChevronLeft, LogOut, Moon, Sun, Monitor } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import ProfileAvatar from '@/components/pages/settings/ProfileAvatar';
import { useAuth } from '@/context/supabase-provider';
import { useAppTheme } from '@/context/ManualThemeProvider';
import { useFavorites } from '@/hooks/useFavorites';
import { useViewpointsSync } from '@/hooks/useViewpointsSync';
import { ViewpointCard } from '@/components/sheet/ViewpointCard';
import { useStyledToast } from '@/hooks/useStyledToast';
import { useMapStore } from '@/store/useMapStore';

export default function ProfileScreen() {
    const router = useRouter();
    const { signOut } = useAuth();
    const { themeMode, setThemeMode } = useAppTheme();
    const toast = useStyledToast();
    
    // Favorites Data
    const { data: favoriteIds = [] } = useFavorites();
    const { data: allViewpoints = [] } = useViewpointsSync();
    
    // Store logic to move map when opening a favorite
    const { setCameraPosition, setSelectedViewpoint } = useMapStore();
    
    const favoriteViewpoints = allViewpoints.filter(vp => favoriteIds.includes(vp.id));
    
    const { session } = useAuth();
    // @ts-ignore - is_anonymous is returned by Supabase but missing from standard types
    const isAnonymous = session?.user?.is_anonymous ?? false;

    const handleSignOut = async () => {
        try {
            await signOut();
            router.replace('/welcome');
        } catch (error) {
            toast.showError("Logout Failed", "There was an error signing out.");
        }
    };

    const handleOpenFavorite = (id: string, lat: number, lng: number) => {
        // Close profile, fly to location, select viewpoint
        router.back();
        setTimeout(() => {
             setCameraPosition({
                 centerCoordinate: [lng, lat],
                 zoomLevel: 14,
             });
             setSelectedViewpoint(id);
        }, 300); // small delay to allow screen transition
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['top']}>
            <YStack flex={1} backgroundColor="$background">
                {/* Header */}
                <XStack alignItems="center" paddingHorizontal="$4" paddingTop="$2" paddingBottom="$4">
                    <Button 
                        icon={ChevronLeft} 
                        size="$3" 
                        circular 
                        chromeless 
                        onPress={() => router.back()} 
                    />
                    <H2 flex={1} textAlign="center" marginRight="$8">Profile</H2>
                </XStack>

                <ScrollView flex={1}>
                    <YStack gap="$6" paddingBottom="$8">
                        
                        {/* Avatar Section */}
                        <YStack alignItems="center">
                            <ProfileAvatar />
                        </YStack>

                        <Separator marginHorizontal="$4" borderColor="$borderColor" />

                        {/* Settings Section */}
                        <YStack gap="$4" paddingHorizontal="$4">
                            <H4>App Theme</H4>
                            <XStack gap="$3">
                                <Button 
                                    flex={1} 
                                    size="$3" 
                                    themeInverse={themeMode === 'light'}
                                    variant={themeMode === 'light' ? undefined : 'outlined'}
                                    icon={Sun}
                                    onPress={() => setThemeMode('light')}
                                >
                                    Light
                                </Button>
                                <Button 
                                    flex={1} 
                                    size="$3" 
                                    themeInverse={themeMode === 'dark'}
                                    variant={themeMode === 'dark' ? undefined : 'outlined'}
                                    icon={Moon}
                                    onPress={() => setThemeMode('dark')}
                                >
                                    Dark
                                </Button>
                                <Button 
                                    flex={1} 
                                    size="$3" 
                                    themeInverse={themeMode === 'auto'}
                                    variant={themeMode === 'auto' ? undefined : 'outlined'}
                                    icon={Monitor}
                                    onPress={() => setThemeMode('auto')}
                                >
                                    Auto
                                </Button>
                            </XStack>
                        </YStack>

                        <Separator marginHorizontal="$4" borderColor="$borderColor" />

                        {/* Favorites Section */}
                        {!isAnonymous && (
                            <YStack gap="$4">
                                <XStack paddingHorizontal="$4" alignItems="center" justifyContent="space-between">
                                    <H4>Favorites</H4>
                                    <Text color="$placeholderColor" fontSize="$3">{favoriteViewpoints.length} saved</Text>
                                </XStack>
                                
                                {favoriteViewpoints.length > 0 ? (
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                                        <XStack gap="$4">
                                            {favoriteViewpoints.map(vp => (
                                                <YStack key={vp.id} width={280}>
                                                    <ViewpointCard 
                                                        viewpoint={vp} 
                                                        onPress={() => handleOpenFavorite(vp.id, vp.lat, vp.lng)} 
                                                    />
                                                </YStack>
                                            ))}
                                        </XStack>
                                    </ScrollView>
                                ) : (
                                    <YStack padding="$4" alignItems="center" justifyContent="center" backgroundColor="$backgroundHover" marginHorizontal="$4" borderRadius="$4">
                                        <Text color="$color" textAlign="center">You haven't saved any viewpoints yet.</Text>
                                    </YStack>
                                )}
                            </YStack>
                        )}

                        {!isAnonymous && <Separator marginHorizontal="$4" borderColor="$borderColor" />}

                        {/* Account Actions */}
                        <YStack paddingHorizontal="$4" paddingTop="$4">
                            {isAnonymous ? (
                                <YStack gap="$4" alignItems="center">
                                    <Text color="$placeholderColor" textAlign="center">
                                        You are currently browsing as a Guest. Log in to save your favorite spots!
                                    </Text>
                                    <Button 
                                        size="$4" 
                                        themeInverse
                                        backgroundColor="$background"
                                        onPress={handleSignOut}
                                        width="100%"
                                    >
                                        Log In / Sign Up
                                    </Button>
                                </YStack>
                            ) : (
                                <Button 
                                    icon={LogOut} 
                                    size="$4" 
                                    backgroundColor="$error"
                                    color="$color"
                                    onPress={handleSignOut}
                                    pressStyle={{ backgroundColor: "$errorHover" }}
                                >
                                    Sign Out
                                </Button>
                            )}
                        </YStack>

                    </YStack>
                </ScrollView>
            </YStack>
        </SafeAreaView>
    );
}
