# Authorization System (Deleted - Reference Only)

**Status:** Deleted on 2025-10-31
**Original Location:** `/lib/authorization.ts`
**Reason for Deletion:** Not currently used; app uses simpler ownership checks in `api-auth.ts`
**Lines of Code:** 149 lines

This document preserves the design and implementation of a comprehensive authorization system that was removed from the codebase. It can be recreated if granular permissions are needed in the future.

---

## Overview

A complete authorization framework that provides:
- Role-based access control (public, authenticated, owner, moderator)
- Resource-level permissions (clips, entities, follows, memberships, users)
- Action-level permissions (create, read, update, delete)
- Helper functions for permission checking

## Type Definitions

```typescript
export type ResourceType = 'clip' | 'entity' | 'follow' | 'membership' | 'user';
export type ActionType = 'create' | 'read' | 'update' | 'delete';
export type PermissionLevel = 'public' | 'authenticated' | 'owner' | 'moderator';
```

## Permission Hierarchy

1. **public** - Anyone (unauthenticated)
2. **authenticated** - Logged-in users
3. **moderator** - Entity moderators (stored in `Entity.modsJson`)
4. **owner** - Resource owner (entity owner, clip creator, etc.)

## Authorization Rules Matrix

The system defined rules for each resource type and action:

### Clips
- **create**: authenticated users
- **read**: public (anyone)
- **update**: owner only
- **delete**: owner only

### Entities (players, teams, leagues, etc.)
- **create**: authenticated users
- **read**: public (anyone)
- **update**: owner OR moderator
- **delete**: owner only

### Follows
- **create**: authenticated users
- **read**: owner (user can only see their own follows)
- **update**: N/A (no update operation)
- **delete**: owner (user can unfollow)

### Team Memberships
- **create**: authenticated (but must own player or team)
- **read**: public (anyone)
- **update**: owner (must own player or team)
- **delete**: owner (must own player or team)

### Users
- **create**: public (sign-up)
- **read**: public (profiles are public)
- **update**: owner only
- **delete**: owner only

## Core Functions

### 1. isActionAllowed()

Checks if a permission level is sufficient for an action:

```typescript
function isActionAllowed(
  resource: ResourceType,
  action: ActionType,
  userPermissionLevel: PermissionLevel
): boolean
```

**Logic:**
- Returns `true` if action requires 'public' level (everyone allowed)
- Returns `true` if user's permission level is in the required levels array
- Returns `false` otherwise

**Example:**
```typescript
// Check if authenticated user can create a clip
isActionAllowed('clip', 'create', 'authenticated') // → true

// Check if public user can update a clip
isActionAllowed('clip', 'update', 'public') // → false
```

### 2. getUserPermissionLevel()

Determines a user's permission level for a resource:

```typescript
function getUserPermissionLevel(
  userId: string | null,
  ownerId: string | null | undefined,
  moderatorIds: string[] = []
): PermissionLevel
```

**Logic:**
1. No userId → 'public'
2. userId matches ownerId → 'owner'
3. userId in moderatorIds → 'moderator'
4. Otherwise → 'authenticated'

**Example:**
```typescript
// User is the owner
getUserPermissionLevel('user-123', 'user-123', []) // → 'owner'

// User is a moderator
getUserPermissionLevel('user-456', 'user-123', ['user-456']) // → 'moderator'

// User is just authenticated
getUserPermissionLevel('user-789', 'user-123', []) // → 'authenticated'

// Not logged in
getUserPermissionLevel(null, 'user-123', []) // → 'public'
```

### 3. checkPermission()

High-level permission checker with helpful error messages:

```typescript
function checkPermission(
  resource: ResourceType,
  action: ActionType,
  userId: string | null,
  ownerId: string | null | undefined,
  moderatorIds: string[] = []
): { allowed: boolean; reason?: string }
```

**Returns:**
- `{ allowed: true }` if permitted
- `{ allowed: false, reason: "..." }` if denied

**Error Messages:**
- "Invalid resource or action"
- "You must be the owner to perform this action"
- "You must be authenticated to perform this action"
- "You must be a moderator to perform this action"
- "You do not have permission to perform this action"

**Example:**
```typescript
// Authenticated user trying to update someone else's entity
checkPermission('entity', 'update', 'user-456', 'user-123', [])
// → { allowed: false, reason: "You must be the owner to perform this action" }

// Owner updating their own entity
checkPermission('entity', 'update', 'user-123', 'user-123', [])
// → { allowed: true }

// Moderator updating entity
checkPermission('entity', 'update', 'user-789', 'user-123', ['user-789'])
// → { allowed: true }
```

### 4. extractModeratorIds()

