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
import { getEntityType, getEntityDisplayName, pluralizeType, EntityType } from "@/lib/entity-utils";
import { Metadata } from "next";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, ThumbsUp, Pin, Lock, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string; slug: string; id: string }>;
}): Promise<Metadata> {
  const { type, slug, id } = await params;
  const entityType = getEntityType(type);

  if (!entityType) {
    return {
      title: "Not Found",
      description: "The requested page could not be found.",
    };
  }

  const [entity, topic] = await Promise.all([
    getEntityBySlug(entityType, slug),
    prisma.discussionTopic.findUnique({
      where: { id: parseInt(id) },
      select: { title: true },
    }),
  ]);

  if (!entity || !topic) {
    return {
      title: "Not Found",
      description: "The requested page could not be found.",
    };
  }

  const displayType = getEntityDisplayName(entityType);

  return {
    title: `${topic.title} | ${entity.name} Discussions`,
    description: `Join the discussion: ${topic.title}`,
    openGraph: {
      title: `${topic.title} | ${entity.name} Discussions`,
      description: `Join the discussion: ${topic.title}`,
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

export default async function DiscussionTopicPage({
  params,
}: {
  params: Promise<{ type: string; slug: string; id: string }>;
}) {
  const { type, slug, id } = await params;

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

  const topicId = parseInt(id);
  if (isNaN(topicId)) {
    notFound();
  }

  // Fetch the discussion topic
  const topic = await prisma.discussionTopic.findUnique({
    where: {
      id: topicId,
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
  });

  if (!topic || topic.subjectId !== entity.id || topic.isDeleted) {
    notFound();
  }

  // Fetch top-level comments with their replies
  const topLevelComments = await prisma.discussionComment.findMany({
    where: {
      parentType: "topic",
      parentId: topicId,
      replyToCommentId: null, // Only top-level
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
      replies: {
        where: {
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
          replyToUser: {
            select: {
              id: true,
              name: true,
              displayName: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const breadcrumbs = buildBreadcrumbs(entity, entityType);

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

    const currentTeam = entity.playerMemberships?.[0]?.team as any;
    const teamMetadata = (currentTeam?.metadata || {}) as any;
    const schoolName = teamMetadata.schoolName || null;
    const schoolSlug = teamMetadata.schoolSlug || null;

    const locationName = metadata.locationName;
    const locationSlug = metadata.locationSlug;

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

  // Increment view count (fire and forget)
  prisma.discussionTopic
    .update({
      where: { id: topicId },
      data: { viewCount: { increment: 1 } },
    })
    .catch(() => {
      // Ignore errors
    });

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
        <div className="max-w-4xl mx-auto">
          {/* Back to discussions link */}
          <Link
            href={`/${pluralizeType(entityType)}/${entity.slug}/discussions`}
            className="text-sm text-green-600 hover:text-green-700 mb-4 inline-flex items-center gap-1"
          >
            ← Back to all discussions
          </Link>

          {/* Topic */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            {/* Topic Header */}
            <div className="flex items-start gap-4 mb-4">
              {/* Author Avatar */}
              <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                {topic.author.image ? (
                  <img
                    src={topic.author.image}
                    alt={topic.author.displayName || topic.author.name || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold text-lg">
                    {(topic.author.displayName || topic.author.name || "?")[0].toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex-1">
                {/* Title with badges */}
                <div className="flex items-start gap-2 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex-1">
                    {topic.isPinned && (
                      <Pin className="inline w-5 h-5 text-green-600 mr-2" />
                    )}
                    {topic.isLocked && (
                      <Lock className="inline w-5 h-5 text-gray-500 mr-2" />
                    )}
                    {topic.title}
                  </h1>
                  {topic.category && (
                    <span
                      className="px-3 py-1 text-sm rounded-full font-medium flex-shrink-0"
                      style={{
                        backgroundColor: topic.category.color || "#e5e7eb",
                        color: topic.category.color ? "#fff" : "#374151",
                      }}
                    >
                      {topic.category.name}
                    </span>
                  )}
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="font-medium">
                    {topic.author.displayName || topic.author.name || "Anonymous"}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDistanceToNow(new Date(topic.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {topic.commentCount} {topic.commentCount === 1 ? "comment" : "comments"}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    {topic.likeCount}
                  </span>
                  <span>•</span>
                  <span>{topic.viewCount} views</span>
                </div>
              </div>
            </div>

            {/* Topic Content */}
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
              {topic.content}
            </div>

            {/* Actions */}
            <div className="mt-6 pt-6 border-t border-gray-200 flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-green-600 transition-colors">
                <ThumbsUp className="w-4 h-4" />
                Like
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-green-600 transition-colors">
                <MessageCircle className="w-4 h-4" />
                Reply
              </button>
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">
              {topic.commentCount} {topic.commentCount === 1 ? "Comment" : "Comments"}
            </h2>

            {topLevelComments.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500">No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              topLevelComments.map((comment) => (
                <div key={comment.id} className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  {/* Comment Header */}
                  <div className="flex items-start gap-3 mb-3">
                    {/* Author Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                      {comment.author.image ? (
                        <img
                          src={comment.author.image}
                          alt={comment.author.displayName || comment.author.name || "User"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold">
                          {(comment.author.displayName || comment.author.name || "?")[0].toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">
                          {comment.author.displayName || comment.author.name || "Anonymous"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                        {comment.isEdited && (
                          <span className="text-xs text-gray-400">(edited)</span>
                        )}
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>

                      {/* Comment Actions */}
                      <div className="mt-2 flex items-center gap-4 text-sm">
                        <button className="flex items-center gap-1 text-gray-500 hover:text-green-600 transition-colors">
                          <ThumbsUp className="w-3.5 h-3.5" />
                          {comment.likeCount > 0 && <span>{comment.likeCount}</span>}
                        </button>
                        <button className="text-gray-500 hover:text-green-600 transition-colors">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Nested Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-10 mt-4 space-y-4 border-l-2 border-gray-200 pl-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start gap-3">
                          {/* Reply Author Avatar */}
                          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                            {reply.author.image ? (
                              <img
                                src={reply.author.image}
                                alt={reply.author.displayName || reply.author.name || "User"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold text-sm">
                                {(reply.author.displayName || reply.author.name || "?")[0].toUpperCase()}
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-900 text-sm">
                                {reply.author.displayName || reply.author.name || "Anonymous"}
                              </span>
                              {reply.replyToUser && (
                                <>
                                  <span className="text-xs text-gray-400">→</span>
                                  <span className="text-sm text-gray-600">
                                    @{reply.replyToUser.displayName || reply.replyToUser.name}
                                  </span>
                                </>
                              )}
                              <span className="text-xs text-gray-500">
                                {formatDistanceToNow(new Date(reply.createdAt), {
                                  addSuffix: true,
                                })}
                              </span>
                              {reply.isEdited && (
                                <span className="text-xs text-gray-400">(edited)</span>
                              )}
                            </div>
                            <p className="text-gray-700 text-sm whitespace-pre-wrap">
                              {reply.content}
                            </p>

                            {/* Reply Actions */}
                            <div className="mt-2 flex items-center gap-4 text-xs">
                              <button className="flex items-center gap-1 text-gray-500 hover:text-green-600 transition-colors">
                                <ThumbsUp className="w-3 h-3" />
                                {reply.likeCount > 0 && <span>{reply.likeCount}</span>}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}

            {/* Add Comment Form (Placeholder) */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add a Comment</h3>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={4}
                placeholder="Share your thoughts..."
                disabled
              />
              <div className="mt-4 flex justify-end">
                <button
                  className="px-6 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
                  disabled
                >
                  Post Comment (Coming Soon)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
