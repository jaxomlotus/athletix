"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Pin, Lock } from "lucide-react";
import { pluralizeType } from "@/lib/entity-utils";

interface DiscussionTopic {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    name: string | null;
    displayName: string | null;
    image: string | null;
  };
  category: {
    id: number;
    name: string;
    slug: string;
    color: string | null;
  } | null;
  commentCount: number;
  viewCount: number;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: Date;
  lastCommentAt: Date;
  originEntity?: {
    id: number;
    name: string;
    slug: string;
    type: string;
  };
}

interface DiscussionsProps {
  entityId: number;
  entityType: string;
  entitySlug: string;
  variant?: "shorthand" | "full";
  topics: DiscussionTopic[];
  totalCount: number;
}

export default function Discussions({
  entityId,
  entityType,
  entitySlug,
  variant = "shorthand",
  topics,
  totalCount,
}: DiscussionsProps) {
  const router = useRouter();
  const isShorthand = variant === "shorthand";
  const displayTopics = isShorthand ? topics.slice(0, 5) : topics;

  if (topics.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
          Discussions
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No discussions yet</p>
          <Link
            href={`/${entityType}/${entitySlug}/discussions/new`}
            className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Start a Discussion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Discussions
        </h2>
        {isShorthand && totalCount > 5 && (
          <Link
            href={`/${entityType}/${entitySlug}/discussions`}
            className="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            View all ({totalCount})
          </Link>
        )}
      </div>

      <div className="space-y-3">
        {displayTopics.map((topic) => (
          <Link
            key={topic.id}
            href={`/${entityType}/${entitySlug}/discussions/${topic.id}`}
            className="block p-3 sm:p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-sm transition-all"
          >
            <div className="flex items-start gap-3">
              {/* Author Avatar */}
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                {topic.author.image ? (
                  <img
                    src={topic.author.image}
                    alt={topic.author.displayName || topic.author.name || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold">
                    {(topic.author.displayName || topic.author.name || "?")[0].toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                {/* Title with badges */}
                <div className="flex items-start gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 flex-1">
                    {topic.isPinned && (
                      <Pin className="inline w-4 h-4 text-green-600 mr-1" />
                    )}
                    {topic.isLocked && (
                      <Lock className="inline w-4 h-4 text-gray-500 mr-1" />
                    )}
                    {topic.title}
                  </h3>
                  {topic.category && (
                    <span
                      className="px-2 py-0.5 text-xs rounded-full font-medium flex-shrink-0"
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
                <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                  <span>
                    {topic.author.displayName || topic.author.name || "Anonymous"}
                  </span>
                  {topic.originEntity && topic.originEntity.id !== entityId && (
                    <>
                      <span>•</span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (topic.originEntity) {
                            router.push(`/${pluralizeType(topic.originEntity.type as any)}/${topic.originEntity.slug}`);
                          }
                        }}
                        className="text-green-600 hover:text-green-700 hover:underline cursor-pointer"
                      >
                        Posted in {topic.originEntity.name}
                      </button>
                    </>
                  )}
                  <span>•</span>
                  <span suppressHydrationWarning>
                    {formatDistanceToNow(new Date(topic.lastCommentAt), {
                      addSuffix: true,
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5" />
                    {topic.commentCount}
                  </span>
                  {!isShorthand && (
                    <span>
                      {topic.viewCount} {topic.viewCount === 1 ? "view" : "views"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {!isShorthand && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link
            href={`/${entityType}/${entitySlug}/discussions/new`}
            className="w-full block text-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Start a Discussion
          </Link>
        </div>
      )}
    </div>
  );
}
