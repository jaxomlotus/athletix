/**
 * Authorization rules and permission checking
 */

export type ResourceType = 'clip' | 'entity' | 'follow' | 'membership' | 'user';
export type ActionType = 'create' | 'read' | 'update' | 'delete';
export type PermissionLevel = 'public' | 'authenticated' | 'owner' | 'moderator';

/**
 * Authorization rules for different resources and actions
 */
export const authorizationRules: Record<
  ResourceType,
  Record<ActionType, PermissionLevel[]>
> = {
  clip: {
    create: ['authenticated'],
    read: ['public'],
    update: ['owner'],
    delete: ['owner'],
  },
  entity: {
    create: ['authenticated'],
    read: ['public'],
    update: ['owner', 'moderator'],
    delete: ['owner'],
  },
  follow: {
    create: ['authenticated'],
    read: ['owner'], // Only the user can see their own follows
    update: ['owner'], // No update operation for follows
    delete: ['owner'],
  },
  membership: {
    create: ['authenticated'], // But must own player or team
    read: ['public'],
    update: ['owner'], // Must own player or team
    delete: ['owner'], // Must own player or team
  },
  user: {
    create: ['public'], // Sign-up
    read: ['public'],
    update: ['owner'],
    delete: ['owner'],
  },
};

/**
 * Check if an action is allowed based on permission level
 */
export function isActionAllowed(
  resource: ResourceType,
  action: ActionType,
  userPermissionLevel: PermissionLevel
): boolean {
  const requiredLevels = authorizationRules[resource]?.[action];
  
  if (!requiredLevels) {
    return false;
  }

  // Public is the lowest level - everyone has it
  if (requiredLevels.includes('public')) {
    return true;
  }

  // Check if user's permission level is sufficient
  return requiredLevels.includes(userPermissionLevel);
}

/**
 * Determine user's permission level for a resource
 */
export function getUserPermissionLevel(
  userId: string | null,
  ownerId: string | null | undefined,
  moderatorIds: string[] = []
): PermissionLevel {
  // Not authenticated
  if (!userId) {
    return 'public';
  }

  // User is the owner
  if (ownerId && userId === ownerId) {
    return 'owner';
  }

  // User is a moderator
  if (moderatorIds.includes(userId)) {
    return 'moderator';
  }

  // User is authenticated but not owner/moderator
  return 'authenticated';
}

/**
 * Check if user can perform action on resource
 * Returns { allowed: true } if permitted, or { allowed: false, reason: string } if not
 */
export function checkPermission(
  resource: ResourceType,
  action: ActionType,
  userId: string | null,
  ownerId: string | null | undefined,
  moderatorIds: string[] = []
): { allowed: boolean; reason?: string } {
  const userLevel = getUserPermissionLevel(userId, ownerId, moderatorIds);
  const allowed = isActionAllowed(resource, action, userLevel);

  if (!allowed) {
    // Provide helpful error message
    const requiredLevels = authorizationRules[resource]?.[action];
    if (!requiredLevels) {
      return { allowed: false, reason: 'Invalid resource or action' };
    }

    if (requiredLevels.includes('owner')) {
      return { allowed: false, reason: 'You must be the owner to perform this action' };
    }

    if (requiredLevels.includes('authenticated')) {
      return { allowed: false, reason: 'You must be authenticated to perform this action' };
    }

    if (requiredLevels.includes('moderator')) {
      return { allowed: false, reason: 'You must be a moderator to perform this action' };
    }

    return { allowed: false, reason: 'You do not have permission to perform this action' };
  }

  return { allowed: true };
}

/**
 * Extract moderator IDs from entity modsJson field
 */
export function extractModeratorIds(modsJson: any): string[] {
  if (!modsJson || !Array.isArray(modsJson)) {
    return [];
  }

  return modsJson
    .filter((mod) => mod && typeof mod === 'object' && mod.userId)
    .map((mod) => String(mod.userId));
}
