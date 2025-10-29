import Image from "next/image";
import Link from "next/link";
import { FaThumbsUp } from "react-icons/fa";
import RankBadge from "./RankBadge";

interface PlayerTag {
  name: string;
  id: string;
  slug: string;
  avatar: string | null;
}

interface TeamTag {
  name: string;
  id: string;
  slug: string;
  logo: string | null;
}

interface ClipData {
  clip: {
    id: string;
    url: string;
    title: string;
    description: string | null;
    thumbnail: string | null;
    platform: string | null;
    createdAt?: Date;
  };
  playerName: string;
  playerId: string;
  playerSlug: string;
  playerAvatar: string | null;
  playerTags?: PlayerTag[];
  teamTags?: TeamTag[];
}

interface ClipsSectionProps {
  clips: ClipData[];
  title?: string;
}

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    let videoId = null;

    if (urlObj.hostname.includes("youtube.com")) {
      videoId = urlObj.searchParams.get("v");
    } else if (urlObj.hostname.includes("youtu.be")) {
      videoId = urlObj.pathname.slice(1);
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)}mo ago`;
  return `${Math.floor(seconds / 31536000)}y ago`;
}

export default function ClipsSection({ clips, title = "Highlight Clips" }: ClipsSectionProps) {
  const defaultAvatar = "https://i.pravatar.cc/150";

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
        {title}
      </h2>
      {!clips || clips.length === 0 ? (
        <p className="w-full text-center text-gray-400 py-8">No clips to show</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {clips.map(({ clip, playerName, playerId, playerSlug, playerAvatar, playerTags, teamTags }, index) => {
          const embedUrl = getYouTubeEmbedUrl(clip.url);
          const rank = index + 1;
          const rankChange = Math.floor(Math.random() * 7) - 3; // -3 to +3
          const isRising = rankChange > 0;

          return (
            <div key={clip.id} className="space-y-2 sm:space-y-3">
              {/* Video */}
              {embedUrl ? (
                <div
                  className="relative w-full"
                  style={{ paddingBottom: "56.25%" }}
                >
                  <iframe
                    src={embedUrl}
                    title={clip.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                  />
                </div>
              ) : (
                <div
                  className="relative w-full bg-gray-200 rounded-lg"
                  style={{ paddingBottom: "56.25%" }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-500">Video unavailable</p>
                  </div>
                </div>
              )}

              {/* Meta Info: Player Info (Left) and Rank + Vote (Right) */}
              <div className="flex items-center justify-between gap-2">
                {/* Player Info - Left */}
                <div className="flex items-center gap-2 min-w-0">
                  <a
                    href={`/players/${playerSlug}`}
                    className="flex items-center gap-2 text-xs sm:text-sm text-green-600 hover:text-green-700 font-semibold shrink-0"
                  >
                    <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden bg-gray-200 shrink-0">
                      <Image
                        src={playerAvatar || defaultAvatar}
                        alt={playerName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span>{playerName}</span>
                  </a>
                  {clip.createdAt && (
                    <span className="text-xs text-gray-400">
                      {getRelativeTime(clip.createdAt)}
                    </span>
                  )}
                </div>

                {/* Rank + Vote - Right */}
                <div className="flex items-center gap-2">
                  <RankBadge rank={rank} rankChange={rankChange} variant="clip" />
                  <button
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 bg-green-50 hover:bg-green-100 text-green-600 rounded-full transition-colors shrink-0"
                    title="Vote for this clip"
                  >
                    <FaThumbsUp className="w-3 sm:w-4 h-3 sm:h-4" />
                    <span className="font-semibold text-xs sm:text-sm">
                      {Math.floor(Math.random() * 500) + 50}
                    </span>
                  </button>
                </div>
              </div>

              {/* Title and Description - Full Width */}
              <div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                  {clip.title}
                </h3>
                {clip.description && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {clip.description}
                  </p>
                )}
              </div>

              {/* Tags - Full width */}
              {((playerTags && playerTags.length > 0) || (teamTags && teamTags.length > 0)) && (
                <div className="flex flex-wrap gap-2">
                  {/* Team Tags */}
                  {teamTags?.map((team) => {
                    return (
                      <Link
                        key={team.id}
                        href={`/teams/${team.slug}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 rounded-full hover:bg-green-100 transition-colors"
                      >
                        {team.logo && (
                          <div className="relative w-5 h-5 rounded-full overflow-hidden bg-white shrink-0">
                            <Image
                              src={team.logo}
                              alt={team.name}
                              fill
                              className="object-contain p-0.5"
                            />
                          </div>
                        )}
                        <span className="text-xs font-medium text-green-700">
                          {team.name}
                        </span>
                      </Link>
                    );
                  })}
                  {/* Player Tags */}
                  {playerTags?.map((player) => {
                    return (
                      <Link
                        key={player.id}
                        href={`/players/${player.slug}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        <div className="relative w-5 h-5 rounded-full overflow-hidden bg-gray-200 shrink-0">
                          <Image
                            src={player.avatar || defaultAvatar}
                            alt={player.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-700">
                          {player.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
}
