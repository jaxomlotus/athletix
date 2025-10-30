"use client";

import { useEffect, useState, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { FiUserPlus } from "react-icons/fi";
import { EntityType } from "@/lib/entity-utils";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  jerseyNumber?: number;
  subtitle?: string | ReactNode;
  description?: string;
  logo?: string | null;
  banner?: string | null;
  breadcrumbs: Breadcrumb[];
  followerCount?: number;
  showFollowButton?: boolean;
  entityType?: EntityType;
}

function getAllBreadcrumbs(breadcrumbs: Breadcrumb[], currentTitle: string): Breadcrumb[] {
  return [...breadcrumbs, { label: currentTitle }];
}

export default function PageHeader({
  title,
  jerseyNumber,
  subtitle,
  description,
  logo,
  banner,
  breadcrumbs,
  followerCount,
  showFollowButton = false,
  entityType,
}: PageHeaderProps) {
  const [isSticky, setIsSticky] = useState(false);
  const allBreadcrumbs = getAllBreadcrumbs(breadcrumbs, title);
  const defaultBanner = "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=400&fit=crop";
  const isSportIcon = entityType === 'sport';

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky header - earlier on mobile (45px), later on desktop (176px)
      const isMobile = window.innerWidth < 640; // sm breakpoint
      const threshold = isMobile ? 120 : 176;
      setIsSticky(window.scrollY > threshold);
    };

    handleScroll(); // Check on mount
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [showFollowButton]);

  return (
    <>
      {/* Main Header */}
      <div
        data-page-header
        className="bg-linear-to-r from-green-600 to-blue-600 text-white relative"
        style={{
          marginBottom: isSticky
            ? (window.innerWidth < 640 ? '-70px' : '-80px')
            : '0px'
        }}
      >
        {/* Banner Image (if provided) */}
        {banner && (
          <>
            <Image
              src={banner}
              alt={`${title} banner`}
              fill
              className="object-cover"
              priority
            />
            {/* Gradient overlay - dark at top and bottom, semi-transparent in middle */}
            <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/25 to-black/50" />
          </>
        )}
        {/* Breadcrumb Trail - Top Left (Absolutely Positioned) */}
        <div className="absolute top-0 left-0 right-0 py-3 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center text-sm text-white">
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
              <span className="mx-2 opacity-60">\</span>
            </div>
          </div>
        </div>

        {/* Profile/Content Section - Inside Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`relative ${showFollowButton ? 'py-13 sm:py-12' : 'py-13 sm:py-16'}`}>
            <div className="flex flex-row items-center gap-4 sm:gap-6 w-full sm:justify-between">
              {/* Logo/Avatar */}
              {logo && (
                <div className={`relative ${entityType === 'player' ? 'w-24 h-24 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-xl bg-white' : `w-24 h-24 sm:w-32 sm:h-32 rounded-lg ${isSportIcon ? 'bg-white/10 backdrop-blur-sm' : 'bg-white'}`} overflow-hidden ${entityType !== 'player' && 'p-3 sm:p-4'} shrink-0`}>
                  <Image
                    src={logo}
                    alt={title}
                    fill
                    className={entityType === 'player' ? 'object-cover' : 'object-contain'}
                    style={isSportIcon ? { filter: 'brightness(0) invert(1)' } : undefined}
                  />
                </div>
              )}

              {/* Title and Content */}
              <div className="flex-1 text-left">
                <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2 text-white">
                  {title}
                  {jerseyNumber && (
                    <span className="ml-2 opacity-60">#{jerseyNumber}</span>
                  )}
                </h1>
                {subtitle && (
                  <div className="text-base sm:text-xl font-semibold mb-1 sm:mb-2 text-white opacity-90">
                    {subtitle}
                  </div>
                )}
                {description && (
                  <p className="text-xs sm:text-sm text-white opacity-80">
                    {description}
                  </p>
                )}
              </div>

              {/* Followers and Follow Button - All screens, in header */}
              {showFollowButton && followerCount !== undefined && (
                <div className="absolute bottom-4 right-0 sm:relative sm:bottom-auto sm:right-auto flex flex-row items-center gap-3 sm:gap-6">
                  <div className="text-right sm:text-center">
                    <p className="text-lg sm:text-2xl font-bold text-white">
                      {followerCount.toLocaleString()}
                    </p>
                    <p className="text-xs sm:text-sm text-white opacity-80">Followers</p>
                  </div>
                  <button className="flex items-center gap-2 px-3 py-2 sm:px-8 sm:py-3 bg-white hover:bg-gray-100 text-green-600 font-semibold rounded-lg transition-colors text-sm sm:text-base cursor-pointer">
                    <FiUserPlus className="w-5 h-5" />
                    <span className="hidden sm:inline">Follow</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Breadcrumb Header */}
      <div
        className={`sticky top-12 sm:top-16 ${!banner && 'bg-linear-to-r from-green-600 to-blue-600'} shadow-lg z-40 ${
          isSticky ? "block" : "hidden"
        }`}
        style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)' }}
      >
        {/* Banner Image for Sticky (if provided) */}
        {banner && (
          <>
            <Image
              src={banner}
              alt={`${title} banner`}
              fill
              className="object-cover"
            />
            {/* 50% opacity overlay */}
            <div className="absolute inset-0 bg-black/50" />
          </>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              {/* Breadcrumb Trail (without last item) */}
              <div className="flex items-center text-sm text-white mb-2">
                {allBreadcrumbs.slice(0, -1).map((crumb, index) => (
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
                      <span>
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

              {/* Current Page Title with Logo/Avatar */}
              <div className="flex items-center gap-2">
                {logo && (
                  <div className={`relative ${entityType === 'player' ? 'w-7 h-7 rounded-full border border-white bg-white' : `w-7 h-7 rounded ${isSportIcon ? 'bg-white/10 backdrop-blur-sm' : 'bg-white'}`} overflow-hidden ${entityType !== 'player' && 'p-1'} shrink-0`}>
                    <Image
                      src={logo}
                      alt={title}
                      fill
                      className={entityType === 'player' ? 'object-cover' : 'object-contain'}
                      style={isSportIcon ? { filter: 'brightness(0) invert(1)' } : undefined}
                    />
                  </div>
                )}
                <span className="text-white text-xl font-bold">
                  {allBreadcrumbs[allBreadcrumbs.length - 1].label}
                  {jerseyNumber && (
                    <span className="ml-2 opacity-60">#{jerseyNumber}</span>
                  )}
                </span>
              </div>
            </div>

            {/* Follow Button (for players) */}
            {showFollowButton && (
              <button className="flex items-center gap-2 px-3 sm:px-4 py-1.5 bg-white text-green-600 hover:bg-gray-100 font-semibold rounded-lg transition-colors text-sm cursor-pointer">
                <FiUserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Follow</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
