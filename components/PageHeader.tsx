"use client";

import { useEffect, useState, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHome } from "react-icons/fa";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string | ReactNode;
  description?: string;
  logo?: string | null;
  breadcrumbs: Breadcrumb[];
}

function getAllBreadcrumbs(breadcrumbs: Breadcrumb[], currentTitle: string): Breadcrumb[] {
  return [...breadcrumbs, { label: currentTitle }];
}

export default function PageHeader({
  title,
  subtitle,
  description,
  logo,
  breadcrumbs,
}: PageHeaderProps) {
  const [isSticky, setIsSticky] = useState(false);
  const allBreadcrumbs = getAllBreadcrumbs(breadcrumbs, title);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky header when scrolled past 200px
      setIsSticky(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Main Header */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white relative">
        {/* Breadcrumb Trail - Top Left */}
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 pt-16">
          <div
            className={`flex ${
              logo ? "flex-col sm:flex-row" : "flex-col"
            } items-center sm:items-start gap-4 sm:gap-8`}
          >
            {/* Logo (if provided) */}
            {logo && (
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-white p-3 sm:p-4 shrink-0">
                <Image
                  src={logo}
                  alt={title}
                  fill
                  className="object-contain"
                />
              </div>
            )}

            {/* Content */}
            <div className={logo ? "flex-1" : "w-full text-center sm:text-left"}>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
                {title}
              </h1>
              {subtitle && (
                <p className="text-base sm:text-lg lg:text-xl opacity-90">
                  {subtitle}
                </p>
              )}
              {description && (
                <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg opacity-80 max-w-2xl">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Breadcrumb Header */}
      <div
        className={`sticky top-14 sm:top-16 bg-linear-to-r from-blue-600 to-purple-600 shadow-lg z-40 transition-opacity duration-200 ${
          isSticky ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
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

          {/* Current Page Title with Logo */}
          <div className="flex items-center gap-2">
            {logo && (
              <div className="relative w-7 h-7 rounded overflow-hidden bg-white p-1 shrink-0">
                <Image
                  src={logo}
                  alt={title}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <div className="text-white text-xl font-bold">
              {allBreadcrumbs[allBreadcrumbs.length - 1].label}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
