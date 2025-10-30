import Image from "next/image";
import prisma from "@/lib/prisma";
import NavigationHeader from "@/components/NavigationHeader";
import ClipsSection from "@/components/ClipsSection";
import Leaderboard from "@/components/Leaderboard";
import Footer from "@/components/Footer";
import Filter, { FilterConfig } from "@/components/Filter";
import FilterLoadingOverlay from "@/components/FilterLoadingOverlay";
import ActiveFilterPills from "@/components/ActiveFilterPills";
import CollapsibleSection from "@/components/CollapsibleSection";
import { Metadata } from "next";
import { getCachedSportsData } from "@/lib/sports-cache";
import { meta } from "@/lib/config";

export const metadata: Metadata = {
  title: `${meta.brand} - ${meta.slogan}`,
  description: meta.description,
  openGraph: {
    title: `${meta.brand} - ${meta.slogan}`,
    description: meta.description,
    type: "website",
  },
};

async function getHomeData(searchParams: Record<string, string>) {
  try {
    // Fetch all clips from player entities with full entity information
    const allClips = await prisma.clip.findMany({
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
          take: 1, // Get first entity who has this clip
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100, // Fetch more to account for filtering
    });

    // Filter clips based on search params
    let filteredClips = allClips.filter((clip) => clip.entityClips.length > 0);

    // Filter by sport
    if (searchParams.sport) {
      filteredClips = filteredClips.filter((clip) => {
        const entity = clip.entityClips[0]?.entity;
        if (!entity || entity.type !== "player") return false;

        return (entity as any).playerMemberships?.some((membership: any) => {
          let current: any = membership.team?.parent;
          while (current && current.type !== "sport") {
            current = current.parent;
          }
          return current?.slug === searchParams.sport;
        });
      });
    }

    // Filter by location
    if (searchParams.location) {
      filteredClips = filteredClips.filter((clip) => {
        const entity = clip.entityClips[0]?.entity;
        const metadata = entity?.metadata as any;
        return metadata?.locationSlug === searchParams.location;
      });
    }

    // Filter by school
    if (searchParams.school) {
      filteredClips = filteredClips.filter((clip) => {
        const entity = clip.entityClips[0]?.entity;
        const metadata = entity?.metadata as any;
        return metadata?.schoolSlug === searchParams.school;
      });
    }

    return filteredClips.slice(0, 20); // Return top 20 after filtering
  } catch (error) {
    console.error("Error fetching home data:", error);
    return [];
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const { mensSports, womensSports, coedSports } = await getCachedSportsData();
  const filters = await searchParams;
  const allClips = await getHomeData(filters);

  // Prepare clips for ClipsSection
  const formattedClips = allClips
    .filter((clip) => clip.entityClips.length > 0)
    .map((clip) => {
      const entityClip = clip.entityClips[0];
      const entity = entityClip.entity;
      return {
        clip: {
          ...clip,
          id: clip.id.toString(),
          createdAt: clip.createdAt,
        },
        playerName: entity.name || "Unknown",
        playerId: entity.id.toString(),
        playerSlug: entity.slug,
        playerAvatar: entity.logo,
        playerTags: [
          {
            name: entity.name || "Unknown",
            id: entity.id.toString(),
            slug: entity.slug,
            avatar: entity.logo,
          },
        ],
      };
    });

  // Prepare leaderboard data
  const leaderboardClips = formattedClips.slice(0, 10).map((clip, index) => {
    // Generate deterministic rank change based on clip ID (so it's consistent between server and client)
    const clipIdNum = parseInt(clip.clip.id);
    const rankChange = (clipIdNum % 7) - 3; // -3 to +3

    return {
      id: clip.clip.id,
      title: clip.clip.title,
      thumbnail: clip.clip.thumbnail,
      url: clip.clip.url,
      rank: index + 1,
      rankChange,
    };
  });

  // Build filter configuration for clips
  const filterConfig: FilterConfig = {};

  // Fetch all clips to build filter options (for counts)
  const allClipsForFilters = await prisma.clip.findMany({
    include: {
      entityClips: {
        include: {
          entity: {
            select: {
              id: true,
              type: true,
              metadata: true,
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
          },
        },
        take: 1,
      },
    },
    take: 500, // Get larger sample for filter options
  });

  // Helper to check if a clip matches filters (excluding specified filter type)
  const clipMatchesFilters = (clip: any, excludeFilterType?: string) => {
    const entity = clip.entityClips[0]?.entity;
    if (!entity) return false;

    // Check sport filter
    if (filters.sport && excludeFilterType !== "sport") {
      if (entity.type !== "player") return false;
      const sportMatches = (entity as any).playerMemberships?.some(
        (membership: any) => {
          let current: any = membership.team?.parent;
          while (current && current.type !== "sport") {
            current = current.parent;
          }
          return current?.slug === filters.sport;
        }
      );
      if (!sportMatches) return false;
    }

    // Check location filter
    if (filters.location && excludeFilterType !== "location") {
      const metadata = entity.metadata as any;
      const locationMatches = metadata?.locationSlug === filters.location;
      if (!locationMatches) return false;
    }

    // Check school filter
    if (filters.school && excludeFilterType !== "school") {
      const metadata = entity.metadata as any;
      const schoolMatches = metadata?.schoolSlug === filters.school;
      if (!schoolMatches) return false;
    }

    // Check position filter (only for player entities)
    if (filters.position && excludeFilterType !== "position") {
      if (entity.type !== "player") return false;
      const positionMatches = (entity as any).playerMemberships?.some(
        (membership: any) => {
          const positions = membership.positions as string[] | null;
          return positions?.includes(filters.position);
        }
      );
      if (!positionMatches) return false;
    }

    // Check age filter (only for player entities)
    if (filters.age && excludeFilterType !== "age") {
      if (entity.type !== "player") return false;
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

      const ageMatches = age.toString() === filters.age;
      if (!ageMatches) return false;
    }

    // Check grade filter (only for player entities)
    if (filters.grade && excludeFilterType !== "grade") {
      if (entity.type !== "player") return false;
      const metadata = entity.metadata as any;
      const gradeMatches = metadata?.grade === filters.grade;
      if (!gradeMatches) return false;
    }

    return true;
  };

  // Build sports list
  const sportsMap = new Map<string, string>();
  allClipsForFilters.forEach((clip) => {
    const entity = clip.entityClips[0]?.entity;
    if (
      entity &&
      entity.type === "player" &&
      (entity as any).playerMemberships
    ) {
      (entity as any).playerMemberships.forEach((membership: any) => {
        let current: any = membership.team?.parent;
        while (current && current.type !== "sport") {
          current = current.parent;
        }
        if (current && current.type === "sport") {
          sportsMap.set(current.slug, current.name);
        }
      });
    }
  });

  if (sportsMap.size > 1) {
    filterConfig.sports = Array.from(sportsMap.entries())
      .map(([slug, name]) => {
        const count = allClipsForFilters.filter((clip) => {
          const entity = clip.entityClips[0]?.entity;
          if (!entity || entity.type !== "player") return false;

          const sportMatches = (entity as any).playerMemberships?.some(
            (membership: any) => {
              let current: any = membership.team?.parent;
              while (current && current.type !== "sport") {
                current = current.parent;
              }
              return current?.slug === slug;
            }
          );

          return sportMatches && clipMatchesFilters(clip, "sport");
        }).length;

        return {
          value: slug,
          label: name,
          count,
        };
      })
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  // Build locations list
  const locationsMap = new Map<string, string>();
  allClipsForFilters.forEach((clip) => {
    const entity = clip.entityClips[0]?.entity;
    if (entity) {
      const metadata = entity.metadata as any;
      if (metadata?.locationSlug && metadata?.locationName) {
        locationsMap.set(metadata.locationSlug, metadata.locationName);
      }
    }
  });

  if (locationsMap.size > 1) {
    filterConfig.locations = Array.from(locationsMap.entries())
      .map(([slug, name]) => {
        const count = allClipsForFilters.filter((clip) => {
          const entity = clip.entityClips[0]?.entity;
          if (!entity) return false;
          const metadata = entity.metadata as any;
          const locationMatches = metadata?.locationSlug === slug;
          return locationMatches && clipMatchesFilters(clip, "location");
        }).length;

        return {
          value: slug,
          label: name,
          count,
        };
      })
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  // Build schools list
  const schoolsMap = new Map<string, string>();
  allClipsForFilters.forEach((clip) => {
    const entity = clip.entityClips[0]?.entity;
    if (entity) {
      const metadata = entity.metadata as any;
      if (metadata?.schoolSlug && metadata?.schoolName) {
        schoolsMap.set(metadata.schoolSlug, metadata.schoolName);
      }
    }
  });

  if (schoolsMap.size > 1) {
    filterConfig.schools = Array.from(schoolsMap.entries())
      .map(([slug, name]) => {
        const count = allClipsForFilters.filter((clip) => {
          const entity = clip.entityClips[0]?.entity;
          if (!entity) return false;
          const metadata = entity.metadata as any;
          const schoolMatches = metadata?.schoolSlug === slug;
          return schoolMatches && clipMatchesFilters(clip, "school");
        }).length;

        return {
          value: slug,
          label: name,
          count,
        };
      })
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  // Build filter labels mapping for pills
  const filterLabels: { [key: string]: string } = {};
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

  // Filter sports based on active filters
  let filteredMensSports = mensSports;
  let filteredWomensSports = womensSports;
  let filteredCoedSports = coedSports;

  // Check if any filters are active (excluding name filter)
  const hasRelevantFilters =
    filters.sport ||
    filters.location ||
    filters.school ||
    filters.position ||
    filters.age ||
    filters.grade;

  // If any filters are active, filter the sports list
  if (hasRelevantFilters) {
    // Get unique sports from clips that match the current filters
    const activeSportSlugs = new Set<string>();
    allClipsForFilters.forEach((clip) => {
      const entity = clip.entityClips[0]?.entity;
      if (!entity) return;

      // Check if this clip matches current filters (we don't exclude any filter type here)
      if (!clipMatchesFilters(clip)) return;

      // Extract sport from this clip
      if (entity.type === "player" && (entity as any).playerMemberships) {
        (entity as any).playerMemberships.forEach((membership: any) => {
          let current: any = membership.team?.parent;
          while (current && current.type !== "sport") {
            current = current.parent;
          }
          if (current && current.type === "sport") {
            activeSportSlugs.add(current.slug);
          }
        });
      }
    });

    // Only filter if we found any matching sports
    // If no sports match the filters, show all sports (rather than empty list)
    if (activeSportSlugs.size > 0) {
      filteredMensSports = mensSports.filter((sport) =>
        activeSportSlugs.has(sport.slug)
      );
      filteredWomensSports = womensSports.filter((sport) =>
        activeSportSlugs.has(sport.slug)
      );
      filteredCoedSports = coedSports.filter((sport) =>
        activeSportSlugs.has(sport.slug)
      );
    }
  }

  // Add gender filter with counts (must be after filtered sports are defined)
  filterConfig.gender = [
    {
      value: "mens",
      label: "Men's Sports",
      count: filteredMensSports.length,
    },
    {
      value: "womens",
      label: "Women's Sports",
      count: filteredWomensSports.length,
    },
    {
      value: "coed",
      label: "Coed Sports",
      count: filteredCoedSports.length,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavigationHeader />

      {/* Hero Section */}
      <div className="relative bg-linear-to-r from-green-600 to-blue-600 text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=600&fit=crop"
            alt="Sports team"
            fill
            className="object-cover opacity-50"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-13 sm:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              {meta.slogan}
            </h1>
            <p className="text-lg sm:text-xl mb-8 opacity-90">
              {meta.description}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {/* Mobile Filter - Shows at top on mobile */}
        <div className="lg:hidden mb-6">
          <Filter config={filterConfig} />
        </div>

        <div className="w-full lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
          {/* Left Column - Main Content */}
          <div className="w-full lg:col-span-8 min-w-0 relative">
            {/* Filter Loading Overlay - covers entire column */}
            <FilterLoadingOverlay />

            {/* Active Filter Pills - above all content */}
            <ActiveFilterPills filterLabels={filterLabels} />

            {/* Sports Section */}
            <CollapsibleSection
              title="All Sports"
              titleLink="/sports"
              showPreview={true}
              previewHeight="150px"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                {/* Men's Sports Column */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Men&apos;s Sports
                  </h3>
                  <ul className="space-y-2">
                    {filteredMensSports.map((sport) => {
                      return (
                        <li key={sport.id}>
                          <a
                            href={`/sports/${sport.slug}`}
                            className="text-green-600 hover:text-green-800 hover:underline flex items-center gap-2"
                          >
                            {sport.logo && (
                              <Image
                                src={sport.logo}
                                alt={`${sport.name} icon`}
                                width={20}
                                height={20}
                                className="object-contain brightness-0 saturate-100 opacity-100"
                                style={{
                                  filter:
                                    "invert(38%) sepia(96%) saturate(2526%) hue-rotate(101deg) brightness(98%) contrast(101%)",
                                }}
                              />
                            )}
                            {sport.name}
                          </a>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Coed Sports under Men's column */}
                  {filteredCoedSports.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Coed Sports
                      </h3>
                      <ul className="space-y-2">
                        {filteredCoedSports.map((sport) => {
                          return (
                            <li key={sport.id}>
                              <a
                                href={`/sports/${sport.slug}`}
                                className="text-green-600 hover:text-green-800 hover:underline flex items-center gap-2"
                              >
                                {sport.logo && (
                                  <Image
                                    src={sport.logo}
                                    alt={`${sport.name} icon`}
                                    width={20}
                                    height={20}
                                    className="object-contain brightness-0 saturate-100 opacity-100"
                                    style={{
                                      filter:
                                        "invert(38%) sepia(96%) saturate(2526%) hue-rotate(101deg) brightness(98%) contrast(101%)",
                                    }}
                                  />
                                )}
                                {sport.name}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Women's Sports Column */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Women&apos;s Sports
                  </h3>
                  <ul className="space-y-2">
                    {filteredWomensSports.map((sport) => {
                      return (
                        <li key={sport.id}>
                          <a
                            href={`/sports/${sport.slug}`}
                            className="text-green-600 hover:text-green-800 hover:underline flex items-center gap-2"
                          >
                            {sport.logo && (
                              <Image
                                src={sport.logo}
                                alt={`${sport.name} icon`}
                                width={20}
                                height={20}
                                className="object-contain brightness-0 saturate-100 opacity-100"
                                style={{
                                  filter:
                                    "invert(38%) sepia(96%) saturate(2526%) hue-rotate(101deg) brightness(98%) contrast(101%)",
                                }}
                              />
                            )}
                            {sport.name}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </CollapsibleSection>

            {/* Clips Section */}
            <ClipsSection clips={formattedClips} title="Latest Highlights" />
          </div>

          {/* Right Column - Filter & Leaderboard (Desktop Only) */}
          <div className="w-full hidden lg:block lg:col-span-4 min-w-0">
            <div className="sticky top-20 space-y-6">
              {/* Filter Component - Desktop */}
              <Filter config={filterConfig} />

              {/* Leaderboard */}
              <Leaderboard clips={leaderboardClips} title="Trending Now" />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
