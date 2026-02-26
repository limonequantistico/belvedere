import { useLoader } from "@/context/LoaderContext";
import { useStyledToast } from "@/hooks/useStyledToast";
import { supabase } from "@/lib/supabase";
import { triggerSuccessNotification } from "@/services/hapticsService";
import { Session } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import { SplashScreen, useRouter } from "expo-router";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

type AuthState = {
    initialized: boolean;
    session: Session | null;
    signUp: (email: string, password: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signInAnonymously: () => Promise<void>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    updatePassword: (newPassword: string) => Promise<void>;
    uploadProfileImage: (
        filePath: string,
        fileBlob: { uri: string; name: string; type: string },
    ) => Promise<string>;
};

export const AuthContext = createContext<AuthState>({
    initialized: false,
    session: null,
    signUp: async () => { },
    signIn: async () => { },
    signInAnonymously: async () => { },
    signOut: async () => { },
    resetPassword: async () => { },
    updatePassword: async () => { },
    uploadProfileImage: async (_filePath: string, _fileBlob: any) => "",
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: PropsWithChildren) {
    const [initialized, setInitialized] = useState(false);
    const [session, setSession] = useState<Session | null>(null);

    const router = useRouter();
    const toast = useStyledToast();
    const { showLoader, hideLoader } = useLoader();

    useEffect(() => {
        if (initialized) {
            SplashScreen.hideAsync();
            if (session) {
                router.replace("/");
            } else {
                router.replace("/welcome");
            }
        }
    }, [initialized, router, session]);

    const signUp = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: "http://localhost:8081/signup-verification",
            },
        });

        if (error) {
            console.error("Error signing up:", error);
            toast.showError("Signup failed", error.message ?? "Something went wrong");
            return;
        }

        if (data.user) {
            console.log("User signed up:", data.user);
            if (data.user.identities?.length === 0) {
                toast.showError(
                    "Email already registered",
                    "Check your inbox to confirm or log in instead.",
                );
                return;
            }
            router.replace("/auth/signup-verification");
        } else {
            console.log("No user returned from sign up");
        }
    };

    const signIn = async (email: string, password: string) => {
        showLoader("Logging in...");
        const { data, error } = await supabase.auth
            .signInWithPassword({
                email,
                password,
            })
            .finally(() => hideLoader());

        if (error) {
            console.error("Error signing in:", error);
            toast.showError("Login failed", error.message ?? "Something went wrong");
            return;
        }

        if (data.session) {
            setSession(data.session);
            console.log("User signed in:", data.user);
            toast.showSuccess("Login successful", "Logged in as " + data.user.email);
            triggerSuccessNotification();
        }
    };

    const signInAnonymously = async () => {
        showLoader("Logging in...");
        const { data, error } = await supabase.auth.signInAnonymously().finally(() => hideLoader());

        if (error) {
            console.error("Error signing in anonymously: ", error);
            toast.showError("Anonymous access failed", error.message ?? "Something went wrong");
            return;
        }

        if (data.session) {
            toast.showSuccess(
                "Guest access granted",
                "Remember you could easily lose your data without an account!",
            );
            setSession(data.session);
        }
    };

    const signOut = async () => {
        showLoader("Logging out...");
        const { error } = await supabase.auth.signOut().finally(() => hideLoader());

        if (error) {
            console.error("Error signing out:", error);
            toast.showError("Logout failed", error.message ?? "Something went wrong");
            return;
        } else {
            toast.showSuccess("Logout successful", "See you later! :)");
        }
    };

    const resetPassword = async (email: string) => {
        showLoader("Loading...");
        const redirectUrl = Linking.createURL("/reset-password");

        const { error, data } = await supabase.auth
            .resetPasswordForEmail(email, {
                redirectTo: redirectUrl,
            })
            .finally(() => hideLoader());

        if (error) {
            console.error("Error resetting the password:", error);
            toast.showError("There was a problem", error.message ?? "Something went wrong");
            return;
        }
        console.log("Password reset email sent:", data);
        toast.showSuccess("Operation successful", "An email has been sent to your inbox");
    };

    const updatePassword = async (newPassword: string) => {
        showLoader("Updating password...");
        const { error } = await supabase.auth
            .updateUser({ password: newPassword })
            .finally(() => hideLoader());

        if (error) {
            console.error("Error updating password:", error);
            toast.showError("There was a problem", error.message ?? "Something went wrong");
            throw error;
        } else {
            toast.showSuccess("Password updated successfully");
        }
    };

    const uploadProfileImage = async (
        filePath: string,
        fileBlob: { uri: string; name: string; type: string },
    ) => {
        // TODO: Storage policies are very permissive, should be tightened for production
        showLoader("Uploading...");
        const formData = new FormData();
        formData.append("file", fileBlob as any);

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(filePath, formData, {
                upsert: true,
            })
            .finally(() => hideLoader());

        if (uploadError) throw uploadError;

        // Retrieve public URL
        const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(filePath);

        const publicUrl = publicUrlData?.publicUrl;
        if (!publicUrl) throw new Error("Failed to retrieve public URL");

        showLoader("Updating...");
        // Update user_metadata
        const { error: updateError } = await supabase.auth
            .updateUser({
                data: { avatar_url: publicUrl },
            })
            .finally(() => hideLoader());

        if (updateError) throw updateError;

        return publicUrl;
    };

    // Handle deep links for password recovery
    useEffect(() => {
        const handleDeepLink = async (url: string) => {
            console.log("Deep link received:", url);

            // Check if it's a recovery link
            if (url.includes("reset-password") || url.includes("type=recovery")) {
                try {
                    // For Supabase links, the token is in the URL as a parameter
                    const urlObj = new URL(url);
                    const fragment = urlObj.hash.substring(1); // Remove the #
                    const params = new URLSearchParams(fragment);

                    const accessToken = params.get("access_token");
                    const refreshToken = params.get("refresh_token");

                    if (accessToken && refreshToken) {
                        // Set session with received tokens
                        const { data, error } = await supabase.auth.setSession({
                            access_token: accessToken,
                            refresh_token: refreshToken,
                        });

                        if (error) {
                            console.error("Session setup error:", error);
                        } else {
                            console.log("Recovery session established:", data);
                            setSession(data.session);
                            // Navigate to reset password page
                            setTimeout(() => {
                                router.replace("/auth/reset-password");
                            }, 100);
                        }
                    }
                } catch (error) {
                    console.error("Error handling recovery link:", error);
                }
            }
        };

        // Listen for deep links when the app is already open
        const subscription = Linking.addEventListener("url", ({ url }) => {
            handleDeepLink(url);
        });

        // Check if the app was opened from a deep link
        Linking.getInitialURL().then(url => {
            if (url) {
                handleDeepLink(url);
            }
        });

        return () => subscription?.remove();
    }, [router]);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        setInitialized(true);

        return () => subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                initialized,
                session,
                signUp,
                signIn,
                signInAnonymously,
                signOut,
                resetPassword,
                updatePassword,
                uploadProfileImage,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
