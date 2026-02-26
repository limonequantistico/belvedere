# Belvedere — Project Tasks

> Living checklist for the Belvedere app development.
> Reference docs: [`seed-document.md`](.docs/seed-document.md) · [`tech-stack.md`](.docs/tech-stack.md) · [`design-system.md`](.docs/design-system.md)

---

## Legend

- `[ ]` — To do
- `[/]` — In progress
- `[x]` — Done

---

## Phase 0 · Project Foundation & Cleanup

The template is already in place (Expo + Supabase + Tamagui). This phase aligns it with Belvedere's identity and prepares the ground for feature work.

- [x] **Update CLAUDE.md** — Rewrite to reflect Belvedere (remove old food-app references, document new architecture)
- [x] **Install core dependencies** — Add missing packages from the tech stack:
  - [x] `@rnmapbox/maps` (Mapbox for React Native)
  - [x] `expo-location`
  - [x] `expo-video`
  - [x] `expo-image` *(was already installed)*
  - [x] `@tanstack/react-query` (TanStack Query v5)
  - [x] `zustand` *(was already installed)*
- [x] **Tamagui theming** — Apply Belvedere design system tokens to `tamagui.config.ts` and `themes.ts`:
  - [x] Implement color palette (Sunset Orange, Forest Green, Canvas, Parchment, text colors)
  - [x] Configure typography (Nunito font family)
  - [x] Set spacing, border radius, and shadow tokens per design system
- [x] **Setup custom fonts** — Load and register Nunito via `@expo-google-fonts/nunito`
- [x] **Remove tab navigation** — Replace current tab structure with a single-screen map-first layout:
  - [x] Full-screen map placeholder as the root protected screen
  - [x] *(Floating search bar, filter pills, bottom sheet → Phase 2)*
- [x] **Update app metadata** — Added Mapbox, expo-video, expo-location plugins to `app.config.ts`

---

## Phase 1 · Backend & Database (Supabase)

- [x] **Enable PostGIS extension** on Supabase project
- [x] **Design and create database schema:**
  - [x] `viewpoints` table — id, name, description, coordinates (PostGIS `geography`), altitude, category, cover_image_url, video_url, verified (bool), created_by, created_at, updated_at
  - [x] `viewpoint_media` table — id, viewpoint_id (FK), media_url, media_type (image/video), sort_order, created_at
  - [x] `viewpoint_categories` table — id, name, icon, color
  - [x] `user_favorites` table — id, user_id, viewpoint_id, created_at
  - [x] `profiles` table — extend existing with display_name, avatar_url, bio
- [x] **Row Level Security (RLS)** — Define policies for all tables
- [x] **Database functions:**
  - [x] `nearby_viewpoints(lat, lng, radius_km)` — PostGIS proximity query
  - [x] `search_viewpoints(query_text)` — Full-text search
- [x] **Storage buckets:**
  - [x] `viewpoint-media` bucket for POI images/videos
  - [x] `avatars` bucket for user profile pictures
- [x] **Seed data** — Populate initial viewpoints for development/testing

---

## Phase 2 · Core Map Experience

This is the heart of the app — a single-screen, map-first layout inspired by the prototype in `@docs/imgs/image 1.png`.

### 2A · Map Integration

- [x] **Mapbox setup** — Configure `@rnmapbox/maps` with API token
- [ ] **Custom map style** *(deferred — nice to have)* — Create/apply a stylized Mapbox Studio style (warm, cartographic, RPG-inspired as per design system)
- [x] **Single-screen map layout:**
  - [x] Full-screen map (Z-Index 0)
  - [x] Floating search bar at top-left + profile avatar icon at top-right (Z-Index 10)
  - [x] Right-side FABs: locate me, map layers (Z-Index 10)
  - [x] Persistent bottom sheet with curated content (Z-Index 20) *(→ Phase 3)*

### 2B · Geolocation & POI Discovery

