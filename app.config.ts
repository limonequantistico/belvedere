import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: "expo-supabase-template",
    slug: "expo-supabase-template",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "exposupabase",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
        usesAppleSignIn: true,
        supportsTablet: true,
        bundleIdentifier: "com.limonequantistico.exposupabasetemplate",
    },
    android: {
        adaptiveIcon: {
            foregroundImage: "./assets/images/adaptive-icon.png",
            backgroundColor: "#ffffff",
        },
        edgeToEdgeEnabled: true,
        package: "com.limonequantistico.exposupabasetemplate",
    },
    web: {
        bundler: "metro",
        output: "static",
        favicon: "./assets/images/favicon.png",
    },
    plugins: [
        "expo-router",
        [
            "expo-splash-screen",
            {
                image: "./assets/images/splash-icon.png",
                imageWidth: 200,
                resizeMode: "contain",
                backgroundColor: "#ffffff",
            },
        ],
        "expo-apple-authentication",
        [
            "@react-native-google-signin/google-signin",
            {
                iosUrlScheme: process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME,
                iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
            },
        ],
        "expo-web-browser",
    ],
    experiments: {
        typedRoutes: true,
    },
    extra: {
        router: {},
        eas: {
            projectId: "56c56d7d-8540-49f0-a6ae-1ca112ede0fe",
        },
    },
    owner: "limonequantistico",
});
