import { notFound } from "next/navigation";
import Image from "next/image";
import prisma from "@/lib/prisma";
import NavigationHeader from "@/components/NavigationHeader";
import ClipsSection from "@/components/ClipsSection";
import Leaderboard from "@/components/Leaderboard";
import Footer from "@/components/Footer";

export const dynamic = 'force-dynamic';

interface LeagueData {
  id: string;
  name: string;
  description: string | null;
  sport: {
    name: string;
  };
  teams: Array<{
    id: string;
    title: string;
    logo: string | null;
    description: string | null;
    teamUsers: Array<{
      user: {
        id: string;
        displayName: string | null;
        name: string | null;
        avatar: string | null;
        userClips: Array<{
          clip: {
            id: string;
            url: string;
            title: string;
            description: string | null;
            thumbnail: string | null;
            platform: string | null;
            createdAt: Date;
          };
        }>;
      };
    }>;
  }>;
}

async function getLeagueData(slug: string): Promise<LeagueData | null> {
  try {
    // Convert slug back to league name
    const leagueName = slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const league = await prisma.league.findFirst({
      where: { name: leagueName },
      include: {
        sport: true,
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
    });

    return league;
  } catch (error) {
    console.error("Error fetching league:", error);
    return null;
  }
}

function createTeamSlug(teamName: string): string {
  return teamName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default async function LeaguePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const league = await getLeagueData(slug);

  if (!league) {
    notFound();
  }

  const defaultLogo = "https://via.placeholder.com/200";

  // Aggregate all clips from all teams in the league
  const allClips = league.teams.flatMap((team) =>
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
  );

  // Prepare leaderboard data
  const leaderboardClips = allClips.slice(0, 10).map((clip, index) => ({
    id: clip.clip.id,
    title: clip.clip.title,
    thumbnail: clip.clip.thumbnail,
    url: clip.clip.url,
    rank: index + 1,
    rankChange: 0, // Static for now to avoid hydration issues
  }));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavigationHeader />

      {/* Header with League Info */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
              {league.name}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl opacity-90">
              {league.sport.name}
            </p>
            {league.description && (
              <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg opacity-80 max-w-2xl">
                {league.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8">
            {/* Teams Section */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Teams
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                {league.teams.map((team) => {
                  const teamSlug = createTeamSlug(team.title);
                  return (
                    <a
                      key={team.id}
                      href={`/team/${teamSlug}`}
                      className="flex flex-col items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
                    >
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-white p-2">
                        <Image
                          src={team.logo || defaultLogo}
                          alt={team.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <h3 className="font-semibold text-gray-900 text-center text-sm sm:text-base">
                        {team.title}
                      </h3>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Clips Section */}
            <ClipsSection clips={allClips} title="League Highlight Clips" />
          </div>

          {/* Right Column - Leaderboard (Hidden on mobile) */}
          <div className="hidden lg:block lg:col-span-4">
            <Leaderboard clips={leaderboardClips} title="Top League Clips" />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
