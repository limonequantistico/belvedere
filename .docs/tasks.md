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

- [ ] **Update CLAUDE.md** — Rewrite to reflect Belvedere (remove old food-app references, document new architecture)
- [ ] **Install core dependencies** — Add missing packages from the tech stack:
  - [ ] `@rnmapbox/maps` (Mapbox for React Native)
  - [ ] `expo-location`
  - [ ] `expo-video`
  - [ ] `expo-image`
  - [ ] `@tanstack/react-query` (TanStack Query v5)
  - [ ] `zustand` (client state manager)
- [ ] **Tamagui theming** — Apply Belvedere design system tokens to `tamagui.config.ts` and `themes.ts`:
  - [ ] Implement color palette (Sunset Orange, Forest Green, Canvas, Parchment, text colors)
  - [ ] Configure typography (Nunito / Quicksand font family)
  - [ ] Set spacing, border radius, and shadow tokens per design system
- [ ] **Setup custom fonts** — Load and register chosen font family via `expo-font`
- [ ] **Remove tab navigation** — Replace current tab structure with a single-screen map-first layout:
  - [ ] Full-screen map as the root protected screen
  - [ ] Floating search bar at top-left with profile icon at top-right
  - [ ] Bottom sheet as the primary navigation/content surface
  - [ ] Profile accessible via the top-right avatar icon (opens as a sheet or overlay)
- [ ] **Update app metadata** — Name, slug, scheme, splash screen, icon in `app.config.ts`

---

## Phase 1 · Backend & Database (Supabase)

- [ ] **Enable PostGIS extension** on Supabase project
- [ ] **Design and create database schema:**
  - [ ] `viewpoints` table — id, name, description, coordinates (PostGIS `geography`), altitude, category, cover_image_url, video_url, verified (bool), created_by, created_at, updated_at
  - [ ] `viewpoint_media` table — id, viewpoint_id (FK), media_url, media_type (image/video), sort_order, created_at
  - [ ] `viewpoint_categories` table — id, name, icon, color
  - [ ] `community_submissions` table — id, submitted_by, name, description, coordinates, media_urls[], status (pending/approved/rejected), reviewed_by, created_at
  - [ ] `user_favorites` table — id, user_id, viewpoint_id, created_at
  - [ ] `profiles` table — extend existing with display_name, avatar_url, bio
- [ ] **Row Level Security (RLS)** — Define policies for all tables
- [ ] **Database functions:**
  - [ ] `nearby_viewpoints(lat, lng, radius_km)` — PostGIS proximity query
  - [ ] `search_viewpoints(query_text)` — Full-text search
- [ ] **Storage buckets:**
  - [ ] `viewpoint-media` bucket for POI images/videos
  - [ ] `avatars` bucket for user profile pictures
  - [ ] `submissions` bucket for community submission media
- [ ] **Seed data** — Populate initial viewpoints for development/testing

---

## Phase 2 · Core Map Experience

This is the heart of the app — a single-screen, map-first layout inspired by the prototype in `@docs/imgs/image 1.png`.

### 2A · Map Integration

- [ ] **Mapbox setup** — Configure `@rnmapbox/maps` with API token
- [ ] **Custom map style** — Create/apply a stylized Mapbox Studio style (warm, cartographic, RPG-inspired as per design system)
- [ ] **Single-screen map layout:**
  - [ ] Full-screen map (Z-Index 0)
  - [ ] Floating search bar at top-left + profile avatar icon at top-right (Z-Index 10)
  - [ ] Right-side FABs: locate me, map layers (Z-Index 10)
  - [ ] Persistent bottom sheet with curated content (Z-Index 20)

### 2B · Geolocation & POI Discovery

- [ ] **User location** — Request permissions and track user position with `expo-location`
- [ ] **Fetch nearby viewpoints** — Call `nearby_viewpoints()` Supabase function based on user coordinates
- [ ] **Custom map markers** — Render stylized `MapMarker` components on the map (illustrated icons, not standard pins)
  - [ ] Active / inactive / unverified variants
- [ ] **Marker interaction** — Tapping a marker:
  - [ ] Smooth camera flight to center on POI
  - [ ] 3D pitch tilt for terrain preview
  - [ ] Open bottom content sheet with POI details
- [ ] **Clustering** — Group nearby markers at lower zoom levels

### 2C · Search & Filters

- [ ] **FloatingSearch component** — Capsule-shaped search bar, cream background, search icon
- [ ] **Profile icon** — User avatar button at the top-right of the search bar row, tapping opens profile sheet/overlay
- [ ] **Filter pills row** — Horizontally scrollable row of category chips directly below the search bar (as in `.docs/imgs/prototypes/image 2.png`):
  - [ ] Categories like Natural, Urban, Historic, etc.
  - [ ] Each pill shows an icon + label
  - [ ] Active state: solid primary accent background; inactive: muted/outlined
