# Phase 1 — Backend & Database (Supabase)

Set up the complete Supabase backend for Belvedere: PostGIS, schema, RLS, database functions, storage buckets, and seed data.

## Proposed Changes

### 1. Enable PostGIS Extension

Enable the `postgis` extension to support geographic queries on viewpoint coordinates.

```sql
CREATE EXTENSION IF NOT EXISTS postgis SCHEMA extensions;
```

---

### 2. Database Schema (Single Migration)

All tables created in dependency order:

#### `viewpoint_categories`
| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | `gen_random_uuid()` |
| `name` | `text NOT NULL UNIQUE` | e.g. "Natural", "Urban" |
| `icon` | `text` | emoji or icon name |
| `color` | `text` | hex color |
| `created_at` | `timestamptz` | default `now()` |

#### `profiles` (extend existing `auth.users`)
| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | FK → `auth.users.id` |
| `display_name` | `text` | |
| `avatar_url` | `text` | |
| `bio` | `text` | |
| `created_at` | `timestamptz` | default `now()` |
| `updated_at` | `timestamptz` | default `now()` |

A trigger auto-creates a profile row on new user sign-up.

#### `viewpoints`
| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | |
| `name` | `text NOT NULL` | |
| `description` | `text` | |
| `location` | `geography(Point, 4326) NOT NULL` | PostGIS point |
| `altitude` | `integer` | meters |
| `category_id` | `uuid` FK | → `viewpoint_categories` |
| `cover_image_url` | `text` | |
| `video_url` | `text` | |
| `verified` | `boolean` | default `true` |
| `created_by` | `uuid` FK | → `profiles` |
| `created_at` / `updated_at` | `timestamptz` | |

Spatial index on `location` for proximity queries.

#### `viewpoint_media`
| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | |
| `viewpoint_id` | `uuid` FK | → `viewpoints` ON DELETE CASCADE |
| `media_url` | `text NOT NULL` | |
| `media_type` | `text NOT NULL` | CHECK `image` or `video` |
| `sort_order` | `integer` | default `0` |
| `created_at` | `timestamptz` | |

#### `user_favorites`
| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | |
| `user_id` | `uuid` FK | → `profiles` ON DELETE CASCADE |
| `viewpoint_id` | `uuid` FK | → `viewpoints` ON DELETE CASCADE |
| `created_at` | `timestamptz` | |

Unique constraint on `(user_id, viewpoint_id)`.

---

### 3. Row Level Security (RLS)

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| `viewpoint_categories` | Public | None (admin only) | None | None |
| `profiles` | Public | Auto (trigger) | Own profile only | None |
| `viewpoints` | Public | Authenticated | Own viewpoints | Own viewpoints |
| `viewpoint_media` | Public | Authenticated | Own media | Own media |
| `user_favorites` | Own favorites | Authenticated (own) | None | Own favorites |

---

### 4. Database Functions

#### `nearby_viewpoints(lat, lng, radius_km)`
Returns viewpoints within a radius, ordered by distance. Joins category data. Uses `ST_DWithin` on the geography column for efficient spatial query.

#### `search_viewpoints(query_text)`
Full-text search on `name` and `description` using `to_tsvector` / `plainto_tsquery`. Returns matching viewpoints with rank.

---

### 5. Storage Buckets

| Bucket | Public | Size Limit | MIME Types |
|--------|--------|-----------|------------|
| `viewpoint-media` | Yes (read) | 50MB | image/*, video/* |
| `avatars` | Yes (read) | 5MB | image/* |

---

### 6. Seed Data

Populate ~8 real Italian viewpoints (scenic panoramic spots) with categories:
- **Categories**: Natural, Urban, Historic, Coastal, Mountain, Rooftop
- **Viewpoints**: Real locations with coordinates, descriptions, and altitude

---

### 7. Generate TypeScript Types

Run Supabase type generation and save to `types/database.ts` for use with the Supabase client.

---

## Verification Plan

### Automated Verification (via Supabase MCP / SQL)
1. **List tables** — Confirm all 6 tables exist in `public` schema
2. **Run `nearby_viewpoints`** — Query seed data near a known coordinate and verify results
3. **Run `search_viewpoints`** — Search for a known viewpoint name
4. **Run security advisor** — Check for missing RLS policies or security issues
5. **Run performance advisor** — Check for missing indexes

### Manual Verification
1. **Open Supabase Dashboard** → Table Editor → verify all tables appear with correct columns
2. **Check Storage** → verify all 3 buckets exist
3. **Auth** → sign up a test user → confirm profile row is auto-created
