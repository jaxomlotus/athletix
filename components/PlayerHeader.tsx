"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

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
      <div className="relative w-full h-40 bg-linear-to-r from-blue-600 to-purple-600">
        <Image
          src={banner}
          alt={`${name} banner`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
      </div>

      {/* Profile Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-20 sm:mt-0 sm:pt-8 mb-6 sm:mb-8">
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
                <a
                  href={`/team/${team.slug}`}
                  className="flex items-center justify-center sm:justify-start gap-3 mb-2 hover:opacity-80 transition-opacity"
                >
                  {team.logo && (
                    <Image
                      src={team.logo}
                      alt={team.name}
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  )}
                  <div>
                    <p className="text-lg sm:text-xl font-semibold text-blue-600 hover:text-blue-700">
                      {team.name}
                      {team.jerseyNumber && (
                        <span className="ml-2 text-gray-500">
                          #{team.jerseyNumber}
                        </span>
                      )}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {team.position} • {team.league}
                    </p>
                  </div>
                </a>
              )}

              {/* Stats */}
              <div className="flex items-center justify-center sm:justify-start gap-4 sm:gap-6 mt-3">
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {followerCount.toLocaleString()}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">Followers</p>
                </div>
                <button className="px-6 sm:px-8 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base">
                  Follow
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Breadcrumb Header with Avatar and Name */}
      <div
        className={`sticky top-14 sm:top-16 bg-linear-to-r from-blue-600 to-purple-600 shadow-md z-40 transition-opacity duration-200 ${
          isSticky ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Trail with Avatar and Name on Same Line */}
          <div className="flex items-center justify-between h-12 text-sm text-white">
            <div className="flex items-center">
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
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="opacity-90">{crumb.label}</span>
                  )}
                </div>
              ))}

              {/* Separator before player */}
              <span className="mx-2 opacity-60">\</span>

              {/* Avatar and Name */}
              <div className="flex items-center gap-2">
                <div className="relative w-6 h-6 rounded-full overflow-hidden bg-white shrink-0">
                  <Image
                    src={avatar}
                    alt={name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="opacity-90">
                  {name}
                </span>
              </div>
            </div>

            {/* Follow Button */}
            <button className="px-4 py-1.5 bg-white text-blue-600 hover:bg-gray-100 font-semibold rounded-lg transition-colors text-sm">
              Follow
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
