# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Belvedere** is a panoramic viewpoint discovery app — a beautifully designed mobile app dedicated to finding and sharing scenic viewpoints. It connects locations with rich social content (video, photos) to help users discover hidden gems.

**Tech Stack:**
- **Framework**: Expo SDK ~54, React Native 0.81
- **UI**: Tamagui v1.138.5 (Nunito font, custom Belvedere palette)
- **Backend**: Supabase (auth, PostgreSQL + PostGIS, storage, edge functions)
- **Map**: Mapbox via `@rnmapbox/maps`
- **State Management**: Zustand (client), TanStack Query v5 (server)
- **Navigation**: Expo Router (file-based routing)
- **TypeScript**: Strict mode enabled

## Common Commands

### Development
```bash
npm start           # Start development server
npx expo start      # Same as above
npx expo run:ios    # Run on iOS with native modules
npx expo run:android
npm run web         # Expo web
npm run lint        # ESLint
```

### Build & Deploy
```bash
npx expo prebuild --clean   # Rebuild native projects (required after config plugin changes)
npx expo run:ios            # Build and run iOS
eas init --id <project_id>  # Initialize EAS
```

## Architecture

### App Layout — Map-First, No Tabs
The app uses a **single-screen, map-first** layout (no tab bar):
- Full-screen Mapbox map as the home screen
- Floating search bar at top + profile avatar icon at top-right
- Horizontally scrollable filter pills (category chips) below the search bar
- Bottom sheet as the primary content surface (featured viewpoints, POI details)

### File-Based Routing Structure
```
app/
├── _layout.tsx                   # Root layout: providers, fonts, toasts, loaders
├── index.tsx                     # Entry redirect
├── welcome.tsx                   # Landing/onboarding
├── auth/                         # Auth flow: login, signup, password reset
│   ├── login.tsx
│   ├── signup.tsx
│   ├── forgot-password.tsx
│   ├── reset-password.tsx
│   └── signup-verification.tsx
└── (protected)/                  # Auth-guarded routes
    ├── _layout.tsx               # Auth guard, Stack navigator
    ├── index.tsx                 # Map screen (main app surface)
    └── modal.tsx                 # Modal overlay
```

### Context Providers
- `context/supabase-provider.tsx` (AuthProvider) — Auth methods, session management, deep links
- `context/ManualThemeProvider.tsx` — Theme toggling (light/dark/auto), wraps TamaguiProvider
- `context/LoaderContext.tsx` — Global loader state
- `context/toastStore.ts` — Toast notifications state

### Services Layer
- `services/hapticsService.tsx` — Haptic feedback wrappers

### Supabase Configuration
- `lib/supabase.ts` — Supabase client setup with AsyncStorage persistence
- `lib/googleSignIn.ts` — Google Sign-In config (requires native build)

### UI Components
- `components/reusable-ui/` — Shared UI (ThemedButton, ThemedCard, ThemedText, InputField, toasts, GlobalLoader)
- `components/pages/` — Page-specific components (auth buttons, profile, settings)

### Hooks
- `hooks/useStyledToast.tsx` — `toast.showDefault()`, `.showSuccess()`, `.showError()`, `.showWarning()`
- `hooks/useThemePreference.ts` — Persisted theme preference
- `hooks/useReactNavigationTheme.ts` — Theme bridge for React Navigation

## Design System

**Palette (from `.docs/design-system.md`):**
- Primary: Sunset Orange `#E07A5F`
- Accent: Forest Green `#81B29A`
- Background (light): Canvas `#F4F1DE`
- Background (dark): Twilight Blue `#2B2D42`
- Text (light): Deep Navy `#3D405B`
- Font: Nunito (Regular, Medium, SemiBold, Bold)

**Theme configuration:** `themes.ts` + `tamagui.config.ts`

## Key Implementation Patterns

### Toast Notifications
```typescript
import { useStyledToast } from "@/hooks/useStyledToast";
const toast = useStyledToast();
toast.showSuccess("Title", "Message");
toast.showError("Title", "Message");
```

### Global Loader
```typescript
import { useGlobalLoader } from "@/hooks/useGlobalLoader";
const { showLoader, hideLoader } = useGlobalLoader();
```

## Project Documentation

All project docs live in `.docs/`:
- `seed-document.md` — Vision, personas, core features
- `tech-stack.md` — Technical choices & justifications
- `design-system.md` — Visual tokens, components, patterns
- `tasks.md` — Living to-do checklist
- `conventions.md` — Project rules (folder-per-phase docs, etc.)
- `phases/` — Per-phase implementation plans, decisions, walkthroughs

## Environment Variables

Required in `.env`:
```
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=...
EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME=...
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=...
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=...
```

## Important Notes

- **Path Aliases**: `@/*` resolves to project root
- **New Architecture**: Enabled in `app.config.ts`
- **Prettier**: 4-space tabs, 100 char line width, double quotes
- **Native rebuilds required**: After changing `app.config.ts` plugins, run `npx expo prebuild --clean`
