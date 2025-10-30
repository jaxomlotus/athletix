import { NextRequest } from 'next/server';
import { deleteFollow } from '@/lib/data-access';
import { requireAuth } from '@/lib/api-auth';
import { checkRateLimit } from '@/lib/rate-limit';
import {
  successResponse,
  errorResponse,
  handleError,
} from '@/lib/api-helpers';

/**
 * DELETE /api/follows/[entityId]
 * Unfollow an entity (requires authentication)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ entityId: string }> }
) {
  try {
    const { entityId } = await params;
    
    // Require authentication
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return errorResponse(authResult.error, authResult.status);
    }

    const user = authResult.user;

    // Check rate limit
    const rateLimit = checkRateLimit(request, user.id, 'mutations');
    if (!rateLimit.allowed) {
      return errorResponse('Rate limit exceeded', 429);
    }

    // Parse and validate entity ID
    const entityIdNum = parseInt(entityId, 10);
    if (isNaN(entityIdNum)) {
      return errorResponse('Invalid entity ID', 400);
    }

    // Delete follow
    await deleteFollow(user.id, entityIdNum);

    return successResponse(null, 'Successfully unfollowed entity');
  } catch (error) {
    return handleError(error);
  }
}
