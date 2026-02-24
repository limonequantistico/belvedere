import { supabase } from "@/lib/supabase";
import * as AppleAuthentication from "expo-apple-authentication";
import { StyleSheet } from "react-native";

export default function AppleAuthButton() {
    // TODO: Non implementabile finché non avrò un account Apple Developer
    // ed inserito le chiavi su Supabase
    // https://supabase.com/dashboard/project/nuaqjdawzozlpbbrdeoj/auth/providers?provider=Apple
    return (
        <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
            cornerRadius={5}
            style={styles.button}
            onPress={async () => {
                try {
                    const credential = await AppleAuthentication.signInAsync({
                        requestedScopes: [
                            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                            AppleAuthentication.AppleAuthenticationScope.EMAIL,
                        ],
                    });
                    console.log("Apple Sign-In credential:", credential);

                    const { identityToken, user } = credential;

                    if (!identityToken) {
                        console.error("No identity token returned");
                        return;
                    }

                    const { data, error } = await supabase.auth.signInWithIdToken({
                        provider: "apple",
                        token: identityToken,
                    });

                    if (error) {
                        console.error("Supabase Apple Sign-In error:", error);
                        return;
                    }

                    console.log("Signed in with Apple and Supabase:", data);
                } catch (e: any) {
                    if (e.code === "ERR_REQUEST_CANCELED") {
                        console.log("User canceled the sign-in flow");
                    } else {
                        console.error("Apple Sign-In Error:", e);
                    }
                }
            }}
        />
    );
}

const styles = StyleSheet.create({
    button: {
        width: "80%",
        height: 48, // oppure 44 se vuoi lo stesso di Apple, ma più coerente usare 48
        alignSelf: "center",
        marginTop: 16,
    },
});
