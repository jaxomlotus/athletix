import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import NavigationHeader from "@/components/NavigationHeader";
import PageHeader from "@/components/PageHeader";
import ClipsSection from "@/components/ClipsSection";
import Leaderboard from "@/components/Leaderboard";
import Footer from "@/components/Footer";
import EntityCard from "@/components/EntityCard";
import { getEntityType, getEntityDisplayName, pluralizeType } from "@/lib/entity-utils";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

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
    description: `Browse all ${displayName.toLowerCase()} on Athletix. Discover sports highlights, stats, and more.`,
    openGraph: {
      title: `${displayName} | Athletix`,
      description: `Browse all ${displayName.toLowerCase()} on Athletix`,
      type: "website",
    },
  };
}

async function getEntitiesData(type: string) {
  try {
    const entityType = getEntityType(type);
    if (!entityType) return null;

    const entities = await prisma.entity.findMany({
      where: { type: entityType },
      include: {
        parent: true,
        children: true,
        clips: {
          include: {
            clip: true,
          },
        },
        _count: {
          select: { clips: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return { entities, entityType };
  } catch (error) {
    console.error("Error fetching entities:", error);
    return null;
  }
}

export default async function EntityListPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const data = await getEntitiesData(type);

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
  const leaderboardClips = allClips.slice(0, 10).map((clip, index) => ({
    id: clip.clip.id.toString(),
    title: clip.clip.title,
    thumbnail: clip.clip.thumbnail,
    url: clip.clip.url,
    rank: index + 1,
    rankChange: Math.floor(Math.random() * 7) - 3,
  }));

  const displayName = getEntityDisplayName(entityType, true);
  const pluralType = pluralizeType(entityType);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavigationHeader />

      <PageHeader
        title={displayName}
        subtitle={`Browse all ${displayName.toLowerCase()}`}
        breadcrumbs={[{ label: "Home", href: "/" }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
        <div className={`w-full ${entityType !== 'player' && entityType !== 'school' && entityType !== 'location' ? 'lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start' : ''}`}>
          <div className={`w-full ${entityType !== 'player' && entityType !== 'school' && entityType !== 'location' ? 'lg:col-span-8' : ''} min-w-0`}>
            {/* Entities Grid */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                All {displayName}
              </h2>
              {entities.length === 0 ? (
                <p className="w-full text-center text-gray-400 py-8">Nothing here yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
            {entityType !== 'player' && entityType !== 'school' && entityType !== 'location' && (
              <ClipsSection clips={allClips} title={`${displayName} Highlights`} />
            )}
          </div>

          {/* Right Column - Leaderboard - Hide for players, schools, and locations list */}
          {entityType !== 'player' && entityType !== 'school' && entityType !== 'location' && (
            <div className="w-full hidden lg:block lg:col-span-4 min-w-0">
              <Leaderboard clips={leaderboardClips} title={`Top ${displayName}`} />
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
