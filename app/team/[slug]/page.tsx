import { notFound } from "next/navigation";
import Image from "next/image";
import prisma from "@/lib/prisma";
import NavigationHeader from "@/components/NavigationHeader";
import PageHeader from "@/components/PageHeader";
import ClipsSection from "@/components/ClipsSection";
import Leaderboard from "@/components/Leaderboard";
import Footer from "@/components/Footer";

export const dynamic = 'force-dynamic';

interface TeamData {
  id: string;
  title: string;
  description: string | null;
  logo: string | null;
  sport: {
    name: string;
  };
  league: {
    name: string;
  };
  teamUsers: Array<{
    role: string | null;
    jerseyNumber: number | null;
    position: string | null;
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
}

async function getTeamData(slug: string): Promise<TeamData | null> {
  try {
    // Convert slug back to team title (e.g., "toronto-blue-jays" -> "Toronto Blue Jays")
    const teamTitle = slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const team = await prisma.team.findUnique({
      where: { title: teamTitle },
      include: {
        sport: true,
        league: true,
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
    });

    return team;
  } catch (error) {
    console.error("Error fetching team:", error);
    return null;
  }
}

function createPlayerSlug(
  userId: string,
  displayName: string | null,
  name: string | null
): string {
  const playerName = displayName || name || "Unknown";
  const slugName = playerName.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "");
  return `${userId}-${slugName}`;
}

function createLeagueSlug(leagueName: string): string {
  return leagueName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function createSportSlug(sportName: string): string {
  return sportName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default async function TeamProfile({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const team = await getTeamData(slug);

  if (!team) {
    notFound();
  }

  const defaultLogo = "https://via.placeholder.com/200";
  const leagueSlug = createLeagueSlug(team.league.name);
  const sportSlug = createSportSlug(team.sport.name);

  // Aggregate all clips from all players on the team
  const allClips = team.teamUsers.flatMap((teamUser) =>
    teamUser.user.userClips.map(({ clip }) => {
      // Get up to 2 other players from the team as tags (deterministic)
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
        teamTags: [
          {
            name: team.title,
            id: team.id,
            logo: team.logo,
          },
        ],
      };
    })
  );

  // Prepare leaderboard data - only clips from this team
  const leaderboardClips = allClips.slice(0, 10).map((clip, index) => ({
    id: clip.clip.id,
    title: clip.clip.title,
    thumbnail: clip.clip.thumbnail,
    url: clip.clip.url,
    rank: index + 1,
    rankChange: Math.floor(Math.random() * 7) - 3, // -3 to +3
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />

      <PageHeader
        title={team.title}
        subtitle={team.description || undefined}
        logo={team.logo || defaultLogo}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: team.sport.name, href: `/sports/${sportSlug}` },
          { label: team.league.name, href: `/league/${leagueSlug}` },
        ]}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8">
            {/* Roster */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Roster</h2>
              {!team.teamUsers || team.teamUsers.length === 0 ? (
                <p className="w-full text-center text-gray-400 py-8">Nothing here yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {team.teamUsers.map(({ user, jerseyNumber, position, role }) => {
                    const playerSlug = createPlayerSlug(
                      user.id,
                      user.displayName,
                      user.name
                    );
                    const defaultAvatar = "https://i.pravatar.cc/150";

                    return (
                      <a
                        key={user.id}
                        href={`/players/${playerSlug}`}
                        className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
                      >
                        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200 shrink-0">
                          <Image
                            src={user.avatar || defaultAvatar}
                            alt={user.displayName || user.name || "Player"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {jerseyNumber && (
                              <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white font-bold text-sm rounded">
                                {jerseyNumber}
                              </span>
                            )}
                            <h3 className="font-semibold text-gray-900 truncate">
                              {user.displayName || user.name}
                            </h3>
                          </div>
                          {position && (
                            <p className="text-sm text-gray-500 mt-1">{position}</p>
                          )}
                          {role && role !== "Player" && (
                            <p className="text-xs text-gray-400 mt-1">{role}</p>
                          )}
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Clips Section */}
            <ClipsSection clips={allClips} title="Team Highlight Clips" />
          </div>

          {/* Right Column - Leaderboard (Hidden on mobile) */}
          <div className="hidden lg:block lg:col-span-4">
            <Leaderboard clips={leaderboardClips} title="Top Team Clips" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
