import { View } from "tamagui";

interface SlideshowDotsProps {
    totalSlides: number;
    currentSlide: number;
    activeColor?: string;
    inactiveColor?: string;
    size?: number;
}

export function SlideshowDots({
    totalSlides,
    currentSlide,
    activeColor = "$accent10",
    inactiveColor = "$color6",
    size = 10,
}: SlideshowDotsProps) {
    return (
        <View
            position="absolute"
            bottom="$6"
            width="100%"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            gap="$2"
        >
            {Array.from({ length: totalSlides }).map((_, index) => (
                <View
                    key={index}
                    width={currentSlide === index ? size + 2 : size}
                    height={currentSlide === index ? size + 2 : size}
                    borderRadius={100}
                    backgroundColor={currentSlide === index ? activeColor : inactiveColor}
                    scale={currentSlide === index ? 1.2 : 1}
                    opacity={currentSlide === index ? 1 : 0.6}
                    animation="quick"
                    animateOnly={["scale", "backgroundColor", "opacity", "width", "height"]}
                />
            ))}
        </View>
    );
}
