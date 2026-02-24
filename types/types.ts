/**
 * Shared types for the application
 *
 * Add your app-specific types here.
 * This file serves as the central type definitions for your domain models.
 */

// ============================================================================
// EXAMPLE TYPES (replace with your own)
// ============================================================================

/**
 * Example user profile type
 * Extends Supabase auth user with app-specific metadata
 */
export type UserProfile = {
    id: string;
    email: string;
    display_name: string | null;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
};
