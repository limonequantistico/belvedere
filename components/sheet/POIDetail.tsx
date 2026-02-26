import React from 'react';
import { View, StyleSheet, Linking, ScrollView, Dimensions, Share } from 'react-native';
import { YStack, XStack, Text, Button } from 'tamagui';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
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

  return (
    <View style={{ width, height: '100%' }}>
      {item.type === 'video' ? (
        <VideoView style={styles.heroImage} player={player} contentFit="cover" />
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
          icon={<ArrowLeft size={20} color="#1A1A1A" />}
          position="absolute"
          top="$4"
          left="$4"
          backgroundColor="rgba(255, 255, 255, 0.9)"
          onPress={onClose}
          pressStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
        />

        {/* Floating Favorite Button */}
        <Button 
          circular
          size="$4" 
          icon={<Heart size={20} color={isFavorite ? "#E65100" : "#1A1A1A"} fill={isFavorite ? "#E65100" : "none"} />}
          position="absolute"
          top="$4"
          right="$4"
          backgroundColor="rgba(255, 255, 255, 0.9)"
          onPress={handleToggleFavorite}
          pressStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
        />

        {/* Floating Share Button */}
        <Button 
          circular
          size="$4" 
          icon={<ShareIcon size={20} color="#1A1A1A" />}
          position="absolute"
          top="$4"
          right={64} // Place to the left of Favorite
          backgroundColor="rgba(255, 255, 255, 0.9)"
          onPress={handleShare}
          pressStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
        />
      </View>
      )}

      {(!videoUrl && allImages.length === 0) && (
         <View style={{ padding: 16 }}>
           <XStack justifyContent="space-between">
             <Button 
               circular
               size="$4" 
               icon={<ArrowLeft size={20} color="#1A1A1A" />}
               backgroundColor="rgba(0, 0, 0, 0.05)"
               onPress={onClose}
               pressStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
             />
             <XStack gap="$3">
               <Button 
                 circular
                 size="$4" 
                 icon={<ShareIcon size={20} color="#1A1A1A" />}
                 backgroundColor="rgba(0, 0, 0, 0.05)"
                 onPress={handleShare}
                 pressStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
               />
               <Button 
                 circular
                 size="$4" 
                 icon={<Heart size={20} color={isFavorite ? "#E65100" : "#1A1A1A"} fill={isFavorite ? "#E65100" : "none"} />}
                 backgroundColor="rgba(0, 0, 0, 0.05)"
                 onPress={handleToggleFavorite}
                 pressStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
               />
             </XStack>
           </XStack>
         </View>
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
          backgroundColor="#E65100" 
          color="white" 
          icon={<Navigation size={20} color="white" />}
          onPress={handleNavigate}
          borderRadius={100}
          marginTop="$4"
          marginBottom={insets.bottom > 0 ? insets.bottom : '$4'}
          pressStyle={{ backgroundColor: '#cc4800' }}
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
