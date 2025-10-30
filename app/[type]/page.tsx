import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import NavigationHeader from "@/components/NavigationHeader";
import PageHeader from "@/components/PageHeader";
import ClipsSection from "@/components/ClipsSection";
import Leaderboard from "@/components/Leaderboard";
import Footer from "@/components/Footer";
import EntityCard from "@/components/EntityCard";
import Filter, { FilterConfig, FilterOption } from "@/components/Filter";
import FilterLoadingOverlay from "@/components/FilterLoadingOverlay";
import ActiveFilterPills from "@/components/ActiveFilterPills";
import {
  getEntityType,
  getEntityDisplayName,
  pluralizeType,
} from "@/lib/entity-utils";
import { Metadata } from "next";
import { meta } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const entityType = getEntityType(type);

  if (!entityType) {
    return {
      title: "Not Found",
      description: "The requested page could not be found.",
    };
  }

  const displayName = getEntityDisplayName(entityType, true);

  return {
    title: displayName,
    description: `Browse all ${displayName.toLowerCase()} on ${
      meta.brand
    }. Discover sports highlights, stats, and more.`,
    openGraph: {
      title: `${displayName} | ${meta.brand}`,
      description: `Browse all ${displayName.toLowerCase()} on ${meta.brand}`,
      type: "website",
    },
  };
}

