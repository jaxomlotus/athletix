"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { FiUserPlus } from "react-icons/fi";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface Team {
  name: string;
  logo: string | null;
  jerseyNumber: number | null;
  position: string | null;
  league: string;
  slug: string;
  leagueSlug: string;
}

interface PlayerHeaderProps {
  name: string;
  avatar: string;
  banner: string;
  breadcrumbs: Breadcrumb[];
  team?: Team;
  followerCount: number;
}

export default function PlayerHeader({
  name,
  avatar,
  banner,
  breadcrumbs,
  team,
  followerCount,
}: PlayerHeaderProps) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky header when scrolled past the banner and avatar (around 300-350px)
      // Avatar becomes invisible around 300px on desktop, earlier on mobile
      setIsSticky(window.scrollY > 320);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Banner Image */}
      <div className="relative w-full h-40 bg-linear-to-r from-green-600 to-blue-600">
        <Image
          src={banner}
          alt={`${name} banner`}
          fill
          className="object-cover"
          priority
        />
        {/* Gradient overlay - dark at top and bottom, transparent in middle */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/50" />

        {/* Breadcrumb Trail */}
        <div className="absolute top-0 left-0 right-0 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center text-sm text-white">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && (
                  <span className="mx-2 opacity-80">\</span>
                )}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="hover:opacity-80 transition-opacity"
                  >
                    {crumb.label === "Home" ? (
                      <FaHome className="w-4 h-4" />
                    ) : (
                      crumb.label
                    )}
                  </Link>
                ) : (
                  <span className="opacity-90">
                    {crumb.label === "Home" ? (
                      <FaHome className="w-4 h-4" />
                    ) : (
                      crumb.label
                    )}
                  </span>
                )}
              </div>
            ))}
              {/* Trailing slash */}
              <span className="mx-2 opacity-80">\</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-20 sm:mt-0 sm:pt-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            {/* Avatar */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white shrink-0">
              <Image
                src={avatar}
                alt={name}
                fill
                className="object-cover"
              />
            </div>

            {/* Player Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                {name}
              </h1>
              {team && (
                <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                  {team.logo && (
                    <Link href={`/teams/${team.slug}`}>
                      <Image
                        src={team.logo}
                        alt={team.name}
                        width={32}
                        height={32}
                        className="object-contain hover:opacity-80 transition-opacity"
                      />
                    </Link>
                  )}
                  <div>
                    <p className="text-lg sm:text-xl font-semibold">
                      <Link
                        href={`/teams/${team.slug}`}
                        className="text-green-600 hover:text-green-700"
                      >
                        {team.name}
                        {team.jerseyNumber && (
                          <span className="ml-2 text-gray-500">
                            #{team.jerseyNumber}
                          </span>
                        )}
                      </Link>
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {team.position} •{" "}
                      <Link
                        href={`/leagues/${team.leagueSlug}`}
                        className="hover:text-gray-700 hover:underline"
                      >
                        {team.league}
                      </Link>
                    </p>
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center justify-center sm:justify-start gap-4 sm:gap-6 mt-3">
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {followerCount.toLocaleString()}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">Followers</p>
                </div>
                <button className="flex items-center gap-2 px-6 sm:px-8 py-2 sm:py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base">
                  <FiUserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                  Follow
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Breadcrumb Header with Avatar and Name */}
      <div
        className={`sticky top-14 sm:top-16 bg-linear-to-r from-green-600 to-blue-600 shadow-lg z-40 transition-opacity duration-200 ${
          isSticky ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div>
              {/* Breadcrumb Trail */}
              <div className="flex items-center text-sm text-white mb-2">
                {breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center">
                    {index > 0 && (
                      <span className="mx-2 opacity-60">\</span>
                    )}
                    {crumb.href ? (
                      <Link
                        href={crumb.href}
                        className="hover:opacity-80 transition-opacity"
                      >
                        {index === 0 && crumb.label === "Home" ? (
                          <FaHome className="w-4 h-4" />
                        ) : (
                          crumb.label
                        )}
                      </Link>
                    ) : (
                      <span className="opacity-90">
                        {index === 0 && crumb.label === "Home" ? (
                          <FaHome className="w-4 h-4" />
                        ) : (
                          crumb.label
                        )}
                      </span>
                    )}
                  </div>
                ))}
                {/* Trailing slash */}
                <span className="mx-2 opacity-60">\</span>
              </div>

              {/* Player Name with Avatar */}
              <div className="flex items-center gap-2">
                <div className="relative w-7 h-7 rounded-full overflow-hidden bg-white shrink-0">
                  <Image
                    src={avatar}
                    alt={name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-white text-xl font-bold">
                  {name}
                </span>
              </div>
            </div>

            {/* Follow Button - vertically centered */}
            <button className="flex items-center gap-2 px-4 py-1.5 bg-white text-green-600 hover:bg-gray-100 font-semibold rounded-lg transition-colors text-sm">
              <FiUserPlus className="w-4 h-4" />
              Follow
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
