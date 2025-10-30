import { NextRequest } from 'next/server';
import { getClipById, updateClip, deleteClip } from '@/lib/data-access';
import { requireAuth, optionalAuth } from '@/lib/api-auth';
import { checkRateLimit } from '@/lib/rate-limit';
import {
  successResponse,
  errorResponse,
  handleError,
} from '@/lib/api-helpers';
import { updateClipSchema } from '@/lib/validation';

/**
 * GET /api/clips/[id]
 * Get a single clip by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Optional auth (for rate limiting)
    const user = await optionalAuth(request);

    // Check rate limit
    const rateLimit = checkRateLimit(request, user?.id || null, 'general');
    if (!rateLimit.allowed) {
      return errorResponse('Rate limit exceeded', 429);
    }

    // Parse and validate ID
    const clipId = parseInt(id, 10);
    if (isNaN(clipId)) {
      return errorResponse('Invalid clip ID', 400);
    }

    // Fetch clip
    const clip = await getClipById(clipId);

    if (!clip) {
      return errorResponse('Clip not found', 404);
    }

    return successResponse(clip);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * PUT /api/clips/[id]
 * Update a clip (requires authentication and ownership)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
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

    // Parse and validate ID
    const clipId = parseInt(id, 10);
    if (isNaN(clipId)) {
      return errorResponse('Invalid clip ID', 400);
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = updateClipSchema.parse(body);

    // Update clip (ownership check is done in data-access)
    const clip = await updateClip(clipId, validatedData, user.id);

    return successResponse(clip, 'Clip updated successfully');
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/clips/[id]
 * Delete a clip (requires authentication and ownership)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
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

    // Parse and validate ID
    const clipId = parseInt(id, 10);
    if (isNaN(clipId)) {
      return errorResponse('Invalid clip ID', 400);
    }

    // Delete clip (ownership check is done in data-access)
    await deleteClip(clipId, user.id);

    return successResponse(null, 'Clip deleted successfully');
  } catch (error) {
    return handleError(error);
  }
}
