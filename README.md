# Expo + Supabase + Tamagui Template

A production-ready mobile app template built with **Expo SDK 54**, **Supabase**, and **Tamagui**. Includes authentication, theming, toast notifications, haptics, and a tab-based navigation structure — all wired up and ready to go.

> **Architecture Note**: Belvedere utilizes a custom Local-First synchronization model for its map POIs. See [`.docs/phases/phase-2-core-map/data-architecture.md`](.docs/phases/phase-2-core-map/data-architecture.md) for full details on how `react-native-mmkv` and Supabase RPCs achieve zero-latency map rendering.

## Tech Stack

| Layer      | Technology                                                                        |
| ---------- | --------------------------------------------------------------------------------- |
| Framework  | [Expo](https://expo.dev) SDK 54 (New Architecture)                                |
| Navigation | [Expo Router](https://docs.expo.dev/router/introduction/) v6 (file-based routing) |
| UI Library | [Tamagui](https://tamagui.dev) v1.138                                             |
| Backend    | [Supabase](https://supabase.com) (Auth, Storage)                                  |
| State      | [Zustand](https://zustand-demo.pmnd.rs/) (toast queue)                            |
| Validation | [Zod](https://zod.dev) v4                                                         |

---

## Project Structure

```
app/
├── _layout.tsx              # Root layout (providers, debug button)
├── index.tsx                # Entry redirect (auth check)
├── welcome.tsx              # Onboarding slideshow
├── auth/                    # Login, Signup, Forgot/Reset password
└── (protected)/             # Auth-guarded routes
    ├── _layout.tsx           # Protected stack + modal
    └── (tabs)/               # Bottom tab navigator
        ├── index.tsx          # Home tab
        └── profile.tsx        # Profile + settings tab

components/
├── pages/                   # Page-specific components
│   ├── auth/                 # AuthButtons, AppleAuth, GoogleAuth
│   ├── intro/                # SlideshowDots
│   └── settings/             # ProfileAvatar, SettingsList, ThemeToggle
└── reusable-ui/             # Shared UI components
    ├── GlobalLoader.tsx       # Full-screen loading overlay
    ├── InputField.tsx         # Styled text input
    ├── SafeScrollView.tsx     # Safe-area-aware scroll view
    ├── ThemedButton.tsx       # Theme-aware button variants
    ├── ThemedCard.tsx         # Theme-aware card
    ├── ThemedText.tsx         # Typography component
    └── toasts/                # Toast system (StyledToast, ToastStyles, AnimatedBorder)

context/
├── supabase-provider.tsx    # Auth context (sign in/up/out, password reset, avatar upload)
├── ManualThemeProvider.tsx   # Tamagui theme wrapper + theme context
├── LoaderContext.tsx         # Global loader state
└── toastStore.ts            # Zustand store for toast queue

hooks/
├── useStyledToast.tsx       # Toast helper (showSuccess, showError, showWarning, etc.)
├── useThemePreference.ts    # Persistent theme preference (auto/light/dark)
└── useReactNavigationTheme.ts # Syncs Tamagui theme → React Navigation theme

lib/
├── supabase.ts              # Supabase client (env vars, session persistence)
└── googleSignIn.ts          # Google Sign-In config (commented, ready to enable)

services/
└── hapticsService.tsx       # Platform-safe haptic feedback wrappers
```

---

## New Project Setup

Follow these steps each time you start a new project from this template.

### 1. Clone and install

```bash
git clone <this-repo> my-new-app
cd my-new-app
npm install
```

### 2. Create a Supabase project

1. Go to the [Supabase Dashboard](https://supabase.com/dashboard) and create a new project
2. Note your **Project URL** and **Anon Key** (or Publishable Key) from _Settings → API Keys_

### 3. Configure environment variables

Copy the example env file and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Google OAuth (optional — see Google Auth section below)
EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME=com.googleusercontent.apps.your-ios-client-id
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-ios-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
```

> **Note:** `.env` is gitignored. Never commit real credentials.

### 4. Update app identity

Edit `app.config.ts`:

- `name` — your app's display name
- `slug` — URL-safe identifier
- `scheme` — deep link scheme (e.g., `myapp`)
- `ios.bundleIdentifier` — e.g., `com.yourcompany.myapp`
- `android.package` — e.g., `com.yourcompany.myapp`

### 5. Link to EAS (Expo Application Services)

Update the `projectId` in `app.config.ts` → `extra.eas.projectId`.

```bash
npx eas init --id <your-project-id>
```

### 6. Update types

Replace the placeholder `UserProfile` type in `types/types.ts` with your app's domain types.

### 7. Start developing

```bash
npx expo start -c
```

---

## Features Guide

### Authentication

The auth flow is handled entirely by `context/supabase-provider.tsx`:

- **Email/Password** — sign up, sign in, sign out
- **Anonymous sign-in** — disabled by default; enable in [Supabase Auth Providers](https://supabase.com/dashboard/project/_/auth/providers)
- **Password recovery** — deep link handling for reset password flow (see below)
- **Avatar upload** — uploads to Supabase Storage + updates `user_metadata`

Routes are split into public (`welcome`, `auth/*`) and protected (`(protected)/*`). The `(protected)/_layout.tsx` redirects unauthenticated users to `/welcome`.

### Toast Notifications

A queue-based toast system with priority, deduplication, and multiple variants:

```ts
import { useStyledToast } from "@/hooks/useStyledToast";

const toast = useStyledToast();

toast.showSuccess("Done!", "Your changes were saved.");
toast.showError("Error", "Something went wrong.");
toast.showWarning("Heads up", "This action is irreversible.");
toast.showDefault("Info", "Just a heads up.");
toast.showUrgent("Critical", "Immediate attention needed.");
toast.showAchievement("🎉 Achievement", "You unlocked something!");
```

The toast UI is defined in `components/reusable-ui/toasts/` and the Zustand queue in `context/toastStore.ts`.

### Global Loader

A full-screen loading overlay with an optional message:

```ts
import { useLoader } from "@/context/LoaderContext";

const { showLoader, hideLoader } = useLoader();

showLoader("Saving...");
// ... async work
hideLoader();
```

Already integrated into the auth provider for login/logout/password operations.

### Theme System

Three-way theme support: **auto** (follow system), **light**, **dark**.

- **Persistence** — theme preference is saved to `AsyncStorage` via `useThemePreference`
- **Tamagui integration** — `ManualThemeProvider` wraps the app with `TamaguiProvider` + `Theme`
- **React Navigation sync** — `useReactNavigationTheme` bridges Tamagui tokens to React Navigation colors (headers, modals, cards)
- **Custom themes** — edit `themes.ts` and use the [Tamagui theme editor](https://tamagui.dev/theme) to generate palettes

Theme toggles are in `components/pages/settings/ThemeToggle.tsx`.

### Haptics

Platform-safe haptic feedback wrappers (no-op on web):

```ts
import { triggerLightImpact, triggerSuccessNotification } from "@/services/hapticsService";

triggerLightImpact(); // Light tap
triggerSuccessNotification(); // Success vibration
```

---

## OAuth Setup

### Apple Sign-In

Requires a **paid Apple Developer account**. The plugin is already configured in `app.config.ts`. Works out of the box once you have the account and build with `npx expo run:ios`.

### Google Sign-In

Since Expo Go cannot run native code, you need a development build:

1. Create OAuth credentials at [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Fill in the `EXPO_PUBLIC_GOOGLE_*` variables in your `.env`
3. Uncomment the code in `lib/googleSignIn.ts`
4. Uncomment the Google button in `components/pages/auth/AuthButtons.tsx`
5. Build for iOS:
    ```bash
    npx expo prebuild --clean
    npx expo run:ios
    ```

> If you don't have a paid Apple Developer account, remove `"usesAppleSignIn": true` from `app.config.ts` before building.

---

## Password Recovery

Deep link handling for password reset is implemented in `supabase-provider.tsx`. It works in development via `Linking.createURL()`.

<details>
<summary>🚀 Production Deep Linking Checklist</summary>

For production, you need to configure universal/app links:

1. **Update `app.config.ts`** with your domain:

    ```ts
    ios: {
      associatedDomains: ["applinks:yourdomain.com"]
    },
    android: {
      intentFilters: [{
        action: "VIEW",
        data: { scheme: "https", host: "yourdomain.com", pathPrefix: "/" },
        category: ["BROWSABLE", "DEFAULT"]
      }]
    }
    ```

2. **Host verification files** on your domain:
    - `https://yourdomain.com/.well-known/apple-app-site-association`
    - `https://yourdomain.com/.well-known/assetlinks.json`

3. **Update Supabase redirect URL** to use your domain instead of `Linking.createURL()`

4. **Build with EAS Build** (required for iOS universal links)

</details>

---

## Updating Dependencies

### Expo SDK upgrade

Follow the [official SDK upgrade guide](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/):

```bash
npx expo install expo@latest
npx expo install --fix
```

Reference: [Latest Expo supported versions](https://docs.expo.dev/versions/latest/)

### Tamagui upgrade

```bash
npm install tamagui@latest @tamagui/config@latest @tamagui/babel-plugin@latest @tamagui/metro-plugin@latest @tamagui/portal@latest @tamagui/toast@latest @tamagui/sheet@latest @tamagui/progress@latest @tamagui/lucide-icons@latest
```

> [!CAUTION]
> **Tamagui static extraction breaks on Node ≥24.**
>
> Node 24's stricter ESM/CJS interop is incompatible with `esbuild-register`, which Tamagui's static extractor uses internally. This affects **all** Tamagui versions (including `1.138.x`), not just `≥1.139`.
>
> **Symptoms:** Long `Error in Tamagui parse, skipping Unexpected token '{'` stack traces in Metro output. The app still bundles and works, but static extraction is skipped.
>
> **Fix (already applied):** `babel.config.js` detects Node ≥24 and sets `disableExtraction: true` for the `@tamagui/babel-plugin`. Static extraction is an optional CSS optimization — the app works identically without it.
>
> **Alternative:** Downgrade Node to v22 LTS to keep static extraction enabled.

### General

```bash
npm outdated          # Check for outdated packages
npm update            # Update within semver ranges
npx expo install --fix # Fix Expo compatibility issues
```

---

## Debug Button

In development (`__DEV__`), a 🐛 bug button appears in the bottom-right corner. It triggers a test toast and haptic feedback to verify the template is wired up correctly. It is automatically hidden in production builds.

---

## Running with Mapbox

Since Mapbox (`@rnmapbox/maps`) requires native code, you cannot use the standard Expo Go app to run this project. You must build and run a custom development client.

To build and launch the app securely on the iOS Simulator, always use:
```bash
npx expo run:ios
```

*(Do not use `npm start` or just `npx expo start` to run the app for the first time, as Expo Go will crash when it encounters the Mapbox native modules).*

### Run on a Physical Device

#### Prerequisites
- **Xcode** — Ensure you have the latest version installed and are signed in with your Apple account
- **iPhone** — Developer Mode enabled, connected to the same Wi-Fi network as your Mac, and trusted/linked via Xcode

#### 1. Remove Apple Sign-In (requires a paid Apple Developer account)

Make the following changes:

- In `app.config.ts`: remove `"usesAppleSignIn": true` and `"expo-apple-authentication"` from the plugins list
- In `components/pages/auth/AuthButtons.tsx`: remove the `AppleAuthButton` component
- Add the following plugin to `app.config.ts` to strip the entitlement:
```ts
  const withRemoveAppleSignInEntitlement: ConfigPlugin = (config) => {
    return withEntitlementsPlist(config, (config) => {
      delete config.modResults["com.apple.developer.applesignin"];
      return config;
    });
  };

  // In your plugins array:
  // @ts-ignore
  withRemoveAppleSignInEntitlement,
```

#### 2. Generate the Xcode Project
```bash
npx expo prebuild --clean -p ios
```

#### 3. Configure & Run in Xcode

1. Open `belvedere.xcworkspace` in Xcode
2. Select your physical device from the device picker at the top
3. Click the project root in the left sidebar → go to **Signing & Capabilities**
   - Enable **Automatically manage signing**
   - Set **Team** to your Apple account/team
4. Press the **Run** button (▶) to build and install the app

#### 4. Trust the App on Your iPhone

Go to **Settings → General → VPN & Device Management → [Your Team] → Trust [Your App]**

> If the option doesn't appear, restart your iPhone and try again.

#### 5. Start the Dev Server

Once the app is running on your device, start the Expo development server in your IDE:
```bash
npx expo start
```

From this moment on the app is available on your device, you can make it work without XCode, just by running `npx expo start`.

