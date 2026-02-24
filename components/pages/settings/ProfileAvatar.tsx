import { ThemedText } from "@/components/reusable-ui/ThemedText";
import { useAuth } from "@/context/supabase-provider";
import { Camera } from "@tamagui/lucide-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Avatar, Button, Spinner, Theme, YStack } from "tamagui";

export default function ProfileAvatar() {
    const { session, uploadProfileImage } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(
        session?.user?.user_metadata?.avatar_url || session?.user?.user_metadata?.picture || "",
    );
    const [userEmail] = useState(session?.user.email || "Guest");

    const pickImageAndUpload = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled && result.assets?.length) {
            const file = result.assets[0];
            const filePath = `avatars/${session?.user.id}_${Date.now()}.jpg`;
            const fileBlob = {
                uri: file.uri,
                name: filePath,
                type: "image/jpeg",
            };

            try {
                setUploading(true);
                const publicUrl = await uploadProfileImage(filePath, fileBlob);
                setAvatarUrl(publicUrl);
            } catch (err) {
                console.error("Errore caricamento avatar:", err);
            } finally {
                setUploading(false);
            }
        }
    };

    return (
        <>
            <YStack flex={1} alignItems="center" justifyContent="center" gap="$4" padding="$4">
                <YStack position="relative">
                    <Avatar circular size="$12">
                        <Avatar.Image accessibilityLabel="Profile" src={avatarUrl} />
                        <Avatar.Fallback backgroundColor="$success" />
                    </Avatar>

                    <Theme inverse>
                        <Button
                            size="$2"
                            icon={<Camera size={16} />}
                            position="absolute"
                            bottom={0}
                            right={5}
                            width={36}
                            height={36}
                            borderRadius={100}
                            elevation={4}
                            padding={0}
                            zIndex={10}
                            onPress={pickImageAndUpload}
                        />
                    </Theme>
                    {uploading && <Spinner />}
                </YStack>
                <ThemedText variant="caption" color="muted">
                    {userEmail}
                </ThemedText>
            </YStack>
        </>
    );
}
