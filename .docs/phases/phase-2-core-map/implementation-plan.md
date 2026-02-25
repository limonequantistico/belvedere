# Phase 2: Core Map Experience

This phase replaces the placeholder Map Screen with a fully functional, stylized Mapbox interface, complete with geolocation, markers, and floating UI elements.

## User Review Required

> [!IMPORTANT]
> **Mapbox Setup**: You will need a Mapbox Access Token. 
> 1. Go to your Mapbox account and retrieve your public and secret access tokens.
> 2. Add them to your `.env` and `.env.local` files:
>    ```env
>    EXPO_PUBLIC_MAPBOX_KEY=pk.your_public_token
>    # If required for builds:
>    MAPBOX_DOWNLOAD_TOKEN=sk.your_secret_token
>    ```

## Proposed Changes

### Configuration
#### [MODIFY] [app.json](file:///Users/luigipiferi/CodingProjects/belvedere/app.json) / [app.config.ts](file:///Users/luigipiferi/CodingProjects/belvedere/app.config.ts)
- Verify that `@rnmapbox/maps` is configured correctly in the Expo plugins section.

---

### Core Map Layout & Integration
#### [MODIFY] [app/(protected)/index.tsx](file:///Users/luigipiferi/CodingProjects/belvedere/app/(protected)/index.tsx)
- Replace static placeholder with a full-screen `@rnmapbox/maps` `MapView`.
- Implement `Camera` component for viewing the map.
- Integrate the UI overlay layers (floating search bar, filter pills, FABs).

#### [NEW] [components/map/CustomMapMarker.tsx](file:///Users/luigipiferi/CodingProjects/belvedere/components/map/CustomMapMarker.tsx)
- Create a Tamagui-styled custom marker for viewpoints.
- Implement variations (active/inactive).

---

### Geolocation & Map Logic
#### [NEW] [store/useLocationStore.ts](file:///Users/luigipiferi/CodingProjects/belvedere/store/useLocationStore.ts)
- Create a Zustand store to hold the user's current coordinates and permission status.
- Add utility functions to request location via `expo-location`.

#### [NEW] [store/useMapStore.ts](file:///Users/luigipiferi/CodingProjects/belvedere/store/useMapStore.ts)
- Create a Zustand store to hold camera position, selected viewpoint, active filters, and zoom level.

#### [NEW] [hooks/useNearbyViewpoints.ts](file:///Users/luigipiferi/CodingProjects/belvedere/hooks/useNearbyViewpoints.ts)
- Create a TanStack Query hook that calls the `nearby_viewpoints()` Supabase RPC.
- Connect this hook to the user's location coordinates array.

---

### UI Components (Overlays)
#### [NEW] [components/ui/FloatingSearch.tsx](file:///Users/luigipiferi/CodingProjects/belvedere/components/ui/FloatingSearch.tsx)
- Capsule-shaped search bar with cream background and a search icon.
- Taps into a dedicated search screen/overlay. Includes profile avatar at the right.
- Integrates with the **Mapbox Geocoding API** for global place/city search (to jump map to location).
- Integrates with the **Supabase `search_viewpoints` RPC** to find specific POIs.
- Selecting a global place moves the map camera; selecting a viewpoint opens its details.

#### [NEW] [components/ui/FilterPills.tsx](file:///Users/luigipiferi/CodingProjects/belvedere/components/ui/FilterPills.tsx)
- Horizontally scrollable row of category chips.
- Toggles category filters in `useMapStore`.

#### [NEW] [components/ui/MapFABs.tsx](file:///Users/luigipiferi/CodingProjects/belvedere/components/ui/MapFABs.tsx)
- Floating action buttons on the right side for "Locate Me" and layer toggling (if required).

---

## Phase 2.5: Local-First Map Data Architecture

> [!TIP]
> **Performance Shift**: To eliminate map panning lag, we are moving away from restrictive bounding-box/radius database queries (`useNearbyViewpoints`) and adopting a **Local-First Sync** architecture.

### Database Updates
1. **[NEW] Supabase RPC**: `sync_viewpoints(last_sync_timestamp)`
   - Returns a "lite" payload of all viewpoints (id, lat, lng, category_name) updated *after* the provided timestamp.
   - If timestamp is null, it returns the entire dataset.

### Client-Side Updates
1. **TanStack Query Configuration**: 
   - We will replace `useNearbyViewpoints` with a `useViewpointsSync` hook.
   - This hook will fetch the entire lite dataset on launch and store it in the TanStack cache with an infinite `staleTime`.
   - The hook will automatically check `sync_viewpoints` taking the last fetch timestamp.
2. **React Native MMKV Integration**:
   - We will configure TanStack Query's `persister` to use `react-native-mmkv`. 
   - This permanently writes the fetched viewpoints to the phone's disk. Next time the app opens, 100k points load from local disk in milliseconds before the network even wakes up.
3. **Map Store Simplification**: 
   - Remove `maxDistanceKm` from `useMapStore`. The map will always display all points via `useSupercluster`'s highly optimized local JS clustering.

## Verification Plan

### Manual Verification
1. Run `npx expo prebuild -p ios` to verify the Mapbox plugin generates the native code correctly.
2. Launch the app in a simulator or device.
3. Grant location permissions and verify the map centers on the current location.
4. Verify that data markers are fetched from Supabase and displayed on the map.
5. Tap on the search bar and filter pills to ensure UI responsiveness.
