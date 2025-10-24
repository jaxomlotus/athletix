import Image from "next/image";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

interface LeaderboardClip {
  id: string;
  title: string;
  thumbnail: string | null;
  url: string;
  rank: number;
  rankChange: number;
}

interface LeaderboardProps {
  clips: LeaderboardClip[];
  title?: string;
}

export default function Leaderboard({
  clips,
  title = "Top Clips",
}: LeaderboardProps) {
  const defaultThumbnail = "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg";

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sticky top-20">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      <div className="space-y-3">
        {clips.map((clip) => {
          const isRising = clip.rankChange > 0;
          const hasChange = clip.rankChange !== 0;

          return (
            <a
              key={clip.id}
              href="#"
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {/* Rank */}
              <div className="flex flex-col items-center gap-1 shrink-0 w-12">
                <span className="text-lg font-bold text-gray-900">
                  {clip.rank}
                </span>
                {hasChange && (
                  <span
                    className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
                      isRising ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isRising ? (
                      <FaArrowUp className="w-2.5 h-2.5" />
                    ) : (
                      <FaArrowDown className="w-2.5 h-2.5" />
                    )}
                    {Math.abs(clip.rankChange)}
                  </span>
                )}
              </div>

              {/* Thumbnail */}
              <div className="relative w-24 h-16 shrink-0 rounded overflow-hidden bg-gray-200">
                <Image
                  src={clip.thumbnail || defaultThumbnail}
                  alt={clip.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Title */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                  {clip.title}
                </h3>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
