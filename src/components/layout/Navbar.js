import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { filmService } from "../../services/filmService";
import {
  FilmIcon,
  UserIcon,
  BookmarkIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  BoltIcon,
  SparklesIcon,
  ShoppingBagIcon,
  BuildingOfficeIcon,
  ArrowRightIcon,
  HomeIcon,
  CalendarIcon,
  ClockIcon,
  StarIcon,
  FireIcon,
  ArrowTrendingUpIcon, // Perbaikan: menggunakan ArrowTrendingUpIcon
  TagIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

// Logo Component (tetap sama)
const CinemaLogo = ({ size = "default" }) => {
  const sizeClasses = {
    small: "w-6 h-6",
    default: "w-8 h-8",
    large: "w-10 h-10",
  };

  return (
    <div className={`${sizeClasses[size]} relative`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Film Reel Background */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="url(#filmGradient)"
          stroke="url(#borderGradient)"
          strokeWidth="2"
        />

        {/* Film Holes */}
        <circle cx="50" cy="25" r="4" fill="white" opacity="0.8" />
        <circle cx="75" cy="50" r="4" fill="white" opacity="0.8" />
        <circle cx="50" cy="75" r="4" fill="white" opacity="0.8" />
        <circle cx="25" cy="50" r="4" fill="white" opacity="0.8" />

        {/* Center Play Button */}
        <circle cx="50" cy="50" r="15" fill="white" opacity="0.9" />
        <polygon points="45,40 45,60 65,50" fill="url(#playGradient)" />

        {/* Film Strip */}
        <rect
          x="20"
          y="45"
          width="60"
          height="10"
          fill="white"
          opacity="0.3"
          rx="2"
        />
        <rect
          x="25"
          y="47"
          width="8"
          height="6"
          fill="url(#stripGradient)"
          rx="1"
        />
        <rect
          x="36"
          y="47"
          width="8"
          height="6"
          fill="url(#stripGradient)"
          rx="1"
        />
        <rect
          x="47"
          y="47"
          width="8"
          height="6"
          fill="url(#stripGradient)"
          rx="1"
        />
        <rect
          x="58"
          y="47"
          width="8"
          height="6"
          fill="url(#stripGradient)"
          rx="1"
        />
        <rect
          x="69"
          y="47"
          width="8"
          height="6"
          fill="url(#stripGradient)"
          rx="1"
        />

        {/* Gradients */}
        <defs>
          <linearGradient id="filmGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient
            id="borderGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="playGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient
            id="stripGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

// Enhanced Real Search Component dengan Backend Integration
const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [films, setFilms] = useState([]);
  const [theaters] = useState([
    {
      id: 1,
      name: "Cinema XXI Jakarta Pusat",
      location: "Jakarta Pusat",
      type: "theater",
    },
    { id: 2, name: "Cinema XXI Bandung", location: "Bandung", type: "theater" },
    {
      id: 3,
      name: "Cinema XXI Surabaya",
      location: "Surabaya",
      type: "theater",
    },
    { id: 4, name: "Cinema XXI Medan", location: "Medan", type: "theater" },
    {
      id: 5,
      name: "Cinema XXI Yogyakarta",
      location: "Yogyakarta",
      type: "theater",
    },
  ]);

  const navigate = useNavigate();
  const inputRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Load data saat component mount
  useEffect(() => {
    if (isOpen) {
      loadInitialData();
      if (inputRef.current) {
        inputRef.current.focus();
      }
      // Load dari localStorage
      const saved = localStorage.getItem("searchHistory");
      if (saved) {
        setSearchHistory(JSON.parse(saved));
      }
    }
  }, [isOpen]);

  const loadInitialData = async () => {
    try {
      // Load films dari API
      const response = await filmService.getAllFilms();
      let filmsData = [];

      if (response && typeof response === "object") {
        if (response.data && Array.isArray(response.data)) {
          filmsData = response.data;
        } else if (Array.isArray(response)) {
          filmsData = response;
        }
      }

      setFilms(filmsData);

      // Set popular searches berdasarkan film yang ada
      const popular = filmsData
        .slice(0, 6)
        .map((film) => film.judul)
        .filter(Boolean);
      setPopularSearches([...popular, "Action", "Romance", "Comedy", "Horror"]);
    } catch (error) {
      console.error("Error loading search data:", error);
      // Fallback popular searches
      setPopularSearches([
        "Ballerina",
        "Karate Kid",
        "Action",
        "Romance",
        "Comedy",
        "Horror",
        "Sci-Fi",
        "Drama",
      ]);
    }
  };

  // Debounced search
  const performSearch = useCallback(
    async (searchQuery) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setIsSearching(true);

      try {
        const allResults = [];

        // Search dalam films
        const filmResults = films
          .filter(
            (film) =>
              film.judul?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              film.genre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              film.deskripsi?.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((film) => ({
            id: film.id,
            title: film.judul,
            type: "film",
            genre: film.genre || "Drama",
            rating: 8.5,
            duration: film.durasi || "120",
            poster: film.poster_url,
            slug: film.slug,
            isActive: film.is_active,
            description: film.deskripsi,
          }));

        // Search dalam theaters
        const theaterResults = theaters
          .filter(
            (theater) =>
              theater.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              theater.location.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((theater) => ({
            id: theater.id,
            title: theater.name,
            type: "theater",
            location: theater.location,
          }));

        // Search dalam genres
        const genreResults = [];
        const genres = [
          "Action",
          "Romance",
          "Comedy",
          "Horror",
          "Sci-Fi",
          "Drama",
          "Thriller",
          "Adventure",
        ];
        genres.forEach((genre) => {
          if (genre.toLowerCase().includes(searchQuery.toLowerCase())) {
            genreResults.push({
              id: `genre-${genre}`,
              title: `Film ${genre}`,
              type: "genre",
              genre: genre,
              count: films.filter((f) =>
                f.genre?.toLowerCase().includes(genre.toLowerCase())
              ).length,
            });
          }
        });

        allResults.push(...filmResults, ...theaterResults, ...genreResults);

        // Filter berdasarkan tab
        let filteredResults = allResults;
        if (activeTab === "films") {
          filteredResults = allResults.filter((item) => item.type === "film");
        } else if (activeTab === "theaters") {
          filteredResults = allResults.filter(
            (item) => item.type === "theater"
          );
        } else if (activeTab === "genres") {
          filteredResults = allResults.filter((item) => item.type === "genre");
        }

        // Sort berdasarkan relevance
        filteredResults.sort((a, b) => {
          const aExact = a.title.toLowerCase() === searchQuery.toLowerCase();
          const bExact = b.title.toLowerCase() === searchQuery.toLowerCase();
          if (aExact && !bExact) return -1;
          if (!aExact && bExact) return 1;

          const aStarts = a.title
            .toLowerCase()
            .startsWith(searchQuery.toLowerCase());
          const bStarts = b.title
            .toLowerCase()
            .startsWith(searchQuery.toLowerCase());
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;

          return 0;
        });

        setResults(filteredResults.slice(0, 20)); // Limit hasil
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [films, theaters, activeTab]
  );

  // Handle search dengan debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, performSearch]);

  const searchTabs = [
    { id: "all", label: "Semua", icon: MagnifyingGlassIcon },
    { id: "films", label: "Film", icon: FilmIcon },
    { id: "theaters", label: "Bioskop", icon: BuildingOfficeIcon },
    { id: "genres", label: "Genre", icon: TagIcon },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Save ke search history
      const newHistory = [
        query,
        ...searchHistory.filter((h) => h !== query),
      ].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));

      // Navigate ke halaman results jika diperlukan
      if (results.length === 1) {
        handleResultClick(results[0]);
      }
    }
  };

  const handleResultClick = (result) => {
    // Save ke search history
    if (query.trim()) {
      const newHistory = [
        query,
        ...searchHistory.filter((h) => h !== query),
      ].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));
    }

    onClose();

    // Navigate berdasarkan type
    switch (result.type) {
      case "film":
        navigate(`/films/${result.slug || result.id}`);
        break;
      case "theater":
        navigate(`/theaters?location=${encodeURIComponent(result.location)}`);
        break;
      case "genre":
        navigate(`/films?genre=${encodeURIComponent(result.genre)}`);
        break;
      default:
        navigate("/films");
    }
  };

  const handleQuickSearch = (term) => {
    setQuery(term);
    // Auto perform search
    performSearch(term);
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-start justify-center pt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl w-full max-w-4xl mx-4 overflow-hidden shadow-2xl max-h-[80vh] flex flex-col"
            initial={{ y: -50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -50, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Header */}
            <div className="p-6 border-b border-gray-100">
              <form onSubmit={handleSearch} className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Cari film, bioskop, genre, atau jadwal..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-14 pr-14 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-sky-500 transition-colors"
                />
                <MagnifyingGlassIcon className="absolute left-5 top-5 h-6 w-6 text-gray-400" />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-12 top-5 hover:bg-gray-100 rounded-full p-1 transition-colors"
                  >
                    <XMarkIcon className="h-4 w-4 text-gray-400" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute right-5 top-5 hover:bg-gray-100 rounded-full p-1 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-400" />
                </button>
              </form>

              {/* Search Tabs */}
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {searchTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? "bg-sky-500 text-white shadow-lg"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <tab.icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Quick Stats */}
              {query && !isSearching && (
                <div className="mt-3 text-sm text-gray-500">
                  Ditemukan {results.length} hasil untuk "{query}"
                </div>
              )}
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-y-auto">
              {isSearching ? (
                <div className="p-8 text-center">
                  <motion.div
                    className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full mx-auto"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <p className="mt-4 text-gray-500 text-lg">
                    Mencari {activeTab === "all" ? "semua" : activeTab}...
                  </p>
                </div>
              ) : results.length > 0 ? (
                <div className="p-4">
                  <div className="grid gap-3">
                    {results.map((result, index) => (
                      <motion.div
                        key={`${result.type}-${result.id}`}
                        className="p-4 hover:bg-gray-50 rounded-xl cursor-pointer flex items-center transition-colors group"
                        whileHover={{ x: 5 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleResultClick(result)}
                      >
                        {/* Icon/Image */}
                        <div className="flex-shrink-0 mr-4">
                          {result.type === "film" && result.poster ? (
                            <img
                              src={result.poster}
                              alt={result.title}
                              className="w-12 h-16 object-cover rounded-lg"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                          ) : null}
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              result.poster ? "hidden" : "flex"
                            } ${
                              result.type === "film"
                                ? "bg-sky-100"
                                : result.type === "theater"
                                ? "bg-green-100"
                                : "bg-purple-100"
                            }`}
                          >
                            {result.type === "film" && (
                              <FilmIcon className="h-6 w-6 text-sky-600" />
                            )}
                            {result.type === "theater" && (
                              <BuildingOfficeIcon className="h-6 w-6 text-green-600" />
                            )}
                            {result.type === "genre" && (
                              <TagIcon className="h-6 w-6 text-purple-600" />
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg text-gray-900 truncate group-hover:text-sky-600 transition-colors">
                            {result.title}
                          </h3>

                          {result.type === "film" && (
                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                              <div className="flex items-center gap-1">
                                <StarIcon className="h-4 w-4 text-yellow-400" />
                                <span>{result.rating}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <ClockIcon className="h-4 w-4" />
                                <span>{result.duration} min</span>
                              </div>
                              <span className="px-2 py-1 bg-sky-100 text-sky-700 rounded-full text-xs">
                                {result.genre}
                              </span>
                              {result.isActive && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                                  Now Playing
                                </span>
                              )}
                            </div>
                          )}

                          {result.type === "theater" && (
                            <p className="text-sm text-gray-500 mt-1 flex items-center">
                              <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                              📍 {result.location}
                            </p>
                          )}

                          {result.type === "genre" && (
                            <p className="text-sm text-gray-500 mt-1">
                              {result.count} film tersedia
                            </p>
                          )}
                        </div>

                        {/* Action */}
                        <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-sky-500 transition-colors" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : query ? (
                <div className="p-8 text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Tidak ditemukan
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Hasil pencarian untuk "{query}" tidak ditemukan
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">
                      Coba kata kunci lain atau:
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {popularSearches.slice(0, 4).map((term, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuickSearch(term)}
                          className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm hover:bg-sky-200 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  {/* Search History */}
                  {searchHistory.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-700 flex items-center">
                          <ClockIcon className="h-5 w-5 mr-2" />
                          Pencarian Terakhir
                        </h4>
                        <button
                          onClick={clearSearchHistory}
                          className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                        >
                          Hapus Semua
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {searchHistory.map((term, i) => (
                          <motion.button
                            key={i}
                            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleQuickSearch(term)}
                          >
                            {term}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Searches */}
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-4 flex items-center">
                      <FireIcon className="h-5 w-5 mr-2 text-orange-500" />
                      Pencarian Populer
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((term, i) => (
                        <motion.button
                          key={i}
                          className="px-4 py-2 bg-gradient-to-r from-sky-100 to-blue-100 text-sky-700 rounded-full text-sm hover:from-sky-200 hover:to-blue-200 transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleQuickSearch(term)}
                        >
                          {term}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-4 flex items-center">
                      <ArrowTrendingUpIcon className="h-5 w-5 mr-2 text-green-500" />
                      Aksi Cepat
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          onClose();
                          navigate("/films?status=now-playing");
                        }}
                        className="p-3 bg-green-50 text-green-700 rounded-xl text-left hover:bg-green-100 transition-colors"
                      >
                        <div className="font-medium">Sedang Tayang</div>
                        <div className="text-sm opacity-75">
                          Film yang bisa ditonton sekarang
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          onClose();
                          navigate("/films?status=coming-soon");
                        }}
                        className="p-3 bg-blue-50 text-blue-700 rounded-xl text-left hover:bg-blue-100 transition-colors"
                      >
                        <div className="font-medium">Coming Soon</div>
                        <div className="text-sm opacity-75">
                          Film yang akan datang
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer dengan shortcuts */}
            <div className="border-t border-gray-100 p-4 bg-gray-50">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span>
                    💡 Tips: Gunakan kata kunci spesifik untuk hasil terbaik
                  </span>
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white rounded border">Enter</kbd>
                  <span>untuk cari</span>
                  <kbd className="px-2 py-1 bg-white rounded border">Esc</kbd>
                  <span>untuk tutup</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Navbar component tetap sama seperti sebelumnya
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  // Keyboard shortcut untuk search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);
      await logout();
      setIsMobileMenuOpen(false);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    {
      icon: FilmIcon,
      label: "Semua Film",
      to: "/films",
    },
    {
      icon: BoltIcon,
      label: "Now Playing",
      to: "/now-playing",
    },
    {
      icon: SparklesIcon,
      label: "Coming Soon",
      to: "/coming-soon",
    },
    {
      icon: ShoppingBagIcon,
      label: "Promo",
      to: "/promo",
    },
  ];

  const bottomNavItems = [
    {
      icon: HomeIcon,
      label: "Home",
      to: "/",
      active: location.pathname === "/",
    },
    {
      icon: FilmIcon,
      label: "Films",
      to: "/films",
      active:
        location.pathname === "/films" ||
        location.pathname.startsWith("/films/"),
    },
    {
      icon: MagnifyingGlassIcon,
      label: "Search",
      action: () => setSearchOpen(true),
      active: false,
    },
    {
      icon: BookmarkIcon,
      label: isAuthenticated && !isAdmin ? "Bookings" : "Films",
      to: isAuthenticated && !isAdmin ? "/bookings" : "/films",
      active: location.pathname === "/bookings",
    },
    {
      icon: isAuthenticated ? (isAdmin ? CogIcon : UserIcon) : UserIcon,
      label: isAuthenticated ? (isAdmin ? "Dashboard" : "Profile") : "Login",
      to: isAuthenticated ? (isAdmin ? "/admin" : "/profile") : "/login",
      active:
        location.pathname === "/profile" ||
        location.pathname === "/login" ||
        location.pathname.startsWith("/admin"),
    },
  ];

  return (
    <>
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Desktop Navbar */}
      <nav className="hidden md:block bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <CinemaLogo size="default" />
                <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-blue-400 rounded-full opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300"></div>
              </motion.div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                  CinemaXXI
                </span>
                <span className="text-xs text-gray-500 -mt-1 hidden lg:block">
                  Your Premier Cinema Experience
                </span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors group ${
                    location.pathname === item.to
                      ? "text-sky-600 bg-sky-50"
                      : "text-gray-700 hover:text-sky-600"
                  }`}
                >
                  <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchOpen(true)}
                className="bg-gray-100 hover:bg-gray-200 p-3 rounded-2xl transition-colors relative group"
                title="Search (Ctrl+K)"
              >
                <MagnifyingGlassIcon className="h-6 w-6 text-gray-600" />
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Ctrl+K
                </div>
              </motion.button>

              {isAuthenticated ? (
                <div className="hidden md:flex items-center space-x-4">
                  {!isAdmin && (
                    <Link
                      to="/bookings"
                      className="flex items-center space-x-1 text-gray-700 hover:text-sky-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      <BookmarkIcon className="h-4 w-4" />
                      <span>My Bookings</span>
                    </Link>
                  )}

                  <Link
                    to={isAdmin ? "/admin" : "/profile"}
                    className={`flex items-center space-x-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      isAdmin
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
                        : "text-gray-700 hover:text-sky-600"
                    }`}
                  >
                    {isAdmin ? (
                      <CogIcon className="h-4 w-4" />
                    ) : (
                      <UserIcon className="h-4 w-4" />
                    )}
                    <span>{isAdmin ? "Dashboard" : "Profile"}</span>
                    {user && !isAdmin && (
                      <span className="ml-1 text-xs opacity-75">
                        ({user.name})
                      </span>
                    )}
                  </Link>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center space-x-1 bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-600 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                  </motion.button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-4">
                  <Link
                    to="/register"
                    className="text-gray-700 hover:text-sky-600 font-medium transition-colors"
                  >
                    Daftar
                  </Link>
                  <Link
                    to="/login"
                    className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-sky-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Masuk
                  </Link>
                </div>
              )}

              <div className="md:hidden lg:hidden">
                <button
                  onClick={toggleMobileMenu}
                  className="text-gray-600 hover:text-sky-600 p-2"
                >
                  {isMobileMenuOpen ? (
                    <XMarkIcon className="h-6 w-6" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                className="md:hidden"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100 rounded-lg">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      className="flex items-center space-x-3 text-gray-700 hover:text-sky-600 hover:bg-gray-50 px-3 py-2 rounded-lg text-base font-medium transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  ))}

                  <div className="border-t border-gray-200 pt-3 mt-3">
                    {isAuthenticated ? (
                      <>
                        {user && (
                          <div className="px-3 py-2 text-sm text-gray-500 border-b border-gray-100 mb-2">
                            Logged in as:{" "}
                            <span className="font-medium text-gray-700">
                              {user.name}
                            </span>
                            {isAdmin && (
                              <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs">
                                Admin
                              </span>
                            )}
                          </div>
                        )}

                        {!isAdmin && (
                          <Link
                            to="/bookings"
                            className="flex items-center space-x-3 text-gray-700 hover:text-sky-600 hover:bg-gray-50 px-3 py-2 rounded-lg text-base font-medium transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <BookmarkIcon className="h-5 w-5" />
                            <span>My Bookings</span>
                          </Link>
                        )}

                        <Link
                          to={isAdmin ? "/admin" : "/profile"}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                            isAdmin
                              ? "text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                              : "text-gray-700 hover:text-sky-600 hover:bg-gray-50"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {isAdmin ? (
                            <CogIcon className="h-5 w-5" />
                          ) : (
                            <UserIcon className="h-5 w-5" />
                          )}
                          <span>{isAdmin ? "Dashboard" : "Profile"}</span>
                        </Link>

                        <button
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="flex items-center space-x-3 w-full text-left text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg text-base font-medium transition-colors disabled:opacity-50"
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5" />
                          <span>
                            {isLoggingOut ? "Logging out..." : "Logout"}
                          </span>
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/register"
                          className="block text-gray-700 hover:text-sky-600 hover:bg-gray-50 px-3 py-2 rounded-lg text-base font-medium transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Daftar
                        </Link>
                        <Link
                          to="/login"
                          className="block bg-gradient-to-r from-sky-500 to-blue-600 text-white px-3 py-2 rounded-lg text-base font-medium"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Masuk
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="flex justify-between items-center h-14 px-4">
          <Link to="/" className="flex items-center space-x-2">
            <CinemaLogo size="small" />
            <span className="text-lg font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              CinemaXXI
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to={isAdmin ? "/admin" : "/profile"}
                  className={`p-2 rounded-full ${
                    isAdmin
                      ? "bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-600"
                      : "bg-sky-100 text-sky-600"
                  }`}
                >
                  {isAdmin ? (
                    <CogIcon className="h-5 w-5" />
                  ) : (
                    <UserIcon className="h-5 w-5" />
                  )}
                </Link>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-xs font-medium text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-full border transition-colors disabled:opacity-50"
                >
                  {isLoggingOut ? "Logout..." : "Logout"}
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/register"
                  className="text-xs font-medium text-gray-600 px-2 py-1 rounded-full"
                >
                  Daftar
                </Link>
                <Link
                  to="/login"
                  className="text-xs font-medium text-white bg-sky-500 hover:bg-sky-600 px-3 py-1 rounded-full transition-colors"
                >
                  Masuk
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-5 h-16">
          {bottomNavItems.map((item, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-center"
              whileTap={{ scale: 0.95 }}
            >
              {item.action ? (
                <button
                  onClick={item.action}
                  className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                    item.active
                      ? "text-sky-600 bg-sky-50"
                      : "text-gray-600 hover:text-sky-600"
                  }`}
                >
                  <item.icon className="h-6 w-6 mb-1" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              ) : (
                <Link
                  to={item.to}
                  className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                    item.active
                      ? isAdmin && item.label === "Dashboard"
                        ? "text-purple-600 bg-purple-50"
                        : "text-sky-600 bg-sky-50"
                      : "text-gray-600 hover:text-sky-600"
                  }`}
                >
                  <item.icon className="h-6 w-6 mb-1" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="md:hidden h-16"></div>
    </>
  );
};

export default Navbar;
