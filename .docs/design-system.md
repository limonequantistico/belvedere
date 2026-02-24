# Belvedere Design System

This design system serves as a living reference for the Belvedere app, built using Expo and Tamagui. It reflects the project vision of a "serene, beautifully designed discovery app" with a unique, relaxing aesthetic that takes inspiration from stylized, cartoonish, or RPG-like cartography. The user experience borrows structural patterns from modern social and map apps, but the visual execution is entirely geared toward calm exploration.

## 1. Visual Foundation

The visual foundation moves away from stark, high-contrast utility apps and embraces an earthy, storybook, or "exploration video game" feel.

### Colors
Since Tamagui relies on tokens, map these directly to your `tamagui.config.ts`. The palette should feel natural, warm, and inviting.

*   **Primary Accent (Sunset Orange/Terracotta):** `#E07A5F`
    *   *Usage:* Primary calls to action (e.g., "View" buttons), active active map markers, key highlights. It stands out beautifully against natural greens and blues.
*   **Secondary/Nature Accent (Forest Green):** `#3D5A80` to `#81B29A`
    *   *Usage:* Secondary buttons, verified location badges, success states.
*   **Background (Canvas/Off-White):** `#F4F1DE` 
    *   *Usage:* Core background for light mode elements, bottom sheets, and cards. Evokes the feeling of physical paper or an old atlas. (For dark mode: a deep twilight blue `#2B2D42` rather than pure black).
*   **Surface / Panels (Parchment/Cream):** `#FFFFFF` or a very light cream `#FDFBF7` with subtle warm tint.
    *   *Usage:* Bottom sheets, search bar background, cards.
*   **Text colors:**
    *   *Primary Text:* `#3D405B` (Deep Navy/Charcoal instead of harsh black. Creates a softer contrast).
    *   *Secondary Text:* `#8D93AB` (Muted navy/gray for distances, category labels).
*   **Status/Destructive:** `#E07A5F` (Use the primary warm accent for destructive actions to keep the palette cohesive, or a softer coral red).

### Typography
To achieve the relaxing, stylized aesthetic, the typography should feel friendly and slightly organic, stepping away from purely tech-focused geometric sans-serifs.
*   **Font Family:** `Nunito`, `Quicksand`, or even a clean rounded serif (like `Fraunces` or `Recoleta`) for headings to give it that "storybook" or RPG journal feel.
*   **Headings:** Bold/Semibold, warm and inviting.
    *   *H1 (Sheet Titles):* 24px, Bold (e.g., "Featured Near You")
    *   *H2 (Card Titles):* 18px, Semibold (e.g., "Eagle's Nest")
*   **Body:** Regular, 15px-16px. Clean sans-serif for legibility in content sheets.
*   **Small/Metadata:** 13px, Medium, `#8D93AB`.

### Spacing & Borders
The UI should feel soft and tactile.
*   **Border Radius:** 
    *   *Pills & Search Bar:* Fully rounded (capsule shape) to feel friendly.
    *   *Cards & Bottom Sheets:* Generous, soft rounding (`20px` to `24px`).
    *   *Action Buttons:* Fully rounded or soft squircles (Continuous curves).
*   **Borders:** Consider using subtle, slightly darker borders (e.g., `1px solid rgba(61, 64, 91, 0.1)`) on cards instead of relying entirely on heavy drop shadows to give a tactile, illustrated feel.
*   **Spacing:** Roomy padding (`16px` to `24px`) so the UI never feels cramped or overwhelming.

### Shadows & Depth
*   **Soft, Diffused Shadows:** Instead of harsh black shadows, use large, highly blurred shadows tinted with the primary text color (e.g., `0px 8px 24px rgba(61, 64, 91, 0.08)`) to make elements appear to softly float.
*   **Frosted Glass (Minimal):** Use sparingly. If used, it should feel like looking through frosted quartz rather than high-tech acrylic.

---

## 2. Core Components

Based on the UX patterns and the seed document, here are the key components to define in Tamagui:

1.  **Map POI Marker (`MapMarker`)**
    *   *Style:* Instead of standard drops, use stylized icons (e.g., an illustrated eye, a stylized mountain, a mini-compass). They should look like little game tokens on a board. 
    *   *Variants:* `active` (pops up slightly, casts a soft shadow), `inactive` (flatter), `unverified` (muted/sepia tone).
