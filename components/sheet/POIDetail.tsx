import React from 'react';
import { View, StyleSheet, Linking, ScrollView, Dimensions, Share, ActivityIndicator } from 'react-native';
import { YStack, XStack, Text, Button, useThemeName, useTheme } from 'tamagui';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { ViewpointLite } from '../../hooks/useViewpointsSync';
import { useViewpointDetails } from '../../hooks/useViewpointDetails';
import { MapPin, Navigation, ArrowLeft, Heart, Share as ShareIcon } from '@tamagui/lucide-icons';
import { useFavorites, useToggleFavorite } from '../../hooks/useFavorites';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type POIDetailProps = {
  viewpoint: ViewpointLite;
  onClose: () => void;
};

const getCategoryIcon = (category?: string) => {
  switch ((category || '').toLowerCase()) {
    case 'nature': return '🌲';
    case 'urban': return '🏙️';
    case 'historic': return '🏛️';
    case 'monument': return '🗿';
    default: return '📍';
  }
};

const MediaItem = ({ item, width = '100%' }: { item: { type: string, url: string }, width?: number | `${number}%` }) => {
  const player = useVideoPlayer(item.type === 'video' ? item.url : null, (p) => {
    p.loop = true;
    p.muted = true;
    if (item.type === 'video') {
      p.play();
    }
  });

  const { status } = useEvent(player, 'statusChange', { status: player.status });
  const isVideoLoading = status === 'loading';
  const isVideoReady = status === 'readyToPlay';
  const shouldShowVideo = isVideoReady || isVideoLoading;
  
  const opacity = useSharedValue(0);
  
  React.useEffect(() => {
    if (shouldShowVideo) {
      opacity.value = withTiming(1, { duration: 300 });
    }
  }, [shouldShowVideo]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={{ width, height: '100%', justifyContent: 'center', alignItems: 'center' }}>
      {item.type === 'video' ? (
        <>
          {isVideoLoading && (
            <View style={{ position: 'absolute', zIndex: 1 }}>
              <ActivityIndicator size="small" color="#E65100" />
            </View>
          )}
          <Animated.View style={[{ width: '100%', height: '100%' }, animatedStyle]}>
            <VideoView style={styles.heroImage} player={player} contentFit="cover" />
          </Animated.View>
        </>
      ) : (
        <Image source={{ uri: item.url }} style={{ width: '100%', height: '100%' }} contentFit="cover" transition={300} />
      )}
    </View>
  );
};

