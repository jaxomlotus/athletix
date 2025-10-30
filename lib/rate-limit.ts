import { NextRequest } from 'next/server';
import { getRateLimitConfig } from './config';

/**
 * Simple in-memory rate limiter
 * For production with multiple servers, consider using Redis
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// Store rate limit data in memory
// Key format: "ip:endpoint" or "user:userId:endpoint"
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Get client identifier (IP address)
 */
function getClientId(request: NextRequest): string {
  // Try to get real IP from various headers
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback to a default value (shouldn't happen in production)
  return 'unknown';
}

/**
 * Check rate limit for a request
 * Returns { allowed: true } if request is allowed
 * Returns { allowed: false, retryAfter: seconds } if rate limited
 */
export function checkRateLimit(
  request: NextRequest,
  userId: string | null,
  type: 'general' | 'search' | 'mutations' | 'heavy' = 'general'
): { allowed: boolean; retryAfter?: number; remaining?: number } {
  const now = Date.now();
  
  // Get rate limit config based on auth status
  const config = getRateLimitConfig(userId !== null, type);
  
  // Generate unique key
  let key: string;
  if (userId) {
    key = `user:${userId}:${type}`;
  } else {
    const clientId = getClientId(request);
    key = `ip:${clientId}:${type}`;
  }

  // Get or create entry
  let entry = rateLimitStore.get(key);
  
  if (!entry || entry.resetAt < now) {
    // Create new entry
    entry = {
      count: 0,
      resetAt: now + config.window,
    };
    rateLimitStore.set(key, entry);
  }

  // Increment counter
  entry.count++;

  // Check if over limit
  if (entry.count > config.requests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return {
      allowed: false,
      retryAfter,
    };
  }

  // Calculate remaining requests
  const remaining = config.requests - entry.count;

  return {
    allowed: true,
    remaining,
  };
}

/**
 * Rate limit middleware wrapper
 * Use this in API routes to apply rate limiting
 */
export function withRateLimit(
  handler: (request: NextRequest, userId: string | null) => Promise<Response>,
  type: 'general' | 'search' | 'mutations' | 'heavy' = 'general'
) {
  return async (request: NextRequest, userId: string | null): Promise<Response> => {
    const result = checkRateLimit(request, userId, type);

    if (!result.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          retryAfter: result.retryAfter,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(result.retryAfter),
          },
        }
      );
    }

    // Set rate limit headers
    const response = await handler(request, userId);
    
    if (result.remaining !== undefined) {
      response.headers.set('X-RateLimit-Remaining', String(result.remaining));
    }

    return response;
  };
}

/**
 * Get rate limit status for a request without incrementing
 * Useful for checking status without consuming a request
 */
export function getRateLimitStatus(
  request: NextRequest,
  userId: string | null,
  type: 'general' | 'search' | 'mutations' | 'heavy' = 'general'
): { remaining: number; resetAt: number; limit: number } {
  const now = Date.now();
  const config = getRateLimitConfig(userId !== null, type);
  
  let key: string;
  if (userId) {
    key = `user:${userId}:${type}`;
  } else {
    const clientId = getClientId(request);
    key = `ip:${clientId}:${type}`;
  }

  const entry = rateLimitStore.get(key);
  
  if (!entry || entry.resetAt < now) {
    return {
      remaining: config.requests,
      resetAt: now + config.window,
      limit: config.requests,
    };
  }

  return {
    remaining: Math.max(0, config.requests - entry.count),
    resetAt: entry.resetAt,
    limit: config.requests,
  };
}
