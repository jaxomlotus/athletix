import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import NavigationHeader from "@/components/NavigationHeader";
import PageHeader from "@/components/PageHeader";
import ClipsSection from "@/components/ClipsSection";
import Leaderboard from "@/components/Leaderboard";
import Footer from "@/components/Footer";
import { getEntityType, getEntityDisplayName, pluralizeType } from "@/lib/entity-utils";

export const dynamic = 'force-dynamic';

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
        createdAt: clip.createdAt,
      },
      playerName: entity.name,
      playerId: entity.id.toString(),
      playerAvatar: entity.logo,
      playerTags: [
        {
          name: entity.name,
          id: entity.id.toString(),
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
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
                    <a
                      key={entity.id}
                      href={`/${pluralType}/${entity.slug}`}
                      className="flex flex-col gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
                    >
                      {entity.logo && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                          <img
                            src={entity.logo}
                            alt={entity.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
                          {entity.name}
                        </h3>
                        {entity.description && (
                          <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                            {entity.description}
                          </p>
                        )}
                        {entity.parent && (
                          <p className="text-xs text-gray-500 mt-1">
                            {entity.parent.name}
                          </p>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Clips Section */}
            {allClips.length > 0 && (
              <ClipsSection clips={allClips} title={`${displayName} Highlights`} />
            )}
          </div>

          {/* Right Column - Leaderboard */}
          {leaderboardClips.length > 0 && (
            <div className="hidden lg:block lg:col-span-4">
              <Leaderboard clips={leaderboardClips} title={`Top ${displayName}`} />
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
