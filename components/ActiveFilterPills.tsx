"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiX } from "react-icons/fi";

interface ActiveFilterPillsProps {
  filterLabels?: {
    [key: string]: string;
  };
}

// Map filter keys to their plural URL form
const FILTER_KEY_TO_PLURAL: { [key: string]: string } = {
  sport: 'sports',
  league: 'leagues',
  location: 'locations',
  school: 'schools',
  player: 'players',
  team: 'teams',
  position: 'positions',
  age: 'ages',
  grade: 'grades',
  search: 'search',
  gender: 'sports', // Gender filter links to /sports
};

export default function ActiveFilterPills({ filterLabels = {} }: ActiveFilterPillsProps) {
  const searchParams = useSearchParams();

  const handleRemoveFilter = (filterKey: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    // Build new query string without this filter
    const params = new URLSearchParams(searchParams.toString());
    params.delete(filterKey);

    const queryString = params.toString();
    const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;

    // Set loading flag
    if (typeof window !== 'undefined') {
      localStorage.setItem('filterLoading', 'true');
    }

    // Navigate with updated filters
    window.location.href = newUrl;
  };

  const handleClearAll = () => {
    // Set loading flag
    if (typeof window !== 'undefined') {
      localStorage.setItem('filterLoading', 'true');
    }

    // Navigate to base URL
    window.location.href = window.location.pathname;
  };

  // Get all active filters
  const activeFilters: { key: string; value: string; displayValue: string; keyLabel: string }[] = [];

  searchParams.forEach((value, key) => {
    if (value) {
      // Get label for the filter value (if provided in filterLabels)
      const displayValue = filterLabels[value] || value;

      // Special cases for filter labels
      let keyLabel = key.charAt(0).toUpperCase() + key.slice(1);
      if (key === 'search') {
        keyLabel = 'Search';
      } else if (key === 'gender') {
        keyLabel = 'Gender';
      }

      activeFilters.push({
        key,
        value,
        displayValue,
        keyLabel,
      });
    }
  });

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {activeFilters.map((filter) => {
        // Get the plural form for the URL
        const pluralType = FILTER_KEY_TO_PLURAL[filter.key] || `${filter.key}s`;
        const listPageUrl = `/${pluralType}`;

        // For specific filter values that map to entities, create detail page URL
        // For non-entity filters (like age, position, grade, search), just link to list page with filter
        let valueUrl = listPageUrl;
        if (['sport', 'league', 'location', 'school', 'player', 'team'].includes(filter.key)) {
          // These are entity types with detail pages
          valueUrl = `/${pluralType}/${filter.value}`;
        } else if (filter.key === 'search') {
          // For search, link to /search with the search parameter
          valueUrl = `/search?search=${encodeURIComponent(filter.value)}`;
        } else {
          // These are filter-only types (age, position, grade), link to list with filter applied
          valueUrl = `${listPageUrl}?${filter.key}=${filter.value}`;
        }

        return (
          <div
            key={filter.key}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-200 text-sm"
          >
            <Link
              href={listPageUrl}
              className="font-medium hover:underline cursor-pointer"
            >
              {filter.keyLabel}
            </Link>
            <span className="font-medium">:</span>
            <Link
              href={valueUrl}
              className="hover:underline cursor-pointer"
            >
              {filter.displayValue}
            </Link>
            <button
              onClick={(e) => handleRemoveFilter(filter.key, e)}
              className="hover:bg-green-100 rounded-full p-0.5 transition-colors cursor-pointer ml-0.5"
              title={`Remove ${filter.key} filter`}
            >
              <FiX className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}

      {activeFilters.length > 1 && (
        <button
          onClick={handleClearAll}
          className="text-sm text-green-600 hover:text-green-700 font-semibold cursor-pointer px-2"
        >
          Clear All
        </button>
      )}
    </div>
  );
}
