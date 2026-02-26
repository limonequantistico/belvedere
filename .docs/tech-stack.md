# Belvedere - Technical Stack

This document outlines the technical stack chosen for Belvedere. The architecture is designed to support a visually rich, map-heavy mobile application while optimizing for developer productivity and scalable backend infrastructure.

## Core Architecture
- **Frontend Framework:** Expo (Universal React Native + Web)
- **Backend / Database:** Supabase

---

## Frontend Stack (Universal App)

**Framework:** **Expo SDK 51+** (React Native & React Native Web)
- **Justification:** Provides the best developer experience for building iOS, Android, and Web apps from a single codebase. Given the project's requirement for a highly polished, aesthetic application that works across mobile and web, Expo's modern ecosystem (especially with Expo Router) is the perfect fit.
- **Docs:** [https://docs.expo.dev/](https://docs.expo.dev/)

**Language:** **TypeScript**
- **Justification:** Ensures type safety, reduces runtime errors, and provides excellent autocomplete. Essential for managing complex data structures from the map and Supabase.

**Routing:** **Expo Router**
- **Justification:** File-based routing for React Native. Essential for handling deep links natively, which is crucial for Belvedere's "Social Media Ecosystem" (e.g., users clicking a link on TikTok and directly opening the specific viewpoint in the app).
- **Docs:** [https://docs.expo.dev/router/introduction/](https://docs.expo.dev/router/introduction/)

**State Management:**
- **Server State:** **TanStack Query v5 (React Query)**
  - **Justification:** Handles caching, background fetching, and loading states for Supabase data (POIs, community submissions). It makes building offline-tolerant experiences much easier, which is critical for an app used outdoors in potentially low-connectivity nature spots.
  - **Docs:** [https://tanstack.com/query/latest/docs/react/overview](https://tanstack.com/query/latest/docs/react/overview)
- **Client State:** **Zustand**
  - **Justification:** A perfectly lightweight, boilerplate-free state manager for UI state (e.g., currently selected viewpoint, active map filters, user's current coordinates).
  - **Docs:** [https://zustand-demo.pmnd.rs/](https://zustand-demo.pmnd.rs/)

**Styling & UI Components:**
- **UI Framework & Styling:** **Tamagui**
  - **Justification:** A universal UI kit and styling engine for React Native and Web. Since the app targets both mobile and web, Tamagui's optimizing compiler ensures high performance across all platforms. It forces a strict design system (tokens, themes) which is ideal for maintaining the polished, unique "exploration video game" aesthetic consistently. It also includes highly customizable, accessible components out of the box.
  - **Docs:** [https://tamagui.dev/](https://tamagui.dev/)
- **Bottom Sheet Interaction:** **`@gorhom/bottom-sheet`**
  - **Justification:** The industry standard for bottom sheets in React Native. It uses `react-native-reanimated` and `react-native-gesture-handler` for buttery smooth 60fps animations. Replaces Tamagui Sheet to provide superior gesture handling, multi-snap points, and scrollable content nesting.
  - **Docs:** [https://ui.gorhom.dev/components/bottom-sheet/](https://ui.gorhom.dev/components/bottom-sheet/)

---

## Maps & Geolocation (The Core Experience)

**Map Engine:** **`@rnmapbox/maps` (Mapbox for React Native) / Mapbox GL JS (Web)**
- **Justification:** The seed document requires a *"custom, open-source map with a unique, relaxing aesthetic (e.g., stylized, cartoonish, or RPG-like elements)"*. Standard Google Maps or Apple Maps do not allow this level of styling. Mapbox Studio allows designers to completely overhaul the map's aesthetic. `@rnmapbox` handles the native side flawlessly, while Expo Web wrappers allow dropping in Mapbox GL JS for seamless web parity.
- **Docs:** [https://rnmapbox.github.io/](https://rnmapbox.github.io/) | [https://docs.mapbox.com/mapbox-gl-js/](https://docs.mapbox.com/mapbox-gl-js/)

**Location Services:** **`expo-location`**
- **Justification:** The easiest and most reliable way to get user permissions and track device coordinates to find nearby panoramic spots.
- **Docs:** [https://docs.expo.dev/versions/latest/sdk/location/](https://docs.expo.dev/versions/latest/sdk/location/)

---

## Media & Content

**Video Playback:** **`expo-video`**
- **Justification:** The newly released, highly optimized native video player for Expo, which also fully supports web rendering. Crucial for the "Rich Content Sheets" that rely on integrated TikTok/Reel-style video previews of the viewpoints.
- **Docs:** [https://docs.expo.dev/versions/latest/sdk/video/](https://docs.expo.dev/versions/latest/sdk/video/)

**Image Handling:** **`expo-image`**
- **Justification:** Fast, heavily cached image rendering that also handles web efficiently. Necessary for loading custom map markers and viewpoint thumbnail galleries seamlessly across devices.
- **Docs:** [https://docs.expo.dev/versions/latest/sdk/image/](https://docs.expo.dev/versions/latest/sdk/image/)

---

## Backend Stack

**Database & Spatial Queries:** **Supabase PostgreSQL + PostGIS**
- **Justification:** This is the most critical backend choice. PostGIS is an extension for PostgreSQL that allows for lightning-fast geographic queries. We can easily query *"Find all verified POIs within 50km of the user's lat/long, ordered by distance"*. Standard NoSQL setups struggle with complex geospatial queries at scale.
- **Docs:** [https://supabase.com/docs/guides/database/extensions/postgis](https://supabase.com/docs/guides/database/extensions/postgis)

**Authentication:** **Supabase Auth**
- **Justification:** Natively integrates with Postgres Row Level Security (RLS). Supports social logins (Apple/Google), which is the frictionless onboarding standard expected by consumer mobile apps today.
- **Docs:** [https://supabase.com/docs/guides/auth](https://supabase.com/docs/guides/auth)

**Asset Storage:** **Supabase Storage**
- **Justification:** For hosting user-submitted viewpoint photos/videos and custom map marker assets. Integrates seamlessly with Supabase Auth so only authenticated users can upload media.
- **Docs:** [https://supabase.com/docs/guides/storage](https://supabase.com/docs/guides/storage)

**Serverless Functions:** **Supabase Edge Functions**
- **Justification:** Useful for processing community submissions (e.g., calling an AI API or moderation tool before approving a user's submitted viewpoint to be added to the official map).
- **Docs:** [https://supabase.com/docs/guides/functions](https://supabase.com/docs/guides/functions)

---

## DevOps & Workflow

**CI/CD & App Distribution:** **Expo Application Services (EAS)**
- **EAS Build:** Compiles the app in the cloud (no need to maintain complex local Xcode/Android Studio setups).
- **EAS Submit:** Automates pushing the built app to the App Store and Google Play.
- **EAS Update:** Allows pushing over-the-air (OTA) updates to fix bugs instantly without waiting for App Store review.
- **Docs:** [https://docs.expo.dev/eas/](https://docs.expo.dev/eas/)
