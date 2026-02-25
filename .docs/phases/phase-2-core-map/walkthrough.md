# Phase 2: Core Map Experience Walkthrough

I've completed the foundational core map layout and data fetching for Belvedere. The placeholder map screen has been successfully replaced with the immersive Mapbox integration!

## Accomplishments

1. **State Management Layers**
   - **`useLocationStore`**: Zustand store that requests foreground location permissions and fetches the user's coordinates.
   - **`useMapStore`**: Zustand store handling the map camera's `flyTo` position, current zoom/pitch, distance radiuses, and the active filtering states.
   - **`useNearbyViewpoints`**: Removed and replaced entirely by the local-first sync architecture.

### Database Migrations
```sql
CREATE OR REPLACE FUNCTION sync_viewpoints(last_sync TIMESTAMPTZ DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  name TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  category_name TEXT,
  verified BOOLEAN
) AS $$ ... $$
```

### Local-First Data Caching (react-native-mmkv)
Replaced the `useNearbyViewpoints` hook with a global `useViewpointsSync` hook. The new hook performs differential synchronizations using `react-native-mmkv` to persist the TanStack Query cache. 

**Native Compilation Fix**
To allow the local-first architecture to function correctly on iOS, `react-native-mmkv` was downgraded from `v4.x` (which requires experimental Nitro Modules) to the stable JSI-bridge `v3.3.3`. The iOS deployment target was also explicitly bumped to `15.1` via `expo-build-properties` to satisfy underlying Native C++ compilation requirements.

   - **`QueryClientProvider`**: Injected at the root (`app/_layout.tsx`) so the entire app can leverage advanced caching.
- Added custom styled markers (`CustomMapMarker` and `ClusterMarker`) with dynamic sizes and verified-status indicators.

2. **Map Integration & Geocoding Search**
   - **`FloatingSearch` component**: A sleek, capsule-shaped search bar overlaid on the top left. Hooked up to perform unified searches targeting **both** Mapbox Geocoding places and Supabase Viewpoints via a custom `useGlobalSearch` hook!

3. **Markers, Filtering, & Clustering**
   - **CustomMapMarker**: Maps Supabase category strings ("Nature", "Urban", etc.) to illustrated emojis. Features an active/selected styling state with strong shadows and white borders for visibility.
   - **JS Clustering (`use-supercluster`)**: Introduced native Mapbox bounds detection to compute zoom-based clusters of viewpoint markers in real-time. Created a bolder Tamagui `<ClusterMarker>` component to visually display dense groups.
   - **Extended `FilterPills`**: Tapping categories or the "Verified Only" button instantly filters the visible map markers using `useMapStore`.
   - **Performance Enhancements**: Coordinates passed to the database from the `MapCenter` state are automatically rounded to ~1.1km resolution. This ensures that camera micro-movements (like expanding a cluster) leverage React Query's `staleTime` cache instantly instead of needlessly re-fetching from Supabase.

## Next Steps

Phase 2 is now officially fully complete! You can tap around on the map to see search integration, filtering, and clustering in action. 

To make the map fully immersive, we need to move onto **Phase 3: Rich Content Sheets**, which will include:
- A draggable bottom Tamagui `Sheet` component.
- Interactive Map Markers that trigger camera flights and open the associated viewpoint details directly in the sheet.
- Presenting rich media, distance calculations, and navigation intents on the sheet overlays.