export function POIDetail({ viewpoint, onClose }: POIDetailProps) {
  const insets = useSafeAreaInsets();
  const { data: details, isLoading } = useViewpointDetails(viewpoint.id);
  const { data: favorites = [] } = useFavorites();
  const { mutate: toggleFavorite } = useToggleFavorite();
  const isFavorite = favorites.includes(viewpoint.id);
  const themeName = useThemeName();
  const theme = useTheme();
  const isDark = themeName.startsWith('dark');
  
  const iconColor = "$color";
  const btnBg = "$secondary";
  const btnPressBg = "$secondaryHover";
  const primaryColor = "$primary";

  const handleToggleFavorite = () => {
    toggleFavorite({ viewpointId: viewpoint.id, isFavorite });
  };

  const handleShare = async () => {
    try {
      const mapsUrl = `https://maps.apple.com/?q=${viewpoint.lat},${viewpoint.lng}`;
      const message = `Check out this spot: ${viewpoint.name}!\n\n${mapsUrl}`;
      
      await Share.share({
        message,
        title: viewpoint.name, // Android only title for share sheet
      });
    } catch (error) {
      console.error('Error sharing viewpoint:', error);
    }
  };

  const videoUrl = details?.video_url;
  const description = details?.description;

  const allImages = React.useMemo(() => {
    const images: { id: string, type: 'image', url: string }[] = [];
    if (viewpoint.cover_image_url) images.push({ id: 'cover', type: 'image', url: viewpoint.cover_image_url });

    if (details?.viewpoint_media) {
      const sortedExtra = [...details.viewpoint_media].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
      sortedExtra.forEach(m => {
        if (m.media_type === 'image') {
          images.push({ id: m.id, type: 'image', url: m.media_url });
        }
      });
    }

    const uniqueUrls = new Set();
    return images.filter(m => {
      if (uniqueUrls.has(m.url)) return false;
      uniqueUrls.add(m.url);
      return true;
    });
  }, [viewpoint.cover_image_url, details?.viewpoint_media]);

  const windowWidth = Dimensions.get('window').width;

  const handleNavigate = () => {
    // Open in native maps
    const url = `maps://0,0?q=${viewpoint.name}&ll=${viewpoint.lat},${viewpoint.lng}`;
    Linking.openURL(url).catch(() => {
      // Fallback for Android or if maps:// fails
      Linking.openURL(`https://maps.google.com/?q=${viewpoint.lat},${viewpoint.lng}`);
    });
  };

  return (
    <YStack flex={1}>
      {/* Header Area with Video OR Image Carousel */}
      {(videoUrl || allImages.length > 0) && (
        <View style={styles.heroContainer}>
          {videoUrl ? (
             <MediaItem item={{ type: 'video', url: videoUrl }} />
          ) : allImages.length === 1 ? (
             <MediaItem item={allImages[0]} />
          ) : (
             <ScrollView 
               horizontal 
               pagingEnabled 
               showsHorizontalScrollIndicator={false}
               style={{ flex: 1 }}
               contentContainerStyle={{ height: '100%' }}
             >
               {allImages.map((m) => (
                 <MediaItem key={m.id} item={m} width={windowWidth} />
               ))}
             </ScrollView>
          )}
          
          {/* Floating Back Button */}
        <Button 
          circular
          size="$4" 
          icon={<ArrowLeft size={20} color={iconColor} />}
          position="absolute"
          top="$4"
          left="$4"
          backgroundColor={btnBg}
          onPress={onClose}
          pressStyle={{ backgroundColor: btnPressBg }}
        />

        {/* Floating Favorite Button */}
        <Button 
          circular
          size="$4" 
          icon={<Heart size={20} color={isFavorite ? primaryColor : iconColor} fill={isFavorite ? primaryColor : "none"} />}
          position="absolute"
          top="$4"
          right="$4"
          backgroundColor={btnBg}
          onPress={handleToggleFavorite}
          pressStyle={{ backgroundColor: btnPressBg }}
        />

        {/* Floating Share Button */}
        <Button 
          circular
          size="$4" 
          icon={<ShareIcon size={20} color={iconColor} />}
          position="absolute"
          top="$4"
          right={64} // Place to the left of Favorite
          backgroundColor={btnBg}
          onPress={handleShare}
          pressStyle={{ backgroundColor: btnPressBg }}
        />
      </View>
      )}

      {(!videoUrl && allImages.length === 0) && (
         <YStack padding="$4" backgroundColor="$background">
           <XStack justifyContent="space-between">
             <Button 
               circular
               size="$4" 
               icon={<ArrowLeft size={20} color={iconColor} />}
               backgroundColor="$secondary"
               onPress={onClose}
               pressStyle={{ backgroundColor: "$secondaryHover" }}
             />
             <XStack gap="$3">
               <Button 
                 circular
                 size="$4" 
                 icon={<ShareIcon size={20} color={iconColor} />}
                 backgroundColor="$secondary"
                 onPress={handleShare}
                 pressStyle={{ backgroundColor: "$secondaryHover" }}
               />
               <Button 
                 circular
                 size="$4" 
                 icon={<Heart size={20} color={isFavorite ? primaryColor : iconColor} fill={isFavorite ? primaryColor : "none"} />}
                 backgroundColor="$secondary"
                 onPress={handleToggleFavorite}
                 pressStyle={{ backgroundColor: "$secondaryHover" }}
               />
             </XStack>
           </XStack>
         </YStack>
      )}

      <YStack padding="$4" gap="$4" flex={1}>
        <XStack justifyContent="space-between" alignItems="flex-start">
          <YStack flex={1} paddingRight="$4">
            <XStack alignItems="center" gap="$2" marginBottom="$1">
              <Text fontSize="$3">{getCategoryIcon(viewpoint.category_name)}</Text>
              <Text fontSize="$3" color="$mutedForeground" textTransform="uppercase" fontWeight="600" letterSpacing={1}>
                {viewpoint.category_name}
              </Text>
              {viewpoint.distance !== undefined && (
                <>
                  <Text fontSize="$3" color="$mutedForeground">•</Text>
                  <Text fontSize="$3" color="$mutedForeground" fontWeight="500">
                    {viewpoint.distance < 1 ? '< 1 km' : `${Math.round(viewpoint.distance)} km`}
                  </Text>
                </>
              )}
            </XStack>
            <Text fontSize="$8" fontWeight="bold" lineHeight={34} color="$color">
              {viewpoint.name}
            </Text>
          </YStack>
        </XStack>

        {/* Content Placeholder for description */}
        <YStack flex={1}>
          {isLoading ? (
            <Text color="$mutedForeground" fontSize="$5" lineHeight={24}>
              Loading details...
            </Text>
          ) : (
            <Text color="$mutedForeground" fontSize="$5" lineHeight={24}>
              {description || 'No description available for this viewpoint.'}
            </Text>
          )}
        </YStack>

        <Button 
          size="$5"
          backgroundColor="$primary" 
          color="$primaryForeground" 
          icon={<Navigation size={20} color="$primaryForeground" />}
          onPress={handleNavigate}
          borderRadius={100}
          marginTop="$4"
          marginBottom={insets.bottom > 0 ? insets.bottom : '$4'}
          pressStyle={{ backgroundColor: '$primaryHover' }}
        >
          Navigate Here
        </Button>
      </YStack>
    </YStack>
  );
}

const styles = StyleSheet.create({
  heroContainer: {
    height: 240,
    width: '100%',
    position: 'relative',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8,
  }
});
