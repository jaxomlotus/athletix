import { NextRequest } from 'next/server';
import { getCachedSports } from '@/lib/data-access';
import { optionalAuth } from '@/lib/api-auth';
import { checkRateLimit } from '@/lib/rate-limit';
import {
  successResponse,
  errorResponse,
  handleError,
  getCacheHeaders,
} from '@/lib/api-helpers';
import { api } from '@/lib/config';

// This route must be dynamic because it uses authentication
export const dynamic = 'force-dynamic';

/**
 * GET /api/sports/cached
 * Get cached sports data with optional gender filter
 * Response is cached for 1 hour via Cache-Control headers
 */
export async function GET(request: NextRequest) {
  try {
    // Optional auth (for rate limiting)
    const user = await optionalAuth(request);

    // Check rate limit
    const rateLimit = checkRateLimit(request, user?.id || null, 'general');
    if (!rateLimit.allowed) {
      return errorResponse('Rate limit exceeded', 429);
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const gender = searchParams.get('gender') as 'mens' | 'womens' | 'coed' | null;

    // Validate gender if provided
    if (gender && !['mens', 'womens', 'coed'].includes(gender)) {
      return errorResponse('Invalid gender parameter. Must be one of: mens, womens, coed', 400);
    }

    // Fetch cached sports
    const sportsData = gender ? await getCachedSports(gender) : await getCachedSports();

    // Create response with cache headers
    const response = successResponse(sportsData);
    
    // Add cache headers (1 hour cache)
    const cacheHeaders = getCacheHeaders(api.cache.sports);
    cacheHeaders.forEach((value, key) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    return handleError(error);
  }
}
