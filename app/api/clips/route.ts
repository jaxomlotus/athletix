import { NextRequest } from 'next/server';
import { getClipsWithFilters, createClip } from '@/lib/data-access';
import { requireAuth, optionalAuth } from '@/lib/api-auth';
import { checkRateLimit } from '@/lib/rate-limit';
import {
  successResponse,
  paginatedResponse,
  errorResponse,
  handleError,
  getPaginationParams,
} from '@/lib/api-helpers';
import { createClipSchema, clipFiltersSchema } from '@/lib/validation';

/**
 * GET /api/clips
 * List clips with filters and pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Optional auth (for rate limiting purposes)
    const user = await optionalAuth(request);

    // Check rate limit
    const rateLimit = checkRateLimit(request, user?.id || null, 'general');
    if (!rateLimit.allowed) {
      return errorResponse('Rate limit exceeded', 429);
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const pagination = getPaginationParams(searchParams);

    // Parse filters
    const filters = {
      sport: searchParams.get('sport') || undefined,
      league: searchParams.get('league') || undefined,
      team: searchParams.get('team') || undefined,
      player: searchParams.get('player') || undefined,
      location: searchParams.get('location') || undefined,
      school: searchParams.get('school') || undefined,
      position: searchParams.get('position') || undefined,
      gender: searchParams.get('gender') as 'mens' | 'womens' | 'coed' | undefined,
    };

    // Validate filters
    const validatedFilters = clipFiltersSchema.parse(filters);

    // Fetch clips
    const result = await getClipsWithFilters({
      ...validatedFilters,
      ...pagination,
    });

    return paginatedResponse(
      result.clips,
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
 * POST /api/clips
 * Create a new clip (requires authentication)
 */
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return errorResponse(authResult.error, authResult.status);
    }

    const user = authResult.user;

    // Check rate limit (mutations are more strict)
    const rateLimit = checkRateLimit(request, user.id, 'mutations');
    if (!rateLimit.allowed) {
      return errorResponse('Rate limit exceeded', 429);
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createClipSchema.parse(body);

    // Create clip
    const clip = await createClip(validatedData, user.id);

    return successResponse(clip, 'Clip created successfully', 201);
  } catch (error) {
    return handleError(error);
  }
}
