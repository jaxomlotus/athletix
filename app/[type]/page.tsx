import { notFound } from "next/navigation";
import {
  getEntitiesWithAdvancedFilters,
  buildFilterOptions,
  type AdvancedEntityFilters,
} from "@/lib/data-access";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import NavigationHeader from "@/components/NavigationHeader";
import PageHeader from "@/components/PageHeader";
import ClipsSection from "@/components/ClipsSection";
import Leaderboard from "@/components/Leaderboard";
import Footer from "@/components/Footer";
import EntityCard from "@/components/EntityCard";
import Filter, { FilterConfig, FilterOption } from "@/components/Filter";
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

    // Build filters from search params
    const filters: AdvancedEntityFilters = {
      search: searchParams.search,
      sport: searchParams.sport,
      league: searchParams.league,
      location: searchParams.location,
      school: searchParams.school,
      position: searchParams.position,
      age: searchParams.age,
      grade: searchParams.grade,
      gender: searchParams.gender as 'mens' | 'womens' | 'coed' | undefined,
    };

    // Get current user session
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const userId = session?.user?.id || null;

    // Use backend filtering function with userId for follow status
    const entities = await getEntitiesWithAdvancedFilters(entityType, filters, userId);

    return { entities, entityType };
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

  // Build filters from search params
  const currentFilters: AdvancedEntityFilters = {
    search: filters.search,
    sport: filters.sport,
    league: filters.league,
    location: filters.location,
    school: filters.school,
    position: filters.position,
    age: filters.age,
    grade: filters.grade,
    gender: filters.gender as "mens" | "womens" | "coed" | undefined,
  };

  // Build filter configuration using backend function
  const filterConfig = await buildFilterOptions(entityType, currentFilters);
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
