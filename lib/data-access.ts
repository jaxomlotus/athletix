/**
 * Shared Data Access Layer
 * All database operations centralized here for use by both API routes and server components
 */

import { prisma } from './prisma';
import type { Prisma } from './generated/prisma-client';
import type {
  ClipFilters,
  EntityFilters,
  MembershipFilters,
  CreateClipInput,
  UpdateClipInput,
  CreateEntityInput,
  UpdateEntityInput,
  CreateMembershipInput,
  UpdateMembershipInput,
} from './validation';

// ============================================================================
// CLIPS
// ============================================================================

// ============================================================================
// FOLLOW STATUS HELPERS
// ============================================================================

/**
 * Check if a user follows specific entities
 * Returns a Map of entityId -> isFollowing
 */
async function getFollowStatusMap(userId: string | null | undefined, entityIds: number[]): Promise<Map<number, boolean>> {
  if (!userId || entityIds.length === 0) {
    return new Map();
  }

  const follows = await prisma.follow.findMany({
    where: {
      userId,
      entityId: {
        in: entityIds,
      },
    },
    select: {
      entityId: true,
    },
  });

  const followMap = new Map<number, boolean>();
  follows.forEach(follow => {
    followMap.set(follow.entityId, true);
  });

  return followMap;
}

/**
 * Attach follow status to a single entity
 */
function attachFollowStatus<T extends { id: number }>(
  entity: T,
  followMap: Map<number, boolean>
): T & { isFollowing?: boolean } {
  return {
    ...entity,
    isFollowing: followMap.get(entity.id) || false,
  };
}

/**
 * Attach follow status to multiple entities
 */
function attachFollowStatusToEntities<T extends { id: number }>(
  entities: T[],
  followMap: Map<number, boolean>
): (T & { isFollowing?: boolean })[] {
  return entities.map(entity => attachFollowStatus(entity, followMap));
}

// ============================================================================
// CLIPS
// ============================================================================

/**
 * Get clips with filters and pagination
 * Used by: Homepage, Clips API
 */
