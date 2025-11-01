import { NextRequest } from 'next/server';
import { getMemberships, createMembership } from '@/lib/data-access';
import { requireAuth, optionalAuth } from '@/lib/api-auth';
import { checkRateLimit } from '@/lib/rate-limit';
import {
  successResponse,
  errorResponse,
  handleError,
  getBooleanParam,
} from '@/lib/api-helpers';
import { createMembershipSchema, membershipFiltersSchema } from '@/lib/validation';

/**
 * GET /api/memberships
 * Get team memberships with filters
 */
export async function GET(request: NextRequest) {
  try {
    // Optional auth (for rate limiting)
    const user = await optionalAuth(request);

    // Check rate limit
    const rateLimit = checkRateLimit(request, user?.id?.toString() || null, 'general');
    if (!rateLimit.allowed) {
      return errorResponse('Rate limit exceeded', 429);
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const filters = {
      playerId: searchParams.get('playerId') ? parseInt(searchParams.get('playerId')!, 10) : undefined,
      teamId: searchParams.get('teamId') ? parseInt(searchParams.get('teamId')!, 10) : undefined,
      current: getBooleanParam(searchParams, 'current'),
      season: searchParams.get('season') || undefined,
    };

    // Validate filters
    const validatedFilters = membershipFiltersSchema.parse(filters);

    // Fetch memberships
    const memberships = await getMemberships(validatedFilters);

    return successResponse(memberships);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * POST /api/memberships
 * Create a new team membership (requires authentication)
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
    const rateLimit = checkRateLimit(request, user.id.toString(), 'mutations');
    if (!rateLimit.allowed) {
      return errorResponse('Rate limit exceeded', 429);
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createMembershipSchema.parse(body);

    // Create membership (ownership check is done in data-access)
    const membership = await createMembership(validatedData, user.id.toString());

    return successResponse(membership, 'Membership created successfully', 201);
  } catch (error) {
    return handleError(error);
  }
}
