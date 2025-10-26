import { notFound } from "next/navigation";
import Image from "next/image";
import prisma from "@/lib/prisma";
import NavigationHeader from "@/components/NavigationHeader";
import PageHeader from "@/components/PageHeader";
import ClipsSection from "@/components/ClipsSection";
import Leaderboard from "@/components/Leaderboard";
import Footer from "@/components/Footer";

export const dynamic = 'force-dynamic';

interface SportData {
  id: string;
  name: string;
  description: string | null;
  leagues: Array<{
    id: string;
    name: string;
    description: string | null;
  }>;
}

async function getSportData(slug: string) {
  try {
    // Convert slug back to sport name
    const sportName = slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const sport = await prisma.sport.findFirst({
      where: { name: sportName },
      include: {
        leagues: {
          include: {
            teams: {
              include: {
                teamUsers: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        displayName: true,
                        name: true,
                        avatar: true,
                        userClips: {
                          include: {
                            clip: true,
                          },
                          orderBy: {
                            order: "asc",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return sport;
  } catch (error) {
    console.error("Error fetching sport:", error);
    return null;
  }
}

function createLeagueSlug(leagueName: string): string {
  return leagueName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default async function SportPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sport = await getSportData(slug);

  if (!sport) {
    notFound();
  }

  // Aggregate all clips from all teams in all leagues in this sport
  const allClips = sport.leagues.flatMap((league) =>
    league.teams.flatMap((team) =>
      team.teamUsers.flatMap((teamUser) =>
        teamUser.user.userClips.map(({ clip }) => {
          // Get up to 2 teammates as tags (deterministic)
          const otherPlayers = team.teamUsers
            .filter((tu) => tu.user.id !== teamUser.user.id)
            .slice(0, 2);

          const playerTags = [
            {
              name: teamUser.user.displayName || teamUser.user.name || "Unknown",
              id: teamUser.user.id,
              avatar: teamUser.user.avatar,
            },
            ...otherPlayers.map((tu) => ({
              name: tu.user.displayName || tu.user.name || "Unknown",
              id: tu.user.id,
              avatar: tu.user.avatar,
            })),
          ];

          return {
            clip: {
              ...clip,
              createdAt: clip.createdAt,
            },
            playerName: teamUser.user.displayName || teamUser.user.name || "Unknown",
            playerId: teamUser.user.id,
            playerAvatar: teamUser.user.avatar,
            playerTags,
          };
        })
      )
    )
  );

  // Prepare leaderboard data
  const leaderboardClips = allClips.slice(0, 10).map((clip, index) => ({
    id: clip.clip.id,
    title: clip.clip.title,
    thumbnail: clip.clip.thumbnail,
    url: clip.clip.url,
    rank: index + 1,
    rankChange: Math.floor(Math.random() * 7) - 3, // -3 to +3
  }));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavigationHeader />

      <PageHeader
        title={sport.name}
        subtitle={sport.description || undefined}
        breadcrumbs={[
          { label: "Home", href: "/" },
        ]}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8">
            {/* Leagues Section */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Leagues
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sport.leagues.map((league) => {
                  const leagueSlug = createLeagueSlug(league.name);
                  return (
                    <a
                      key={league.id}
                      href={`/league/${leagueSlug}`}
                      className="flex flex-col gap-2 p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
                    >
                      <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
                        {league.name}
                      </h3>
                      {league.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {league.description}
                        </p>
                      )}
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Clips Section */}
            <ClipsSection clips={allClips} title="Sport Highlight Clips" />
          </div>

          {/* Right Column - Leaderboard (Hidden on mobile) */}
          <div className="hidden lg:block lg:col-span-4">
            <Leaderboard clips={leaderboardClips} title="Top Sport Clips" />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
