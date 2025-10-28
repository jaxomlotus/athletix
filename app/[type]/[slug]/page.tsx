import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import NavigationHeader from "@/components/NavigationHeader";
import PageHeader from "@/components/PageHeader";
import PlayerHeader from "@/components/PlayerHeader";
import ClipsSection from "@/components/ClipsSection";
import Leaderboard from "@/components/Leaderboard";
import Footer from "@/components/Footer";
import RankBadge from "@/components/RankBadge";
import { getEntityType, getEntityDisplayName, pluralizeType, getChildEntityType } from "@/lib/entity-utils";

export const dynamic = 'force-dynamic';

async function getEntityData(type: string, slug: string) {
  try {
    const entityType = getEntityType(type);
    if (!entityType) return null;

    const entity = await prisma.entity.findUnique({
      where: { slug, type: entityType },
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
        children: {
          include: {
            children: {
              include: {
                clips: {
                  include: {
                    clip: true,
                  },
                },
              },
            },
            clips: {
              include: {
                clip: true,
              },
            },
          },
        },
        clips: {
          include: {
            clip: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return { entity, entityType };
  } catch (error) {
    console.error("Error fetching entity:", error);
    return null;
  }
}

function buildBreadcrumbs(entity: any) {
  const crumbs: Array<{ label: string; href: string }> = [{ label: "Home", href: "/" }];

  // Build breadcrumb trail from parents
  const parents: any[] = [];
  let current = entity.parent;
  while (current) {
    parents.unshift(current);
    current = current.parent;
  }

  parents.forEach((parent) => {
    const parentType = pluralizeType(parent.type);
    crumbs.push({
      label: parent.name,
      href: `/${parentType}/${parent.slug}`,
    });
  });

  return crumbs;
}

export default async function EntityDetailPage({
  params,
}: {
  params: Promise<{ type: string; slug: string }>;
}) {
  const { type, slug } = await params;
  const data = await getEntityData(type, slug);

  if (!data || !data.entity) {
    notFound();
  }

  const { entity, entityType } = data;
  const metadata = (entity.metadata || {}) as any;
  const childType = getChildEntityType(entityType);

  // Aggregate clips from entity and its children
  const entityClips = entity.clips.map(({ clip }: any) => ({
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
  }));

  const childClips = entity.children?.flatMap((child: any) =>
    child.clips?.map(({ clip }: any) => ({
      clip: {
        ...clip,
        createdAt: clip.createdAt,
      },
      playerName: child.name,
      playerId: child.id.toString(),
      playerAvatar: child.logo,
      playerTags: [
        {
          name: child.name,
          id: child.id.toString(),
          avatar: child.logo,
        },
      ],
    })) || []
  ) || [];

  const allClips = [...entityClips, ...childClips];

  // Prepare leaderboard
  const leaderboardClips = allClips.slice(0, 10).map((clip, index) => ({
    id: clip.clip.id.toString(),
    title: clip.clip.title,
    thumbnail: clip.clip.thumbnail,
    url: clip.clip.url,
    rank: index + 1,
    rankChange: Math.floor(Math.random() * 7) - 3,
  }));

  const breadcrumbs = buildBreadcrumbs(entity);
  const displayName = getEntityDisplayName(entityType);

  // For players, use PlayerHeader
  if (entityType === 'player') {
    const teamName = entity.parent?.name;
    const leagueName = entity.parent?.parent?.name;
    const sportName = entity.parent?.parent?.parent?.name;

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <NavigationHeader />

        <PlayerHeader
          name={entity.name}
          displayName={metadata.displayName || entity.name}
          avatar={entity.logo || undefined}
          bannerImage={entity.banner || undefined}
          bio={entity.description || undefined}
          position={metadata.position}
          jerseyNumber={metadata.jerseyNumber}
          teamName={teamName}
          leagueName={leagueName}
          sportName={sportName}
          socialLinks={metadata.socialLinks}
          followerCount={entity.followerCount}
          breadcrumbs={breadcrumbs}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-8">
              {/* Stats Section for Players */}
              {metadata.stats && (
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Stats</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {Object.entries(metadata.stats).map(([key, value]) => (
                      <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">{String(value)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <ClipsSection clips={allClips} title="Highlights" />
            </div>

            <div className="hidden lg:block lg:col-span-4">
              <Leaderboard clips={leaderboardClips} title="Top Clips" />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // For non-player entities, use standard PageHeader
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavigationHeader />

      <PageHeader
        title={entity.name}
        subtitle={entity.description || undefined}
        breadcrumbs={breadcrumbs}
        logoUrl={entity.logo || undefined}
        bannerUrl={entity.banner || undefined}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            {/* Children Section */}
            {entity.children && entity.children.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                  {entity.childEntities || getEntityDisplayName(childType || 'player', true)}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {entity.children.map((child: any) => {
                    const childPluralType = pluralizeType(child.type);
                    return (
                      <a
                        key={child.id}
                        href={`/${childPluralType}/${child.slug}`}
                        className="flex gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
                      >
                        {child.logo && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                            <img
                              src={child.logo}
                              alt={child.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate">
                            {child.name}
                          </h3>
                          {child.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {child.description}
                            </p>
                          )}
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Clips Section */}
            {allClips.length > 0 && (
              <ClipsSection clips={allClips} title={`${entity.name} Highlights`} />
            )}
          </div>

          {/* Right Column - Leaderboard */}
          {leaderboardClips.length > 0 && (
            <div className="hidden lg:block lg:col-span-4">
              <Leaderboard clips={leaderboardClips} title={`Top ${displayName} Clips`} />
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
