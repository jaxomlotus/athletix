import Image from "next/image";
import prisma from "@/lib/prisma";
import NavigationHeader from "@/components/NavigationHeader";
import ClipsSection from "@/components/ClipsSection";
import Leaderboard from "@/components/Leaderboard";
import Footer from "@/components/Footer";

async function getHomeData() {
  try {
    // Fetch all leagues
    const leagues = await prisma.league.findMany({
      include: {
        sport: true,
        teams: {
          take: 3, // Preview of teams
        },
      },
    });

    // Fetch all clips from all users
    const allClips = await prisma.clip.findMany({
      include: {
        userClips: {
          include: {
            user: {
              select: {
                id: true,
                displayName: true,
                name: true,
                avatar: true,
              },
            },
          },
          take: 1, // Get first user who has this clip
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    return { leagues, allClips };
  } catch (error) {
    console.error("Error fetching home data:", error);
    return { leagues: [], allClips: [] };
  }
}

function createLeagueSlug(leagueName: string): string {
  return leagueName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default async function HomePage() {
  const { leagues, allClips } = await getHomeData();

  // Prepare clips for ClipsSection
  const formattedClips = allClips
    .filter((clip) => clip.userClips.length > 0)
    .map((clip) => {
      const userClip = clip.userClips[0];
      return {
        clip: {
          ...clip,
          createdAt: clip.createdAt,
        },
        playerName:
          userClip.user.displayName || userClip.user.name || "Unknown",
        playerId: userClip.user.id,
        playerAvatar: userClip.user.avatar,
        playerTags: [
          {
            name: userClip.user.displayName || userClip.user.name || "Unknown",
            id: userClip.user.id,
            avatar: userClip.user.avatar,
          },
        ],
      };
    });

  // Prepare leaderboard data
  const leaderboardClips = formattedClips.slice(0, 10).map((clip, index) => ({
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

      {/* Hero Section */}
      <div className="relative bg-linear-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=600&fit=crop"
            alt="Sports team"
            fill
            className="object-cover opacity-50"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Your Athletic Journey
            </h1>
            <p className="text-lg sm:text-xl mb-8 opacity-90">
              The ultimate platform for athletes to share highlights, connect
              with fans, and build their personal brand
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-lg">
                Get Started
              </button>
              <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors text-lg">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8">
            {/* Leagues Section */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Browse by League
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {leagues.map((league) => {
                  const leagueSlug = createLeagueSlug(league.name);
                  return (
                    <a
                      key={league.id}
                      href={`/league/${leagueSlug}`}
                      className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
                          {league.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {league.sport.name} • {league.teams.length} teams
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Clips Section */}
            <ClipsSection clips={formattedClips} title="Latest Highlights" />
          </div>

          {/* Right Column - Leaderboard (Hidden on mobile) */}
          <div className="hidden lg:block lg:col-span-4">
            <Leaderboard clips={leaderboardClips} title="Trending Now" />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