- [ ] **Search functionality** — Full-text search against viewpoint names/descriptions
- [ ] **Filter logic** — Filter map markers by category, distance, verified status

---

## Phase 3 · Rich Content Sheets (POI Details)

- [ ] **RichContentSheet component** — Draggable Tamagui `Sheet` with rounded top corners, snap points at 20% / 50% / 90%
- [ ] **"Featured Near You" list** — Default sheet content showing a scrollable list of `ViewpointCard` components
- [ ] **ViewpointCard component** — Rounded rectangle with image thumbnail, title, distance, category badge, "View" button
- [ ] **POI Detail view** (expanded sheet or dedicated screen):
  - [ ] **Graceful media hero area** — Handles three cases:
    - Video available → auto-playing, looping, muted-by-default video (`expo-video`)
    - Photo available → static cover image (`expo-image`)
    - No media → elegant placeholder (gradient, illustration, or category-themed fallback)
  - [ ] Viewpoint name, location, category
  - [ ] Description / travel-journal-style text
  - [ ] Photo gallery (swipeable `expo-image` carousel) — only shown if images exist
  - [ ] Practical info: how to get there, what you'll see, accessibility notes
  - [ ] "Navigate" button → deep-link to Google Maps / Apple Maps
  - [ ] Favorite / save button
  - [ ] Share button

---

## Phase 4 · Media & Content

- [ ] **Video playback** — Integrate `expo-video` for viewpoint previews
  - [ ] Autoplay on visibility
  - [ ] Muted by default, tap to unmute
  - [ ] Looping playback
- [ ] **Image handling** — Use `expo-image` with caching for all viewpoint imagery
- [ ] **Media fallback system** — Consistent placeholder/fallback for viewpoints without media
- [ ] **AI-generated POI markers** — Design and integrate custom marker assets (illustrated eye, mountain, compass icons)

---

## Phase 5 · User Profile & Favorites

- [ ] **Profile overlay/sheet** — Accessible from the top-right avatar icon on the map:
  - [ ] Avatar upload (with existing `ProfileAvatar` component)
  - [ ] Display name, bio editing
  - [ ] List of favorite viewpoints
  - [ ] Settings (theme toggle, logout)
- [ ] **Favorites system:**
  - [ ] Heart/bookmark toggle on viewpoint cards and detail views
  - [ ] Favorites list on profile
  - [ ] Optimistic UI updates

---

## Phase 6 · State Management & Data Layer

- [ ] **TanStack Query setup** — Configure `QueryClient`, wrap app in `QueryClientProvider`
- [ ] **Query hooks:**
  - [ ] `useNearbyViewpoints(lat, lng, radius)`
  - [ ] `useViewpointDetails(id)`
  - [ ] `useSearchViewpoints(query)`
  - [ ] `useFavorites(userId)`
- [ ] **Zustand stores:**
  - [ ] `useMapStore` — Camera position, selected viewpoint, active filters, zoom level
  - [ ] `useLocationStore` — User's current coordinates, location permission status
- [ ] **Offline tolerance** — Configure TanStack Query caching for low-connectivity outdoor use

---

## Phase 7 · Polish & Animations

- [ ] **Spring animations** — Bouncy interactions on filter pills and markers (react-native-reanimated)
- [ ] **Sheet drag physics** — Smooth, snappy sheet dragging with comfortable stop points
- [ ] **Soft transitions** — Crossfade page transitions, gentle video fade-ins
- [ ] **Marker focus animation** — Sweeping camera flight with 3D pitch on marker tap
- [ ] **Reduce Motion support** — Honor system accessibility setting for motion-sensitive users
- [ ] **Haptic feedback** — Tactile response on key interactions (using existing `hapticsService`)

---

## Phase 8 · Accessibility & QA

- [ ] **Contrast ratios** — Verify WCAG compliance for text/background combinations
- [ ] **Touch targets** — Ensure all interactive elements meet 44×44pt minimum
- [ ] **Screen reader labels** — Descriptive accessibility labels on map markers, videos, interactive elements
- [ ] **Error handling** — Graceful fallbacks for denied location permissions, network failures, empty states
- [ ] **Loading states** — Skeleton screens and shimmer effects for content loading
- [ ] **Empty states** — Friendly illustrations/messages when no viewpoints found, no favorites, etc.

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

### Discover / Feed
- [ ] **Curated feed of viewpoints:**
  - [ ] "Trending" / "Popular nearby" sections
  - [ ] Category-based collections (e.g., "Best sunset spots", "Hidden rooftops")
  - [ ] Vertical scrollable feed with video previews
- [ ] **Deep linking** — Support opening specific viewpoints from external links (TikTok, social shares)

### Profile Stats & Gamification
- [ ] Stats: viewpoints visited, favorites count, submissions count
- [ ] Achievement / badge system
