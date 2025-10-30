import { notFound } from "next/navigation";
import Link from "next/link";
import React from "react";
import prisma from "@/lib/prisma";
import NavigationHeader from "@/components/NavigationHeader";
import PageHeader from "@/components/PageHeader";
import ClipsSection from "@/components/ClipsSection";
import Leaderboard from "@/components/Leaderboard";
import Footer from "@/components/Footer";
import RankBadge from "@/components/RankBadge";
import Filter, { FilterConfig } from "@/components/Filter";
import FilterLoadingOverlay from "@/components/FilterLoadingOverlay";
import ActiveFilterPills from "@/components/ActiveFilterPills";
import {
  getEntityType,
  getEntityDisplayName,
  pluralizeType,
  getChildEntityType,
  EntityType,
} from "@/lib/entity-utils";
import {
  getEntityLayout,
  getCustomWidget,
  isCustomWidget,
  getColumnWidgets,
  EntityLayout,
} from "@/lib/layout-utils";
import Image from "next/image";
import { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { meta } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string; slug: string }>;
}): Promise<Metadata> {
  const { type, slug } = await params;
  const entityType = getEntityType(type);

  if (!entityType) {
    return {
      title: "Not Found",
      description: "The requested page could not be found.",
    };
  }

  const entity = await prisma.entity.findUnique({
    where: { slug, type: entityType },
    select: {
      name: true,
      description: true,
      metadata: true,
    },
  });

  if (!entity) {
    return {
      title: "Not Found",
      description: "The requested page could not be found.",
    };
  }

  const metadata = (entity.metadata || {}) as any;
  const description =
    metadata.bio ||
    entity.description ||
    `View ${entity.name}'s profile on ${meta.brand}`;
  const displayType = getEntityDisplayName(entityType);

  return {
    title: `${entity.name} | ${displayType}`,
    description: description,
    openGraph: {
      title: `${entity.name} | ${displayType}`,
      description: description,
      type: "profile",
    },
  };
}

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
                metadata: true,
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

  // For players, schools, locations, leagues, and sports, just show Home \ Type
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

  if (entityType === "location") {
    crumbs.push({
      label: "Locations",
      href: "/locations",
    });
    return crumbs;
  }

  if (entityType === "league") {
    crumbs.push({
      label: "Leagues",
      href: "/leagues",
    });
    return crumbs;
  }

  if (entityType === "sport") {
    crumbs.push({
      label: "Sports",
      href: "/sports",
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
  searchParams,
}: {
  params: Promise<{ type: string; slug: string }>;
  searchParams: Promise<Record<string, string>>;
}) {
  const { type, slug } = await params;
  const filters = await searchParams;
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

  // For schools, find all teams associated with this school
  let schoolTeams: any[] = [];

  if (entityType === "school") {
    // Query teams where metadata contains this school's slug
    const allTeams = await prisma.entity.findMany({
      where: {
        type: "team",
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
              },
            },
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
                clips: {
                  include: {
                    clip: true,
                  },
                },
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
    });

    // Filter by school slug in metadata
    schoolTeams = allTeams.filter(
      (team) => (team.metadata as any)?.schoolSlug === entity.slug
    );
  }

  // For locations, find all schools, teams, and players in this location
  let locationSchools: any[] = [];
  let locationTeams: any[] = [];
  let locationPlayers: any[] = [];

  if (entityType === "location") {
    // Query entities where metadata contains this location
    const allEntities = await prisma.entity.findMany({
      where: {
        OR: [{ type: "school" }, { type: "team" }, { type: "player" }],
      },
      include: {
        clips: {
          include: {
            clip: true,
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
                clips: {
                  include: {
                    clip: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Filter by location slug in metadata
    locationSchools = allEntities.filter(
      (e) =>
        e.type === "school" && (e.metadata as any)?.locationSlug === entity.slug
    );
    locationTeams = allEntities.filter(
      (e) =>
        e.type === "team" && (e.metadata as any)?.locationSlug === entity.slug
    );
    locationPlayers = allEntities.filter(
      (e) =>
        e.type === "player" && (e.metadata as any)?.locationSlug === entity.slug
    );
  }

  // Clips from location entities (schools, teams, players)
  const locationClips =
    entityType === "location"
      ? [
          ...locationSchools.flatMap(
            (school: any) =>
              school.clips?.map(({ clip }: any) => ({
                clip: {
                  ...clip,
                  id: clip.id.toString(),
                  createdAt: clip.createdAt,
                },
                playerName: school.name,
                playerId: school.id.toString(),
                playerSlug: school.slug,
                playerAvatar: school.logo,
                playerTags: [
                  {
                    name: school.name,
                    id: school.id.toString(),
                    slug: school.slug,
                    avatar: school.logo,
                  },
                ],
              })) || []
          ),
          ...locationTeams.flatMap(
            (team: any) =>
              team.clips?.map(({ clip }: any) => ({
                clip: {
                  ...clip,
                  id: clip.id.toString(),
                  createdAt: clip.createdAt,
                },
                playerName: team.name,
                playerId: team.id.toString(),
                playerSlug: team.slug,
                playerAvatar: team.logo,
                playerTags: [
                  {
                    name: team.name,
                    id: team.id.toString(),
                    slug: team.slug,
                    avatar: team.logo,
                  },
                ],
              })) || []
          ),
          // Clips from players on location teams
          ...locationTeams.flatMap(
            (team: any) =>
              team.teamMembers?.flatMap(
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
          ),
          ...locationPlayers.flatMap(
            (player: any) =>
              player.clips?.map(({ clip }: any) => ({
                clip: {
                  ...clip,
                  id: clip.id.toString(),
                  createdAt: clip.createdAt,
                },
                playerName: player.name,
                playerId: player.id.toString(),
                playerSlug: player.slug,
                playerAvatar: player.logo,
                playerTags: [
                  {
                    name: player.name,
                    id: player.id.toString(),
                    slug: player.slug,
                    avatar: player.logo,
                  },
                ],
              })) || []
          ),
        ]
      : [];

  // Clips from school team players
  const schoolTeamPlayerClips =
    entityType === "school"
      ? schoolTeams.flatMap(
          (team: any) =>
            team.teamMembers?.flatMap(
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
        )
      : [];

  const allClips = [
    ...entityClips,
    ...teamMemberClips,
    ...childClips,
    ...childTeamMemberClips,
    ...grandchildClips,
    ...grandchildTeamMemberClips,
    ...greatGrandchildClips,
    ...locationClips,
    ...schoolTeamPlayerClips,
  ];

  // Prepare leaderboard
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

  const breadcrumbs = buildBreadcrumbs(entity, entityType);
  const displayName = getEntityDisplayName(entityType);

  // Build filter configuration for sports pages
  let filterConfig: FilterConfig = {};
  let filterLabels: { [key: string]: string } = {};
  let filteredChildren = entity.children || [];

  if (entityType === "sport" && entity.children && entity.children.length > 0) {
    // Build leagues list for filter
    const leaguesMap = new Map<string, string>();
    entity.children.forEach((child: any) => {
      if (child.type === "league") {
        leaguesMap.set(child.slug, child.name);
      }
    });

    if (leaguesMap.size > 0) {
      filterConfig.leagues = Array.from(leaguesMap.entries())
        .map(([slug, name]) => ({
          value: slug,
          label: name,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));

      // Build filter labels
      filterConfig.leagues.forEach((opt) => {
        filterLabels[opt.value] = opt.label;
      });
    }

    // Apply league filter if active
    if (filters.league) {
      filteredChildren = entity.children.filter(
        (child: any) => child.slug === filters.league
      );
    }
  }

  // Get layout configuration
  const layout = getEntityLayout(entityType, entity.layout);

  // Helper function to render a widget by name
  const renderWidget = (widgetName: string) => {
    // Handle custom widgets (x0, x1, etc.)
    if (isCustomWidget(widgetName)) {
      const customWidget = getCustomWidget(layout, widgetName);
      if (!customWidget) return null;

      return (
        <div
          key={widgetName}
          className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
            {customWidget.title}
          </h2>
          <div className="prose prose-sm sm:prose max-w-none [&_a]:text-green-600 [&_a]:underline [&_a:hover]:no-underline">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {customWidget.content}
            </ReactMarkdown>
          </div>
        </div>
      );
    }

    // Handle standard widgets
    switch (widgetName) {
      case "Meta":
        if (
          entityType === "player" &&
          metadata.stats &&
          Object.keys(metadata.stats).length > 0
        ) {
          return (
            <div
              key="Meta"
              className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                Stats
              </h2>
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
            </div>
          );
        }
        return null;

      case "Teams":
        // For players - show their teams
        if (entity.playerMemberships && entity.playerMemberships.length > 0) {
          return (
            <div
              key="Teams"
              className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                Teams
              </h2>
              <div className="space-y-3">
                {entity.playerMemberships.map((membership: any) => {
                  const positions = membership.positions as string[] | null;
                  return (
                    <div
                      key={membership.id}
                      className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-green-500 transition-colors"
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
                          className="text-lg font-semibold text-gray-900 hover:text-green-600 transition-colors"
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
          );
        }
        // For schools - show their teams
        if (schoolTeams.length > 0) {
          return (
            <div
              key="Teams"
              className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Teams
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {schoolTeams.map((team: any) => {
                  const sportName = team.parent?.parent?.name;
                  const leagueName = team.parent?.name;
                  return (
                    <a
                      key={team.id}
                      href={`/teams/${team.slug}`}
                      className="flex gap-3 p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-md transition-all"
                    >
                      {team.logo && (
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-gray-100">
                          <img
                            src={team.logo}
                            alt={team.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate">
                          {team.name}
                        </h3>
                        {team.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {team.description}
                          </p>
                        )}
                        {(sportName || leagueName) && (
                          <p className="text-xs text-gray-500 mt-1">
                            {sportName && sportName}
                            {sportName && leagueName && " • "}
                            {leagueName && leagueName}
                          </p>
                        )}
                        {team.teamMembers && team.teamMembers.length > 0 && (
                          <p className="text-xs text-green-600 font-semibold mt-2">
                            {team.teamMembers.length}{" "}
                            {team.teamMembers.length === 1
                              ? "player"
                              : "players"}
                          </p>
                        )}
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          );
        }
        // For locations - show their teams
        if (locationTeams.length > 0) {
          return (
            <div
              key="Teams"
              className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Teams
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {locationTeams.map((team: any) => (
                  <a
                    key={team.id}
                    href={`/teams/${team.slug}`}
                    className="flex gap-3 p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-md transition-all"
                  >
                    {team.logo && (
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-gray-100">
                        <img
                          src={team.logo}
                          alt={team.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate">
                        {team.name}
                      </h3>
                      {team.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {team.description}
                        </p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          );
        }
        // For leagues and other entities with team children - render them here
        if (entity.children && entity.children.length > 0 && entity.children[0]?.type === "team") {
          return (
            <div
              key="Teams"
              className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Teams
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {entity.children.map((team: any) => (
                  <a
                    key={team.id}
                    href={`/teams/${team.slug}`}
                    className="flex gap-3 p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-md transition-all"
                  >
                    {team.logo && (
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-gray-100">
                        <img
                          src={team.logo}
                          alt={team.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate">
                        {team.name}
                      </h3>
                      {team.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {team.description}
                        </p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          );
        }
        return null;

      case "Players":
        // For teams - show team members
        if (entity.teamMembers && entity.teamMembers.length > 0) {
          return (
            <div
              key="Players"
              className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6"
            >
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
                      className="flex gap-3 p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-md transition-all"
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
                        {membership.positions &&
                          membership.positions.length > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              {membership.positions.join(" • ")}
                            </p>
                          )}
                        {player.clips && player.clips.length > 0 && (
                          <p className="text-xs text-green-600 font-semibold mt-2">
                            {player.clips.length}{" "}
                            {player.clips.length === 1 ? "clip" : "clips"}
                          </p>
                        )}
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          );
        }
        // For locations - show location players
        if (locationPlayers.length > 0) {
          return (
            <div
              key="Players"
              className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Players
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {locationPlayers.map((player: any) => (
                  <a
                    key={player.id}
                    href={`/players/${player.slug}`}
                    className="flex gap-3 p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-md transition-all"
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
                      </h3>
                      {player.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {player.description}
                        </p>
                      )}
                      {player.clips && player.clips.length > 0 && (
                        <p className="text-xs text-green-600 font-semibold mt-2">
                          {player.clips.length}{" "}
                          {player.clips.length === 1 ? "clip" : "clips"}
                        </p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          );
        }
        return null;

      case "Schools":
        if (locationSchools.length > 0) {
          return (
            <div
              key="Schools"
              className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Schools
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {locationSchools.map((school: any) => (
                  <a
                    key={school.id}
                    href={`/schools/${school.slug}`}
                    className="flex gap-3 p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-md transition-all"
                  >
                    {school.logo && (
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-gray-100">
                        <img
                          src={school.logo}
                          alt={school.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate">
                        {school.name}
                      </h3>
                      {school.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {school.description}
                        </p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          );
        }
        return null;

      case "Leagues":
      case "Teams":
      case "Clips":
        // Handle children sections (Leagues, Teams under leagues, etc.)
        if (entity.children && entity.children.length > 0) {
          const firstChildType = entity.children[0]?.type;
          const shouldShow =
            (widgetName === "Leagues" && firstChildType === "league") ||
            (widgetName === "Teams" && firstChildType === "team");

          if (!shouldShow && widgetName !== "Clips") return null;

          if (widgetName === "Clips") {
            return (
              <ClipsSection
                key="Clips"
                clips={allClips}
                title={
                  entityType === "player"
                    ? "Highlights"
                    : `${entity.name} Highlights`
                }
              />
            );
          }

          return (
            <div
              key={widgetName}
              className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                {entity.childEntities ||
                  getEntityDisplayName(childType || "player", true)}
              </h2>
              {filteredChildren.length === 0 ? (
                <p className="w-full text-center text-gray-400 py-8">
                  No results found.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredChildren.map((child: any) => {
                    const childPluralType = pluralizeType(child.type);
                    return (
                      <a
                        key={child.id}
                        href={`/${childPluralType}/${child.slug}`}
                        className="flex gap-3 p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-md transition-all"
                      >
                        {child.logo && (
                          <div
                            className={`w-12 h-12 rounded-lg overflow-hidden shrink-0 flex items-center justify-center ${
                              child.type === "sport"
                                ? "bg-linear-to-br from-green-500 to-blue-600 p-2"
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
              )}
            </div>
          );
        }
        // Also handle Clips section directly if no children
        if (widgetName === "Clips") {
          return (
            <ClipsSection
              key="Clips"
              clips={allClips}
              title={
                entityType === "player"
                  ? "Highlights"
                  : `${entity.name} Highlights`
              }
            />
          );
        }
        return null;

      case "TopClips":
        return (
          <Leaderboard
            key="TopClips"
            clips={leaderboardClips}
            title={
              entityType === "player" ? "Top Clips" : `Top ${displayName} Clips`
            }
          />
        );

      default:
        return null;
    }
  };

  // Build subtitle for players with bio and sports
  let subtitle: React.ReactNode = entity.description || undefined;
  if (entityType === "player") {
    const bioText = metadata.bio || entity.description;
    const birthdate = metadata.birthdate ? new Date(metadata.birthdate) : null;

    // Get school from current team membership (school info is in team metadata)
    const currentTeam = entity.playerMemberships?.[0]?.team;
    const teamMetadata = (currentTeam?.metadata || {}) as any;
    const schoolName = teamMetadata.schoolName || null;
    const schoolSlug = teamMetadata.schoolSlug || null;

    // Get location from metadata
    const locationName = metadata.locationName;
    const locationSlug = metadata.locationSlug;

    // Get all unique sports from team memberships
    const sports =
      entity.playerMemberships
        ?.map((membership: any) => {
          // Navigate up: team -> league -> sport
          const sport = membership.team?.parent?.parent;
          return sport ? { name: sport.name, slug: sport.slug } : null;
        })
        .filter(
          (sport: any, index: number, self: any[]) =>
            sport &&
            self.findIndex((s: any) => s?.name === sport.name) === index
        ) || [];

    // Calculate age from birthdate
    let age: number | null = null;
    if (birthdate && !isNaN(birthdate.getTime())) {
      const today = new Date();
      age = today.getFullYear() - birthdate.getFullYear();
      const monthDiff = today.getMonth() - birthdate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthdate.getDate())
      ) {
        age--;
      }
    }

    // Get grade from metadata
    const grade = metadata.grade;

    // Build info parts for display
    const hasInfoLine = schoolName || locationName || age || grade;
    const hasSports = sports.length > 0;

    if (bioText || hasSports || hasInfoLine) {
      subtitle = (
        <div className="text-sm sm:text-base opacity-90">
          {bioText && <p className="mb-1">{bioText}</p>}
          {hasInfoLine && (
            <p className="text-xs sm:text-sm opacity-80 mb-1">
              {schoolName && schoolSlug && (
                <>
                  <Link href={`/schools/${schoolSlug}`} className="underline">
                    {schoolName}
                  </Link>
                  {(locationName || age) && " • "}
                </>
              )}
              {locationName && locationSlug && (
                <>
                  <Link
                    href={`/locations/${locationSlug}`}
                    className="underline"
                  >
                    {locationName}
                  </Link>
                  {(age || grade) && " • "}
                </>
              )}
              {age && `${age} years old`}
              {age && grade && " • "}
              {grade && grade}
            </p>
          )}
          {hasSports && (
            <p className="text-xs sm:text-sm opacity-80">
              {sports.map((sport: any, index: number) => (
                <span key={sport.slug}>
                  <Link href={`/sports/${sport.slug}`} className="underline">
                    {sport.name}
                  </Link>
                  {index < sports.length - 1 && " • "}
                </span>
              ))}
            </p>
          )}
        </div>
      );
    }
  } else if (entityType === "team") {
    const description = entity.description;

    // Get school from metadata (for college teams)
    const schoolName = metadata.schoolName;
    const schoolSlug = metadata.schoolSlug;

    // Get location from metadata
    const locationName = metadata.locationName;
    const locationSlug = metadata.locationSlug;

    if (description || schoolName || locationName) {
      subtitle = (
        <div className="text-sm sm:text-base opacity-90">
          {description && <p className="mb-1">{description}</p>}
          {(schoolName || locationName) && (
            <p className="text-xs sm:text-sm opacity-80">
              {schoolName && schoolSlug && (
                <>
                  <Link href={`/schools/${schoolSlug}`} className="underline">
                    {schoolName}
                  </Link>
                  {locationName && " • "}
                </>
              )}
              {locationName && locationSlug && (
                <Link href={`/locations/${locationSlug}`} className="underline">
                  {locationName}
                </Link>
              )}
            </p>
          )}
        </div>
      );
    }
  } else if (entityType === "league") {
    const description = entity.description;

    // Get the sport from the parent
    const sport = entity.parent;
    const sportName = sport?.name;
    const sportSlug = sport?.slug;

    if (description || sportName) {
      subtitle = (
        <div className="text-sm sm:text-base opacity-90">
          {description && <p className="mb-1">{description}</p>}
          {sportName && sportSlug && (
            <p className="text-xs sm:text-sm opacity-80">
              <Link href={`/sports/${sportSlug}`} className="underline">
                {sportName}
              </Link>
            </p>
          )}
        </div>
      );
    }
  } else if (entityType === "school") {
    const description = entity.description;

    // Get location from metadata
    const locationName = metadata.locationName;
    const locationSlug = metadata.locationSlug;

    if (description || locationName) {
      subtitle = (
        <div className="text-sm sm:text-base opacity-90">
          {description && <p className="mb-1">{description}</p>}
          {locationName && locationSlug && (
            <p className="text-xs sm:text-sm opacity-80">
              <Link href={`/locations/${locationSlug}`} className="underline">
                {locationName}
              </Link>
            </p>
          )}
        </div>
      );
    }
  } else if (entityType === "location") {
    const description = entity.description;
    const totalEntities =
      locationSchools.length + locationTeams.length + locationPlayers.length;

    if (description || totalEntities > 0) {
      subtitle = (
        <div className="text-sm sm:text-base opacity-90">
          {description && <p className="mb-1">{description}</p>}
          {totalEntities > 0 && (
            <p className="text-xs sm:text-sm opacity-80">
              {locationSchools.length}{" "}
              {locationSchools.length === 1 ? "School" : "Schools"} •{" "}
              {locationTeams.length}{" "}
              {locationTeams.length === 1 ? "Team" : "Teams"} •{" "}
              {locationPlayers.length}{" "}
              {locationPlayers.length === 1 ? "Player" : "Players"}
            </p>
          )}
        </div>
      );
    }
  } else if (entityType === "sport") {
    const description = entity.description;

    // Build gender elements if metadata exists
    const genderElements = [];
    if (metadata.mens) {
      genderElements.push(
        <Link
          key="mens"
          href="/sports?gender=mens"
          className="text-white font-normal underline hover:no-underline transition-all"
        >
          Men's
        </Link>
      );
    }

    if (metadata.womens) {
      genderElements.push(
        <Link
          key="womens"
          href="/sports?gender=womens"
          className="text-white font-normal underline hover:no-underline transition-all"
        >
          Women's
        </Link>
      );
    }

    if (metadata.coed) {
      genderElements.push(
        <Link
          key="coed"
          href="/sports?gender=coed"
          className="text-white font-normal underline hover:no-underline transition-all"
        >
          Coed
        </Link>
      );
    }

    if (description || genderElements.length > 0) {
      subtitle = (
        <div className="text-sm sm:text-base opacity-90">
          {description && <p className="mb-1">{description}</p>}
          {genderElements.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap text-xs sm:text-sm opacity-90">
              {genderElements.map((element, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span className="opacity-60">•</span>}
                  {element}
                </React.Fragment>
              ))}
            </div>
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
        {/* Mobile Filter - Shows at top on mobile (for sports pages only) */}
        {entityType === "sport" && filterConfig.leagues && (
          <div className="lg:hidden mb-6">
            <Filter config={filterConfig} />
          </div>
        )}

        <div className="w-full lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
          {/* Left Column */}
          {layout.l && layout.l.length > 0 && (
            <div className="w-full lg:col-span-2 min-w-0 mb-6 lg:mb-0">
              {layout.l.map((widgetName) => renderWidget(widgetName))}
            </div>
          )}

          {/* Center Column */}
          <div
            className={`w-full min-w-0 ${
              layout.l && layout.l.length > 0
                ? "lg:col-span-6"
                : "lg:col-span-8"
            } relative`}
          >
            {/* Filter Loading Overlay - covers entire column (for sports pages only) */}
            {entityType === "sport" && <FilterLoadingOverlay />}

            {/* Active Filter Pills - above all content (for sports pages only) */}
            {entityType === "sport" && (
              <ActiveFilterPills filterLabels={filterLabels} />
            )}

            {layout.c.map((widgetName) => renderWidget(widgetName))}
          </div>

          {/* Right Column - Sticky */}
          {layout.r && layout.r.length > 0 && (
            <div className="w-full lg:col-span-4 min-w-0 hidden lg:block">
              <div className="sticky top-6 space-y-6">
                {/* Filter Component - Desktop (for sports pages only) */}
                {entityType === "sport" && filterConfig.leagues && (
                  <Filter config={filterConfig} />
                )}

                {layout.r.map((widgetName) => renderWidget(widgetName))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
