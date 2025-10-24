import { notFound } from 'next/navigation'
import Image from 'next/image'

interface PlayerData {
  id: string
  name: string | null
  email: string | null
  avatar: string | null
  bannerImage: string | null
  displayName: string | null
  bio: string | null
  socialLinks: any
  followerCount: number
  followingCount: number
  teamUsers: Array<{
    role: string | null
    jerseyNumber: number | null
    position: string | null
    team: {
      title: string
      logo: string | null
      sport: {
        name: string
      }
      league: {
        name: string
      }
    }
  }>
  userClips: Array<{
    clip: {
      id: string
      url: string
      title: string
      description: string | null
      thumbnail: string | null
      platform: string | null
    }
  }>
}

async function getPlayerData(slug: string): Promise<PlayerData | null> {
  try {
    const res = await fetch(`${process.env.PERMAHOST}/api/player/${slug}`, {
      cache: 'no-store',
    })

    if (!res.ok) {
      return null
    }

    return res.json()
  } catch (error) {
    console.error('Error fetching player:', error)
    return null
  }
}

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    let videoId = null

    if (urlObj.hostname.includes('youtube.com')) {
      videoId = urlObj.searchParams.get('v')
    } else if (urlObj.hostname.includes('youtu.be')) {
      videoId = urlObj.pathname.slice(1)
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null
  } catch {
    return null
  }
}

export default async function PlayerProfile({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const player = await getPlayerData(slug)

  if (!player) {
    notFound()
  }

  const primaryTeam = player.teamUsers[0]
  const displayName = player.displayName || player.name || 'Unknown Player'
  const defaultBanner = 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=400&fit=crop'
  const defaultAvatar = 'https://i.pravatar.cc/300?img=68'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Image */}
      <div className="relative w-full h-80 bg-gradient-to-r from-blue-600 to-purple-600">
        <Image
          src={player.bannerImage || defaultBanner}
          alt={`${displayName} banner`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Profile Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-20 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            {/* Avatar */}
            <div className="relative w-40 h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
              <Image
                src={player.avatar || defaultAvatar}
                alt={displayName}
                fill
                className="object-cover"
              />
            </div>

            {/* Player Info */}
            <div className="flex-1 text-center sm:text-left pb-4">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {displayName}
              </h1>
              {primaryTeam && (
                <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                  {primaryTeam.team.logo && (
                    <Image
                      src={primaryTeam.team.logo}
                      alt={primaryTeam.team.title}
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  )}
                  <div>
                    <p className="text-xl font-semibold text-gray-700">
                      {primaryTeam.team.title}
                      {primaryTeam.jerseyNumber && (
                        <span className="ml-2 text-gray-500">
                          #{primaryTeam.jerseyNumber}
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">
                      {primaryTeam.position} • {primaryTeam.team.league.name}
                    </p>
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center justify-center sm:justify-start gap-6 mt-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {player.followerCount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {player.followingCount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Following</p>
                </div>
              </div>
            </div>

            {/* Follow Button */}
            <div className="pb-4">
              <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                Follow
              </button>
            </div>
          </div>
        </div>

        {/* Bio */}
        {player.bio && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">About</h2>
            <p className="text-gray-700 leading-relaxed">{player.bio}</p>
          </div>
        )}

        {/* Social Links */}
        {player.socialLinks && Object.keys(player.socialLinks).length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Social Media
            </h2>
            <div className="flex flex-wrap gap-3">
              {Object.entries(player.socialLinks).map(([platform, handle]) => (
                <a
                  key={platform}
                  href={`https://${platform}.com/${String(handle).replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <span className="font-medium capitalize">{platform}</span>
                  <span className="text-gray-600">{String(handle)}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Stats Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Season Stats
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">.298</p>
              <p className="text-sm text-gray-600 mt-1">Batting Avg</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">32</p>
              <p className="text-sm text-gray-600 mt-1">Home Runs</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">94</p>
              <p className="text-sm text-gray-600 mt-1">RBIs</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">18</p>
              <p className="text-sm text-gray-600 mt-1">Stolen Bases</p>
            </div>
          </div>
        </div>

        {/* Clips Section */}
        {player.userClips && player.userClips.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Highlight Clips
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {player.userClips.map(({ clip }) => {
                const embedUrl = getYouTubeEmbedUrl(clip.url)
                return (
                  <div key={clip.id} className="space-y-3">
                    {embedUrl ? (
                      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                        <iframe
                          src={embedUrl}
                          title={clip.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute top-0 left-0 w-full h-full rounded-lg"
                        />
                      </div>
                    ) : (
                      <div className="relative w-full bg-gray-200 rounded-lg" style={{ paddingBottom: '56.25%' }}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-gray-500">Video unavailable</p>
                        </div>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {clip.title}
                      </h3>
                      {clip.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {clip.description}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