export async function getClipsWithFilters(
  filters: ClipFilters & { page?: number; limit?: number } = {}
) {
  const { page = 1, limit = 20, ...clipFilters } = filters;
  const skip = (page - 1) * limit;

  try {
    // Fetch clips with entity relationships
    const clips = await prisma.clip.findMany({
      include: {
        entityClips: {
          include: {
            entity: {
              select: {
                id: true,
                name: true,
                slug: true,
                logo: true,
                type: true,
                metadata: true,
                playerMemberships: {
                  where: { isCurrent: true },
                  include: {
                    team: {
                      select: {
                        parent: {
                          select: {
                            slug: true,
                            type: true,
                            parent: {
                              select: {
                                slug: true,
                                type: true,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        userClips: {
          select: {
            userId: true,
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100, // Fetch more for filtering
    });

    // Apply filters
    let filteredClips = clips.filter((clip) => clip.entityClips.length > 0);

    // Filter by sport
    if (clipFilters.sport) {
      filteredClips = filteredClips.filter((clip) => {
        const entity = clip.entityClips[0]?.entity;
        if (!entity || entity.type !== 'player') return false;

        return (entity as any).playerMemberships?.some((membership: any) => {
          let current: any = membership.team?.parent;
          while (current && current.type !== 'sport') {
            current = current.parent;
          }
          return current?.slug === clipFilters.sport;
        });
      });
    }

    // Filter by location
    if (clipFilters.location) {
      filteredClips = filteredClips.filter((clip) => {
        const entity = clip.entityClips[0]?.entity;
        const metadata = entity?.metadata as any;
        return metadata?.locationSlug === clipFilters.location;
      });
    }

    // Filter by school
    if (clipFilters.school) {
      filteredClips = filteredClips.filter((clip) => {
        const entity = clip.entityClips[0]?.entity;
        const metadata = entity?.metadata as any;
        return metadata?.schoolSlug === clipFilters.school;
      });
    }

    // Apply pagination
    const paginatedClips = filteredClips.slice(skip, skip + limit);
    const total = filteredClips.length;

    return {
      clips: paginatedClips,
      total,
      page,
      limit,
    };
  } catch (error) {
    console.error('Error fetching clips:', error);
    throw new Error('Failed to fetch clips');
  }
}

/**
 * Get single clip by ID
 */
export async function getClipById(id: number) {
  return prisma.clip.findUnique({
    where: { id },
    include: {
      entityClips: {
        include: {
          entity: true,
        },
      },
      userClips: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
    },
  });
}

/**
 * Create a new clip
 * Used by: Clips API
 */
export async function createClip(data: CreateClipInput, userId: string) {
  const { entityIds, ...clipData } = data;

  // Create clip
  const clip = await prisma.clip.create({
    data: {
      ...clipData,
      userClips: {
        create: {
          userId,
          order: 0,
        },
      },
      ...(entityIds && {
        entityClips: {
          create: entityIds.map((entityId, index) => ({
            entityId,
            order: index,
          })),
        },
      }),
    },
    include: {
      entityClips: {
        include: {
          entity: true,
        },
      },
      userClips: true,
    },
  });

  return clip;
}

/**
 * Update a clip
 * Used by: Clips API
 */
export async function updateClip(id: number, data: UpdateClipInput, userId: string) {
  const { entityIds, ...clipData } = data;

  // Verify ownership
  const userClip = await prisma.userClip.findFirst({
    where: { clipId: id, userId },
  });

  if (!userClip) {
    throw new Error('Clip not found or you do not own this clip');
  }

  // Update clip
  const clip = await prisma.clip.update({
    where: { id },
    data: {
      ...clipData,
      ...(entityIds && {
        entityClips: {
          deleteMany: {},
          create: entityIds.map((entityId, index) => ({
            entityId,
            order: index,
          })),
        },
      }),
    },
    include: {
      entityClips: {
        include: {
          entity: true,
        },
      },
      userClips: true,
    },
  });

  return clip;
}

/**
 * Delete a clip
 * Used by: Clips API
 */
export async function deleteClip(id: number, userId: string) {
  // Verify ownership
  const userClip = await prisma.userClip.findFirst({
    where: { clipId: id, userId },
  });

  if (!userClip) {
    throw new Error('Clip not found or you do not own this clip');
  }

  // Delete clip (cascades to entityClips and userClips)
  return prisma.clip.delete({
    where: { id },
  });
}

// ============================================================================
// ENTITIES
// ============================================================================

/**
 * Get entities by type with filters (simple version for API)
 * Used by: Entities API
 */
export async function getEntitiesByType(
  type: string,
  filters: EntityFilters & { page?: number; limit?: number; userId?: string | null } = {}
) {
  const { page = 1, limit = 20, search, userId, ...otherFilters } = filters;
  const skip = (page - 1) * limit;

  const where: Prisma.EntityWhereInput = {
    type,
    ...(search && {
      name: {
        contains: search,
      },
    }),
    ...(otherFilters.parentId && {
      parentId: otherFilters.parentId,
    }),
  };

  const [entities, total] = await Promise.all([
    prisma.entity.findMany({
      where,
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
            type: true,
            parent: {
              select: {
                id: true,
                name: true,
                slug: true,
                type: true,
              },
            },
          },
        },
        children: {
          select: {
            id: true,
            name: true,
            slug: true,
            type: true,
            gender: true,
          },
        },
        clips: {
          include: {
            clip: true,
          },
          orderBy: {
            order: 'asc',
          },
          take: 10,
        },
      },
      orderBy: {
        name: 'asc',
      },
      skip,
      take: limit,
    }),
    prisma.entity.count({ where }),
  ]);

  // Attach follow status if user is authenticated
  let entitiesWithFollowStatus = entities;
  if (userId) {
    const entityIds = entities.map(e => e.id);
    const followMap = await getFollowStatusMap(userId, entityIds);
    entitiesWithFollowStatus = attachFollowStatusToEntities(entities, followMap);
  }

  return {
    entities: entitiesWithFollowStatus,
    total,
    page,
    limit,
  };
}

/**
 * Advanced entity filtering with all UI filter options
 * Used by: Entity list pages (app/[type]/page.tsx)
 * Handles complex cross-entity queries and metadata filtering
 */
export interface AdvancedEntityFilters {
  search?: string;
  sport?: string;
  league?: string;
  location?: string;
  school?: string;
  position?: string;
  age?: string;
  grade?: string;
  gender?: 'mens' | 'womens' | 'coed';
}

export async function getEntitiesWithAdvancedFilters(
  entityType: string,
  filters: AdvancedEntityFilters,
  userId?: string | null
) {
  // Start with base query
  let entities = await prisma.entity.findMany({
    where: { type: entityType },
    include: {
      parent: {
        include: {
          parent: {
            include: {
              parent: true,
            },
          },
        },
      },
      children: true,
      clips: {
        include: {
          clip: true,
        },
      },
      playerMemberships: {
        where: { isCurrent: true },
        include: {
          team: {
            select: {
              id: true,
              name: true,
              slug: true,
              parent: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  type: true,
                  parent: {
                    select: {
                      id: true,
                      name: true,
                      slug: true,
                      type: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      _count: {
        select: { clips: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  // Apply filters
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    entities = entities.filter((entity) =>
      entity.name.toLowerCase().includes(searchTerm)
    );
  }

  // Gender filter (sports only)
  if (filters.gender && entityType === 'sport') {
    entities = entities.filter((entity) => {
      const metadata = entity.metadata as any;
      if (filters.gender === 'mens') return metadata?.mens === true;
      if (filters.gender === 'womens') return metadata?.womens === true;
      if (filters.gender === 'coed') return metadata?.coed === true;
      return true;
    });
  }

  // Sport filter
  if (filters.sport) {
    entities = entities.filter((entity) => {
      if (entityType === 'team' || entityType === 'league') {
        let current: any = entity.parent;
        while (current) {
          if (current.type === 'sport' && current.slug === filters.sport) {
            return true;
          }
          current = current.parent;
        }
        return false;
      }
      if (entityType === 'player' && (entity as any).playerMemberships) {
        return (entity as any).playerMemberships.some((membership: any) => {
          const sport = membership.team?.parent?.parent;
          return sport?.slug === filters.sport;
        });
      }
      return true;
    });
  }

  // League filter
  if (filters.league) {
    entities = entities.filter((entity) => {
      if (entityType === 'team') {
        return entity.parent?.slug === filters.league;
      }
      if (entityType === 'player' && (entity as any).playerMemberships) {
        return (entity as any).playerMemberships.some((membership: any) => {
          return membership.team?.parent?.slug === filters.league;
        });
      }
      return true;
    });
  }

  // Location filter
  if (filters.location) {
    if (entityType === 'sport') {
      // Special case: Find sports that have players with this location
      const playersWithLocation = await prisma.entity.findMany({
        where: {
          type: 'player',
          metadata: {
            path: '$.locationSlug',
            equals: filters.location,
          },
        },
        include: {
          playerMemberships: {
            where: { isCurrent: true },
            include: {
              team: {
                select: {
                  parent: {
                    select: {
                      parent: {
                        select: {
                          slug: true,
                          type: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      const sportSlugsWithLocation = new Set<string>();
      playersWithLocation.forEach((player) => {
        (player as any).playerMemberships?.forEach((membership: any) => {
          const sport = membership.team?.parent?.parent;
          if (sport && sport.type === 'sport') {
            sportSlugsWithLocation.add(sport.slug);
          }
        });
      });

      entities = entities.filter((entity) =>
        sportSlugsWithLocation.has(entity.slug)
      );
    } else {
      entities = entities.filter((entity) => {
        const metadata = entity.metadata as any;
        return metadata?.locationSlug === filters.location;
      });
    }
  }

  // School filter
  if (filters.school) {
    if (entityType === 'sport') {
      // Special case: Find sports that have players with this school
      const playersWithSchool = await prisma.entity.findMany({
        where: {
          type: 'player',
          metadata: {
            path: '$.schoolSlug',
            equals: filters.school,
          },
        },
        include: {
          playerMemberships: {
            where: { isCurrent: true },
            include: {
              team: {
                select: {
                  parent: {
                    select: {
                      parent: {
                        select: {
                          slug: true,
                          type: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      const sportSlugsWithSchool = new Set<string>();
      playersWithSchool.forEach((player) => {
        (player as any).playerMemberships?.forEach((membership: any) => {
          const sport = membership.team?.parent?.parent;
          if (sport && sport.type === 'sport') {
            sportSlugsWithSchool.add(sport.slug);
          }
        });
      });

      entities = entities.filter((entity) =>
        sportSlugsWithSchool.has(entity.slug)
      );
    } else {
      entities = entities.filter((entity) => {
        const metadata = entity.metadata as any;
        return metadata?.schoolSlug === filters.school;
      });
    }
  }

  // Position filter (players only)
  if (filters.position && entityType === 'player') {
    entities = entities.filter((entity) => {
      if (!(entity as any).playerMemberships) return false;
      return (entity as any).playerMemberships.some((membership: any) => {
        const positions = membership.positions as string[] | null;
        return positions?.includes(filters.position!);
      });
    });
  }

  // Age filter (players only)
  if (filters.age && entityType === 'player') {
    entities = entities.filter((entity) => {
      const metadata = entity.metadata as any;
      const birthdate = metadata?.birthdate
        ? new Date(metadata.birthdate)
        : null;
      if (!birthdate || isNaN(birthdate.getTime())) return false;

      const today = new Date();
      let age = today.getFullYear() - birthdate.getFullYear();
      const monthDiff = today.getMonth() - birthdate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthdate.getDate())
      ) {
        age--;
      }

      return age.toString() === filters.age;
    });
  }

  // Grade filter (players only)
  if (filters.grade && entityType === 'player') {
    entities = entities.filter((entity) => {
      const metadata = entity.metadata as any;
      return metadata?.grade === filters.grade;
    });
  }

  // Attach follow status if user is authenticated
  if (userId) {
    const entityIds = entities.map(e => e.id);
    const followMap = await getFollowStatusMap(userId, entityIds);
    return attachFollowStatusToEntities(entities, followMap);
  }

  return entities;
}

/**
 * Build filter options with counts for entity list pages
 * Handles interdependent filter counts (e.g., when sport is selected, league counts update)
 */
export interface FilterOption {
  value: string;
  label: string;
  count: number;
}

export interface FilterConfig {
  showNameSearch: boolean;
  sports?: FilterOption[];
  leagues?: FilterOption[];
  locations?: FilterOption[];
  schools?: FilterOption[];
  positions?: FilterOption[];
  ages?: FilterOption[];
  grades?: FilterOption[];
  gender?: FilterOption[];
}

export async function buildFilterOptions(
  entityType: string,
  currentFilters: AdvancedEntityFilters
): Promise<FilterConfig> {
  const config: FilterConfig = {
    showNameSearch: true,
  };

  // Fetch all entities of this type (unfiltered) for building options
  const allEntities = await prisma.entity.findMany({
    where: { type: entityType },
    include: {
      parent: {
        include: {
          parent: {
            include: {
              parent: true,
            },
          },
        },
      },
      playerMemberships: {
        where: { isCurrent: true },
        include: {
          team: {
            select: {
              parent: {
                select: {
                  name: true,
                  slug: true,
                  type: true,
                  parent: {
                    select: {
                      name: true,
                      slug: true,
                      type: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  // Helper to check if entity matches filters (excluding one filter type)
  const entityMatchesFilters = (
    entity: any,
    excludeFilter?: keyof AdvancedEntityFilters
  ): boolean => {
    // Sport filter
    if (currentFilters.sport && excludeFilter !== 'sport') {
      let sportMatches = false;
      if (entityType === 'team' || entityType === 'league') {
        let current: any = entity.parent;
        while (current && current.type !== 'sport') {
          current = current.parent;
        }
        sportMatches = current?.slug === currentFilters.sport;
      } else if (entityType === 'player') {
        sportMatches = entity.playerMemberships?.some((membership: any) => {
          let current = membership.team?.parent;
          while (current && current.type !== 'sport') {
            current = current.parent;
          }
          return current?.slug === currentFilters.sport;
        });
      }
      if (!sportMatches) return false;
    }

    // League filter
    if (currentFilters.league && excludeFilter !== 'league') {
      let leagueMatches = false;
      if (entityType === 'team') {
        leagueMatches = entity.parent?.slug === currentFilters.league;
      } else if (entityType === 'player') {
        leagueMatches = entity.playerMemberships?.some(
          (membership: any) =>
            membership.team?.parent?.slug === currentFilters.league
        );
      }
      if (!leagueMatches) return false;
    }

    // Location filter
    if (currentFilters.location && excludeFilter !== 'location') {
      const metadata = entity.metadata as any;
      const locationMatches = metadata?.locationSlug === currentFilters.location;
      if (!locationMatches) return false;
    }

    // School filter
    if (currentFilters.school && excludeFilter !== 'school') {
      const metadata = entity.metadata as any;
      const schoolMatches = metadata?.schoolSlug === currentFilters.school;
      if (!schoolMatches) return false;
    }

    // Position filter
    if (currentFilters.position && excludeFilter !== 'position') {
      let positionMatches = false;
      if (entity.playerMemberships) {
        positionMatches = entity.playerMemberships.some((membership: any) => {
          const positions = membership.positions as string[] | null;
          return positions?.includes(currentFilters.position!);
        });
      }
      if (!positionMatches) return false;
    }

    // Age filter
    if (currentFilters.age && excludeFilter !== 'age') {
      const metadata = entity.metadata as any;
      const birthdate = metadata?.birthdate
        ? new Date(metadata.birthdate)
        : null;
      if (!birthdate || isNaN(birthdate.getTime())) return false;

      const today = new Date();
      let age = today.getFullYear() - birthdate.getFullYear();
      const monthDiff = today.getMonth() - birthdate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthdate.getDate())
      ) {
        age--;
      }

      const ageMatches = age.toString() === currentFilters.age;
      if (!ageMatches) return false;
    }

    // Grade filter
    if (currentFilters.grade && excludeFilter !== 'grade') {
      const metadata = entity.metadata as any;
      const gradeMatches = metadata?.grade === currentFilters.grade;
      if (!gradeMatches) return false;
    }

    // Gender filter (sports only)
    if (currentFilters.gender && excludeFilter !== 'gender' && entityType === 'sport') {
      const metadata = entity.metadata as any;
      let genderMatches = false;
      if (currentFilters.gender === 'mens') {
        genderMatches = metadata?.mens === true;
      } else if (currentFilters.gender === 'womens') {
        genderMatches = metadata?.womens === true;
      } else if (currentFilters.gender === 'coed') {
        genderMatches = metadata?.coed === true;
      }
      if (!genderMatches) return false;
    }

    return true;
  };

  // Build sports filter (don't show on sports page)
  if (entityType !== 'sport') {
    const sportsMap = new Map<string, string>();
    allEntities.forEach((entity) => {
      if (entityType === 'team' || entityType === 'league') {
        let current: any = entity.parent;
        while (current) {
          if (current.type === 'sport') {
            sportsMap.set(current.slug, current.name);
            break;
          }
          current = current.parent;
        }
      } else if (entityType === 'player' && entity.playerMemberships) {
        entity.playerMemberships.forEach((membership: any) => {
          const sport = membership.team?.parent?.parent;
          if (sport) {
            sportsMap.set(sport.slug, sport.name);
          }
        });
      }
    });
    if (sportsMap.size > 1) {
      config.sports = Array.from(sportsMap.entries())
        .map(([slug, name]) => {
          const count = allEntities.filter((entity) => {
            let sportMatches = false;
            if (entityType === 'team' || entityType === 'league') {
              let current: any = entity.parent;
              while (current && current.type !== 'sport') {
                current = current.parent;
              }
              sportMatches = current?.slug === slug;
            } else if (entityType === 'player') {
              sportMatches = entity.playerMemberships.some(
                (membership: any) => {
                  let current = membership.team?.parent;
                  while (current && current.type !== 'sport') {
                    current = current.parent;
                  }
                  return current?.slug === slug;
                }
              );
            }
            return sportMatches && entityMatchesFilters(entity, 'sport');
          }).length;

          return { value: slug, label: name, count };
        })
        .sort((a, b) => a.label.localeCompare(b.label));
    }
  }

  // Build leagues filter (don't show on league page)
  if (
    entityType !== 'league' &&
    (entityType === 'team' || entityType === 'player')
  ) {
    const leaguesMap = new Map<string, string>();
    allEntities.forEach((entity) => {
      if (entityType === 'team' && entity.parent?.type === 'league') {
        leaguesMap.set(entity.parent.slug, entity.parent.name);
      } else if (entityType === 'player' && entity.playerMemberships) {
        entity.playerMemberships.forEach((membership: any) => {
          const league = membership.team?.parent;
          if (league) {
            leaguesMap.set(league.slug, league.name);
          }
        });
      }
    });
    if (leaguesMap.size > 1) {
      config.leagues = Array.from(leaguesMap.entries())
        .map(([slug, name]) => {
          const count = allEntities.filter((entity) => {
            let leagueMatches = false;
            if (entityType === 'team') {
              leagueMatches = entity.parent?.slug === slug;
            } else if (entityType === 'player') {
              leagueMatches = entity.playerMemberships?.some(
                (membership: any) => membership.team?.parent?.slug === slug
              );
            }
            return leagueMatches && entityMatchesFilters(entity, 'league');
          }).length;

          return { value: slug, label: name, count };
        })
        .sort((a, b) => a.label.localeCompare(b.label));
    }
  }

  // Build locations filter (don't show on location page)
  if (entityType !== 'location') {
    const locationsMap = new Map<string, string>();

    if (entityType === 'sport') {
      // For sports, fetch locations from players
      const playersWithLocations = await prisma.entity.findMany({
        where: { type: 'player' },
        select: { metadata: true },
      });

      playersWithLocations.forEach((player) => {
        const metadata = player.metadata as any;
        if (metadata?.locationSlug && metadata?.locationName) {
          locationsMap.set(metadata.locationSlug, metadata.locationName);
        }
      });
    } else {
      allEntities.forEach((entity) => {
        const metadata = entity.metadata as any;
        if (metadata?.locationSlug && metadata?.locationName) {
          locationsMap.set(metadata.locationSlug, metadata.locationName);
        }
      });
    }

    if (locationsMap.size > 1) {
      config.locations = Array.from(locationsMap.entries())
        .map(([slug, name]) => {
          let count = 0;
          if (entityType === 'sport') {
            count = allEntities.length;
          } else {
            count = allEntities.filter((entity) => {
              const metadata = entity.metadata as any;
              const locationMatches = metadata?.locationSlug === slug;
              return locationMatches && entityMatchesFilters(entity, 'location');
            }).length;
          }
          return { value: slug, label: name, count };
        })
        .sort((a, b) => a.label.localeCompare(b.label));
    }
  }

  // Build schools filter (don't show on school page)
  if (entityType !== 'school') {
    const schoolsMap = new Map<string, string>();

    if (entityType === 'sport') {
      const playersWithSchools = await prisma.entity.findMany({
        where: { type: 'player' },
        select: { metadata: true },
      });

      playersWithSchools.forEach((player) => {
        const metadata = player.metadata as any;
        if (metadata?.schoolSlug && metadata?.schoolName) {
          schoolsMap.set(metadata.schoolSlug, metadata.schoolName);
        }
      });
    } else {
      allEntities.forEach((entity) => {
        const metadata = entity.metadata as any;
        if (metadata?.schoolSlug && metadata?.schoolName) {
          schoolsMap.set(metadata.schoolSlug, metadata.schoolName);
        }
      });
    }

    if (schoolsMap.size > 1) {
      config.schools = Array.from(schoolsMap.entries())
        .map(([slug, name]) => {
          let count = 0;
          if (entityType === 'sport') {
            count = allEntities.length;
          } else {
            count = allEntities.filter((entity) => {
              const metadata = entity.metadata as any;
              const schoolMatches = metadata?.schoolSlug === slug;
              return schoolMatches && entityMatchesFilters(entity, 'school');
            }).length;
          }
          return { value: slug, label: name, count };
        })
        .sort((a, b) => a.label.localeCompare(b.label));
    }
  }

  // Build positions filter (players only)
  if (entityType === 'player') {
    const positionsSet = new Set<string>();
    allEntities.forEach((entity) => {
      if (entity.playerMemberships) {
        entity.playerMemberships.forEach((membership: any) => {
          const positions = membership.positions as string[] | null;
          if (positions) {
            positions.forEach((pos: string) => positionsSet.add(pos));
          }
        });
      }
    });
    if (positionsSet.size > 0) {
      config.positions = Array.from(positionsSet)
        .sort()
        .map((pos) => {
          const count = allEntities.filter((entity) => {
            let positionMatches = false;
            if (entity.playerMemberships) {
              positionMatches = entity.playerMemberships.some(
                (membership: any) => {
                  const positions = membership.positions as string[] | null;
                  return positions?.includes(pos);
                }
              );
            }
            return positionMatches && entityMatchesFilters(entity, 'position');
          }).length;

          return { value: pos, label: pos, count };
        });
    }
  }

  // Build ages filter (players only)
  if (entityType === 'player') {
    const agesSet = new Set<number>();
    allEntities.forEach((entity) => {
      const metadata = entity.metadata as any;
      const birthdate = metadata?.birthdate
        ? new Date(metadata.birthdate)
        : null;
      if (birthdate && !isNaN(birthdate.getTime())) {
        const today = new Date();
        let age = today.getFullYear() - birthdate.getFullYear();
        const monthDiff = today.getMonth() - birthdate.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthdate.getDate())
        ) {
          age--;
        }
        agesSet.add(age);
      }
    });
    if (agesSet.size > 0) {
      config.ages = Array.from(agesSet)
        .sort((a, b) => a - b)
        .map((age) => {
          const count = allEntities.filter((entity) => {
            const metadata = entity.metadata as any;
            const birthdate = metadata?.birthdate
              ? new Date(metadata.birthdate)
              : null;
            if (!birthdate || isNaN(birthdate.getTime())) return false;

            const today = new Date();
            let entityAge = today.getFullYear() - birthdate.getFullYear();
            const monthDiff = today.getMonth() - birthdate.getMonth();
            if (
              monthDiff < 0 ||
              (monthDiff === 0 && today.getDate() < birthdate.getDate())
            ) {
              entityAge--;
            }

            const ageMatches = entityAge === age;
            return ageMatches && entityMatchesFilters(entity, 'age');
          }).length;

          return {
            value: age.toString(),
            label: `${age} years old`,
            count,
          };
        });
    }
  }

  // Build grades filter (players only)
  if (entityType === 'player') {
    const gradesSet = new Set<string>();
    allEntities.forEach((entity) => {
      const metadata = entity.metadata as any;
      if (metadata?.grade) {
        gradesSet.add(metadata.grade);
      }
    });
    if (gradesSet.size > 0) {
      const gradeOrder = [
        'Freshman',
        'Sophomore',
        'Junior',
        'Senior',
        'Graduate',
      ];
      config.grades = Array.from(gradesSet)
        .sort((a, b) => {
          const aIndex = gradeOrder.indexOf(a);
          const bIndex = gradeOrder.indexOf(b);
          if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;
          return aIndex - bIndex;
        })
        .map((grade) => {
          const count = allEntities.filter((entity) => {
            const metadata = entity.metadata as any;
            const gradeMatches = metadata?.grade === grade;
            return gradeMatches && entityMatchesFilters(entity, 'grade');
          }).length;

          return { value: grade, label: grade, count };
        });
    }
  }

  // Build gender filter (sports only)
  if (entityType === 'sport') {
    const mensCount = allEntities.filter((entity) => {
      const metadata = entity.metadata as any;
      const isMens = metadata?.mens === true;
      return isMens && entityMatchesFilters(entity, 'gender');
    }).length;

    const womensCount = allEntities.filter((entity) => {
      const metadata = entity.metadata as any;
      const isWomens = metadata?.womens === true;
      return isWomens && entityMatchesFilters(entity, 'gender');
    }).length;

    const coedCount = allEntities.filter((entity) => {
      const metadata = entity.metadata as any;
      const isCoed = metadata?.coed === true;
      return isCoed && entityMatchesFilters(entity, 'gender');
    }).length;

    config.gender = [
      { value: 'mens', label: "Men's Sports", count: mensCount },
      { value: 'womens', label: "Women's Sports", count: womensCount },
      { value: 'coed', label: 'Coed Sports', count: coedCount },
    ];
  }

  return config;
}

/**
 * Get entity by slug and type
 * Used by: Entity detail pages, Entities API
 */
export async function getEntityBySlug(
  type: string,
  slug: string,
  userId?: string | null,
  season?: string | null
) {
  // Build membership filter based on season parameter
  // If season is provided, filter by that season
  // If season is null/undefined, show ALL memberships (no filter)
  const membershipWhere = season ? { season } : {};

  // Build clip filter based on season parameter
  // Filter clips by recordedAt (or createdAt as fallback) within the season date range
  let clipWhere = {};
  if (season) {
    const seasonYear = season.includes('-')
      ? parseInt(season.split('-')[0])
      : parseInt(season);

    const seasonStart = new Date(`${seasonYear}-09-01`);
    const seasonEnd = new Date(`${seasonYear + 1}-06-01`);

    // Filter clips where recordedAt (or createdAt if recordedAt is null) falls within season
    clipWhere = {
      OR: [
        {
          recordedAt: {
            gte: seasonStart,
            lte: seasonEnd,
          },
        },
        {
          recordedAt: null,
          createdAt: {
            gte: seasonStart,
            lte: seasonEnd,
          },
        },
      ],
    };
  }

  const entity = await prisma.entity.findUnique({
    where: {
      slug,
      type,
    },
    include: {
      parent: {
        select: {
          id: true,
          name: true,
          slug: true,
          type: true,
          parent: {
            select: {
              id: true,
              name: true,
              slug: true,
              type: true,
              parent: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  type: true,
                },
              },
            },
          },
        },
      },
      children: {
        select: {
          id: true,
          name: true,
          slug: true,
          type: true,
          logo: true,
          gender: true,
        },
      },
      clips: {
        where: {
          clip: clipWhere,
        },
        include: {
          clip: true,
        },
        orderBy: {
          order: 'asc',
        },
      },
      playerMemberships: {
        where: membershipWhere,
        include: {
          team: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
              parent: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  parent: {
                    select: {
                      id: true,
                      name: true,
                      slug: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      teamMembers: {
        where: membershipWhere,
        include: {
          player: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
            },
          },
        },
      },
    },
  });

  if (!entity) {
    return null;
  }

  // Attach follow status if user is authenticated
  if (userId) {
    const followMap = await getFollowStatusMap(userId, [entity.id]);
    return attachFollowStatus(entity, followMap);
  }

  return entity;
}

/**
 * Create a new entity
 * Used by: Entities API
 */
export async function createEntity(data: CreateEntityInput, userId: string) {
  return prisma.entity.create({
    data: {
      ...data,
      ownerId: userId,
    } as any,
    include: {
      parent: true,
      children: true,
    },
  });
}

/**
 * Update an entity
 * Used by: Entities API
 */
export async function updateEntity(
  type: string,
  slug: string,
  data: UpdateEntityInput,
  userId: string
) {
  // Verify entity exists and user owns it
  const entity = await prisma.entity.findUnique({
    where: { slug, type },
    select: { id: true, ownerId: true },
  });

  if (!entity) {
    throw new Error('Entity not found');
  }

  if (entity.ownerId !== userId) {
    throw new Error('You do not own this entity');
  }

  // Update entity
  return prisma.entity.update({
    where: { id: entity.id },
    data: data as any,
    include: {
      parent: true,
      children: true,
    },
  });
}

/**
 * Delete an entity
 * Used by: Entities API
 */
export async function deleteEntity(type: string, slug: string, userId: string) {
  // Verify entity exists and user owns it
  const entity = await prisma.entity.findUnique({
    where: { slug, type },
    select: { id: true, ownerId: true },
  });

  if (!entity) {
    throw new Error('Entity not found');
  }

  if (entity.ownerId !== userId) {
    throw new Error('You do not own this entity');
  }

  // Delete entity (cascades to children, clips, etc.)
  return prisma.entity.delete({
    where: { id: entity.id },
  });
}

// ============================================================================
// FOLLOWS
// ============================================================================

/**
 * Get user's follows
 * Used by: Follows API
 */
export async function getUserFollows(userId: string) {
  return prisma.follow.findMany({
    where: { userId },
    include: {
      entity: {
        select: {
          id: true,
          name: true,
          slug: true,
          type: true,
          logo: true,
        },
      },
    },
    orderBy: {
      followedAt: 'desc',
    },
  });
}

/**
 * Create a follow
 * Used by: Follows API
 */
export async function createFollow(userId: string, entityId: number) {
  // Check if entity exists
  const entity = await prisma.entity.findUnique({
    where: { id: entityId },
  });

  if (!entity) {
    throw new Error('Entity not found');
  }

  // Create follow (unique constraint prevents duplicates)
  const follow = await prisma.follow.create({
    data: {
      userId,
      entityId,
    },
    include: {
      entity: {
        select: {
          id: true,
          name: true,
          slug: true,
          type: true,
          logo: true,
        },
      },
    },
  });

  // Update follower count
  await prisma.entity.update({
    where: { id: entityId },
    data: {
      followerCount: {
        increment: 1,
      },
    },
  });

  return follow;
}

/**
 * Delete a follow
 * Used by: Follows API
 */
export async function deleteFollow(userId: string, entityId: number) {
  // Delete follow
  const follow = await prisma.follow.deleteMany({
    where: {
      userId,
      entityId,
    },
  });

  if (follow.count === 0) {
    throw new Error('Follow not found');
  }

  // Update follower count
  await prisma.entity.update({
    where: { id: entityId },
    data: {
      followerCount: {
        decrement: 1,
      },
    },
  });

  return follow;
}

// ============================================================================
// TEAM MEMBERSHIPS
// ============================================================================

/**
 * Get team memberships with filters
 * Used by: Memberships API
 */
export async function getMemberships(filters: MembershipFilters = {}) {
  const where: Prisma.TeamMembershipWhereInput = {
    ...(filters.playerId && { playerId: filters.playerId }),
    ...(filters.teamId && { teamId: filters.teamId }),
    ...(filters.current !== undefined && { isCurrent: filters.current }),
    ...(filters.season && { season: filters.season }),
  };

  return prisma.teamMembership.findMany({
    where,
    include: {
      player: {
        select: {
          id: true,
          name: true,
          slug: true,
          type: true,
          logo: true,
        },
      },
      team: {
        select: {
          id: true,
          name: true,
          slug: true,
          type: true,
          logo: true,
          parent: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
    },
    orderBy: [
      { isCurrent: 'desc' },
      { startDate: 'desc' },
    ],
  });
}

/**
 * Create a team membership
 * Used by: Memberships API
 */
export async function createMembership(data: CreateMembershipInput, userId: string) {
  // Verify user owns either the player or the team
  const [player, team] = await Promise.all([
    prisma.entity.findUnique({
      where: { id: data.playerId },
      select: { ownerId: true, type: true },
    }),
    prisma.entity.findUnique({
      where: { id: data.teamId },
      select: { ownerId: true, type: true },
    }),
  ]);

  if (!player || player.type !== 'player') {
    throw new Error('Invalid player');
  }

  if (!team || team.type !== 'team') {
    throw new Error('Invalid team');
  }

  if (player.ownerId !== userId && team.ownerId !== userId) {
    throw new Error('You must own the player or team to create this membership');
  }

  // Create membership
  return prisma.teamMembership.create({
    data: {
      playerId: data.playerId,
      teamId: data.teamId,
      jerseyNumber: data.jerseyNumber,
      positions: data.positions,
      season: data.season,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      isCurrent: data.isCurrent ?? true,
    },
    include: {
      player: true,
      team: true,
    },
  });
}

/**
 * Update a team membership
 * Used by: Memberships API
 */
export async function updateMembership(
  id: number,
  data: UpdateMembershipInput,
  userId: string
) {
  // Verify membership exists and user owns player or team
  const membership = await prisma.teamMembership.findUnique({
    where: { id },
    include: {
      player: {
        select: { ownerId: true },
      },
      team: {
        select: { ownerId: true },
      },
    },
  });

  if (!membership) {
    throw new Error('Membership not found');
  }

  const ownsPlayer = membership.player.ownerId === userId;
  const ownsTeam = membership.team.ownerId === userId;

  if (!ownsPlayer && !ownsTeam) {
    throw new Error('You must own the player or team to update this membership');
  }

  // Update membership
  return prisma.teamMembership.update({
    where: { id },
    data: {
      ...(data.jerseyNumber !== undefined && { jerseyNumber: data.jerseyNumber }),
      ...(data.positions && { positions: data.positions }),
      ...(data.season && { season: data.season }),
      ...(data.startDate !== undefined && { startDate: data.startDate ? new Date(data.startDate) : null }),
      ...(data.endDate !== undefined && { endDate: data.endDate ? new Date(data.endDate) : null }),
      ...(data.isCurrent !== undefined && { isCurrent: data.isCurrent }),
    },
    include: {
      player: true,
      team: true,
    },
  });
}

/**
 * Delete a team membership
 * Used by: Memberships API
 */
export async function deleteMembership(id: number, userId: string) {
  // Verify membership exists and user owns player or team
  const membership = await prisma.teamMembership.findUnique({
    where: { id },
    include: {
      player: {
        select: { ownerId: true },
      },
      team: {
        select: { ownerId: true },
      },
    },
  });

  if (!membership) {
    throw new Error('Membership not found');
  }

  const ownsPlayer = membership.player.ownerId === userId;
  const ownsTeam = membership.team.ownerId === userId;

  if (!ownsPlayer && !ownsTeam) {
    throw new Error('You must own the player or team to delete this membership');
  }

  // Delete membership
  return prisma.teamMembership.delete({
    where: { id },
  });
}

// ============================================================================
// SEASONS
// ============================================================================

/**
 * Get available seasons from team memberships
 * Used by: Entity detail pages for season filter
 */
export async function getAvailableSeasons(): Promise<string[]> {
  const memberships = await prisma.teamMembership.findMany({
    where: {
      season: {
        not: null,
      },
    },
    select: {
      season: true,
    },
    distinct: ['season'],
    orderBy: {
      season: 'desc',
    },
  });

  return memberships
    .map((m) => m.season)
    .filter((season): season is string => season !== null);
}

/**
 * Get available seasons for a specific entity (player or team)
 * Used by: Entity detail pages for season filter
 */
export async function getEntitySeasons(
  entityId: number,
  entityType: 'player' | 'team'
): Promise<string[]> {
  const whereClause =
    entityType === 'player' ? { playerId: entityId } : { teamId: entityId };

  const memberships = await prisma.teamMembership.findMany({
    where: {
      ...whereClause,
      season: {
        not: null,
      },
    },
    select: {
      season: true,
    },
    distinct: ['season'],
    orderBy: {
      season: 'desc',
    },
  });

  return memberships
    .map((m) => m.season)
    .filter((season): season is string => season !== null);
}

/**
 * Get available sports for a player
 * Used by: Player detail pages for sport filter
 */
export async function getPlayerSports(playerId: number): Promise<Array<{ slug: string; name: string }>> {
  const memberships = await prisma.teamMembership.findMany({
    where: {
      playerId,
    },
    include: {
      team: {
        include: {
          parent: {
            include: {
              parent: {
                select: {
                  id: true,
                  slug: true,
                  name: true,
                  type: true,
                },
              },
            },
          },
        },
      },
    },
  });

  // Extract unique sports (team -> league -> sport)
  const sportsMap = new Map<string, string>();

  memberships.forEach((m) => {
    const sport = m.team?.parent?.parent;
    if (sport && sport.type === 'sport') {
      sportsMap.set(sport.slug, sport.name);
    }
  });

  return Array.from(sportsMap.entries()).map(([slug, name]) => ({ slug, name }));
}

/**
 * Get entity stats for a specific entity (player, team, etc.)
 * Used by: Entity detail pages to display stats
 */
export async function getEntityStats(
  entityId: number,
  options: {
    season?: string | null;
    statsType?: 'normalized' | 'custom';
    includeCareer?: boolean;
  } = {}
) {
  const { season, statsType, includeCareer = false } = options;

  const where: any = {
    entityId,
  };

  if (statsType) {
    where.statsType = statsType;
  }

  // If a specific season is requested, get that season
  // If includeCareer is true, also get career stats
  // Otherwise, get all stats
  if (season && !includeCareer) {
    where.season = season;
  } else if (season && includeCareer) {
    where.OR = [{ season }, { season: 'career' }];
  }

  const stats = await prisma.entityStats.findMany({
    where,
    include: {
      template: {
        include: {
          sport: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          league: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
      parent: {
        select: {
          id: true,
          name: true,
          slug: true,
          type: true,
        },
      },
    },
    orderBy: [
      {
        season: 'desc',
      },
      {
        createdAt: 'desc',
      },
    ],
  });

  return stats;
}

// ============================================================================
// SPORTS CACHE
// ============================================================================

/**
 * Get cached sports data
 * Used by: Homepage, Sports API, various filters
 */
type Sport = {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
  metadata: any;
};

// Overload signatures
export async function getCachedSports(gender: 'mens' | 'womens' | 'coed'): Promise<Sport[]>;
export async function getCachedSports(): Promise<{
  sports: Sport[];
  mensSports: Sport[];
  womensSports: Sport[];
  coedSports: Sport[];
}>;

// Implementation
export async function getCachedSports(gender?: 'mens' | 'womens' | 'coed'): Promise<any> {
  const sports = await prisma.entity.findMany({
    where: {
      type: 'sport',
    },
    select: {
      id: true,
      name: true,
      slug: true,
      logo: true,
      metadata: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  // Filter by gender if specified
  if (gender) {
    return sports.filter((sport) => {
      const metadata = sport.metadata as any;
      return metadata?.[gender] === true;
    });
  }

  // Return categorized sports
  const mensSports = sports.filter((s) => (s.metadata as any)?.mens);
  const womensSports = sports.filter((s) => (s.metadata as any)?.womens);
  const coedSports = sports.filter((s) => (s.metadata as any)?.coed);

  return {
    sports,
    mensSports,
    womensSports,
    coedSports,
  };
}

// ============================================================================
// SEARCH
// ============================================================================

/**
 * Search entities across multiple types
 * Used by: Search page, Search suggestions API
 */
export async function searchEntities(
  query: string,
  types?: string[],
  limit: number = 10
) {
  const where: Prisma.EntityWhereInput = {
    name: {
      contains: query,
    },
    ...(types && types.length > 0 && {
      type: {
        in: types,
      },
    }),
  };

  return prisma.entity.findMany({
    where,
    select: {
      id: true,
      name: true,
      slug: true,
      type: true,
      logo: true,
      description: true,
      metadata: true,
      parent: {
        select: {
          id: true,
          name: true,
          slug: true,
          type: true,
        },
      },
      _count: {
        select: {
          clips: true,
        },
      },
    },
    orderBy: {
      followerCount: 'desc',
    },
    take: limit,
  });
}
