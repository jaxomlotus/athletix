"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { meta } from "@/lib/config";
import { authClient } from "@/lib/auth-client";
import AuthModal from "./AuthModal";

interface SearchResult {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
}

interface SearchResults {
  sports: SearchResult[];
  leagues: SearchResult[];
  teams: SearchResult[];
  players: SearchResult[];
  locations: SearchResult[];
  schools: SearchResult[];
}

export default function NavigationHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // Debounced search
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setResults(null);
      setShowDropdown(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search/suggestions?q=${encodeURIComponent(searchQuery.trim())}`
        );
        const data = await response.json();
        setResults(data.results);
        setShowDropdown(true);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut();
    setShowUserMenu(false);
    router.refresh();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowDropdown(false);
      router.push(`/search?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleResultClick = (type: string, slug: string) => {
    setShowDropdown(false);
    setSearchQuery("");
    router.push(`/${type}/${slug}`);
  };

  const handleSectionClick = (urlPrefix: string) => {
    setShowDropdown(false);
    const query = searchQuery.trim();
    setSearchQuery("");
    router.push(`/${urlPrefix}?search=${encodeURIComponent(query)}`);
  };

  // Sort sections by result count
  const getSortedSections = () => {
    if (!results) return [];

    const sections = [
      { key: "sports", label: "Sports", results: results.sports, urlPrefix: "sports" },
      { key: "leagues", label: "Leagues", results: results.leagues, urlPrefix: "leagues" },
      { key: "teams", label: "Teams", results: results.teams, urlPrefix: "teams" },
      { key: "players", label: "Players", results: results.players, urlPrefix: "players" },
      { key: "locations", label: "Locations", results: results.locations, urlPrefix: "locations" },
      { key: "schools", label: "Schools", results: results.schools, urlPrefix: "schools" },
    ];

    return sections
      .filter(section => section.results.length > 0)
      .sort((a, b) => b.results.length - a.results.length);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo and Search */}
          <div className="flex items-center gap-3 sm:gap-6 flex-1">
            {/* Logo */}
            <a href="/" className="flex items-center">
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {meta.brand}
              </div>
            </a>

            {/* Search Bar */}
            <div ref={searchRef} className="hidden sm:block flex-1 max-w-md relative">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                      if (results && searchQuery.trim().length >= 2) {
                        setShowDropdown(true);
                      }
                    }}
                    placeholder="Search athletes, teams..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm cursor-text"
                  />
                </div>
              </form>

              {/* Dropdown */}
              {showDropdown && results && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                  {getSortedSections().length > 0 ? (
                    <>
                      {getSortedSections().map((section) => (
                        <div key={section.key} className="border-b border-gray-100 last:border-b-0">
                          <button
                            onClick={() => handleSectionClick(section.urlPrefix)}
                            className="w-full px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-700 uppercase tracking-wide text-left hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            {section.label} ({section.results.length})
                          </button>
                          <div className="py-1">
                            {section.results.map((result) => (
                              <button
                                key={result.id}
                                onClick={() => handleResultClick(section.urlPrefix, result.slug)}
                                className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left cursor-pointer"
                              >
                                {result.logo && (
                                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
                                    <img
                                      src={result.logo}
                                      alt={result.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                <span className="text-sm text-gray-900 truncate">{result.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}

                      {/* View all results link */}
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleSearch(e as any);
                          }}
                          className="text-sm text-green-600 hover:text-green-700 font-semibold cursor-pointer"
                        >
                          View all results for "{searchQuery}"
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="px-4 py-4 text-center text-sm text-gray-500">
                      No results
                    </div>
                  )}
                </div>
              )}

              {/* Loading indicator */}
              {isLoading && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-sm text-gray-500 z-50">
                  Loading...
                </div>
              )}
            </div>
          </div>

          {/* Auth Section */}
          <div className="flex items-center">
            {isPending ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : session?.user ? (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-gray-100 rounded-lg transition-colors text-xs sm:text-base cursor-pointer"
                >
                  <FaRegUserCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                  <span className="hidden sm:inline text-gray-900 font-medium">
                    {session.user.name || session.user.email}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {session.user.email}
                      </p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 px-3 sm:px-6 py-1.5 sm:py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors text-xs sm:text-base cursor-pointer"
              >
                <FaRegUserCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="signup"
      />
    </header>
  );
}
