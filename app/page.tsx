import Image from "next/image";
import prisma from "@/lib/prisma";
import NavigationHeader from "@/components/NavigationHeader";
import ClipsSection from "@/components/ClipsSection";
import Leaderboard from "@/components/Leaderboard";
import Footer from "@/components/Footer";

async function getHomeData() {
  try {
    // Fetch all sports entities
    const allSports = await prisma.entity.findMany({
      where: { type: 'sport' },
      orderBy: { name: 'asc' },
    });

    // Filter sports by gender metadata
    const mensSports = allSports.filter(sport =>
      (sport.metadata as { mens?: boolean })?.mens === true
    );
    const womensSports = allSports.filter(sport =>
      (sport.metadata as { womens?: boolean })?.womens === true
    );
    const coedSports = allSports.filter(sport =>
      (sport.metadata as { coed?: boolean })?.coed === true
    );

    // Fetch all clips from player entities
    const allClips = await prisma.clip.findMany({
      include: {
        entityClips: {
          include: {
            entity: {
              select: {
                id: true,
                name: true,
                logo: true,
                type: true,
              },
            },
          },
          take: 1, // Get first entity who has this clip
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    return { mensSports, womensSports, coedSports, allClips };
  } catch (error) {
    console.error("Error fetching home data:", error);
    return { mensSports: [], womensSports: [], coedSports: [], allClips: [] };
  }
}

function createSportSlug(sportName: string): string {
  return sportName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default async function HomePage() {
  const { mensSports, womensSports, coedSports, allClips } = await getHomeData();

  // Prepare clips for ClipsSection
  const formattedClips = allClips
    .filter((clip) => clip.entityClips.length > 0)
    .map((clip) => {
      const entityClip = clip.entityClips[0];
      const entity = entityClip.entity;
      return {
        clip: {
          ...clip,
          createdAt: clip.createdAt,
        },
        playerName: entity.name || "Unknown",
        playerId: entity.id,
        playerAvatar: entity.logo,
        playerTags: [
          {
            name: entity.name || "Unknown",
            id: entity.id,
            avatar: entity.logo,
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
    rankChange: Math.floor(Math.random() * 7) - 3, // -3 to +3
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
            {/* Sports Section */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Browse by Sport
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                {/* Men's Sports Column */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Men&apos;s Sports
                  </h3>
                  <ul className="space-y-2">
                    {mensSports.map((sport) => {
                      return (
                        <li key={sport.id}>
                          <a
                            href={`/sports/${sport.slug}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {sport.name}
                          </a>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Coed Sports under Men's column */}
                  {coedSports.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Coed Sports
                      </h3>
                      <ul className="space-y-2">
                        {coedSports.map((sport) => {
                          return (
                            <li key={sport.id}>
                              <a
                                href={`/sports/${sport.slug}`}
                                className="text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                {sport.name}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Women's Sports Column */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Women&apos;s Sports
                  </h3>
                  <ul className="space-y-2">
                    {womensSports.map((sport) => {
                      return (
                        <li key={sport.id}>
                          <a
                            href={`/sports/${sport.slug}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {sport.name}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>

            {/* Clips Section */}
            <ClipsSection clips={formattedClips} title="Latest Highlights" />
          </div>

          {/* Right Column - Leaderboard (Hidden on mobile) */}
          <div className="hidden lg:block lg:col-span-4">
            <Leaderboard clips={leaderboardClips} title="Trending Now" stickyTop="top-20" />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
