import { NextRequest } from 'next/server';
import { auth } from './auth';
import { prisma } from './prisma';
import { User } from './generated/prisma-client';

export type AuthResult = 
  | { success: true; user: User; session: any }
  | { success: false; error: string; status: number };

/**
 * Get the authenticated user from the request
 * Returns the user object if authenticated, or null if not
 */
export async function getAuthUser(request: NextRequest): Promise<User | null> {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return null;
    }

    // Fetch full user from database
    // session.user.id is a string, convert to number for Prisma query
    const userId = typeof session.user.id === 'string' ? parseInt(session.user.id, 10) : session.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    return user;
  } catch (error) {
    console.error('Error getting auth user:', error);
    return null;
  }
}

/**
 * Require authentication middleware
 * Returns user if authenticated, or error response if not
 */
export async function requireAuth(request: NextRequest): Promise<AuthResult> {
  const user = await getAuthUser(request);
  
  if (!user) {
    return {
      success: false,
      error: 'Authentication required',
      status: 401,
    };
  }

  return {
    success: true,
    user,
    session: { userId: user.id },
  };
}

/**
 * Optional authentication middleware
 * Returns user if authenticated, or null if not (but doesn't fail)
 */
export async function optionalAuth(request: NextRequest): Promise<User | null> {
  return getAuthUser(request);
}

/**
 * Verify that the authenticated user owns the specified entity
 */
export async function requireOwnership(
  entityId: number,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const userIdNum = parseInt(userId, 10);

    const entity = await prisma.entity.findUnique({
      where: { id: entityId },
      select: { ownerId: true },
    });

    if (!entity) {
      return { success: false, error: 'Entity not found' };
    }

    if (entity.ownerId !== userIdNum) {
      return { success: false, error: 'You do not own this entity' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error checking ownership:', error);
    return { success: false, error: 'Failed to verify ownership' };
  }
}

/**
 * Verify that the authenticated user owns the specified clip
 * Clips are owned through the UserClip relationship
 */
export async function requireClipOwnership(
  clipId: number,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const userIdNum = parseInt(userId, 10);

    // Check if user has a UserClip relationship with this clip
    const userClip = await prisma.userClip.findFirst({
      where: {
        clipId: clipId,
        userId: userIdNum,
      },
    });

    if (!userClip) {
      return { success: false, error: 'Clip not found or you do not own this clip' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error checking clip ownership:', error);
    return { success: false, error: 'Failed to verify ownership' };
  }
}

/**
 * Verify that the authenticated user owns the specified membership
 * (either owns the player or the team)
 */
export async function requireMembershipOwnership(
  membershipId: number,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const userIdNum = parseInt(userId, 10);

    const membership = await prisma.teamMembership.findUnique({
      where: { id: membershipId },
      include: {
        player: {
          select: { ownerId: true },
        },
        team: {
          select: { ownerId: true },
        },
      },
    });

    if (!membership) {
      return { success: false, error: 'Membership not found' };
    }

    // User must own either the player or the team
    const ownsPlayer = membership.player.ownerId === userIdNum;
    const ownsTeam = membership.team.ownerId === userIdNum;

    if (!ownsPlayer && !ownsTeam) {
      return {
        success: false,
        error: 'You must own the player or team to modify this membership'
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error checking membership ownership:', error);
    return { success: false, error: 'Failed to verify ownership' };
  }
}