2.  **Filter Pill (`FilterPill`)**
    *   *Style:* Capsule-shaped button. 
    *   *Variants:*
        *   `active`: Solid primary accent (`#E07A5F`) background, white text.
        *   `inactive`: Cream background, deep navy text, subtle border.
3.  **Floating Search Bar (`FloatingSearch`)**
    *   *Style:* Full-width capsule input floating at the top of the map. Cream background with a subtle border and soft shadow. Left aligned search icon, right aligned voice/filter icon.
4.  **Bottom Content Sheet (`RichContentSheet`)**
    *   *Style:* Draggable Tamagui Sheet. Rounded top corners (`24px`). Cream background. 
    *   *Content:* Expands to show TikTok-style video reels at the top and stylized, easy-to-read pathway info below.
5.  **Location Card (`ViewpointCard`)**
    *   *Style:* Softly rounded rectangle (`20px` radius). Left-aligned image thumbnail (with rounded corners), right-aligned title and metadata.
    *   *Action:* Contains a prominent, warm "View" button.
6.  **Floating Action Button (`MapFAB`)**
    *   *Style:* Circular buttons floating on the right edge. Cream background, navy icons, soft shadow.
7.  **Bottom Navigation Bar (`BottomNav`)**
    *   *Style:* 4 or 5 icon layout. Background matches the main surface color.
    *   *Active State:* Primary accent color (`#E07A5F`) icon and text, perhaps with a cute small dot or underline indicator.

---

## 3. Layout Patterns

*   **The Map-First Screen (Home):**
    *   Z-Index 0: Fullscreen Mapbox instance tailored to look like an illustrated or stylized map (focusing on terrain, water, and elevation rather than roads).
    *   Z-Index 10: Top floating elements (Search Bar, Filter pills). Safe-area padded.
    *   Z-Index 10: Right-side FABs (Locate me, map layers).
    *   Z-Index 20: Persistent Bottom Sheet containing "Featured Near You" or currently selected POI.
*   **The Rich View Sheet (POI Detail):**
    *   Expands heavily (80%-100% of screen).
    *   Top half: Auto-playing looping video (`expo-video`) demonstrating the viewpoint, framed softly.
    *   Bottom half: Scrollable practical information. The UI here should feel like an elegant travel journal entry.

---

## 4. Interaction & Motion

*   **Sheet Dragging:** Fluid dragging that snaps comfortably to pre-defined stop points (e.g., 20%, 50%, 90% of screen height).
*   **Playful Spring Animations:** Interactions should feel alive but not overly energetic. Bouncy spring animations on filter pills and map markers when tapped, resembling physical tokens being pressed.
*   **Marker Focus:** Tapping a `MapMarker` triggers a smooth, sweeping flight to center the camera, slowly tilting the pitch to reveal a pseudo-3D view of the terrain if available.
*   **Soft Transitions:** Videos fade in gently; page transitions use smooth crossfades rather than jarring slides.

---

## 5. Accessibility Checklist

- [ ] **Contrast Ratios:** Ensure the deep navy text against the cream background meets WCAG standards. The muted text `#8D93AB` must be tested against `#F4F1DE` for legibility.
- [ ] **Touch Targets:** Maintain large, 44x44 point minimum touch targets for the friendly, accessible feel.
- [ ] **Screen Readers:** Map markers and video elements must have descriptive, story-like accessibility labels.
- [ ] **Motion Sensitivity:** Implement a `Reduce Motion` check to disable the camera flights and spring bounces for users who prefer static transitions.

---

## 6. References

*   **Seed Document:** `.docs/seed-document.md`
*   **Architecture & Tech Stack:** `.docs/tech-stack.md`
*   **UX Inspiration:** Reference the general layout structure (search bar top, sheet bottom) from `.docs/imgs/prototypes/` but *ignore the dark neon UI styling*.

---

## 7. Design Style

**Stylized Cartography & Serene Exploration**

The core aesthetic completely abandons the "utility app" look for an experience that feels like opening a digital pop-up book or exploring a beautiful indie game world. 
*   **Why Warm/Natural?** It immediately signals to the user that this app is for leisure, mental health, and aesthetics, rather than frantic point A to point B navigation.
*   **The "Exploration" Map:** The map tiles (via Mapbox Studio) are the most crucial element. They should drop unnecessary road labels, utilizing soft topographic lines, warm terrain colors, and highlighted water bodies. It should look like an interactive piece of art.
*   **Friendly & Tactile:** Everything from the generous border radii to the springy animations and soft shadows makes the digital interface feel like a collection of physical, welcoming objects.
