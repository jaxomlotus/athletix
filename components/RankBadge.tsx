interface RankBadgeProps {
  rank: number;
  rankChange?: number;
  variant?: "clip" | "leaderboard";
}

function getOrdinalSuffix(rank: number): string {
  const j = rank % 10;
  const k = rank % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
}

export default function RankBadge({ rank, rankChange = 0, variant = "clip" }: RankBadgeProps) {
  const isRising = rankChange > 0;
  const hasChange = rankChange !== 0;
  const ordinal = `${rank}${getOrdinalSuffix(rank)}`;

  if (variant === "leaderboard") {
    // Leaderboard variant: ordinal with triangle below
    return (
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-lg font-bold text-gray-900">
          {ordinal}
        </span>
        {hasChange && (
          <div
            className={`w-0 h-0 ${
              isRising
                ? "border-l-[5px] border-r-[5px] border-b-[6px] border-l-transparent border-r-transparent border-b-green-600"
                : "border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-red-600"
            }`}
            title={isRising ? `+${Math.abs(rankChange)}` : `${rankChange}`}
          />
        )}
      </div>
    );
  }

  // Clip variant: ordinal with triangle to the left (pointing up for green, down for red)
  return (
    <div className="flex items-center gap-1.5">
      {hasChange && (
        <div
          className={`w-0 h-0 ${
            isRising
              ? "border-l-[5px] border-r-[5px] border-b-[6px] border-l-transparent border-r-transparent border-b-green-600"
              : "border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-red-600"
          }`}
          title={isRising ? `+${Math.abs(rankChange)}` : `${rankChange}`}
        />
      )}
      <span className="text-base font-bold text-gray-900">
        {ordinal}
      </span>
    </div>
  );
}
