export const meta = {
  brand: `Voated`,
  slogan: `Vote on the G.O.A.T.!`,
  description: `Where student athletes showcase their game.`,
};

/**
 * Rate Limiting Configuration
 * All windows are in milliseconds
 */
export const rateLimit = {
  // Unauthenticated users (by IP address)
  unauthenticated: {
    // General API endpoints
    general: {
      requests: 100,
      window: 15 * 60 * 1000, // 15 minutes
    },
    // Search endpoints (more strict)
    search: {
      requests: 30,
      window: 60 * 1000, // 1 minute
    },
    // Mutation operations (more restrictive for unauthenticated)
    mutations: {
      requests: 5,
      window: 60 * 1000, // 1 minute
    },
    // Heavy operations
    heavy: {
      requests: 10,
      window: 60 * 1000, // 1 minute
    },
  },
  // Authenticated users (by user ID)
  authenticated: {
    // General API endpoints
    general: {
      requests: 1000,
      window: 15 * 60 * 1000, // 15 minutes
    },
    // Mutation operations (create, update, delete)
    mutations: {
      requests: 30,
      window: 60 * 1000, // 1 minute
    },
    // Search endpoints
    search: {
      requests: 100,
      window: 60 * 1000, // 1 minute
    },
    // Heavy operations
    heavy: {
      requests: 50,
      window: 60 * 1000, // 1 minute
    },
  },
} as const;

/**
 * API Configuration
 */
export const api = {
  // Default pagination limits
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
  // Cache durations (in seconds)
  cache: {
    sports: 3600, // 1 hour
    entities: 300, // 5 minutes (for public entity lists)
    clips: 60, // 1 minute
  },
} as const;

/**
 * Security Configuration
 */
export const security = {
  // Allow internal server-to-server calls to bypass some checks
  internalRequestSecret: process.env.INTERNAL_API_SECRET,
} as const;

/**
 * Helper to get rate limit config based on auth status and endpoint type
 */
export function getRateLimitConfig(
  authenticated: boolean,
  type: 'general' | 'search' | 'mutations' | 'heavy' = 'general'
): { requests: number; window: number } {
  if (authenticated) {
    return rateLimit.authenticated[type] || rateLimit.authenticated.general;
  }
  return rateLimit.unauthenticated[type] || rateLimit.unauthenticated.general;
}