- [x] **User location** — Request permissions and track user position with `expo-location`
- [x] **Local-First Data Sync** — Synchronize viewpoints directly to device disk instead of GPS-based radius queries
  - [x] Configure `@tanstack/react-query` global client with infinite cache time
  - [x] Wire `react-native-mmkv` to the TanStack Persister
  - [x] Pull data from Supabase `sync_viewpoints` differential RPC
- [x] **Custom map markers** — Render stylized map points with dynamic sizes based on verified status
- [x] **Marker Clustering** — Group map points seamlessly on the JS thread to maintain extreme visual performance
- [x] **Marker interaction** — Tapping a marker:
  - [x] Smooth camera flight to center on POI
  - [x] 3D pitch tilt for terrain preview
  - [x] Open bottom content sheet with POI details *(→ Phase 3)*

### 2C · Search & Filters

- [x] **FloatingSearch component** — Capsule-shaped search bar, cream background, search icon
- [x] **Profile icon** — User avatar button at the top-right of the search bar row, tapping opens profile sheet/overlay
- [x] **Filter pills row** — Horizontally scrollable row of category chips directly below the search bar (as in `.docs/imgs/prototypes/image 2.png`):
  - [x] Categories like Natural, Urban, Historic, etc.
  - [x] Each pill shows an icon + label
  - [x] Active state: solid primary accent background; inactive: muted/outlined
- [x] **Search functionality** — Full-text search against viewpoint names/descriptions (via `search_viewpoints` RPC + Mapbox geocoding)
- [x] **Filter logic** — Filter map markers by category, distance, verified status

---

## Phase 3 · Rich Content Sheets (POI Details)

- [x] **RichContentSheet component** — Draggable Gorhom `BottomSheet` with rounded top corners, snap points at 20% / 50% / 85%
- [x] **"Featured Near You" list** — Default sheet content showing a scrollable list of `ViewpointCard` components
- [x] **ViewpointCard component** — Rounded rectangle with image thumbnail, title, distance, category badge, "View" button
- [x] **POI Detail view** (expanded sheet or dedicated screen):
  - [x] **Graceful media hero area** — Handles three cases:
    - [x] Video available → auto-playing, looping, muted-by-default video (`expo-video`)
    - [x] Photo available → static cover image (`expo-image`)
    - [x] No media → elegant placeholder (gradient, illustration, or category-themed fallback)
  - [x] Viewpoint name, location, category
  - [x] Description / travel-journal-style text
  - [x] Photo gallery (swipeable `expo-image` carousel) — only shown if images exist
  - [x] "Navigate" button → deep-link to Google Maps / Apple Maps
  - [x] Favorite / save button
  - [x] Share button

---

## Phase 4 · Media & Content (everything was done in previous phases)

- [x] **Video playback** — Integrate `expo-video` for viewpoint previews
  - [x] Autoplay on visibility
  - [x] Muted by default, tap to unmute
  - [x] Looping playback
- [x] **Image handling** — Use `expo-image` with caching for all viewpoint imagery
- [x] **Media fallback system** — Consistent placeholder/fallback for viewpoints without media
- [x] **AI-generated POI markers** — Design and integrate custom marker assets (illustrated eye, mountain, compass icons)

---

## Phase 5 · User Profile & Favorites

- [x] **Profile page** — Accessible from the top-right avatar icon on the map:
  - [x] Avatar upload (with existing `ProfileAvatar` component)
  - [x] List of favorite viewpoints
  - [x] Settings (theme toggle, logout)
- [x] **Favorites system:**
  - [x] Heart/bookmark toggle on viewpoint cards and detail views
  - [x] Favorites list on profile
  - [x] Optimistic UI updates
- [x] FAB Map Style change button and popup

---

## Phase 6 · State Management & Data Layer

- [x] **TanStack Query setup** — Configure `QueryClient`, wrap app in `QueryClientProvider`
- [ ] **Query hooks:**
  - [x] `useNearbyViewpoints(lat, lng, radius)`
  - [x] `useViewpointDetails(id)`
  - [ ] `useSearchViewpoints(query)`
  - [x] `useFavorites(userId)`
