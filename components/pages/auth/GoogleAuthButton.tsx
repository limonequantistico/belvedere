import { supabase } from "@/lib/supabase";
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from "@react-native-google-signin/google-signin";

export default function GoogleAuthButton() {
    return (
        <>
            {/* TODO: Fix Styling, it's completely wrong now */}
            <GoogleSigninButton
                style={{
                    width: "82%",
                    height: 48,
                    alignSelf: "center",
                    marginTop: 16,
                }}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Light}
                onPress={async () => {
                    try {
                        await GoogleSignin.hasPlayServices();
                        const userInfo = await GoogleSignin.signIn();
                        console.log("User Info:", userInfo);
                        if (userInfo?.data?.idToken) {
                            const { data, error } = await supabase.auth.signInWithIdToken({
                                provider: "google",
                                token: userInfo.data.idToken,
                            });
                            if (error) {
                                console.log(error);
                            } else {
                                console.log("Signed in with Google and Supabase:", data);
                            }
                        } else {
                            console.error("No ID token present in user info:", userInfo);
                            throw new Error("no ID token present!");
                        }
                    } catch (error: any) {
                        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                            // user cancelled the login flow
                            console.log("User cancelled the Google Sign-In flow");
                        } else if (error.code === statusCodes.IN_PROGRESS) {
                            // operation (e.g. sign in) is in progress already
                            console.log("Google Sign-In is already in progress");
                        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                            // play services not available or outdated
                            console.error("Play services not available or outdated:", error);
                        } else {
                            // some other error happened
                            console.error("Google Sign-In Error:", error);
                        }
                    }
                }}
            />
        </>
    );
}
