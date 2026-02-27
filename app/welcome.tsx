import AuthButtons from "@/components/pages/auth/AuthButtons";
import { SlideshowDots } from "@/components/pages/intro/SlideshowDots";
import { ThemedText } from "@/components/reusable-ui/ThemedText";
import { Asset } from "expo-asset";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, ImageBackground, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { Image, ScrollView, View, YStack, Theme } from "tamagui";

const { width, height } = Dimensions.get("window");
const slidesCount = 4;

const preloadImages = [
    require("@/assets/images/lotr1.png"),
    require("@/assets/images/lotr2.png"),
    require("@/assets/images/lotr3.png"),
];

export default function WelcomeSlideshow() {
    const [currentPage, setCurrentPage] = useState(0);
    const scrollRef = useRef<ScrollView>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        async function loadAssets() {
            await Asset.loadAsync(preloadImages);
            setReady(true);
        }

        loadAssets();
    }, []);

    if (!ready) return null;

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const page = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentPage(page);
    };

    const slides = [
        {
            image: require("@/assets/images/adaptive-icon.png"),
            title: "Welcome to Expo-Supabase",
            description: "A simple way to get started with Expo and Supabase.",
            background: require("@/assets/images/lotr1.png"),
        },
        {
            image: require("@/assets/images/adaptive-icon.png"),
            title: "Useful Features",
            description: "Navigation, authentication, and more — all ready to go.",
            background: require("@/assets/images/lotr2.png"),
        },
        {
            image: require("@/assets/images/adaptive-icon.png"),
            title: "Get Started",
            description: "Start building your next great app.",
            background: require("@/assets/images/lotr3.png"),
        },
    ];

    return (
        <View flex={1}>
            <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                onScroll={handleScroll}
                scrollEventThrottle={16}
                showsHorizontalScrollIndicator={false}
                flex={1}
            >
                {slides.map((slide, index) => (
                    <ImageBackground
                        key={index}
                        source={slide.background}
                        style={{ width, height, flex: 1 }}
                        resizeMode="cover"
                    >
                        <YStack
                            key={index}
                            width={width}
                            height={"100%"}
                            alignItems="center"
                            justifyContent="center"
                            backgroundColor="rgba(0,0,0,0.8)"
                        >
                            <Image
                                source={slide.image}
                                width={128}
                                height={128}
                                borderRadius={12}
                                marginBottom="$4"
                            />
                            <Theme name="dark">
                                {/* Text is always white since the background is dark */}
                                <ThemedText
                                    variant="h1"
                                    marginBottom="$2"
                                    color="$color"
                                    textAlign="center"
                                >
                                    {slide.title}
                                </ThemedText>
                                <ThemedText variant="caption" color="$color">{slide.description}</ThemedText>
                            </Theme>
                        </YStack>
                    </ImageBackground>
                ))}

                <YStack width={width} height={height} alignItems="center" justifyContent="center">
                    <AuthButtons />
                </YStack>
            </ScrollView>

            <SlideshowDots totalSlides={slidesCount} currentSlide={currentPage} />
        </View>
    );
}
