import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import NavigationHeader from "@/components/NavigationHeader";
import PageHeader from "@/components/PageHeader";
import ClipsSection from "@/components/ClipsSection";
import Leaderboard from "@/components/Leaderboard";
import Footer from "@/components/Footer";
import RankBadge from "@/components/RankBadge";
import {
  getEntityType,
  getEntityDisplayName,
  pluralizeType,
  getChildEntityType,
  EntityType,
} from "@/lib/entity-utils";
import Image from "next/image";

export const dynamic = "force-dynamic";

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
        playerMemberships: {
          where: { isCurrent: true },
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
                    type: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        teamMembers: {
          where: { isCurrent: true },
          include: {
            player: {
              select: {
                id: true,
                name: true,
                slug: true,
                logo: true,
                type: true,
                description: true,
                clips: {
                  include: {
                    clip: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        children: {
          include: {
            teamMembers: {
              where: { isCurrent: true },
              include: {
                player: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    logo: true,
                    type: true,
                    clips: {
                      include: {
                        clip: true,
                      },
                    },
                  },
                },
              },
            },
            children: {
              include: {
                teamMembers: {
                  where: { isCurrent: true },
                  include: {
                    player: {
                      select: {
                        id: true,
                        name: true,
                        slug: true,
                        logo: true,
                        type: true,
                        clips: {
                          include: {
                            clip: true,
                          },
                        },
                      },
                    },
                  },
                },
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
            },
          },
        },
        clips: {
          include: {
            clip: true,
          },
          orderBy: {
            order: "asc",
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

function buildBreadcrumbs(entity: any, entityType: EntityType) {
  const crumbs: Array<{ label: string; href: string }> = [
    { label: "Home", href: "/" },
  ];

  // For players and schools, just show Home \ Type
  if (entityType === "player") {
    crumbs.push({
      label: "Players",
      href: "/players",
    });
    return crumbs;
  }

  if (entityType === "school") {
    crumbs.push({
      label: "Schools",
      href: "/schools",
    });
    return crumbs;
  }

  // Build breadcrumb trail from parents for other entity types
  const parents: any[] = [];
  let current = entity.parent;
  while (current) {
    parents.unshift(current);
    current = current.parent;
  }

  parents.forEach((parent) => {
    const parentType = pluralizeType(parent.type as EntityType);
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
  }));

  // Clips from team members (players on this team)
  const teamMemberClips =
    entity.teamMembers?.flatMap(
      (membership: any) =>
        membership.player.clips?.map(({ clip }: any) => ({
          clip: {
            ...clip,
            id: clip.id.toString(),
            createdAt: clip.createdAt,
          },
          playerName: membership.player.name,
          playerId: membership.player.id.toString(),
          playerSlug: membership.player.slug,
          playerAvatar: membership.player.logo,
          playerTags: [
            {
              name: membership.player.name,
              id: membership.player.id.toString(),
              slug: membership.player.slug,
              avatar: membership.player.logo,
            },
          ],
        })) || []
    ) || [];

  const childClips =
    entity.children?.flatMap(
      (child: any) =>
        child.clips?.map(({ clip }: any) => ({
          clip: {
            ...clip,
            id: clip.id.toString(),
            createdAt: clip.createdAt,
          },
          playerName: child.name,
          playerId: child.id.toString(),
          playerSlug: child.slug,
          playerAvatar: child.logo,
          playerTags: [
            {
              name: child.name,
              id: child.id.toString(),
              slug: child.slug,
              avatar: child.logo,
            },
          ],
        })) || []
    ) || [];

  // Clips from child team members (e.g., players on teams under a school)
  const childTeamMemberClips =
    entity.children?.flatMap(
      (child: any) =>
        child.teamMembers?.flatMap(
          (membership: any) =>
            membership.player.clips?.map(({ clip }: any) => ({
              clip: {
                ...clip,
                id: clip.id.toString(),
                createdAt: clip.createdAt,
              },
              playerName: membership.player.name,
              playerId: membership.player.id.toString(),
              playerSlug: membership.player.slug,
              playerAvatar: membership.player.logo,
              playerTags: [
                {
                  name: membership.player.name,
                  id: membership.player.id.toString(),
                  slug: membership.player.slug,
                  avatar: membership.player.logo,
                },
              ],
            })) || []
        ) || []
    ) || [];

  // Clips from grandchildren (e.g., teams under leagues under sports)
  const grandchildClips =
    entity.children?.flatMap(
      (child: any) =>
        child.children?.flatMap(
          (grandchild: any) =>
            grandchild.clips?.map(({ clip }: any) => ({
              clip: {
                ...clip,
                id: clip.id.toString(),
                createdAt: clip.createdAt,
              },
              playerName: grandchild.name,
              playerId: grandchild.id.toString(),
              playerSlug: grandchild.slug,
              playerAvatar: grandchild.logo,
              playerTags: [
                {
                  name: grandchild.name,
                  id: grandchild.id.toString(),
                  slug: grandchild.slug,
                  avatar: grandchild.logo,
                },
              ],
            })) || []
        ) || []
    ) || [];

  // Clips from grandchild team members
  const grandchildTeamMemberClips =
    entity.children?.flatMap(
      (child: any) =>
        child.children?.flatMap(
          (grandchild: any) =>
            grandchild.teamMembers?.flatMap(
              (membership: any) =>
                membership.player.clips?.map(({ clip }: any) => ({
                  clip: {
                    ...clip,
                    id: clip.id.toString(),
                    createdAt: clip.createdAt,
                  },
                  playerName: membership.player.name,
                  playerId: membership.player.id.toString(),
                  playerSlug: membership.player.slug,
                  playerAvatar: membership.player.logo,
                  playerTags: [
                    {
                      name: membership.player.name,
                      id: membership.player.id.toString(),
                      slug: membership.player.slug,
                      avatar: membership.player.logo,
                    },
                  ],
                })) || []
            ) || []
        ) || []
    ) || [];

  // Clips from great-grandchildren (e.g., players under teams under leagues under sports)
  const greatGrandchildClips =
    entity.children?.flatMap(
      (child: any) =>
        child.children?.flatMap(
          (grandchild: any) =>
            grandchild.children?.flatMap(
              (greatGrandchild: any) =>
                greatGrandchild.clips?.map(({ clip }: any) => ({
                  clip: {
                    ...clip,
                    id: clip.id.toString(),
                    createdAt: clip.createdAt,
                  },
                  playerName: greatGrandchild.name,
                  playerId: greatGrandchild.id.toString(),
                  playerSlug: greatGrandchild.slug,
                  playerAvatar: greatGrandchild.logo,
                  playerTags: [
                    {
                      name: greatGrandchild.name,
                      id: greatGrandchild.id.toString(),
                      slug: greatGrandchild.slug,
                      avatar: greatGrandchild.logo,
                    },
                  ],
                })) || []
            ) || []
        ) || []
    ) || [];

  const allClips = [
    ...entityClips,
    ...teamMemberClips,
    ...childClips,
    ...childTeamMemberClips,
    ...grandchildClips,
    ...grandchildTeamMemberClips,
    ...greatGrandchildClips,
  ];

  // Prepare leaderboard
  const leaderboardClips = allClips.slice(0, 10).map((clip, index) => ({
    id: clip.clip.id.toString(),
    title: clip.clip.title,
    thumbnail: clip.clip.thumbnail,
    url: clip.clip.url,
    rank: index + 1,
    rankChange: Math.floor(Math.random() * 7) - 3,
  }));

  const breadcrumbs = buildBreadcrumbs(entity, entityType);
  const displayName = getEntityDisplayName(entityType);

  // Build subtitle for players with bio and sports
  let subtitle: React.ReactNode = entity.description || undefined;
  if (entityType === "player") {
    const bioText = metadata.bio || entity.description;
    const sportName = entity.parent?.parent?.parent?.name; // Get sport from hierarchy
    const city = metadata.city;
    const state = metadata.state;
    const birthdate = metadata.birthdate ? new Date(metadata.birthdate) : null;

    // Get school from current team membership
    const currentTeam = entity.playerMemberships?.[0]?.team;
    const school = currentTeam?.parent?.type === "school" ? currentTeam.parent : null;

    // Calculate age from birthdate
    let age: number | null = null;
    if (birthdate && !isNaN(birthdate.getTime())) {
      const today = new Date();
      age = today.getFullYear() - birthdate.getFullYear();
      const monthDiff = today.getMonth() - birthdate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
        age--;
      }
    }

    // Build location string
    const locationParts = [];
    if (city) locationParts.push(city);
    if (state) locationParts.push(state);
    const location = locationParts.join(', ');

    // Build info parts for display
    const hasInfoLine = school || location || age;

    if (bioText || sportName || hasInfoLine) {
      subtitle = (
        <div className="text-sm sm:text-base opacity-90">
          {bioText && <p className="mb-1">{bioText}</p>}
          {hasInfoLine && (
            <p className="text-xs sm:text-sm opacity-80 mb-1">
              {school && (
                <>
                  <Link
                    href={`/schools/${school.slug}`}
                    className="underline"
                  >
                    {school.name}
                  </Link>
                  {(location || age) && " • "}
                </>
              )}
              {location}
              {location && age && " • "}
              {age && `${age} years old`}
            </p>
          )}
          {sportName && (
            <p className="text-xs sm:text-sm opacity-80">{sportName}</p>
          )}
        </div>
      );
    }
  } else if (entityType === "team") {
    const description = entity.description;
    const city = metadata.city;
    const state = metadata.state;

    // Get school from metadata (for college teams)
    const schoolName = metadata.schoolName;
    const schoolSlug = metadata.schoolSlug;

    // Build location string
    const locationParts = [];
    if (city) locationParts.push(city);
    if (state) locationParts.push(state);
    const location = locationParts.join(', ');

    if (description || schoolName || location) {
      subtitle = (
        <div className="text-sm sm:text-base opacity-90">
          {description && <p className="mb-1">{description}</p>}
          {(schoolName || location) && (
            <p className="text-xs sm:text-sm opacity-80">
              {schoolName && schoolSlug && (
                <>
                  <Link
                    href={`/schools/${schoolSlug}`}
                    className="underline"
                  >
                    {schoolName}
                  </Link>
                  {location && " • "}
                </>
              )}
              {location}
            </p>
          )}
        </div>
      );
    }
  } else if (entityType === "school") {
    const description = entity.description;
    const city = metadata.city;
    const state = metadata.state;

    // Build location string
    const locationParts = [];
    if (city) locationParts.push(city);
    if (state) locationParts.push(state);
    const location = locationParts.join(', ');

    if (description || location) {
      subtitle = (
        <div className="text-sm sm:text-base opacity-90">
          {description && <p className="mb-1">{description}</p>}
          {location && (
            <p className="text-xs sm:text-sm opacity-80">
              {location}
            </p>
          )}
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavigationHeader />

      <PageHeader
        title={entity.name}
        subtitle={subtitle}
        breadcrumbs={breadcrumbs}
        logo={entity.logo || undefined}
        banner={entity.banner || undefined}
        followerCount={entity.followerCount}
        showFollowButton={true}
        entityType={entityType}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
        <div className="w-full lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
          <div className="w-full lg:col-span-8 min-w-0">
            {/* Teams Section for Players */}
            {entityType === "player" &&
              entity.playerMemberships &&
              entity.playerMemberships.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                    Teams
                  </h2>
                  <div className="space-y-3">
                    {entity.playerMemberships.map((membership: any) => {
                      const positions = membership.positions as string[] | null;
                      return (
                        <div
                          key={membership.id}
                          className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
                        >
                          {membership.team.logo && (
                            <Link href={`/teams/${membership.team.slug}`}>
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center hover:opacity-80 transition-opacity">
                                <Image
                                  src={membership.team.logo}
                                  alt={membership.team.name}
                                  fill
                                  className="object-contain p-1"
                                />
                              </div>
                            </Link>
                          )}
                          <div className="flex-1">
                            <Link
                              href={`/teams/${membership.team.slug}`}
                              className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                            >
                              {membership.team.name}
                              {membership.jerseyNumber && (
                                <span className="ml-2 text-gray-500">
                                  #{membership.jerseyNumber}
                                </span>
                              )}
                            </Link>
                            {positions && positions.length > 0 && (
                              <p className="text-sm text-gray-600 mt-0.5">
                                {positions.join(" • ")}
                              </p>
                            )}
                            {membership.season && (
                              <p className="text-xs text-gray-500 mt-1">
                                {membership.season}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            {/* Stats Section for Players */}
            {entityType === "player" && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  Stats
                </h2>
                {metadata.stats && Object.keys(metadata.stats).length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {Object.entries(metadata.stats).map(([key, value]) => (
                      <div
                        key={key}
                        className="text-center p-3 bg-gray-50 rounded-lg"
                      >
                        <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {String(value)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="w-full text-center text-gray-400 py-8">
                    No stats to show
                  </p>
                )}
              </div>
            )}

            {/* Team Members Section (Players on this team/school teams) */}
            {entity.teamMembers && entity.teamMembers.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Players
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {entity.teamMembers.map((membership: any) => {
                    const player = membership.player;
                    return (
                      <a
                        key={player.id}
                        href={`/players/${player.slug}`}
                        className="flex gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
                      >
                        {player.logo && (
                          <div className="w-12 h-12 rounded-full bg-white overflow-hidden shrink-0 flex items-center justify-center">
                            <img
                              src={player.logo}
                              alt={player.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate">
                            {player.name}
                            {membership.jerseyNumber && (
                              <span className="ml-2 text-gray-500">
                                #{membership.jerseyNumber}
                              </span>
                            )}
                          </h3>
                          {player.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {player.description}
                            </p>
                          )}
                          {membership.positions && membership.positions.length > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              {membership.positions.join(" • ")}
                            </p>
                          )}
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Children Section */}
            {entity.children && entity.children.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                  {entity.childEntities ||
                    getEntityDisplayName(childType || "player", true)}
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
                          <div
                            className={`w-12 h-12 rounded-lg overflow-hidden shrink-0 flex items-center justify-center ${
                              child.type === "sport"
                                ? "bg-linear-to-br from-blue-500 to-purple-600 p-2"
                                : "bg-gray-100"
                            }`}
                          >
                            <img
                              src={child.logo}
                              alt={child.name}
                              className="w-full h-full object-contain"
                              style={
                                child.type === "sport"
                                  ? { filter: "brightness(0) invert(1)" }
                                  : undefined
                              }
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
            <ClipsSection
              clips={allClips}
              title={
                entityType === "player"
                  ? "Highlights"
                  : `${entity.name} Highlights`
              }
            />
          </div>

          {/* Right Column - Leaderboard */}
          <div className="w-full hidden lg:block lg:col-span-4 min-w-0">
            <Leaderboard
              clips={leaderboardClips}
              title={
                entityType === "player"
                  ? "Top Clips"
                  : `Top ${displayName} Clips`
              }
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
