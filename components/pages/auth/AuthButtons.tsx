import { useAuth } from "@/context/supabase-provider";
import { Github, User } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { Button, Paragraph, Separator, Theme, View } from "tamagui";
import AppleAuthButton from "./AppleAuthButton";

export default function AuthButtons() {
    const { signInAnonymously } = useAuth();

    return (
        <>
            <Theme inverse>
                <Button
                    alignSelf="center"
                    size="$4"
                    width={"80%"}
                    marginTop={16}
                    onPress={() => router.push("/auth/login")}
                >
                    Login via Email
                </Button>
                <Button
                    size="$4"
                    width={"80%"}
                    marginTop={16}
                    onPress={() => router.push("/auth/signup")}
                >
                    Sign Up via Email
                </Button>
            </Theme>

            <View flexDirection="row" gap="$4" alignItems="center" width="80%" marginTop={16}>
                <Separator />
                <Paragraph>Or</Paragraph>
                <Separator />
            </View>

            {/* <AppleAuthButton /> */}

            {/* <GoogleAuthButton /> */}

            <Button
                icon={Github}
                size="$4"
                width={"80%"}
                marginTop={16}
                onPress={() => router.push("/auth/signup")}
            >
                Continue with Github
            </Button>

            <Button
                icon={User}
                size="$4"
                width={"80%"}
                marginTop={16}
                onPress={() => signInAnonymously()}
            >
                Continue as Guest
            </Button>
        </>
    );
}
