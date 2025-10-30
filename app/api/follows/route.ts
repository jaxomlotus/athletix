import { NextRequest } from 'next/server';
import { getUserFollows, createFollow } from '@/lib/data-access';
import { requireAuth } from '@/lib/api-auth';
import { checkRateLimit } from '@/lib/rate-limit';
import {
  successResponse,
  errorResponse,
  handleError,
} from '@/lib/api-helpers';
import { createFollowSchema } from '@/lib/validation';

/**
 * GET /api/follows
 * Get authenticated user's follows
 */
export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return errorResponse(authResult.error, authResult.status);
    }

    const user = authResult.user;

    // Check rate limit
    const rateLimit = checkRateLimit(request, user.id, 'general');
    if (!rateLimit.allowed) {
      return errorResponse('Rate limit exceeded', 429);
    }

    // Fetch follows
    const follows = await getUserFollows(user.id);

    return successResponse(follows);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * POST /api/follows
 * Create a new follow (requires authentication)
 */
export async function POST(request: NextRequest) {
  try {
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

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createFollowSchema.parse(body);

    // Create follow
    const follow = await createFollow(user.id, validatedData.entityId);

    return successResponse(follow, 'Successfully followed entity', 201);
  } catch (error) {
    return handleError(error);
  }
}
