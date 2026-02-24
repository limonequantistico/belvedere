# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **Expo React Native application** with Supabase backend integration. It's a food collection/tracking app where users can discover and track traditional foods by geographic location (country > region > province hierarchy).

**Tech Stack:**
- **Framework**: Expo SDK ~54, React Native 0.81
- **UI**: Tamagui v1.138.5 (React Native styling framework)
- **Backend**: Supabase (authentication, database, storage)
- **State Management**: Zustand
- **Navigation**: Expo Router (file-based routing)
- **TypeScript**: Strict mode enabled

## Common Commands

### Development
```bash
# Start development server
npm start
# or
npx expo start

# Run on specific platform
npx expo run:ios
npx expo run:android
npm run web

# Linting
npm run lint
```

### Build & Deploy
```bash
# Build iOS with native code (requires XCode for Google Auth)
npx expo prebuild --clean
npx expo run:ios

# Initialize EAS for deployment
eas init --id <project_id>
```

## Architecture

### File-Based Routing Structure
Uses Expo Router with group-based routes:
- `app/_layout.tsx` - Root layout with theme providers, toasts, loaders
- `app/(protected)/` - Protected routes requiring authentication
  - `app/(protected)/(tabs)/` - Tab navigation: index, collection, achievements, profile
  - `app/(protected)/food/[id].tsx` - Dynamic food detail page
  - `app/(protected)/location-selection.tsx` - Province picker
- `app/auth/` - Authentication flow: login, signup, password reset
- `app/welcome.tsx` - Initial landing page

### State Management (Zustand)
Located in `context/zustand.tsx`, contains several stores:
- **useLocation**: Selected province state
- **useUserStore**: Current authenticated user
- **useAllFoodsStore** / **useUsersFoodStore**: Food data with tried/collected tracking
- **useCollectionStore**: Lazy-loaded hierarchy tree (countries > regions > provinces > foods)
  - `fetchHierarchy()` - Loads the tree structure once
  - `fetchProvinceFoods()` - Lazy loads foods for a province on demand
  - `updateFoodCollectionStatus()` - Optimistically updates collection state

### Context Providers
- `context/supabase-provider.tsx` (AuthProvider) - Authentication methods, session management, deep link handling for password recovery
- `context/ManualThemeProvider.tsx` - Theme toggling (light/dark/auto), wraps TamaguiProvider
- `context/LoaderContext.tsx` - Global loader state
- `context/toastStore.ts` - Toast notifications state

### Services Layer
Located in `services/`:
- `foodService.tsx` - Food queries with hierarchy joins, collection management
- `achievementsService.ts` - Achievement tracking and unlocking
- `hapticsService.tsx` - Haptic feedback wrappers
- `locationService.tsx` - Geolocation helpers

### Supabase Configuration
- `lib/supabase.ts` - Supabase client setup
  - Uses AsyncStorage for session persistence
  - Custom fetch wrapper via `utils/networkLogger.ts` for debugging
  - Auto-refresh token on app foreground
  - **IMPORTANT**: Comment out AsyncStorage storage for web testing at localhost:8081

### UI Components
- `components/reusable-ui/` - Shared UI components
  - `toasts/` - Custom toast system with styled variants (success, error, warning)
  - `GlobalLoader.tsx` - App-wide loading overlay
  - `ThemeToggle.tsx` - Theme switcher component
- `components/pages/` - Page-specific components

### Hooks
- `hooks/useStyledToast.tsx` - Unified toast API: `toast.showDefault()`, `toast.showSuccess()`, `toast.showError()`, `toast.showWarning()`
- `hooks/useGlobalLoader.tsx` - `showLoader()` / `hideLoader()`
- `hooks/useThemePreference.ts` - Persisted theme preference
- `hooks/useDeviceLocation.tsx` - Geolocation access
- `hooks/useGradientColor.tsx` - Theme-aware gradient colors

### Type Definitions
See `types/types.ts` for all shared types:
- Base entities: `Food`, `Province`, `Tag`
- Hierarchy types: `CountryHierarchy`, `RegionHierarchy`, `ProvinceHierarchy`
- Extended types: `FoodWithHierarchy`, `GroupedData`
- Achievements: `Achievement`, `UserAchievement`

