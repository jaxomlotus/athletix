import { z } from 'zod';

/**
 * Entity type enum
 */
export const entityTypeSchema = z.enum([
  'sport',
  'league',
  'team',
  'player',
  'school',
  'location',
]);

/**
 * Clip validation schemas
 */
export const createClipSchema = z.object({
  url: z.string().url().max(512),
  title: z.string().min(1).max(256),
  description: z.string().max(5000).optional(),
  thumbnail: z.string().url().max(512).optional(),
  platform: z.string().max(50).optional(),
  entityIds: z.array(z.number().int()).min(1).optional(),
});

export const updateClipSchema = z.object({
  url: z.string().url().max(512).optional(),
  title: z.string().min(1).max(256).optional(),
  description: z.string().max(5000).nullable().optional(),
  thumbnail: z.string().url().max(512).nullable().optional(),
  platform: z.string().max(50).nullable().optional(),
  entityIds: z.array(z.number().int()).optional(),
});

/**
 * Entity validation schemas
 */
export const createEntitySchema = z.object({
  type: entityTypeSchema,
  slug: z.string().min(1).max(256).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  name: z.string().min(1).max(256),
  description: z.string().max(10000).optional(),
  logo: z.string().max(512).optional(),
  banner: z.string().max(512).optional(),
  parentId: z.number().int().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  layout: z.record(z.string(), z.any()).optional(),
});

export const updateEntitySchema = z.object({
  name: z.string().min(1).max(256).optional(),
  description: z.string().max(10000).nullable().optional(),
  logo: z.string().max(512).nullable().optional(),
  banner: z.string().max(512).nullable().optional(),
  parentId: z.number().int().nullable().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  layout: z.record(z.string(), z.any()).optional(),
});

/**
 * Follow validation schemas
 */
export const createFollowSchema = z.object({
  entityId: z.number().int(),
});

/**
 * Team membership validation schemas
 */
export const createMembershipSchema = z.object({
  playerId: z.number().int(),
  teamId: z.number().int(),
  jerseyNumber: z.number().int().min(0).max(999).optional(),
  positions: z.array(z.string()).optional(),
  season: z.string().max(50).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  isCurrent: z.boolean().optional(),
});

export const updateMembershipSchema = z.object({
  jerseyNumber: z.number().int().min(0).max(999).nullable().optional(),
  positions: z.array(z.string()).optional(),
  season: z.string().max(50).optional(),
  startDate: z.string().datetime().nullable().optional(),
  endDate: z.string().datetime().nullable().optional(),
  isCurrent: z.boolean().optional(),
});

/**
 * Query parameter validation schemas
 */
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export const clipFiltersSchema = z.object({
  sport: z.string().optional(),
  league: z.string().optional(),
  team: z.string().optional(),
  player: z.string().optional(),
  location: z.string().optional(),
  school: z.string().optional(),
  position: z.string().optional(),
  gender: z.enum(['mens', 'womens', 'coed']).optional(),
  age: z.number().int().min(0).max(100).optional(),
  grade: z.string().optional(),
});

export const entityFiltersSchema = z.object({
  search: z.string().max(256).optional(),
  sport: z.string().optional(),
  league: z.string().optional(),
  location: z.string().optional(),
  school: z.string().optional(),
  gender: z.enum(['mens', 'womens', 'coed']).optional(),
  parentId: z.number().int().optional(),
});

export const membershipFiltersSchema = z.object({
  playerId: z.number().int().optional(),
  teamId: z.number().int().optional(),
  current: z.boolean().optional(),
  season: z.string().optional(),
});

/**
 * Search query validation
 */
export const searchQuerySchema = z.object({
  q: z.string().min(1).max(256),
  types: z.array(entityTypeSchema).optional(),
  limit: z.number().int().min(1).max(50).default(10),
});

/**
 * Type exports for use in API routes
 */
export type CreateClipInput = z.infer<typeof createClipSchema>;
export type UpdateClipInput = z.infer<typeof updateClipSchema>;
export type CreateEntityInput = z.infer<typeof createEntitySchema>;
export type UpdateEntityInput = z.infer<typeof updateEntitySchema>;
export type CreateFollowInput = z.infer<typeof createFollowSchema>;
export type CreateMembershipInput = z.infer<typeof createMembershipSchema>;
export type UpdateMembershipInput = z.infer<typeof updateMembershipSchema>;
export type ClipFilters = z.infer<typeof clipFiltersSchema>;
export type EntityFilters = z.infer<typeof entityFiltersSchema>;
export type MembershipFilters = z.infer<typeof membershipFiltersSchema>;
export type SearchQuery = z.infer<typeof searchQuerySchema>;
