import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

/**
 * Standard API response format
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Paginated API response format
 */
export interface PaginatedApiResponse<T = any> extends ApiResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Create a successful response
 */
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message && { message }),
    },
    { status }
  );
}

/**
 * Create a paginated successful response
 */
export function paginatedResponse<T>(
  data: T,
  pagination: {
    page: number;
    limit: number;
    total: number;
  },
  message?: string
): NextResponse<PaginatedApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      pagination: {
        ...pagination,
        totalPages: Math.ceil(pagination.total / pagination.limit),
      },
      ...(message && { message }),
    },
    { status: 200 }
  );
}

/**
 * Create an error response
 */
export function errorResponse(
  error: string,
  status: number = 400,
  details?: any
): NextResponse<ApiResponse> {
  const response: ApiResponse = {
    success: false,
    error,
  };

  // In development, include error details
  if (process.env.NODE_ENV === 'development' && details) {
    (response as any).details = details;
  }

  return NextResponse.json(response, { status });
}

/**
 * Handle errors and return appropriate response
 */
export function handleError(error: unknown): NextResponse<ApiResponse> {
  console.error('API Error:', error);

  // Zod validation error
  if (error instanceof ZodError) {
    return errorResponse(
      'Validation error',
      400,
      error.issues.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      }))
    );
  }

  // Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as any;
    
    // Unique constraint violation
    if (prismaError.code === 'P2002') {
      return errorResponse(
        'A record with this value already exists',
        409,
        prismaError.meta
      );
    }

    // Record not found
    if (prismaError.code === 'P2025') {
      return errorResponse('Record not found', 404);
    }

    // Foreign key constraint failed
    if (prismaError.code === 'P2003') {
      return errorResponse(
        'Invalid reference - related record not found',
        400,
        prismaError.meta
      );
    }
  }

  // Generic error
  if (error instanceof Error) {
    return errorResponse(
      process.env.NODE_ENV === 'development'
        ? error.message
        : 'An error occurred',
      500
    );
  }

  return errorResponse('An unexpected error occurred', 500);
}

/**
 * Extract and validate pagination parameters from URL
 */
export function getPaginationParams(
  searchParams: URLSearchParams,
  defaultLimit: number = 20,
  maxLimit: number = 100
): { page: number; limit: number; skip: number } {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(
    maxLimit,
    Math.max(1, parseInt(searchParams.get('limit') || String(defaultLimit), 10))
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

/**
 * Parse query parameter as array
 * Handles both comma-separated and multiple parameters
 * Examples: ?ids=1,2,3 or ?ids=1&ids=2&ids=3
 */
export function getArrayParam(
  searchParams: URLSearchParams,
  key: string
): string[] {
  const values = searchParams.getAll(key);
  
  if (values.length === 0) {
    return [];
  }

  // If single value with commas, split it
  if (values.length === 1 && values[0].includes(',')) {
    return values[0].split(',').map((v) => v.trim()).filter(Boolean);
  }

  // Multiple parameters or single value without commas
  return values.filter(Boolean);
}

/**
 * Parse boolean query parameter
 */
export function getBooleanParam(
  searchParams: URLSearchParams,
  key: string,
  defaultValue: boolean = false
): boolean {
  const value = searchParams.get(key);
  
  if (value === null) {
    return defaultValue;
  }

  return value === 'true' || value === '1';
}

/**
 * Sanitize string to prevent XSS
 * Next.js does this automatically in components, but good for API responses
 */
export function sanitizeString(str: string): string {
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Create cache headers for responses
 */
export function getCacheHeaders(maxAge: number): Headers {
  const headers = new Headers();
  headers.set('Cache-Control', `public, max-age=${maxAge}, s-maxage=${maxAge}`);
  return headers;
}

/**
 * Create no-cache headers for responses
 */
export function getNoCacheHeaders(): Headers {
  const headers = new Headers();
  headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  headers.set('Pragma', 'no-cache');
  headers.set('Expires', '0');
  return headers;
}
