import { notFound } from "next/navigation";
import Image from "next/image";
import prisma from "@/lib/prisma";
import NavigationHeader from "@/components/NavigationHeader";
import PlayerHeader from "@/components/PlayerHeader";
import ClipsSection from "@/components/ClipsSection";
import Footer from "@/components/Footer";
import {
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaFacebook,
  FaTiktok,
  FaLinkedin,
} from "react-icons/fa";

export const dynamic = 'force-dynamic';

interface PlayerData {
  id: string;
  name: string | null;
  email: string | null;
  avatar: string | null;
  bannerImage: string | null;
  displayName: string | null;
  bio: string | null;
  socialLinks: any;
  followerCount: number;
  followingCount: number;
  teamUsers: Array<{
    role: string | null;
    jerseyNumber: number | null;
    position: string | null;
    team: {
      title: string;
      logo: string | null;
      sport: {
        name: string;
      };
      league: {
        name: string;
      };
    };
  }>;
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
}

async function getPlayerData(slug: string): Promise<PlayerData | null> {
  try {
    // Extract userId from slug (format: userId-Display-Name)
    const userId = slug.split("-")[0];

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        teamUsers: {
          include: {
            team: {
              include: {
                sport: true,
                league: true,
              },
            },
          },
        },
        userClips: {
          include: {
            clip: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching player:", error);
    return null;
  }
}

function getSocialIcon(platform: string) {
  const platformLower = platform.toLowerCase();
  switch (platformLower) {
    case "twitter":
      return <FaTwitter className="w-5 h-5 text-blue-600" />;
    case "instagram":
      return <FaInstagram className="w-5 h-5 text-blue-600" />;
    case "youtube":
      return <FaYoutube className="w-5 h-5 text-blue-600" />;
    case "facebook":
      return <FaFacebook className="w-5 h-5 text-blue-600" />;
    case "tiktok":
      return <FaTiktok className="w-5 h-5 text-blue-600" />;
    case "linkedin":
      return <FaLinkedin className="w-5 h-5 text-blue-600" />;
    default:
      return null;
  }
}

function createTeamSlug(teamName: string): string {
  return teamName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function createLeagueSlug(leagueName: string): string {
  return leagueName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default async function PlayerProfile({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const player = await getPlayerData(slug);

  if (!player) {
    notFound();
  }

  const primaryTeam = player.teamUsers[0];
  const displayName = player.displayName || player.name || "Unknown Player";
  const defaultBanner =
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=400&fit=crop";
  const defaultAvatar = "https://i.pravatar.cc/300?img=68";

  // Prepare clips data for ClipsSection component
  const playerClips = player.userClips.map(({ clip }) => {
    // Get 1-2 random teammates as tags (if player has teammates)
    const teammates = primaryTeam?.team
      ? [
          {
            name: displayName,
            id: player.id,
            avatar: player.avatar,
          },
        ]
      : [];

    return {
      clip: {
        ...clip,
        createdAt: clip.createdAt,
      },
      playerName: displayName,
      playerId: player.id,
      playerAvatar: player.avatar,
      playerTags: teammates,
    };
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />

      <PlayerHeader
        name={displayName}
        avatar={player.avatar || defaultAvatar}
        banner={player.bannerImage || defaultBanner}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Players" },
        ]}
        team={
          primaryTeam
            ? {
                name: primaryTeam.team.title,
                logo: primaryTeam.team.logo,
                jerseyNumber: primaryTeam.jerseyNumber,
                position: primaryTeam.position,
                league: primaryTeam.team.league.name,
                slug: createTeamSlug(primaryTeam.team.title),
                leagueSlug: createLeagueSlug(primaryTeam.team.league.name),
              }
            : undefined
        }
        followerCount={player.followerCount}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Bio */}
        {player.bio && (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{player.bio}</p>
            {/* Social Links */}
            {player.socialLinks &&
              Object.keys(player.socialLinks).length > 0 && (
                <div className="flex flex-wrap gap-2 sm:gap-3 pt-4 sm:pt-5">
                  {Object.entries(player.socialLinks).map(
                    ([platform, handle]) => {
                      const icon = getSocialIcon(platform);
                      if (!icon) return null;

                      return (
                        <a
                          key={platform}
                          href={`https://${platform}.com/${String(
                            handle
                          ).replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
                          title={`${platform}: ${String(handle)}`}
                        >
                          {icon}
                          <span className="text-gray-600 text-xs sm:text-sm">
                            {String(handle)}
                          </span>
                        </a>
                      );
                    }
                  )}
                </div>
              )}
          </div>
        )}

        {/* Stats Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">.298</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Batting Avg</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">32</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Home Runs</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">94</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">RBIs</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">18</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Stolen Bases</p>
            </div>
          </div>
        </div>

        {/* Clips Section */}
        <ClipsSection clips={playerClips} title="Highlight Clips" />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
