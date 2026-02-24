# Phase 1 Walkthrough: Backend & Database 🚀

The Supabase backend foundation for **Belvedere** is now fully set up and ready for feature integration. Here is what was accomplished:

## 1. Schema & PostGIS 🌍
The `postgis` extension was enabled and 5 core tables were created:
*   `viewpoint_categories`: Stores category metadata (Natural, Urban, Historic, etc.)
*   `profiles`: Extends Supabase Auth with custom user data (display name, avatar).
*   `viewpoints`: The core table containing the PostGIS `location` column for geographic data, altitude, category, and media links.
*   `viewpoint_media`: For storing additional photos or video reels associated with places.
*   `user_favorites`: For users to bookmark viewpoints.

*Note: A database trigger ( `handle_new_user()` ) was added to automatically insert a row into the `profiles` table whenever a new user signs up.*

## 2. Row Level Security (RLS) 🛡️
Strict RLS policies were applied across all tables.
- **Public data** like viewpoints, media, and categories are readable by everyone.
- **Insert/Update/Delete** actions are restricted to authenticated users, and users can only modify their own profiles, submitted viewpoints, media, and favorites.

## 3. Database Functions 🔍
Two powerful functions were added for map discovery:
*   `nearby_viewpoints(lat, lng, radius)`: Uses PostGIS `ST_DWithin` and `ST_Distance` to efficiently find and sort viewpoints around the user's current location.
*   `search_viewpoints(search_query)`: Implements PostgreSQL Full-Text Search across viewpoint names and descriptions.

## 4. Storage Buckets 📦
Two public storage buckets were created:
*   `viewpoint-media` (for POI images and video reels)
*   `avatars` (for user profile pictures)

RLS policies for `storage.objects` were also applied so users can securely upload files.

## 5. Seed Data 🇮🇹
I populated the database with **7 stunning real-world Italian viewpoints** to jumpstart development:
1. Piazzale Michelangelo (Florence)
2. Terrazza del Pincio (Rome)
3. Belvedere di Tragara (Capri)
4. Giardino degli Aranci (Rome)
5. Terrazza Mascagni (Livorno)
6. Monte Spinale (Dolomites)
7. Punta Tegge (La Maddalena)

## 6. TypeScript Types 📝
The frontend `types/database.types.ts` file was automatically generated and updated directly from the Supabase project schema, ensuring 100% type safety moving into Phase 2.

> [!TIP]
> The database is perfectly clean according to the Supabase Security Advisor (all functions now have immutable search paths). We are 100% ready to move to Phase 2 (Core Map Experience).
