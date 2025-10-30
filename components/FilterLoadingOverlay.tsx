"use client";

import { useLayoutEffect, useState } from "react";
import { FiLoader } from "react-icons/fi";

export default function FilterLoadingOverlay() {
  // Start with false for consistent server/client hydration
  const [shouldShow, setShouldShow] = useState(false);

  useLayoutEffect(() => {
    // Check localStorage synchronously before browser paints
    const filterLoading = localStorage.getItem('filterLoading');

    if (filterLoading === 'true') {
      // Show loader immediately (before paint)
      setShouldShow(true);

      // Clear the flag
      localStorage.removeItem('filterLoading');

      // Hide loading after content is ready
      const timer = setTimeout(() => {
        setShouldShow(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!shouldShow) return null;

  return (
    <div className="absolute inset-0 bg-white bg-opacity-98 z-10 flex items-center justify-center rounded-lg min-h-[200px]">
      <div className="flex flex-col items-center gap-3">
        <FiLoader className="w-10 h-10 text-green-600 animate-spin" />
        <p className="text-base font-semibold text-gray-700">Loading filtered results...</p>
      </div>
    </div>
  );
}
