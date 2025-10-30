"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { FiChevronDown, FiChevronUp, FiX } from "react-icons/fi";
import Link from "next/link";

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface FilterConfig {
  leagues?: FilterOption[];
  sports?: FilterOption[];
  gender?: FilterOption[];
  locations?: FilterOption[];
  schools?: FilterOption[];
  positions?: FilterOption[];
  ages?: FilterOption[];
  grades?: FilterOption[];
  showNameSearch?: boolean;
}

interface FilterProps {
  config: FilterConfig;
}

export default function Filter({ config }: FilterProps) {
  const searchParams = useSearchParams();

  // Expand/collapse state - default to true on desktop, false on mobile
  const [isExpanded, setIsExpanded] = useState(true);

  // Set initial expanded state based on screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const isLargeScreen = window.innerWidth >= 1024; // lg breakpoint
      setIsExpanded(isLargeScreen);
    };

    checkScreenSize();
  }, []);

  // Initialize state from URL params
  const [selectedLeague, setSelectedLeague] = useState(searchParams.get("league") || "");
  const [selectedSport, setSelectedSport] = useState(searchParams.get("sport") || "");
  const [selectedGender, setSelectedGender] = useState(searchParams.get("gender") || "");
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get("location") || "");
  const [selectedSchool, setSelectedSchool] = useState(searchParams.get("school") || "");
  const [selectedPosition, setSelectedPosition] = useState(searchParams.get("position") || "");
  const [selectedAge, setSelectedAge] = useState(searchParams.get("age") || "");
  const [selectedGrade, setSelectedGrade] = useState(searchParams.get("grade") || "");
  const [searchName, setSearchName] = useState(searchParams.get("search") || "");


  const handleClearFilters = () => {
    setSelectedLeague("");
    setSelectedSport("");
    setSelectedGender("");
    setSelectedLocation("");
    setSelectedSchool("");
    setSelectedPosition("");
    setSelectedAge("");
    setSelectedGrade("");
    setSearchName("");

    // Set loading flag in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('filterLoading', 'true');
    }

    // Reload the page to reset everything
    window.location.href = window.location.pathname;
  };

  const hasActiveFilters = selectedLeague || selectedSport || selectedGender || selectedLocation || selectedSchool || selectedPosition || selectedAge || selectedGrade || searchName;

  const handleApplyFilters = (e?: React.FormEvent) => {
    e?.preventDefault();

    // Build query string
    const params = new URLSearchParams();
    if (selectedLeague) params.set("league", selectedLeague);
    if (selectedSport) params.set("sport", selectedSport);
    if (selectedGender) params.set("gender", selectedGender);
    if (selectedLocation) params.set("location", selectedLocation);
    if (selectedSchool) params.set("school", selectedSchool);
    if (selectedPosition) params.set("position", selectedPosition);
    if (selectedAge) params.set("age", selectedAge);
    if (selectedGrade) params.set("grade", selectedGrade);
    if (searchName) params.set("search", searchName);

    const queryString = params.toString();
    const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;

    // Set loading flag in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('filterLoading', 'true');
    }

    // Navigate to URL with filters (causes full page reload with new data)
    window.location.href = newUrl;
  };

  const handleDropdownChange = (filterType: string, value: string) => {
    // Build query string with all current filters plus the new change
    const params = new URLSearchParams();

    const filters = {
      league: selectedLeague,
      sport: selectedSport,
      gender: selectedGender,
      location: selectedLocation,
      school: selectedSchool,
      position: selectedPosition,
      age: selectedAge,
      grade: selectedGrade,
      search: searchName,
    };

    // Update with the new value
    filters[filterType as keyof typeof filters] = value;

    // Build params
    if (filters.league) params.set("league", filters.league);
    if (filters.sport) params.set("sport", filters.sport);
    if (filters.gender) params.set("gender", filters.gender);
    if (filters.location) params.set("location", filters.location);
    if (filters.school) params.set("school", filters.school);
    if (filters.position) params.set("position", filters.position);
    if (filters.age) params.set("age", filters.age);
    if (filters.grade) params.set("grade", filters.grade);
    if (filters.search) params.set("search", filters.search);

    const queryString = params.toString();
    const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;

    // Set loading flag in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('filterLoading', 'true');
    }

    // Navigate to URL with filters (causes full page reload with new data)
    window.location.href = newUrl;
  };

  const handleClearIndividualFilter = (filterType: string) => {
    // Build query string with all current filters except the one being cleared
    const params = new URLSearchParams();

    const filters = {
      league: selectedLeague,
      sport: selectedSport,
      gender: selectedGender,
      location: selectedLocation,
      school: selectedSchool,
      position: selectedPosition,
      age: selectedAge,
      grade: selectedGrade,
      search: searchName,
    };

    // Clear the specific filter
    filters[filterType as keyof typeof filters] = "";

    // Build params
    if (filters.league) params.set("league", filters.league);
    if (filters.sport) params.set("sport", filters.sport);
    if (filters.gender) params.set("gender", filters.gender);
    if (filters.location) params.set("location", filters.location);
    if (filters.school) params.set("school", filters.school);
    if (filters.position) params.set("position", filters.position);
    if (filters.age) params.set("age", filters.age);
    if (filters.grade) params.set("grade", filters.grade);
    if (filters.search) params.set("search", filters.search);

    const queryString = params.toString();
    const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;

    // Set loading flag in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('filterLoading', 'true');
    }

    // Navigate to URL with filters (causes full page reload with new data)
    window.location.href = newUrl;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-900">Filters</h2>
          {hasActiveFilters && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
              Active
            </span>
          )}
        </div>
        {isExpanded ? (
          <FiChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <FiChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Filter Content - Collapsible on all screen sizes */}
      <div className={`${isExpanded ? 'block' : 'hidden'} p-4 sm:p-6 pt-0`}>
        {/* Clear All Button */}
        {hasActiveFilters && (
          <div className="flex justify-end mb-4">
            <button
              onClick={handleClearFilters}
              className="text-sm text-green-600 hover:text-green-700 font-semibold cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}

        <form onSubmit={handleApplyFilters} className="space-y-4">
        {/* Name Search */}
        {config.showNameSearch && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="name-search" className="block text-sm font-medium text-gray-900">
                Search by Name
              </label>
              {searchName && (
                <button
                  type="button"
                  onClick={() => handleClearIndividualFilter("search")}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>
            <input
              id="name-search"
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Enter name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 cursor-text"
            />
          </div>
        )}

        {/* League Filter */}
        {config.leagues && config.leagues.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="league-filter" className="block text-sm font-medium text-gray-900">
                <Link href="/leagues" className="hover:text-green-600 hover:underline">
                  League
                </Link>
              </label>
              {selectedLeague && (
                <button
                  type="button"
                  onClick={() => handleClearIndividualFilter("league")}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  title="Clear league filter"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>
            <select
              id="league-filter"
              value={selectedLeague}
              onChange={(e) => handleDropdownChange("league", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 cursor-pointer"
            >
              <option value="">All Leagues</option>
              {config.leagues.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}{option.count !== undefined ? ` (${option.count})` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Sport Filter */}
        {config.sports && config.sports.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="sport-filter" className="block text-sm font-medium text-gray-900">
                <Link href="/sports" className="hover:text-green-600 hover:underline">
                  Sport
                </Link>
              </label>
              {selectedSport && (
                <button
                  type="button"
                  onClick={() => handleClearIndividualFilter("sport")}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  title="Clear sport filter"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>
            <select
              id="sport-filter"
              value={selectedSport}
              onChange={(e) => handleDropdownChange("sport", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 cursor-pointer"
            >
              <option value="">All Sports</option>
              {config.sports.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}{option.count !== undefined ? ` (${option.count})` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Gender Filter */}
        {config.gender && config.gender.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="gender-filter" className="block text-sm font-medium text-gray-900">
                Gender
              </label>
              {selectedGender && (
                <button
                  type="button"
                  onClick={() => handleClearIndividualFilter("gender")}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  title="Clear gender filter"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>
            <select
              id="gender-filter"
              value={selectedGender}
              onChange={(e) => handleDropdownChange("gender", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 cursor-pointer"
            >
              <option value="">All Genders</option>
              {config.gender.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}{option.count !== undefined ? ` (${option.count})` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Location Filter */}
        {config.locations && config.locations.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="location-filter" className="block text-sm font-medium text-gray-900">
                <Link href="/locations" className="hover:text-green-600 hover:underline">
                  Location
                </Link>
              </label>
              {selectedLocation && (
                <button
                  type="button"
                  onClick={() => handleClearIndividualFilter("location")}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  title="Clear location filter"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>
            <select
              id="location-filter"
              value={selectedLocation}
              onChange={(e) => handleDropdownChange("location", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 cursor-pointer"
            >
              <option value="">All Locations</option>
              {config.locations.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}{option.count !== undefined ? ` (${option.count})` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* School Filter */}
        {config.schools && config.schools.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="school-filter" className="block text-sm font-medium text-gray-900">
                <Link href="/schools" className="hover:text-green-600 hover:underline">
                  School
                </Link>
              </label>
              {selectedSchool && (
                <button
                  type="button"
                  onClick={() => handleClearIndividualFilter("school")}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  title="Clear school filter"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>
            <select
              id="school-filter"
              value={selectedSchool}
              onChange={(e) => handleDropdownChange("school", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 cursor-pointer"
            >
              <option value="">All Schools</option>
              {config.schools.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}{option.count !== undefined ? ` (${option.count})` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Position Filter */}
        {config.positions && config.positions.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="position-filter" className="block text-sm font-medium text-gray-900">
                Position
              </label>
              {selectedPosition && (
                <button
                  type="button"
                  onClick={() => handleClearIndividualFilter("position")}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  title="Clear position filter"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>
            <select
              id="position-filter"
              value={selectedPosition}
              onChange={(e) => handleDropdownChange("position", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 cursor-pointer"
            >
              <option value="">All Positions</option>
              {config.positions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}{option.count !== undefined ? ` (${option.count})` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Age Filter */}
        {config.ages && config.ages.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="age-filter" className="block text-sm font-medium text-gray-900">
                Age
              </label>
              {selectedAge && (
                <button
                  type="button"
                  onClick={() => handleClearIndividualFilter("age")}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  title="Clear age filter"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>
            <select
              id="age-filter"
              value={selectedAge}
              onChange={(e) => handleDropdownChange("age", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 cursor-pointer"
            >
              <option value="">All Ages</option>
              {config.ages.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}{option.count !== undefined ? ` (${option.count})` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Grade Filter */}
        {config.grades && config.grades.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="grade-filter" className="block text-sm font-medium text-gray-900">
                Grade
              </label>
              {selectedGrade && (
                <button
                  type="button"
                  onClick={() => handleClearIndividualFilter("grade")}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  title="Clear grade filter"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>
            <select
              id="grade-filter"
              value={selectedGrade}
              onChange={(e) => handleDropdownChange("grade", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 cursor-pointer"
            >
              <option value="">All Grades</option>
              {config.grades.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}{option.count !== undefined ? ` (${option.count})` : ''}
                </option>
              ))}
            </select>
          </div>
        )}
        </form>
      </div>
    </div>
  );
}
