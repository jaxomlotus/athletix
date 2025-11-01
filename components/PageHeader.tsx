"use client";

import { useEffect, useState, ReactNode, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import {
  FiUserPlus,
  FiCheck,
  FiChevronDown,
  FiGrid,
  FiMessageSquare,
  FiBarChart2,
  FiVideo,
} from "react-icons/fi";
import { EntityType } from "@/lib/entity-utils";
import { useFollow } from "@/lib/hooks/useFollow";
import AuthModal from "./AuthModal";
import ConfirmModal from "./ConfirmModal";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface Tab {
  label: string;
  href: string;
  active: boolean;
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
  entityId?: number;
  isFollowing?: boolean;
  tabs?: Tab[];
}

function getAllBreadcrumbs(
  breadcrumbs: Breadcrumb[],
  currentTitle: string
): Breadcrumb[] {
  return [...breadcrumbs, { label: currentTitle }];
}

// Helper function to get icon for each tab
function getTabIcon(label: string) {
  switch (label) {
    case "Overview":
      return <FiGrid className="w-4 h-4" />;
    case "Discussions":
      return <FiMessageSquare className="w-4 h-4" />;
    case "Stats":
      return <FiBarChart2 className="w-4 h-4" />;
    case "Clips":
      return <FiVideo className="w-4 h-4" />;
    default:
      return null;
  }
}

export default function PageHeader({
  title,
  jerseyNumber,
  subtitle,
  description,
  logo,
  banner,
  breadcrumbs,
  followerCount: initialFollowerCount,
  showFollowButton = false,
  entityType,
  entityId,
  isFollowing: initialFollowStatus = false,
  tabs,
}: PageHeaderProps) {
  const [isSticky, setIsSticky] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showMainTabDropdown, setShowMainTabDropdown] = useState(false);
  const [showStickyTabDropdown, setShowStickyTabDropdown] = useState(false);
  const mainDropdownRef = useRef<HTMLDivElement>(null);
  const stickyDropdownRef = useRef<HTMLDivElement>(null);
  const allBreadcrumbs = getAllBreadcrumbs(breadcrumbs, title);
  const defaultBanner =
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=400&fit=crop";
  const isSportIcon = entityType === "sport";
  const activeTab = tabs?.find((tab) => tab.active);

  const {
    isFollowing,
    followerCount,
    isLoading,
    toggleFollow,
    performUnfollow,
  } = useFollow({
    entityId: entityId || 0,
    entityName: title,
    initialFollowStatus,
    initialFollowerCount: initialFollowerCount || 0,
    onAuthRequired: () => setShowAuthModal(true),
    onUnfollowRequest: () => setShowConfirmModal(true),
  });

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

  // Handle clicking outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mainDropdownRef.current &&
        !mainDropdownRef.current.contains(event.target as Node)
      ) {
        setShowMainTabDropdown(false);
      }
      if (
        stickyDropdownRef.current &&
        !stickyDropdownRef.current.contains(event.target as Node)
      ) {
        setShowStickyTabDropdown(false);
      }
    };

    if (showMainTabDropdown || showStickyTabDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMainTabDropdown, showStickyTabDropdown]);

  return (
    <>
      {/* Main Header */}
      <div
        data-page-header
        className="bg-linear-to-r from-green-600 to-blue-600 text-white relative"
        style={{
          marginBottom: isSticky
            ? window.innerWidth < 640
              ? "-70px"
              : "-80px"
            : "0px",
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
                  {index > 0 && <span className="mx-2 opacity-60">\</span>}
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
          <div
            className={`relative ${
              showFollowButton ? "pt-13 sm:pt-12 pb-2" : "pt-13 sm:pt-16 pb-2"
            }`}
          >
            <div className="flex flex-row flex-wrap sm:flex-nowrap items-start sm:items-center gap-2 sm:gap-6 w-full sm:justify-between">
              {/* Logo/Avatar */}
              {logo && (
                <div
                  className={`relative w-16 h-16 sm:w-24 sm:h-24 rounded-full
                        bg-white backdrop-blur-sm
                             overflow-hidden shrink-0 mr-1 sm:pr-0 self-center sm:self-auto`}
                >
                  <Image
                    src={logo}
                    alt={title}
                    fill
                    className={
                      entityType === "player"
                        ? "object-cover"
                        : "object-contain"
                    }
                    style={
                      isSportIcon
                        ? { filter: "brightness(0) invert(1)" }
                        : undefined
                    }
                  />
                </div>
              )}

              {/* Title + Subtitle */}
              <div className="flex-1 text-left">
                <h1 className="text-lg sm:text-4xl font-semibold sm:font-bold mb-1 sm:mb-2 text-white">
                  {title}
                  {jerseyNumber && (
                    <span className="ml-2 opacity-60">#{jerseyNumber}</span>
                  )}
                </h1>
                {/* Subtitle - shown on all screens */}
                {subtitle && (
                  <div className="text-sm sm:text-xl mb-1 sm:mb-2 text-white opacity-90">
                    {subtitle}
                  </div>
                )}
                {description && (
                  <p className="text-xs sm:text-sm text-white opacity-80">
                    {description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Tabs Section - Bottom of Header */}
          {tabs && tabs.length > 0 && (
            <>

              {/* Mobile Tab Dropdown + Add Button */}
              <div className="relative z-10 pb-2 sm:hidden bg-black/10 px-4 -mx-4 pt-2">
                <div className="flex items-center justify-between gap-3">
                  {/* Tab Dropdown on left */}
                  <div className="relative" ref={mainDropdownRef}>
                    <button
                      onClick={() =>
                        setShowMainTabDropdown(!showMainTabDropdown)
                      }
                      className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-lg transition-all bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 cursor-pointer"
                    >
                      {activeTab && getTabIcon(activeTab.label)}
                      <span>{activeTab?.label}</span>
                      <FiChevronDown className="w-3 h-3" />
                    </button>

                    {/* Dropdown Menu */}
                    {showMainTabDropdown && (
                      <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg overflow-hidden min-w-[140px] z-50">
                        {tabs.map((tab) => (
                          <Link
                            key={tab.label}
                            href={tab.href}
                            className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                              tab.active
                                ? "bg-green-50 text-green-700 font-semibold"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                            onClick={() => setShowMainTabDropdown(false)}
                          >
                            {getTabIcon(tab.label)}
                            {tab.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Follower Count + Add Button on right */}
                  {showFollowButton && followerCount !== undefined && (
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-white text-sm font-semibold">
                        {followerCount.toLocaleString()}
                      </span>
                      <button
                        onClick={toggleFollow}
                        disabled={isLoading}
                        className={`flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer disabled:opacity-50 ${
                          isFollowing
                            ? "bg-white/20 backdrop-blur-sm text-white hover:bg-red-500/30"
                            : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                        }`}
                      >
                        {isFollowing ? (
                          <>
                            <FiCheck className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <FiUserPlus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Desktop Tabs - Full Width */}
        {tabs && tabs.length > 0 && (
          <div className="hidden sm:block bg-black/10 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {tabs.map((tab) => (
                    <Link
                      key={tab.label}
                      href={tab.href}
                      className={`px-4 py-1 text-sm font-medium rounded-lg transition-all ${
                        tab.active
                          ? "bg-white/20 backdrop-blur-sm text-white"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {tab.label}
                    </Link>
                  ))}
                </div>

                {/* Add Button */}
                {showFollowButton && followerCount !== undefined && (
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-semibold">
                      {followerCount.toLocaleString()}
                    </span>
                    <button
                      onClick={toggleFollow}
                      disabled={isLoading}
                      className={`flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-lg transition-all cursor-pointer disabled:opacity-50 bg-white/10 backdrop-blur-sm text-white ${
                        isFollowing
                          ? "hover:bg-red-500/30"
                          : "hover:bg-white/20"
                      }`}
                    >
                      {isFollowing ? (
                        <>
                          <FiCheck className="w-4 h-4" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <FiUserPlus className="w-4 h-4" />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Breadcrumb Header */}
      <div
        className={`sticky top-12 sm:top-16 ${
          !banner && "bg-linear-to-r from-green-600 to-blue-600"
        } shadow-lg z-40 ${isSticky ? "block" : "hidden"}`}
        style={{
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
        }}
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
        {/* Desktop Layout */}
        <div className="hidden sm:block">
          {/* Line 1: Avatar + Title */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-3">
            <div className="flex items-center gap-2">
              {logo && (
                  <div
                    className={`relative ${
                      entityType === "player"
                        ? "w-7 h-7 rounded-full border border-white bg-white"
                        : `w-7 h-7 rounded-full ${
                            isSportIcon
                              ? "bg-white/10 backdrop-blur-sm"
                              : "bg-white"
                          }`
                    } overflow-hidden ${
                      entityType !== "player" && "p-1"
                    } shrink-0`}
                  >
                    <Image
                      src={logo}
                      alt={title}
                      fill
                      className={
                        entityType === "player"
                          ? "object-cover"
                          : "object-contain"
                      }
                      style={
                        isSportIcon
                          ? { filter: "brightness(0) invert(1)" }
                          : undefined
                      }
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

          {/* Line 2: Tab bar + Add Button - Full Width */}
          {tabs && tabs.length > 0 && (
            <div className="bg-black/10 relative z-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {tabs.map((tab) => (
                      <Link
                        key={tab.label}
                        href={tab.href}
                        className={`px-4 py-1 text-sm font-medium rounded-lg transition-all ${
                          tab.active
                            ? "bg-white/20 backdrop-blur-sm text-white"
                            : "text-white/80 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {tab.label}
                      </Link>
                    ))}
                  </div>

                  {/* Add Button */}
                  {showFollowButton && followerCount !== undefined && (
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm font-semibold">
                        {followerCount.toLocaleString()}
                      </span>
                      <button
                        onClick={toggleFollow}
                        disabled={isLoading}
                        className={`flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-lg transition-all cursor-pointer disabled:opacity-50 bg-white/10 backdrop-blur-sm text-white ${
                          isFollowing
                            ? "hover:bg-red-500/30"
                            : "hover:bg-white/20"
                        }`}
                      >
                        {isFollowing ? (
                          <>
                            <FiCheck className="w-4 h-4" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <FiUserPlus className="w-4 h-4" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="sm:hidden w-full pt-4">
            {/* Line 1: Logo + Title */}
            <div className="flex items-center gap-2 mb-2">
              {logo && (
                <div
                  className={`relative ${
                    entityType === "player"
                      ? "w-7 h-7 rounded-full border border-white bg-white"
                      : `w-7 h-7 rounded-full ${
                          isSportIcon
                            ? "bg-white/10 backdrop-blur-sm"
                            : "bg-white"
                        }`
                  } overflow-hidden ${
                    entityType !== "player" && "p-1"
                  } shrink-0`}
                >
                  <Image
                    src={logo}
                    alt={title}
                    fill
                    className={
                      entityType === "player"
                        ? "object-cover"
                        : "object-contain"
                    }
                    style={
                      isSportIcon
                        ? { filter: "brightness(0) invert(1)" }
                        : undefined
                    }
                  />
                </div>
              )}
              <span className="text-white text-base sm:text-xl font-semibold sm:font-bold">
                {allBreadcrumbs[allBreadcrumbs.length - 1].label}
                {jerseyNumber && (
                  <span className="ml-2 opacity-60">#{jerseyNumber}</span>
                )}
              </span>
            </div>

            {/* Line 2: Tab Dropdown (left) + Followers + Add Button (right) */}
            <div className="flex items-center justify-between bg-black/10 px-4 -mx-4 py-1.5 pb-2">
              {/* Tab Dropdown */}
              {tabs && tabs.length > 0 && activeTab && (
                <div className="relative" ref={stickyDropdownRef}>
                  <button
                    onClick={() =>
                      setShowStickyTabDropdown(!showStickyTabDropdown)
                    }
                    className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-lg transition-all bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 cursor-pointer"
                  >
                    {getTabIcon(activeTab.label)}
                    <span>{activeTab.label}</span>
                    <FiChevronDown className="w-3 h-3" />
                  </button>

                  {/* Dropdown Menu */}
                  {showStickyTabDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg overflow-hidden min-w-[140px] z-50">
                      {tabs.map((tab) => (
                        <Link
                          key={tab.label}
                          href={tab.href}
                          className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                            tab.active
                              ? "bg-green-50 text-green-700 font-semibold"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                          onClick={() => setShowStickyTabDropdown(false)}
                        >
                          {getTabIcon(tab.label)}
                          {tab.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Followers + Add Button */}
              {showFollowButton && followerCount !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-semibold">
                    {followerCount.toLocaleString()}
                  </span>
                  <button
                    onClick={toggleFollow}
                    disabled={isLoading}
                    className={`flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer disabled:opacity-50 ${
                      isFollowing
                        ? "bg-white/20 backdrop-blur-sm text-white hover:bg-red-500/30 hover:text-white"
                        : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <FiCheck className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <FiUserPlus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="signup"
      />

      {/* Confirm Unfollow Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={performUnfollow}
        title="Unfollow"
        message={`Are you sure you want to unfollow ${title}?`}
        confirmText="Unfollow"
        cancelText="Cancel"
      />
    </>
  );
}
