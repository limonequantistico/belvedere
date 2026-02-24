import React from "react";
import { Portal } from "@tamagui/portal";
import { YStack, Spinner, Text, styled } from "tamagui";
import { useLoader } from "@/context/LoaderContext";

// Overlay con sfondo semi-trasparente
const Overlay = styled(YStack, {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    // zIndex: 9999,
});

// Container del loader
const LoaderContainer = styled(YStack, {
    backgroundColor: "transparent",
    padding: "$4",
    borderRadius: "$4",
    alignItems: "center",
    gap: "$3",
    shadowColor: "$shadowColor",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    minWidth: 120,
});

export const GlobalLoader: React.FC = () => {
    const { isLoading, message } = useLoader();

    if (!isLoading) {
        return null;
    }

    return (
        <Portal>
            <Overlay>
                <LoaderContainer>
                    <Spinner size="large" color="$primary" />
                    {message && (
                        <Text fontSize="$4" fontWeight="500" color="$color" textAlign="center">
                            {message}
                        </Text>
                    )}
                </LoaderContainer>
            </Overlay>
        </Portal>
    );
};
