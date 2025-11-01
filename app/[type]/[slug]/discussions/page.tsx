import { notFound } from "next/navigation";
import Link from "next/link";
import React from "react";
import prisma from "@/lib/prisma";
import { getEntityBySlug } from "@/lib/data-access";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import NavigationHeader from "@/components/NavigationHeader";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";
import Discussions from "@/components/Discussions";
import Leaderboard from "@/components/Leaderboard";
import { getEntityType, getEntityDisplayName, pluralizeType, EntityType } from "@/lib/entity-utils";
import { Metadata } from "next";
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

  const entity = await getEntityBySlug(entityType, slug);

  if (!entity) {
    return {
      title: "Not Found",
      description: "The requested page could not be found.",
    };
  }

  const displayType = getEntityDisplayName(entityType);

  return {
    title: `${entity.name} Discussions | ${displayType}`,
    description: `Join the discussion about ${entity.name}`,
    openGraph: {
      title: `${entity.name} Discussions | ${displayType}`,
      description: `Join the discussion about ${entity.name}`,
    },
  };
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

export default async function DiscussionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string; slug: string }>;
  searchParams: Promise<Record<string, string>>;
}) {
  const { type, slug } = await params;
  const filters = await searchParams;
  const page = parseInt(filters.page || "1");
  const perPage = 20;

  const entityType = getEntityType(type);
  if (!entityType) {
    notFound();
  }

  // Get current user session
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userId = session?.user?.id || null;

  // Fetch entity with user context for follow status
  const entity = await getEntityBySlug(entityType, slug, userId);
  if (!entity) {
    notFound();
  }

  const metadata = (entity.metadata || {}) as any;

  // Fetch clips for leaderboard (top 10)
  const entityClips = await prisma.entityClip.findMany({
    where: {
      entityId: entity.id,
    },
    include: {
      clip: true,
    },
    orderBy: {
      clip: {
        createdAt: 'desc',
      },
    },
    take: 10,
  });

  const leaderboardClips = entityClips.map((ec, index) => {
    const clipIdNum = typeof ec.clip.id === 'string' ? parseInt(ec.clip.id) : ec.clip.id;
    const rankChange = (clipIdNum % 7) - 3; // -3 to +3
    return {
      id: ec.clip.id.toString(),
      title: ec.clip.title,
      thumbnail: ec.clip.thumbnail,
      url: ec.clip.url,
      rank: index + 1,
      rankChange,
    };
  });

  // Fetch discussion topics for this entity
  const [topics, totalCount] = await Promise.all([
    prisma.discussionTopic.findMany({
      where: {
        entities: {
          some: {
            entityId: entity.id,
          },
        },
        isDeleted: false,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            displayName: true,
            image: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
          },
        },
      },
      orderBy: [
        { isPinned: "desc" },
        { lastCommentAt: "desc" },
      ],
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.discussionTopic.count({
      where: {
        entities: {
          some: {
            entityId: entity.id,
          },
        },
        isDeleted: false,
      },
    }),
  ]);

  // Fetch origin entities for topics (to show "Posted in" tags)
  const originEntityIds = [...new Set(topics.map((t) => t.subjectId))];
  const originEntities = await prisma.entity.findMany({
    where: {
      id: { in: originEntityIds },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      type: true,
    },
  });

  // Create a map for quick lookup
  const originEntityMap = new Map(originEntities.map((e) => [e.id, e]));

  // Attach origin entity to each topic
  const topicsWithOrigin = topics.map((topic) => ({
    ...topic,
    originEntity: originEntityMap.get(topic.subjectId),
  }));

  const breadcrumbs = buildBreadcrumbs(entity, entityType);
  const displayName = getEntityDisplayName(entityType);
  const totalPages = Math.ceil(totalCount / perPage);

  // Build tabs for navigation
  const entityPath = `/${pluralizeType(entityType)}/${entity.slug}`;
  const tabs = [
    { label: "Overview", href: entityPath, active: false },
    { label: "Discussions", href: `${entityPath}/discussions`, active: true },
    { label: "Stats", href: `${entityPath}/stats`, active: false },
    { label: "Clips", href: `${entityPath}/clips`, active: false },
  ];

  // Build subtitle same as entity page
  let subtitle: React.ReactNode = entity.description || undefined;
  if (entityType === "player") {
    const bioText = metadata.bio || entity.description;
    const birthdate = metadata.birthdate ? new Date(metadata.birthdate) : null;

    // Get school from current team membership
    const currentTeam = entity.playerMemberships?.[0]?.team as any;
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

    const grade = metadata.grade;
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
    const schoolName = metadata.schoolName;
    const schoolSlug = metadata.schoolSlug;
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
  } else if (entityType === "sport") {
    const description = entity.description;
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
        entityId={entity.id}
        isFollowing={(entity as any).isFollowing ?? false}
        tabs={tabs}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
        <div className="w-full lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
          {/* Center Column - Discussions */}
          <div className="w-full min-w-0 lg:col-span-8">
            <Discussions
              entityId={entity.id}
              entityType={pluralizeType(entityType)}
              entitySlug={entity.slug}
              variant="full"
              topics={topicsWithOrigin}
              totalCount={totalCount}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                {page > 1 && (
                  <Link
                    href={`/${pluralizeType(entityType)}/${entity.slug}/discussions?page=${page - 1}`}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </Link>
                )}

                <span className="px-4 py-2 text-gray-700">
                  Page {page} of {totalPages}
                </span>

                {page < totalPages && (
                  <Link
                    href={`/${pluralizeType(entityType)}/${entity.slug}/discussions?page=${page + 1}`}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Sticky Sidebar */}
          <div className="w-full lg:col-span-4 min-w-0 hidden lg:block">
            <div className="sticky top-6 space-y-6">
              <Leaderboard
                clips={leaderboardClips}
                title={
                  entityType === "player" ? "Top Clips" : `Top ${displayName} Clips`
                }
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
