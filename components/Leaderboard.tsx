import Image from "next/image";
import RankBadge from "./RankBadge";

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
    <div className="bg-white rounded-lg shadow-sm p-4 sticky top-28">
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
              <div className="shrink-0 w-12">
                <RankBadge rank={clip.rank} rankChange={clip.rankChange} variant="leaderboard" />
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
