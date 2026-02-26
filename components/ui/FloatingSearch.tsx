import React, { useState } from 'react';
import { Input, XStack, YStack, Avatar, Text, ScrollView, Spinner } from 'tamagui';
import { Search, MapPin, Navigation } from '@tamagui/lucide-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMapStore } from '../../store/useMapStore';
import { useGlobalSearch, SearchResult } from '../../hooks/useGlobalSearch';
import { Keyboard, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/supabase-provider';

export function FloatingSearch() {
  const insets = useSafeAreaInsets();
  const { setCameraPosition, setSelectedViewpoint } = useMapStore();
  const [localQuery, setLocalQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const { session } = useAuth();

  // Hook into our custom search logic
  const { data: searchResults, isLoading } = useGlobalSearch(localQuery);

  const handleSelect = (result: SearchResult) => {
    Keyboard.dismiss();
    setLocalQuery(result.title);
    setIsFocused(false);

    if (result.type === 'place') {
      if (result.coordinates && result.coordinates[0] !== 0) {
        setCameraPosition({
          centerCoordinate: result.coordinates,
          zoomLevel: 10,
        });
      }
    } else if (result.type === 'viewpoint') {
      // Fly to the specific viewpoint and open it
      setCameraPosition({
        centerCoordinate: result.coordinates,
        zoomLevel: 14,
      });
      setSelectedViewpoint(result.id);
    }
  };

  return (
    <YStack
      position="absolute"
      top={insets.top + 10}
      left={16}
      right={16}
      zIndex={20} // Higher than pills to dropdown over them
      gap="$2"
    >
      <XStack
        alignItems="center"
        gap="$3"
      >
        <XStack
          flex={1}
          bg="$background"
          borderRadius="$10"
          alignItems="center"
          paddingHorizontal="$3"
          elevation={4}
          shadowColor="$shadowColor"
          shadowOffset={{ width: 0, height: 4 }}
          shadowOpacity={0.15}
          shadowRadius={12}
        >
          {isLoading ? (
            <Spinner size="small" color="$placeholderColor" />
          ) : (
            <Search size={20} color="$placeholderColor" />
          )}
          <Input
            flex={1}
            unstyled
            placeholder="Search places or viewpoints..."
            value={localQuery}
            onChangeText={setLocalQuery}
            onFocus={() => setIsFocused(true)}
            paddingVertical="$3"
            paddingHorizontal="$2"
            color="$color"
            fontSize="$4"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </XStack>

        <Pressable onPress={() => router.push('/profile')}>
          <Avatar circular size="$4" elevation={2}>
            {session?.user?.user_metadata?.avatar_url || session?.user?.user_metadata?.picture ? (
              <Avatar.Image src={session?.user?.user_metadata?.avatar_url || session?.user?.user_metadata?.picture} />
            ) : (
              <Avatar.Fallback bg="$primary" />
            )}
          </Avatar>
        </Pressable>
      </XStack>

      {/* Dropdown Results */}
      {isFocused && localQuery.length >= 2 && searchResults && searchResults.length > 0 && (
        <YStack
          bg="$background"
          borderRadius="$6"
          elevation={4}
          shadowColor="$shadowColor"
          shadowOffset={{ width: 0, height: 4 }}
          shadowOpacity={0.2}
          shadowRadius={8}
          maxHeight={300}
          overflow="hidden"
        >
          <ScrollView keyboardShouldPersistTaps="handled">
            {searchResults.map((result) => (
              <XStack
                key={result.id}
                padding="$3"
                alignItems="center"
                gap="$3"
                borderBottomWidth={1}
                borderBottomColor="$borderColor"
                onPress={() => handleSelect(result)}
              >
                {result.type === 'viewpoint' ? (
                  <Navigation size={18} color="$primary" />
                ) : (
                  <MapPin size={18} color="$color" />
                )}
                <YStack flex={1}>
                  <Text color="$color" fontWeight="600" numberOfLines={1}>
                    {result.title}
                  </Text>
                  {result.subtitle && (
                    <Text color="$placeholderColor" fontSize="$3" numberOfLines={1}>
                      {result.subtitle}
                    </Text>
                  )}
                </YStack>
              </XStack>
            ))}
          </ScrollView>
        </YStack>
      )}
    </YStack>
  );
}
