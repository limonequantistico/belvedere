import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: "belvedere",
    slug: "belvedere",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "belvedere",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
        usesAppleSignIn: true,
        supportsTablet: true,
        bundleIdentifier: "com.limonequantistico.belvedere",
    },
    android: {
        adaptiveIcon: {
            foregroundImage: "./assets/images/adaptive-icon.png",
            backgroundColor: "#ffffff",
        },
        edgeToEdgeEnabled: true,
        package: "com.limonequantistico.belvedere",
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
                iosUrlScheme: process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME || "com.googleusercontent.apps.PLACEHOLDER",
                iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || "PLACEHOLDER",
            },
        ],
        "expo-web-browser",
        [
            "@rnmapbox/maps",
            {
                RNMapboxMapsImpl: "mapbox",
            },
        ],
        "expo-video",
        [
            "expo-build-properties",
            {
                ios: {
                    deploymentTarget: "15.1"
                }
            }
        ],
        [
            "expo-location",
            {
                locationWhenInUsePermission: "Belvedere needs your location to find scenic viewpoints near you.",
            },
        ],
    ],
    experiments: {
        typedRoutes: true,
    },
    extra: {
        router: {},
        eas: {
            projectId: "ce46656a-c937-42c0-836f-ed52441a533a",
        },
    },
    owner: "pythor",
});
