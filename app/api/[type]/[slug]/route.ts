import { NextRequest } from 'next/server';
import { getEntityBySlug, updateEntity, deleteEntity } from '@/lib/data-access';
import { requireAuth, optionalAuth } from '@/lib/api-auth';
import { checkRateLimit } from '@/lib/rate-limit';
import {
  successResponse,
  errorResponse,
  handleError,
} from '@/lib/api-helpers';
import { updateEntitySchema } from '@/lib/validation';
import { getEntityType } from '@/lib/entity-utils';

/**
 * GET /api/[type]/[slug]
 * Get a single entity by slug and type
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; slug: string }> }
) {
  try {
    const { type, slug } = await params;
    const entityType = getEntityType(type);

    if (!entityType) {
      return errorResponse('Invalid entity type', 400);
    }

    // Optional auth (for rate limiting)
    const user = await optionalAuth(request);

    // Check rate limit
    const rateLimit = checkRateLimit(request, user?.id || null, 'general');
    if (!rateLimit.allowed) {
      return errorResponse('Rate limit exceeded', 429);
    }

    // Fetch entity with follow status if user is authenticated
    const entity = await getEntityBySlug(entityType, slug, user?.id);

    if (!entity) {
      return errorResponse('Entity not found', 404);
    }

    return successResponse(entity);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * PUT /api/[type]/[slug]
 * Update an entity (requires authentication and ownership)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; slug: string }> }
) {
  try {
    const { type, slug } = await params;
    const entityType = getEntityType(type);

    if (!entityType) {
      return errorResponse('Invalid entity type', 400);
    }

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
    const validatedData = updateEntitySchema.parse(body);

    // Update entity (ownership check is done in data-access)
    const entity = await updateEntity(entityType, slug, validatedData, user.id);

    return successResponse(entity, 'Entity updated successfully');
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/[type]/[slug]
 * Delete an entity (requires authentication and ownership)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; slug: string }> }
) {
  try {
    const { type, slug } = await params;
    const entityType = getEntityType(type);

    if (!entityType) {
      return errorResponse('Invalid entity type', 400);
    }

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

    // Delete entity (ownership check is done in data-access)
    await deleteEntity(entityType, slug, user.id);

    return successResponse(null, 'Entity deleted successfully');
  } catch (error) {
    return handleError(error);
  }
}
