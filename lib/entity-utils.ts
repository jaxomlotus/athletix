/**
 * Utility functions for working with Entity types
 */

export type EntityType = 'sport' | 'league' | 'team' | 'player';

// Map plural URLs to singular entity types
const TYPE_MAP: Record<string, EntityType> = {
  sports: 'sport',
  leagues: 'league',
  teams: 'team',
  players: 'player',
  sport: 'sport',
  league: 'league',
  team: 'team',
  player: 'player',
};

// Map singular entity types to plural URLs
const PLURAL_MAP: Record<EntityType, string> = {
  sport: 'sports',
  league: 'leagues',
  team: 'teams',
  player: 'players',
};

/**
 * Convert a URL type (plural or singular) to entity type (singular)
 * @param urlType - The type from the URL (e.g., 'sports', 'sport')
 * @returns The entity type or null if invalid
 */
export function getEntityType(urlType: string): EntityType | null {
  return TYPE_MAP[urlType.toLowerCase()] || null;
}

/**
 * Convert an entity type to plural URL form
 * @param entityType - The entity type
 * @returns The pluralized form for URLs
 */
export function pluralizeType(entityType: EntityType): string {
  return PLURAL_MAP[entityType];
}

/**
 * Validate if a string is a valid entity type URL
 * @param type - The type to validate
 * @returns True if valid
 */
export function isValidEntityType(type: string): boolean {
  return type.toLowerCase() in TYPE_MAP;
}

/**
 * Get the child entity type for a parent entity
 * @param parentType - The parent entity type
 * @returns The child entity type or null
 */
export function getChildEntityType(parentType: EntityType): EntityType | null {
  const hierarchy: Record<EntityType, EntityType | null> = {
    sport: 'league',
    league: 'team',
    team: 'player',
    player: null,
  };
  return hierarchy[parentType];
}

/**
 * Get display name for entity type
 * @param entityType - The entity type
 * @param plural - Whether to return plural form
 * @returns Display name
 */
export function getEntityDisplayName(entityType: EntityType, plural = false): string {
  if (plural) {
    return PLURAL_MAP[entityType].charAt(0).toUpperCase() + PLURAL_MAP[entityType].slice(1);
  }
  return entityType.charAt(0).toUpperCase() + entityType.slice(1);
}