Extracts moderator user IDs from entity's modsJson field:

```typescript
function extractModeratorIds(modsJson: any): string[]
```

**Expected modsJson format:**
```typescript
[
  { userId: "user-123", permissions: ["edit", "moderate"] },
  { userId: "user-456", permissions: ["edit"] }
]
```

**Returns:** `["user-123", "user-456"]`

**Handles edge cases:**
- Returns empty array if modsJson is null/undefined
- Returns empty array if modsJson is not an array
- Filters out invalid entries (missing userId)
- Converts userId to string

---

## Complete Authorization Rules Table

| Resource   | Action | Required Permission Levels        |
|------------|--------|-----------------------------------|
| clip       | create | authenticated                     |
| clip       | read   | public                            |
| clip       | update | owner                             |
| clip       | delete | owner                             |
| entity     | create | authenticated                     |
| entity     | read   | public                            |
| entity     | update | owner, moderator                  |
| entity     | delete | owner                             |
| follow     | create | authenticated                     |
| follow     | read   | owner                             |
| follow     | update | N/A                               |
| follow     | delete | owner                             |
| membership | create | authenticated (+ owns player/team)|
| membership | read   | public                            |
| membership | update | owner (owns player/team)          |
| membership | delete | owner (owns player/team)          |
| user       | create | public                            |
| user       | read   | public                            |
| user       | update | owner                             |
| user       | delete | owner                             |

---

## Usage Examples

### Protecting an API Route

```typescript
import { checkPermission, extractModeratorIds } from '@/lib/authorization';

// In an API route
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id || null;

  // Fetch the entity
  const entity = await prisma.entity.findUnique({
    where: { id: parseInt(params.id) },
    select: { ownerId: true, modsJson: true }
  });

  if (!entity) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Check permission
  const moderatorIds = extractModeratorIds(entity.modsJson);
  const permission = checkPermission(
    'entity',
    'update',
    userId,
    entity.ownerId,
    moderatorIds
  );

  if (!permission.allowed) {
    return NextResponse.json(
      { error: permission.reason },
      { status: 403 }
    );
  }

  // Proceed with update...
}
```

### Component-Level Permission Check

```typescript
import { isActionAllowed, getUserPermissionLevel } from '@/lib/authorization';

function EntityCard({ entity, currentUserId }: Props) {
  const userLevel = getUserPermissionLevel(
    currentUserId,
    entity.ownerId,
    extractModeratorIds(entity.modsJson)
  );

  const canEdit = isActionAllowed('entity', 'update', userLevel);
  const canDelete = isActionAllowed('entity', 'delete', userLevel);

  return (
    <div>
      <h2>{entity.name}</h2>
      {canEdit && <button>Edit</button>}
      {canDelete && <button>Delete</button>}
    </div>
  );
}
```

---

## Why It Was Removed

The current app uses simpler ownership checks in `api-auth.ts`:

```typescript
// Current approach (simpler but less flexible)
export function requireEntityOwnership(
  userId: string | null,
  ownerId: string | null | undefined
): void {
  if (!userId || userId !== ownerId) {
    throw createApiError('Forbidden', 'You must own this resource', 403);
  }
}
```

**Trade-offs:**
- ✅ Simpler, less code to maintain
- ✅ Sufficient for current needs (owner-only model)
- ❌ No moderator support
- ❌ No granular permissions per resource type
- ❌ No helpful permission error messages

---

## When to Recreate This System

Consider recreating this authorization system when:

1. **Adding moderator roles** - Entity moderators need different permissions than owners
2. **Granular permissions** - Different actions need different permission levels
3. **Team collaboration** - Multiple users need varying access to resources
4. **Admin features** - Platform admins need elevated permissions
5. **Permission auditing** - Need to track/log who can do what

---

## Implementation Notes

### Integration with Prisma Schema

The moderator system depends on the `Entity.modsJson` field:

```prisma
model Entity {
  // ...
  modsJson  Json?  // Array of { userId: string, permissions: string[] }
  // ...
}
```

### Performance Considerations

- **Moderator lookup is O(n)**: `moderatorIds.includes(userId)` scans the array
- **For large moderator lists**: Consider a separate `EntityModerator` junction table with indexing
- **Caching**: Authorization rules are static and can be cached

### Testing Considerations

When recreating, ensure tests cover:
- All permission levels (public, authenticated, owner, moderator)
- All resource types and actions
- Edge cases (null userId, empty moderatorIds, invalid modsJson)
- Error messages are helpful and accurate

---

## Full Source Code

```typescript
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
```

---

**Last Updated:** 2025-10-31
**Preserved By:** Claude Code
