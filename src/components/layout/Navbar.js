import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  HomeIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

// Enhanced Interactive Search Component
const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  const searchTabs = [
    { id: 'all', label: 'Semua', icon: MagnifyingGlassIcon },
    { id: 'films', label: 'Film', icon: FilmIcon },
    { id: 'theaters', label: 'Bioskop', icon: BuildingOfficeIcon },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsSearching(true);
      setTimeout(() => {
        const allResults = [
          { id: 1, title: 'Ballerina', type: 'film', rating: 8.5, genre: 'Action' },
          { id: 2, title: 'Gowes', type: 'film', rating: 7.8, genre: 'Drama' },
          { id: 3, title: 'Cinema XXI Jakarta', type: 'theater', location: 'Jakarta' },
          { id: 4, title: 'Cinema XXI Bandung', type: 'theater', location: 'Bandung' }
        ];

        let filteredResults = allResults.filter(item =>
          item.title.toLowerCase().includes(query.toLowerCase())
        );

        if (activeTab !== 'all') {
          filteredResults = filteredResults.filter(item =>
            activeTab === 'films' ? item.type === 'film' : item.type === 'theater'
          );
        }

        setResults(filteredResults);
        setIsSearching(false);
      }, 800);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black  bg-opacity-80 z-50 flex items-start justify-center pt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl w-full max-w-3xl mx-4 overflow-hidden shadow-2xl"
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
                  type="text"
                  placeholder="Cari film, bioskop, atau jadwal..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-14 pr-14 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-sky-500 transition-colors"
                  autoFocus
                />
                <MagnifyingGlassIcon className="absolute left-5 top-5 h-6 w-6 text-gray-400" />
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute right-5 top-5 hover:bg-gray-100 rounded-full p-1 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-400" />
                </button>
              </form>

              {/* Search Tabs */}
              <div className="flex gap-2 mt-4">
                {searchTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === tab.id
                      ? 'bg-sky-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    <tab.icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto">
              {isSearching ? (
                <div className="p-8 text-center">
                  <motion.div
                    className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full mx-auto"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <p className="mt-4 text-gray-500 text-lg">Mencari {activeTab === 'all' ? 'semua' : activeTab}...</p>
                </div>
              ) : results.length > 0 ? (
                <div className="p-4">
                  {results.map(result => (
                    <motion.div
                      key={result.id}
                      className="p-4 hover:bg-gray-50 rounded-xl cursor-pointer flex items-center transition-colors"
                      whileHover={{ x: 5 }}
                      onClick={() => {
                        onClose();
                        navigate(result.type === 'film' ? `/films/${result.id}` : `/theaters/${result.id}`);
                      }}
                    >
                      <div className={`rounded-full p-3 mr-4 ${result.type === 'film' ? 'bg-sky-100' : 'bg-green-100'}`}>
                        {result.type === 'film' ? (
                          <FilmIcon className="h-6 w-6 text-sky-600" />
                        ) : (
                          <BuildingOfficeIcon className="h-6 w-6 text-green-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{result.title}</h3>
                        {result.type === 'film' ? (
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <span>⭐ {result.rating}</span>
                            <span>{result.genre}</span>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 mt-1">📍 {result.location}</p>
                        )}
                      </div>
                      <ArrowRightIcon className="h-5 w-5 text-gray-400" />
                    </motion.div>
                  ))}
                </div>
              ) : query ? (
                <div className="p-8 text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Tidak ditemukan</h3>
                  <p className="text-gray-500">Hasil pencarian untuk "{query}" tidak ditemukan</p>
                </div>
              ) : (
                <div className="p-6">
                  <h4 className="font-semibold text-gray-700 mb-4">🔥 Pencarian Populer</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Ballerina', 'GILS', 'Karate Kid', 'Cinema Jakarta', 'Waktu Maghrib', 'Action', 'Romance'].map((term, i) => (
                      <motion.button
                        key={i}
                        className="px-4 py-2 bg-gradient-to-r from-sky-100 to-blue-100 text-sky-700 rounded-full text-sm hover:from-sky-200 hover:to-blue-200 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setQuery(term)}
                      >
                        {term}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Mock auth state - replace with actual auth context
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Set to true untuk testing
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState({ name: 'John Doe', email: 'john@example.com' }); // Mock user data

  const handleLogout = async () => {
    setIsAuthenticated(false);
    setUser(null);
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    {
      icon: FilmIcon,
      label: 'Semua Film',
      to: '/films'
    },
    {
      icon: BoltIcon,
      label: 'Now Playing',
      to: '/now-playing'
    },
    {
      icon: SparklesIcon,
      label: 'Coming Soon',
      to: '/coming-soon'
    },
    {
      icon: ShoppingBagIcon,
      label: 'Promo',
      to: '/promo'
    },
  ];

  // Updated bottom navigation items for mobile
  const bottomNavItems = [
    {
      icon: HomeIcon,
      label: 'Home',
      to: '/',
      active: location.pathname === '/'
    },
    {
      icon: FilmIcon,
      label: 'Films',
      to: '/films',
      active: location.pathname === '/films'
    },
    {
      icon: MagnifyingGlassIcon,
      label: 'Search',
      action: () => setSearchOpen(true),
      active: false
    },
    {
      icon: BookmarkIcon,
      label: 'Bookings',
      to: '/bookings',
      active: location.pathname === '/bookings'
    },
    {
      icon: UserIcon,
      label: isAuthenticated ? 'Profile' : 'Login',
      to: isAuthenticated ? '/profile' : '/login',
      active: location.pathname === '/profile' || location.pathname === '/login',
      action: isAuthenticated ? null : () => navigate('/login')
    }
  ];

  return (
    <>
      {/* Search Overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Desktop Navbar - Always show */}
      <nav className="hidden md:block bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              to="/"
              className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent"
            >
              CinemaXXI
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-6">
              {/* Navigation Items */}
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors group ${location.pathname === item.to
                    ? 'text-sky-600 bg-sky-50'
                    : 'text-gray-700 hover:text-sky-600'
                    }`}
                >
                  <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchOpen(true)}
                className="bg-gray-100 hover:bg-gray-200 p-3 rounded-2xl transition-colors"
              >
                <MagnifyingGlassIcon className="h-6 w-6 text-gray-600" />
              </motion.button>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="hidden md:flex items-center space-x-4">
                  <Link
                    to="/bookings"
                    className="flex items-center space-x-1 text-gray-700 hover:text-sky-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <BookmarkIcon className="h-4 w-4" />
                    <span>My Bookings</span>
                  </Link>

                  <Link
                    to="/profile"
                    className="flex items-center space-x-1 text-gray-700 hover:text-sky-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <UserIcon className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center space-x-1 bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                      <CogIcon className="h-4 w-4" />
                      <span>Admin</span>
                    </Link>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="flex items-center space-x-1 bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-600 transition-colors shadow-lg hover:shadow-xl"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    <span>Logout</span>
                  </motion.button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-4">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-sky-600 font-medium transition-colors"
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-sky-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Daftar
                  </Link>
                </div>
              )}

              {/* Mobile menu button - Only for tablet */}
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

          {/* Mobile Dropdown Menu - Only for tablet */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                className="md:hidden"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100 rounded-lg">
                  {/* Navigation Items */}
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
                        <Link
                          to="/bookings"
                          className="flex items-center space-x-3 text-gray-700 hover:text-sky-600 hover:bg-gray-50 px-3 py-2 rounded-lg text-base font-medium transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <BookmarkIcon className="h-5 w-5" />
                          <span>My Bookings</span>
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center space-x-3 text-gray-700 hover:text-sky-600 hover:bg-gray-50 px-3 py-2 rounded-lg text-base font-medium transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <UserIcon className="h-5 w-5" />
                          <span>Profile</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full text-left text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg text-base font-medium transition-colors"
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5" />
                          <span>Logout</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="block text-gray-700 hover:text-sky-600 hover:bg-gray-50 px-3 py-2 rounded-lg text-base font-medium transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Masuk
                        </Link>
                        <Link
                          to="/register"
                          className="block bg-gradient-to-r from-sky-500 to-blue-600 text-white px-3 py-2 rounded-lg text-base font-medium"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Daftar
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

      {/* Mobile Top Bar - Only show on small screens */}
      <div className="md:hidden bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="flex justify-between items-center h-14 px-4">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent"
          >
            CinemaXXI
          </Link>

          {/* User Actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="p-2 rounded-full bg-sky-100 text-sky-600"
                >
                  <UserIcon className="h-5 w-5" />
                </Link>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="text-xs font-medium text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-full border transition-colors"
                >
                  Logout
                </motion.button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-sky-600 px-3 py-1 rounded-full border border-sky-200"
              >
                Login
              </Link>
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
                  className={`flex flex-col items-center justify-center w-full h-full transition-colors ${item.active
                    ? 'text-sky-600 bg-sky-50'
                    : 'text-gray-600 hover:text-sky-600'
                    }`}
                >
                  <item.icon className="h-6 w-6 mb-1" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              ) : (
                <Link
                  to={item.to}
                  className={`flex flex-col items-center justify-center w-full h-full transition-colors ${item.active
                    ? 'text-sky-600 bg-sky-50'
                    : 'text-gray-600 hover:text-sky-600'
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

      {/* Add padding bottom for mobile to prevent content overlap */}
      <div className="md:hidden h-16"></div>
    </>
  );
};

export default Navbar;