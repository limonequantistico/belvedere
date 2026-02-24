# Phase 0 — Walkthrough

## What Changed

### Navigation Restructured
- **Deleted** `app/(protected)/(tabs)/` — the entire tab bar system (Home + Profile tabs)
- **Created** `app/(protected)/index.tsx` — map screen placeholder (will become full-screen Mapbox in Phase 2)
- **Updated** `app/(protected)/_layout.tsx` — removed tabs reference, now routes directly to `index.tsx`
- **Fixed** `app/index.tsx` — redirect changed from `/(protected)/(tabs)` → `/(protected)`

### Dependencies Installed
`@rnmapbox/maps`, `expo-location`, `expo-video`, `@tanstack/react-query`, `@expo-google-fonts/nunito`

### Plugins Added (`app.config.ts`)
- `@rnmapbox/maps` with `RNMapboxMapsImpl: "mapbox"`
- `expo-video`
- `expo-location` with foreground permission string

### Theming (`themes.ts`)
Full palette rewrite to match `design-system.md`:
| Token | Before | After |
|-------|--------|-------|
| Primary | `#C97A5A` | `#E07A5F` (Sunset Orange) |
| Accent | `#5A9FA8` | `#81B29A` (Forest Green) |
| Light bg | `#FAF9F7` | `#F4F1DE` (Canvas) |
| Light card | `#E8E5E0` | `#FDFBF7` (Parchment) |
| Text | `#38342F` | `#3D405B` (Deep Navy) |
| Dark bg | `#252525` | `#2B2D42` (Twilight Blue) |

### Font (`tamagui.config.ts` + `app/_layout.tsx`)
- Nunito loaded via `@expo-google-fonts/nunito` (Regular, Medium, SemiBold, Bold)
- Splash screen held until fonts are ready
- Registered as `body` and `heading` font in Tamagui config

### CLAUDE.md
Full rewrite — now documents Belvedere's map-first architecture, file structure, design system, and env vars.

### .env.example
Added `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN` placeholder.

## Verification
- ✅ Dev server starts successfully (`npx expo start -c`)
- ✅ TypeScript check: 9 errors, all pre-existing from template (InputField, ThemedText, AuthButtons, SlideshowDots) — none from Phase 0 changes
