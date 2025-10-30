import { notFound } from "next/navigation";
import { searchEntities as searchEntitiesData } from "@/lib/data-access";
import NavigationHeader from "@/components/NavigationHeader";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";
import EntityCard from "@/components/EntityCard";
import { Metadata } from "next";
import { meta } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}): Promise<Metadata> {
  const params = await searchParams;
  const searchTerm = params.name || "";

  return {
    title: searchTerm
      ? `Search Results for "${searchTerm}" - ${meta.brand}`
      : `Search - ${meta.brand}`,
    description: `Search results for ${searchTerm} across sports, leagues, teams, players, and locations.`,
  };
}

// Refactored to use shared data access function
async function searchEntities(searchTerm: string) {
  if (!searchTerm || searchTerm.trim().length === 0) {
    return {
      sports: [],
      leagues: [],
      teams: [],
      players: [],
      locations: [],
    };
  }

  const normalizedSearch = searchTerm.toLowerCase().trim();

  // Use shared search function with specific entity types and limit
  const results = await searchEntitiesData(
    normalizedSearch,
    ['sport', 'league', 'team', 'player', 'location'],
    20
  );

  // Group results by type
  const sports = results.filter(e => e.type === 'sport');
  const leagues = results.filter(e => e.type === 'league');
  const teams = results.filter(e => e.type === 'team');
  const players = results.filter(e => e.type === 'player');
  const locations = results.filter(e => e.type === 'location');

  return {
    sports,
    leagues,
    teams,
    players,
    locations,
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const searchTerm = params.search || "";

  const results = await searchEntities(searchTerm);

  const totalResults =
    results.sports.length +
    results.leagues.length +
    results.teams.length +
    results.players.length +
    results.locations.length;

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Search", href: "/search" },
  ];

  // Define sections with their data
  const sections = [
    {
      id: "sports",
      title: "Sports",
      url: "/sports",
      count: results.sports.length,
      data: results.sports,
      entityType: "sport" as const,
      pluralType: "sports",
      gridCols: "lg:grid-cols-3",
    },
    {
      id: "leagues",
      title: "Leagues",
      url: "/leagues",
      count: results.leagues.length,
      data: results.leagues,
      entityType: "league" as const,
      pluralType: "leagues",
      gridCols: "lg:grid-cols-3",
    },
    {
      id: "teams",
      title: "Teams",
      url: "/teams",
      count: results.teams.length,
      data: results.teams,
      entityType: "team" as const,
      pluralType: "teams",
      gridCols: "lg:grid-cols-3",
    },
    {
      id: "players",
      title: "Players",
      url: "/players",
      count: results.players.length,
      data: results.players,
      entityType: "player" as const,
      pluralType: "players",
      gridCols: "lg:grid-cols-3",
    },
    {
      id: "locations",
      title: "Locations",
      url: "/locations",
      count: results.locations.length,
      data: results.locations,
      entityType: "location" as const,
      pluralType: "locations",
      gridCols: "lg:grid-cols-2",
    },
  ];

  // Sort sections by count (descending)
  const sortedSections = [...sections].sort((a, b) => b.count - a.count);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavigationHeader />

      <PageHeader
        title={searchTerm ? `Search Results for "${searchTerm}"` : "Search"}
        subtitle={
          searchTerm
            ? `Found ${totalResults} result${totalResults !== 1 ? "s" : ""}`
            : "Enter a search term to find sports, leagues, teams, players, and locations"
        }
        breadcrumbs={breadcrumbs}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
        <div className="w-full lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
          <div className="w-full lg:col-span-12 min-w-0 relative">
            {!searchTerm && (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-600">
                  Use the search bar in the header to search for sports,
                  leagues, teams, players, and locations
                </p>
              </div>
            )}

            {searchTerm && totalResults === 0 && (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-600">
                  No results found for &quot;{searchTerm}&quot;. Try a different
                  search term.
                </p>
              </div>
            )}

            {/* Dynamic Sections - Sorted by Result Count */}
            {searchTerm &&
              sortedSections.map((section) => (
                <div
                  key={section.id}
                  className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6"
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                    <a
                      href={section.url}
                      className="hover:text-green-600 hover:underline"
                    >
                      {section.title} ({section.count})
                    </a>
                  </h2>
                  {section.count === 0 ? (
                    <p className="w-full text-center text-gray-400 py-8">
                      No {section.title.toLowerCase()} found.
                    </p>
                  ) : (
                    <div
                      className={`grid grid-cols-1 sm:grid-cols-2 ${section.gridCols} gap-4`}
                    >
                      {section.data.map((entity: any) => (
                        <EntityCard
                          key={entity.id}
                          entity={{
                            id: entity.id,
                            name: entity.name || "Unnamed",
                            slug: entity.slug,
                            logo: entity.logo,
                            description: entity.description,
                            parent: entity.parent,
                            _count: entity._count,
                          }}
                          entityType={section.entityType}
                          pluralType={section.pluralType}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
