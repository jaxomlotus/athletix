import { NextRequest } from 'next/server';
import { updateMembership, deleteMembership } from '@/lib/data-access';
import { requireAuth } from '@/lib/api-auth';
import { checkRateLimit } from '@/lib/rate-limit';
import {
  successResponse,
  errorResponse,
  handleError,
} from '@/lib/api-helpers';
import { updateMembershipSchema } from '@/lib/validation';

/**
 * PUT /api/memberships/[id]
 * Update a team membership (requires authentication and ownership)
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
    const rateLimit = checkRateLimit(request, user.id.toString(), 'mutations');
    if (!rateLimit.allowed) {
      return errorResponse('Rate limit exceeded', 429);
    }

    // Parse and validate ID
    const membershipId = parseInt(id, 10);
    if (isNaN(membershipId)) {
      return errorResponse('Invalid membership ID', 400);
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = updateMembershipSchema.parse(body);

    // Update membership (ownership check is done in data-access)
    const membership = await updateMembership(membershipId, validatedData, user.id.toString());

    return successResponse(membership, 'Membership updated successfully');
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/memberships/[id]
 * Delete a team membership (requires authentication and ownership)
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
    const rateLimit = checkRateLimit(request, user.id.toString(), 'mutations');
    if (!rateLimit.allowed) {
      return errorResponse('Rate limit exceeded', 429);
    }

    // Parse and validate ID
    const membershipId = parseInt(id, 10);
    if (isNaN(membershipId)) {
      return errorResponse('Invalid membership ID', 400);
    }

    // Delete membership (ownership check is done in data-access)
    await deleteMembership(membershipId, user.id.toString());

    return successResponse(null, 'Membership deleted successfully');
  } catch (error) {
    return handleError(error);
  }
}
