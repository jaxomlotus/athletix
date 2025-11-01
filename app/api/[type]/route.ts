import { NextRequest } from 'next/server';
import { getEntitiesByType, createEntity } from '@/lib/data-access';
import { requireAuth, optionalAuth } from '@/lib/api-auth';
import { checkRateLimit } from '@/lib/rate-limit';
import {
  successResponse,
  paginatedResponse,
  errorResponse,
  handleError,
  getPaginationParams,
} from '@/lib/api-helpers';
import { createEntitySchema, entityFiltersSchema } from '@/lib/validation';
import { getEntityType } from '@/lib/entity-utils';

/**
 * GET /api/[type]
 * List entities by type with filters and pagination
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;
    const entityType = getEntityType(type);

    if (!entityType) {
      return errorResponse('Invalid entity type', 400);
    }

    // Optional auth (for rate limiting)
    const user = await optionalAuth(request);

    // Check rate limit
    const rateLimit = checkRateLimit(request, user?.id?.toString() || null, 'general');
    if (!rateLimit.allowed) {
      return errorResponse('Rate limit exceeded', 429);
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const pagination = getPaginationParams(searchParams);

    // Parse filters
    const filters = {
      search: searchParams.get('search') || undefined,
      sport: searchParams.get('sport') || undefined,
      league: searchParams.get('league') || undefined,
      location: searchParams.get('location') || undefined,
      school: searchParams.get('school') || undefined,
      gender: searchParams.get('gender') as 'mens' | 'womens' | 'coed' | undefined,
      parentId: searchParams.get('parentId') ? parseInt(searchParams.get('parentId')!, 10) : undefined,
    };

    // Validate filters
    const validatedFilters = entityFiltersSchema.parse(filters);

    // Fetch entities with follow status if user is authenticated
    const result = await getEntitiesByType(entityType, {
      ...validatedFilters,
      ...pagination,
      userId: user?.id?.toString(),
    });

    return paginatedResponse(
      result.entities,
      {
        page: result.page,
        limit: result.limit,
        total: result.total,
      }
    );
  } catch (error) {
    return handleError(error);
  }
}

/**
 * POST /api/[type]
 * Create a new entity (requires authentication)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;
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
    const rateLimit = checkRateLimit(request, user.id.toString(), 'mutations');
    if (!rateLimit.allowed) {
      return errorResponse('Rate limit exceeded', 429);
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createEntitySchema.parse({
      ...body,
      type: entityType, // Ensure type matches URL
    });

    // Create entity
    const entity = await createEntity(validatedData, user.id.toString());

    return successResponse(entity, 'Entity created successfully', 201);
  } catch (error) {
    return handleError(error);
  }
}
