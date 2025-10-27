import Image from "next/image";
import prisma from "@/lib/prisma";
import NavigationHeader from "@/components/NavigationHeader";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";

export const dynamic = 'force-dynamic';

async function getAllPlayers() {
  try {
    const players = await prisma.user.findMany({
      orderBy: [
        { name: 'asc' },
      ],
      include: {
        teamUsers: {
          include: {
            team: {
              select: {
                title: true,
                id: true,
              },
            },
          },
          take: 1, // Get first team for display
        },
      },
    });

    return players;
  } catch (error) {
    console.error("Error fetching players:", error);
    return [];
  }
}

function createPlayerSlug(
  userId: string,
  displayName: string | null,
  name: string | null
): string {
  const playerName = displayName || name || "Unknown";
  const slugName = playerName
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "");
  return `${userId}-${slugName}`;
}

function createTeamSlug(teamName: string): string {
  return teamName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default async function PlayersPage() {
  const players = await getAllPlayers();
  const defaultAvatar = "https://i.pravatar.cc/150";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavigationHeader />

      <PageHeader
        title="All Players"
        subtitle="Browse all athletes on the platform"
        breadcrumbs={[
          { label: "Home", href: "/" },
        ]}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
            Players Directory
          </h2>
          {!players || players.length === 0 ? (
            <p className="w-full text-center text-gray-400 py-8">Nothing here yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {players.map((player) => {
                const playerSlug = createPlayerSlug(
                  player.id,
                  player.displayName,
                  player.name
                );
                const primaryTeam = player.teamUsers[0]?.team;

                return (
                  <a
                    key={player.id}
                    href={`/players/${playerSlug}`}
                    className="flex flex-col items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
                  >
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gray-200 shrink-0">
                      <Image
                        src={player.avatar || defaultAvatar}
                        alt={player.displayName || player.name || "Player"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-center min-w-0 w-full">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {player.displayName || player.name}
                      </h3>
                      {primaryTeam && (
                        <p className="text-sm text-gray-500 mt-1 truncate">
                          {primaryTeam.title}
                        </p>
                      )}
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