- [x] **Zustand stores:**
  - [x] `useMapStore` — Camera position, selected viewpoint, active filters, zoom level
  - [x] `useLocationStore` — User's current coordinates, location permission status
- [x] **Offline tolerance & Syncing** — Configured TanStack Query caching for low-connectivity outdoor use
  - [x] Added `useForceSyncViewpoints` to manually invalidate MMKV cache and pull fresh data
  - [x] Added "Force Sync" FAB in MapFABs component strictly for DEV mode testing

---

## Phase 7 · Polish & Animations

- [x] **Spring animations** — Refined to removed bounciness while maintaining tactile haptics
- [x] **Sheet drag physics** — Smooth, snappy sheet dragging with comfortable stop points
- [x] **Soft transitions** — Crossfade page transitions, progressive video fade-ins (300ms)
- [x] **Marker focus animation** — Sweeping camera flight with 3D pitch on marker tap
- [x] **Reduce Motion support** — Honor system accessibility setting for motion-sensitive users
- [x] **Haptic feedback** — Tactile response on key interactions (using existing `hapticsService`)

---

## Phase 8 · Accessibility & QA

- [ ] **Contrast ratios** — Verify WCAG compliance for text/background combinations
- [ ] **Touch targets** — Ensure all interactive elements meet 44×44pt minimum
- [ ] **Screen reader labels** — Descriptive accessibility labels on map markers, videos, interactive elements
- [ ] **Error handling** — Graceful fallbacks for denied location permissions, network failures, empty states
- [ ] **Loading states** — Skeleton screens and shimmer effects for content loading
- [ ] **Empty states** — Friendly illustrations/messages when no viewpoints found, no favorites, etc.
- [x] **Design Consistency** — Make sure the design is consistent with the brand guidelines, and that there are no elements that look out of place.
- [ ] Show small heart icon on the top right of POIs that are favorited

---

## Phase 9 · DevOps & Launch Prep

- [ ] **EAS Build setup** — Configure `eas.json` for iOS and Android builds
- [ ] **EAS Submit** — Automate App Store / Play Store submissions
- [ ] **EAS Update** — Configure OTA updates for fast bug fixes
- [ ] **Deep link configuration** — Associated domains for iOS, intent filters for Android
- [ ] **App Store assets** — Screenshots, descriptions, metadata
- [ ] **Analytics integration** — Basic usage tracking (optional, privacy-first)

---

---

## Nice to Have (Future Phases)

Features to revisit once the core experience is solid.

### Community Submissions
- [ ] **Database Schema:**
  - [ ] `community_submissions` table — id, submitted_by, name, description, coordinates, media_urls[], status (pending/approved/rejected), reviewed_by, created_at
  - [ ] `submissions` bucket for community submission media
- [ ] **Submission flow:**
  - [ ] "Suggest a viewpoint" button
  - [ ] Form: name, description, location (pick on map or auto-detect), upload photos/video
  - [ ] Preview before submitting
  - [ ] Confirmation screen with tracking status
- [ ] **Submission status tracking** — Users can see their pending/approved/rejected submissions
- [ ] **Moderation pipeline:**
  - [ ] Supabase Edge Function for processing submissions
  - [ ] Admin review interface (or basic approval flow)
  - [ ] Status notification to submitter

### POI Details (Expanded)
- [ ] Practical info: how to get there, what you'll see, accessibility notes

### Discover / Feed
- [ ] **Curated feed of viewpoints:**
  - [ ] "Trending" / "Popular nearby" sections
  - [ ] Category-based collections (e.g., "Best sunset spots", "Hidden rooftops")
  - [ ] Vertical scrollable feed with video previews
- [ ] **Deep linking** — Support opening specific viewpoints from external links (TikTok, social shares)

### Profile Stats & Gamification
- [ ] Stats: viewpoints visited, favorites count, submissions count
- [ ] Achievement / badge system
- [ ] Display name, bio editing


- [ ] Add other info about the place, like how to get there, what you'll see, accessibility difficulty and notes, best time to visit, etc.
- [ ] Add visible and copiable coordinates, more of a style choice than a feature. 