async function getEntitiesData(
  type: string,
  searchParams: Record<string, string>
) {
  try {
    const entityType = getEntityType(type);
    if (!entityType) return null;

    // Build where clause based on filters
    const where: any = { type: entityType };

    // Note: Name filtering will be done in memory for case-insensitive search

    const entities = await prisma.entity.findMany({
      where,
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
      orderBy: { name: "asc" },
    });

    // Apply filters in memory for metadata fields
    let filteredEntities = entities;

    // Filter by name (case-insensitive)
    if (searchParams.search) {
      const searchTerm = searchParams.search.toLowerCase();
      filteredEntities = filteredEntities.filter((entity) =>
        entity.name.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by gender (for sports only)
    if (searchParams.gender && entityType === "sport") {
      filteredEntities = filteredEntities.filter((entity) => {
        const metadata = entity.metadata as any;
        if (searchParams.gender === "mens") {
          return metadata?.mens === true;
        } else if (searchParams.gender === "womens") {
          return metadata?.womens === true;
        } else if (searchParams.gender === "coed") {
          return metadata?.coed === true;
        }
        return true;
      });
    }

    // Filter by sport
    if (searchParams.sport) {
      filteredEntities = filteredEntities.filter((entity) => {
        // For teams and leagues, check parent hierarchy
        if (entityType === "team" || entityType === "league") {
          let current = entity.parent;
          while (current) {
            if (
              current.type === "sport" &&
              current.slug === searchParams.sport
            ) {
              return true;
            }
            current = (current as any).parent;
          }
          return false;
        }
        // For players, check team memberships
        if (entityType === "player" && entity.playerMemberships) {
          return entity.playerMemberships.some((membership: any) => {
            const sport = membership.team?.parent?.parent;
            return sport?.slug === searchParams.sport;
          });
        }
        return true;
      });
    }

    // Filter by league
    if (searchParams.league) {
      filteredEntities = filteredEntities.filter((entity) => {
        if (entityType === "team") {
          return entity.parent?.slug === searchParams.league;
        }
        if (entityType === "player" && entity.playerMemberships) {
          return entity.playerMemberships.some((membership: any) => {
            return membership.team?.parent?.slug === searchParams.league;
          });
        }
        return true;
      });
    }

    // Filter by location
    if (searchParams.location) {
      if (entityType === "sport") {
        // For sports, find which sports have players matching this location
        const playersWithLocation = await prisma.entity.findMany({
          where: {
            type: "player",
            metadata: {
              path: "$.locationSlug",
              equals: searchParams.location,
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

        // Get unique sport slugs from these players
        const sportSlugsWithLocation = new Set<string>();
        playersWithLocation.forEach((player) => {
          (player as any).playerMemberships?.forEach((membership: any) => {
            const sport = membership.team?.parent?.parent;
            if (sport && sport.type === "sport") {
              sportSlugsWithLocation.add(sport.slug);
            }
          });
        });

        // Filter sports to only those with matching players
        filteredEntities = filteredEntities.filter((entity) =>
          sportSlugsWithLocation.has(entity.slug)
        );
      } else {
        filteredEntities = filteredEntities.filter((entity) => {
          const metadata = entity.metadata as any;
          return metadata?.locationSlug === searchParams.location;
        });
      }
    }

    // Filter by school
    if (searchParams.school) {
      if (entityType === "sport") {
        // For sports, find which sports have players matching this school
        const playersWithSchool = await prisma.entity.findMany({
          where: {
            type: "player",
            metadata: {
              path: "$.schoolSlug",
              equals: searchParams.school,
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

        // Get unique sport slugs from these players
        const sportSlugsWithSchool = new Set<string>();
        playersWithSchool.forEach((player) => {
          (player as any).playerMemberships?.forEach((membership: any) => {
            const sport = membership.team?.parent?.parent;
            if (sport && sport.type === "sport") {
              sportSlugsWithSchool.add(sport.slug);
            }
          });
        });

        // Filter sports to only those with matching players
        filteredEntities = filteredEntities.filter((entity) =>
          sportSlugsWithSchool.has(entity.slug)
        );
      } else {
        filteredEntities = filteredEntities.filter((entity) => {
          const metadata = entity.metadata as any;
          return metadata?.schoolSlug === searchParams.school;
        });
      }
    }

    // Filter by position (for players)
    if (searchParams.position && entityType === "player") {
      filteredEntities = filteredEntities.filter((entity) => {
        if (!entity.playerMemberships) return false;
        return entity.playerMemberships.some((membership: any) => {
          const positions = membership.positions as string[] | null;
          return positions?.includes(searchParams.position);
        });
      });
    }

    // Filter by age (for players)
    if (searchParams.age && entityType === "player") {
      filteredEntities = filteredEntities.filter((entity) => {
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

        return age.toString() === searchParams.age;
      });
    }

    // Filter by grade (for players)
    if (searchParams.grade && entityType === "player") {
      filteredEntities = filteredEntities.filter((entity) => {
        const metadata = entity.metadata as any;
        return metadata?.grade === searchParams.grade;
      });
    }

    return { entities: filteredEntities, entityType };
  } catch (error) {
    console.error("Error fetching entities:", error);
    return null;
  }
}

export default async function EntityListPage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams: Promise<Record<string, string>>;
}) {
  const { type } = await params;
  const filters = await searchParams;
  const data = await getEntitiesData(type, filters);

  if (!data) {
    notFound();
  }

  const { entities, entityType } = data;

  // Aggregate all clips from entities
  const allClips = entities.flatMap((entity) =>
    entity.clips.map(({ clip }) => ({
      clip: {
        ...clip,
        id: clip.id.toString(),
        createdAt: clip.createdAt,
      },
      playerName: entity.name,
      playerId: entity.id.toString(),
      playerSlug: entity.slug,
      playerAvatar: entity.logo,
      playerTags: [
        {
          name: entity.name,
          id: entity.id.toString(),
          slug: entity.slug,
          avatar: entity.logo,
        },
      ],
    }))
  );

  // Prepare leaderboard data
  const leaderboardClips = allClips.slice(0, 10).map((clip, index) => {
    // Generate deterministic rank change based on clip ID (so it's consistent between server and client)
    const clipIdNum =
      typeof clip.clip.id === "string" ? parseInt(clip.clip.id) : clip.clip.id;
    const rankChange = (clipIdNum % 7) - 3; // -3 to +3

    return {
      id: clip.clip.id.toString(),
      title: clip.clip.title,
      thumbnail: clip.clip.thumbnail,
      url: clip.clip.url,
      rank: index + 1,
      rankChange,
    };
  });

  const displayName = getEntityDisplayName(entityType, true);
  const pluralType = pluralizeType(entityType);

  // Helper function to check if entity matches filters (excluding specified filter type)
  const entityMatchesFilters = (
    entity: any,
    currentFilters: Record<string, string>,
    excludeFilterType?: string
  ) => {
    // Check sport filter
    if (currentFilters.sport && excludeFilterType !== "sport") {
      let sportMatches = false;
      if (entityType === "team" || entityType === "league") {
        let current = entity.parent;
        while (current && current.type !== "sport") {
          current = current.parent;
        }
        sportMatches = current?.slug === currentFilters.sport;
      } else if (entityType === "player") {
        sportMatches = entity.playerMemberships?.some((membership: any) => {
          let current = membership.team?.parent;
          while (current && current.type !== "sport") {
            current = current.parent;
          }
          return current?.slug === currentFilters.sport;
        });
      }
      if (!sportMatches) return false;
    }

    // Check league filter
    if (currentFilters.league && excludeFilterType !== "league") {
      let leagueMatches = false;
      if (entityType === "team") {
        leagueMatches = entity.parent?.slug === currentFilters.league;
      } else if (entityType === "player") {
        leagueMatches = entity.playerMemberships?.some(
          (membership: any) =>
            membership.team?.parent?.slug === currentFilters.league
        );
      }
      if (!leagueMatches) return false;
    }

    // Check location filter
    if (currentFilters.location && excludeFilterType !== "location") {
      const metadata = entity.metadata as any;
      const locationMatches =
        metadata?.locationSlug === currentFilters.location;
      if (!locationMatches) return false;
    }

    // Check school filter
    if (currentFilters.school && excludeFilterType !== "school") {
      const metadata = entity.metadata as any;
      const schoolMatches = metadata?.schoolSlug === currentFilters.school;
      if (!schoolMatches) return false;
    }

    // Check position filter
    if (currentFilters.position && excludeFilterType !== "position") {
      let positionMatches = false;
      if (entity.playerMemberships) {
        positionMatches = entity.playerMemberships.some((membership: any) => {
          const positions = membership.positions as string[] | null;
          return positions?.includes(currentFilters.position);
        });
      }
      if (!positionMatches) return false;
    }

    // Check age filter
    if (currentFilters.age && excludeFilterType !== "age") {
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

    // Check grade filter
    if (currentFilters.grade && excludeFilterType !== "grade") {
      const metadata = entity.metadata as any;
      const gradeMatches = metadata?.grade === currentFilters.grade;
      if (!gradeMatches) return false;
    }

    // Check gender filter (for sports only)
    if (currentFilters.gender && excludeFilterType !== "gender" && entityType === "sport") {
      const metadata = entity.metadata as any;
      let genderMatches = false;
      if (currentFilters.gender === "mens") {
        genderMatches = metadata?.mens === true;
      } else if (currentFilters.gender === "womens") {
        genderMatches = metadata?.womens === true;
      } else if (currentFilters.gender === "coed") {
        genderMatches = metadata?.coed === true;
      }
      if (!genderMatches) return false;
    }

    return true;
  };

  // Build filter configuration
  const filterConfig: FilterConfig = {
    showNameSearch: true,
  };

  // Fetch all entities to build filter options (without filters applied)
  const allEntitiesForFilters = await prisma.entity.findMany({
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

  // Build unique sports list (don't show on sports page)
  if (entityType !== "sport") {
    const sportsMap = new Map<string, string>();
    allEntitiesForFilters.forEach((entity) => {
      if (entityType === "team" || entityType === "league") {
        let current = entity.parent;
        while (current) {
          if (current.type === "sport") {
            sportsMap.set(current.slug, current.name);
            break;
          }
          current = (current as any).parent;
        }
      } else if (entityType === "player" && (entity as any).playerMemberships) {
        (entity as any).playerMemberships.forEach((membership: any) => {
          const sport = membership.team?.parent?.parent;
          if (sport) {
            sportsMap.set(sport.slug, sport.name);
          }
        });
      }
    });
    if (sportsMap.size > 1) {
      filterConfig.sports = Array.from(sportsMap.entries())
        .map(([slug, name]) => {
          // Count entities that would match if this sport is selected
          const count = allEntitiesForFilters.filter((entity) => {
            // Check if this entity matches this sport
            let sportMatches = false;
            if (entityType === "team" || entityType === "league") {
              let current: any = entity.parent;
              while (current && current.type !== "sport") {
                current = current.parent;
              }
              sportMatches = current?.slug === slug;
            } else if (entityType === "player") {
              sportMatches = (entity as any).playerMemberships.some(
                (membership: any) => {
                  let current = membership.team?.parent;
                  while (current && current.type !== "sport") {
                    current = current.parent;
                  }
                  return current?.slug === slug;
                }
              );
            }
            // Also check other active filters (excluding sport)
            return (
              sportMatches && entityMatchesFilters(entity, filters, "sport")
            );
          }).length;

          return {
            value: slug,
            label: name,
            count,
          };
        })
        .sort((a, b) => a.label.localeCompare(b.label));
    }
  }

  // Build unique leagues list (don't show on league page)
  if (
    entityType !== "league" &&
    (entityType === "team" || entityType === "player")
  ) {
    const leaguesMap = new Map<string, string>();
    allEntitiesForFilters.forEach((entity) => {
      if (entityType === "team" && entity.parent?.type === "league") {
        leaguesMap.set(entity.parent.slug, entity.parent.name);
      } else if (entityType === "player" && (entity as any).playerMemberships) {
        (entity as any).playerMemberships.forEach((membership: any) => {
          const league = membership.team?.parent;
          if (league) {
            leaguesMap.set(league.slug, league.name);
          }
        });
      }
    });
    if (leaguesMap.size > 1) {
      filterConfig.leagues = Array.from(leaguesMap.entries())
        .map(([slug, name]) => {
          // Count entities that would match if this league is selected
          const count = allEntitiesForFilters.filter((entity) => {
            // Check if this entity matches this league
            let leagueMatches = false;
            if (entityType === "team") {
              leagueMatches = entity.parent?.slug === slug;
            } else if (entityType === "player") {
              leagueMatches = (entity as any).playerMemberships?.some(
                (membership: any) => membership.team?.parent?.slug === slug
              );
            }
            // Also check other active filters (excluding league)
            return (
              leagueMatches && entityMatchesFilters(entity, filters, "league")
            );
          }).length;

          return {
            value: slug,
            label: name,
            count,
          };
        })
        .sort((a, b) => a.label.localeCompare(b.label));
    }
  }

  // Build unique locations list (don't show on location page)
  if (entityType !== "location") {
    const locationsMap = new Map<string, string>();

    if (entityType === "sport") {
      // For sports, fetch locations from players
      const playersWithLocations = await prisma.entity.findMany({
        where: {
          type: "player",
        },
        select: {
          metadata: true,
        },
      });

      playersWithLocations.forEach((player) => {
        const metadata = player.metadata as any;
        if (metadata?.locationSlug && metadata?.locationName) {
          locationsMap.set(metadata.locationSlug, metadata.locationName);
        }
      });
    } else {
      allEntitiesForFilters.forEach((entity) => {
        const metadata = entity.metadata as any;
        if (metadata?.locationSlug && metadata?.locationName) {
          locationsMap.set(metadata.locationSlug, metadata.locationName);
        }
      });
    }

    if (locationsMap.size > 1) {
      filterConfig.locations = Array.from(locationsMap.entries())
        .map(([slug, name]) => {
          let count = 0;

          if (entityType === "sport") {
            // For sports, count is not applicable since filtering affects which sports show
            count = allEntitiesForFilters.length;
          } else {
            // Count entities that would match if this location is selected
            count = allEntitiesForFilters.filter((entity) => {
              const metadata = entity.metadata as any;
              const locationMatches = metadata?.locationSlug === slug;
              // Also check other active filters (excluding location)
              return (
                locationMatches &&
                entityMatchesFilters(entity, filters, "location")
              );
            }).length;
          }

          return {
            value: slug,
            label: name,
            count,
          };
        })
        .sort((a, b) => a.label.localeCompare(b.label));
    }
  }

  // Build unique schools list (don't show on school page)
  if (entityType !== "school") {
    const schoolsMap = new Map<string, string>();

    if (entityType === "sport") {
      // For sports, fetch schools from players
      const playersWithSchools = await prisma.entity.findMany({
        where: {
          type: "player",
        },
        select: {
          metadata: true,
        },
      });

      playersWithSchools.forEach((player) => {
        const metadata = player.metadata as any;
        if (metadata?.schoolSlug && metadata?.schoolName) {
          schoolsMap.set(metadata.schoolSlug, metadata.schoolName);
        }
      });
    } else {
      allEntitiesForFilters.forEach((entity) => {
        const metadata = entity.metadata as any;
        if (metadata?.schoolSlug && metadata?.schoolName) {
          schoolsMap.set(metadata.schoolSlug, metadata.schoolName);
        }
      });
    }

    if (schoolsMap.size > 1) {
      filterConfig.schools = Array.from(schoolsMap.entries())
        .map(([slug, name]) => {
          let count = 0;

          if (entityType === "sport") {
            // For sports, count is not applicable since filtering affects which sports show
            count = allEntitiesForFilters.length;
          } else {
            // Count entities that would match if this school is selected
            count = allEntitiesForFilters.filter((entity) => {
              const metadata = entity.metadata as any;
              const schoolMatches = metadata?.schoolSlug === slug;
              // Also check other active filters (excluding school)
              return (
                schoolMatches && entityMatchesFilters(entity, filters, "school")
              );
            }).length;
          }

          return {
            value: slug,
            label: name,
            count,
          };
        })
        .sort((a, b) => a.label.localeCompare(b.label));
    }
  }

  // Build positions list (only for players)
  if (entityType === "player") {
    const positionsSet = new Set<string>();
    allEntitiesForFilters.forEach((entity) => {
      if ((entity as any).playerMemberships) {
        (entity as any).playerMemberships.forEach((membership: any) => {
          const positions = membership.positions as string[] | null;
          if (positions) {
            positions.forEach((pos: string) => positionsSet.add(pos));
          }
        });
      }
    });
    if (positionsSet.size > 0) {
      filterConfig.positions = Array.from(positionsSet)
        .sort()
        .map((pos) => {
          // Count entities that would match if this position is selected
          const count = allEntitiesForFilters.filter((entity) => {
            let positionMatches = false;
            if (entity.playerMemberships) {
              positionMatches = (entity as any).playerMemberships.some(
                (membership: any) => {
                  const positions = membership.positions as string[] | null;
                  return positions?.includes(pos);
                }
              );
            }
            // Also check other active filters (excluding position)
            return (
              positionMatches &&
              entityMatchesFilters(entity, filters, "position")
            );
          }).length;

          return {
            value: pos,
            label: pos,
            count,
          };
        });
    }
  }

  // Build ages list (only for players)
  if (entityType === "player") {
    const agesSet = new Set<number>();
    allEntitiesForFilters.forEach((entity) => {
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
      filterConfig.ages = Array.from(agesSet)
        .sort((a, b) => a - b)
        .map((age) => {
          // Count entities that would match if this age is selected
          const count = allEntitiesForFilters.filter((entity) => {
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
            // Also check other active filters (excluding age)
            return ageMatches && entityMatchesFilters(entity, filters, "age");
          }).length;

          return {
            value: age.toString(),
            label: `${age} years old`,
            count,
          };
        });
    }
  }

  // Build grades list (only for players)
  if (entityType === "player") {
    const gradesSet = new Set<string>();
    allEntitiesForFilters.forEach((entity) => {
      const metadata = entity.metadata as any;
      if (metadata?.grade) {
        gradesSet.add(metadata.grade);
      }
    });
    if (gradesSet.size > 0) {
      // Define grade order
      const gradeOrder = [
        "Freshman",
        "Sophomore",
        "Junior",
        "Senior",
        "Graduate",
      ];
      filterConfig.grades = Array.from(gradesSet)
        .sort((a, b) => {
          const aIndex = gradeOrder.indexOf(a);
          const bIndex = gradeOrder.indexOf(b);
          if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;
          return aIndex - bIndex;
        })
        .map((grade) => {
          // Count entities that would match if this grade is selected
          const count = allEntitiesForFilters.filter((entity) => {
            const metadata = entity.metadata as any;
            const gradeMatches = metadata?.grade === grade;
            // Also check other active filters (excluding grade)
            return (
              gradeMatches && entityMatchesFilters(entity, filters, "grade")
            );
          }).length;

          return {
            value: grade,
            label: grade,
            count,
          };
        });
    }
  }

  // Add gender filter (for sports only)
  if (entityType === "sport") {
    // Count sports by gender category
    const mensCount = allEntitiesForFilters.filter((entity) => {
      const metadata = entity.metadata as any;
      const isMens = metadata?.mens === true;
      return isMens && entityMatchesFilters(entity, filters, "gender");
    }).length;

    const womensCount = allEntitiesForFilters.filter((entity) => {
      const metadata = entity.metadata as any;
      const isWomens = metadata?.womens === true;
      return isWomens && entityMatchesFilters(entity, filters, "gender");
    }).length;

    const coedCount = allEntitiesForFilters.filter((entity) => {
      const metadata = entity.metadata as any;
      const isCoed = metadata?.coed === true;
      return isCoed && entityMatchesFilters(entity, filters, "gender");
    }).length;

    filterConfig.gender = [
      {
        value: "mens",
        label: "Men's Sports",
        count: mensCount,
      },
      {
        value: "womens",
        label: "Women's Sports",
        count: womensCount,
      },
      {
        value: "coed",
        label: "Coed Sports",
        count: coedCount,
      },
    ];
  }

  console.log("Final filter config for", entityType, ":", filterConfig);

  // Build filter labels mapping for pills (value -> label)
  const filterLabels: { [key: string]: string } = {};

  // Map all filter option values to their labels
  if (filterConfig.leagues) {
    filterConfig.leagues.forEach((opt) => {
      filterLabels[opt.value] = opt.label;
    });
  }
  if (filterConfig.sports) {
    filterConfig.sports.forEach((opt) => {
      filterLabels[opt.value] = opt.label;
    });
  }
  if (filterConfig.gender) {
    filterConfig.gender.forEach((opt) => {
      filterLabels[opt.value] = opt.label;
    });
  }
  if (filterConfig.locations) {
    filterConfig.locations.forEach((opt) => {
      filterLabels[opt.value] = opt.label;
    });
  }
  if (filterConfig.schools) {
    filterConfig.schools.forEach((opt) => {
      filterLabels[opt.value] = opt.label;
    });
  }
  if (filterConfig.positions) {
    filterConfig.positions.forEach((opt) => {
      filterLabels[opt.value] = opt.label;
    });
  }
  if (filterConfig.ages) {
    filterConfig.ages.forEach((opt) => {
      filterLabels[opt.value] = opt.label;
    });
  }
  if (filterConfig.grades) {
    filterConfig.grades.forEach((opt) => {
      filterLabels[opt.value] = opt.label;
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavigationHeader />

      <PageHeader
        title={displayName}
        subtitle={`Browse all ${displayName.toLowerCase()}`}
        breadcrumbs={[{ label: "Home", href: "/" }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
        {/* Mobile Filter - Shows at top on mobile */}
        <div className="lg:hidden mb-6">
          <Filter config={filterConfig} />
        </div>

        <div className="w-full lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
          <div className="w-full lg:col-span-8 min-w-0 relative">
            {/* Filter Loading Overlay - covers entire column */}
            <FilterLoadingOverlay />

            {/* Active Filter Pills - above all content */}
            <ActiveFilterPills filterLabels={filterLabels} />

            {/* Entities Grid */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                All {displayName}
              </h2>
              {entities.length === 0 ? (
                <p className="w-full text-center text-gray-400 py-8">
                  Nothing here yet.
                </p>
              ) : (
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 ${
                    entityType === "location" || entityType === "school"
                      ? "lg:grid-cols-2"
                      : "lg:grid-cols-3"
                  } gap-4`}
                >
                  {entities.map((entity) => (
                    <EntityCard
                      key={entity.id}
                      entity={entity}
                      entityType={entityType}
                      pluralType={pluralType}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Clips Section - Hide for players, schools, and locations list */}
            {entityType !== "player" &&
              entityType !== "school" &&
              entityType !== "location" && (
                <ClipsSection
                  clips={allClips}
                  title={`${displayName} Highlights`}
                />
              )}
          </div>

          {/* Right Column - Filter & Leaderboard (Desktop Only) */}
          <div className="w-full hidden lg:block lg:col-span-4 min-w-0">
            <div className="sticky top-20 space-y-6">
              {/* Filter Component - Desktop */}
              <Filter config={filterConfig} />

              {/* Leaderboard - Hide for players, schools, and locations list */}
              {entityType !== "player" &&
                entityType !== "school" &&
                entityType !== "location" && (
                  <Leaderboard
                    clips={leaderboardClips}
                    title={`Top ${displayName}`}
                  />
                )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