## Tamagui Configuration

Custom configuration in `tamagui.config.ts`:
- Custom themes defined in `themes.ts` (Mediterranean theme)
- Media queries: xs/sm/md/lg/xl/xxl, gtXs/gtSm/etc.
- Custom fonts and tokens from `@tamagui/config/v4`
- Selection styles and responsive breakpoints

## Authentication & OAuth

### Setup Requirements (from README)
- **Apple Auth**: Requires paid developer account, enabled via `usesAppleSignIn: true` in app.json
- **Google Auth**: Requires native build (not Expo Go)
  1. Set credentials in `lib/googleSignIn.ts`: `webClientId`, `iosClientId`
  2. Set `iosUrlScheme` and `iosClientId` in `app.json`
  3. Uncomment button in `components/reusable-ui/auth/AuthButtons.tsx`
  4. Run `npx expo prebuild --clean && npx expo run:ios`
- **Anonymous Sign-in**: Currently disabled in Supabase settings

### Deep Linking for Password Recovery
- Handled in `context/supabase-provider.tsx` via `Linking.addEventListener`
- Custom scheme: `exposupabase://` (see `app.json` scheme field)
- Development URL: `http://localhost:8081`
- Production requires associated domains setup (see README section)

## Project Setup for New Instances

Follow these steps when creating a new project from this template:
1. Get `project_id`, `name`, `slug` from Expo dashboard
2. Run `eas init --id <project_id>`
3. Update `name` and `slug` in `app.json`
4. Update `projectId` in `lib/supabase.ts` from Supabase project settings
5. Update `publishableKey` in `lib/supabase.ts` from Supabase API keys

## Theme System

The app supports manual theme toggling via:
- `hooks/useThemePreference.ts` - Retrieves and sets theme from AsyncStorage
- `context/ManualThemeProvider.tsx` - Provides `useAppTheme()` hook
- `components/reusable-ui/ThemeToggle.tsx` - UI controls

To create new themes, use the official Tamagui theme editor at tamagui.dev/theme and update `themes.ts`.

## Key Implementation Patterns

### Toast Notifications
```typescript
import { useStyledToast } from "@/hooks/useStyledToast";

const toast = useStyledToast();
toast.showSuccess("Title", "Message");
toast.showError("Title", "Message");
toast.showWarning("Title", "Message");
toast.showDefault("Title", "Message");
```

### Global Loader
```typescript
import { useGlobalLoader } from "@/hooks/useGlobalLoader";

const { showLoader, hideLoader } = useGlobalLoader();
showLoader("Loading...");
// ... async operation
hideLoader();
```

### Collection Hierarchy (Lazy Loading)
```typescript
import { useCollectionStore } from "@/context/zustand";

const { hierarchy, loadedProvinces, fetchHierarchy, fetchProvinceFoods } = useCollectionStore();

// Load tree once
await fetchHierarchy(userId);

// Lazy load province foods on demand
await fetchProvinceFoods(userId, provinceId);
```

## Important Notes

- **Path Aliases**: `@/*` resolves to project root (see `tsconfig.json`)
- **New Architecture**: Enabled in `app.json` for improved performance
- **ESLint**: `react-hooks/exhaustive-deps` is disabled (marked TODO for review)
- **Prettier**: 4-space tabs, 100 char line width, double quotes
- **Network Logging**: Custom fetch wrapper in `utils/networkLogger.ts` logs all Supabase requests
- **Storage Policies**: Avatar upload policies are noted as "ultra permissive" (TODO in code)
- **Progress Bar**: Recent fix to remove animation (see commit d6732d3)

## Dependencies to Note

- `@tamagui/babel-plugin` and `@tamagui/metro-plugin` for Tamagui optimization
- `react-native-reanimated` for animations
- `expo-router` for file-based navigation
- `zustand` for state management
- `zod` for schema validation
- `burnt` for native toast notifications
- `expo-haptics` for tactile feedback

## Version Updates

To update Tamagui:
```bash
npm install tamagui@latest
# Update all other @tamagui/* packages to matching version
npm install
```

To upgrade Expo SDK, follow the official guide at: https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/
