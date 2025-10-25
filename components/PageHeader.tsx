"use client";

import { useEffect, useState, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

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

export default function PageHeader({
  title,
  subtitle,
  description,
  logo,
  breadcrumbs,
}: PageHeaderProps) {
  const [isSticky, setIsSticky] = useState(false);

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
      <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
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
        className={`sticky top-14 sm:top-16 bg-linear-to-r from-blue-600 to-purple-600 shadow-sm z-40 transition-opacity duration-200 ${
          isSticky ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-10 text-sm text-white">
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
                  <span className="font-medium">
                    {crumb.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
