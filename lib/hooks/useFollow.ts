'use client';

import { useState } from 'react';
import { useSession } from '@/lib/auth-client';

interface UseFollowOptions {
  entityId: number;
  entityName: string;
  initialFollowStatus?: boolean;
  initialFollowerCount?: number;
  onAuthRequired?: () => void;
  onUnfollowRequest?: () => void;
}

interface UseFollowResult {
  isFollowing: boolean;
  followerCount: number;
  isLoading: boolean;
  error: string | null;
  toggleFollow: () => void;
  performUnfollow: () => Promise<void>;
}

/**
 * Custom hook for managing entity follow/unfollow functionality
 *
 * Features:
 * - Optimistic updates for instant UI feedback
 * - Auth check before follow/unfollow
 * - Error handling with rollback
 * - Loading states
 *
 * @example
 * const { isFollowing, isLoading, toggleFollow } = useFollow({
 *   entityId: entity.id,
 *   entityName: entity.name,
 *   initialFollowStatus: entity.isFollowing,
 *   onAuthRequired: () => setShowAuthModal(true)
 * });
 */
export function useFollow({
  entityId,
  entityName,
  initialFollowStatus = false,
  initialFollowerCount = 0,
  onAuthRequired,
  onUnfollowRequest,
}: UseFollowOptions): UseFollowResult {
  const { data: session } = useSession();
  const [isFollowing, setIsFollowing] = useState(initialFollowStatus);
  const [followerCount, setFollowerCount] = useState(initialFollowerCount);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performFollow = async () => {
    setIsLoading(true);
    setError(null);

    // Optimistic update
    const previousFollowState = isFollowing;
    const previousFollowerCount = followerCount;
    setIsFollowing(true);
    setFollowerCount(followerCount + 1);

    try {
      const response = await fetch('/api/follows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entityId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to follow');
      }
    } catch (err) {
      // Rollback optimistic update on error
      setIsFollowing(previousFollowState);
      setFollowerCount(previousFollowerCount);
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Follow error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const performUnfollow = async () => {
    setIsLoading(true);
    setError(null);

    // Optimistic update
    const previousFollowState = isFollowing;
    const previousFollowerCount = followerCount;
    setIsFollowing(false);
    setFollowerCount(Math.max(0, followerCount - 1)); // Ensure it doesn't go below 0

    try {
      const response = await fetch(`/api/follows/${entityId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to unfollow');
      }
    } catch (err) {
      // Rollback optimistic update on error
      setIsFollowing(previousFollowState);
      setFollowerCount(previousFollowerCount);
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Unfollow error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFollow = () => {
    // Check if user is authenticated
    if (!session?.user) {
      if (onAuthRequired) {
        onAuthRequired();
      }
      return;
    }

    if (isFollowing) {
      // Request confirmation before unfollowing
      if (onUnfollowRequest) {
        onUnfollowRequest();
      } else {
        // If no confirmation callback, unfollow directly
        performUnfollow();
      }
    } else {
      // Follow directly without confirmation
      performFollow();
    }
  };

  return {
    isFollowing,
    followerCount,
    isLoading,
    error,
    toggleFollow,
    performUnfollow,
  };
}
