import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  ClockIcon,
  CalendarDaysIcon,
  TicketIcon,
  HeartIcon,
  EyeIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { filmService } from '../../services/filmService';

const AllFilms = () => {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [likedFilms, setLikedFilms] = useState(new Set());
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch films
  const fetchFilms = useCallback(async () => {
    setLoading(true);
    try {
      const response = await filmService.getAllFilms();
      let filmsData = [];
      
      if (response?.data && Array.isArray(response.data)) {
        filmsData = response.data;
      } else if (Array.isArray(response)) {
        filmsData = response;
      }
      
      setFilms(filmsData);
    } catch (error) {
      setError('Gagal memuat film. Silakan coba lagi.');
      console.error('Error fetching films:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFilms();
  }, [fetchFilms]);

  // Filter and sort films
  const filteredFilms = films
    .filter(film => {
      const matchesSearch = film.judul?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = !selectedGenre || film.genre?.includes(selectedGenre);
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return (a.judul || '').localeCompare(b.judul || '');
        case 'rating':
          return 8.5 - 8.0; // Mock rating sort
        case 'duration':
          return (b.durasi || 0) - (a.durasi || 0);
        case 'newest':
        default:
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      }
    });

  // Get unique genres
  const genres = [...new Set(films.map(film => film.genre).filter(Boolean))];

  // Handle like toggle
  const handleLike = (filmId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedFilms(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(filmId)) {
        newLiked.delete(filmId);
      } else {
        newLiked.add(filmId);
      }
      return newLiked;
    });
  };

  // Handle show modal
  const handleShowModal = (film, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedFilm(film);
    setShowModal(true);
  };

  // Film Card Component
  const FilmCard = ({ film }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={film.poster_url || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3'}
          alt={film.judul}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3';
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleLike(film.id, e)}
                className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                  likedFilms.has(film.id)
                    ? 'bg-red-500 text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <HeartIcon className={`h-4 w-4 ${likedFilms.has(film.id) ? 'fill-current' : ''}`} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleShowModal(film, e)}
                className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors"
              >
                <EyeIcon className="h-4 w-4" />
              </motion.button>

              <Link
                to={`/films/${film.slug || film.id}`}
                className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 text-white py-2 rounded-full text-center text-sm font-semibold hover:from-sky-600 hover:to-blue-700 transition-all"
              >
                Beli Tiket
              </Link>
            </div>
          </div>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-4 left-4">
          <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
            <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-white text-sm font-semibold">8.5</span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Now Playing
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-sky-600 transition-colors line-clamp-1">
          {film.judul || 'Untitled Movie'}
        </h3>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <ClockIcon className="h-4 w-4" />
            <span>{film.durasi || '120'} min</span>
          </div>
          <div className="flex items-center gap-1">
            <CalendarDaysIcon className="h-4 w-4" />
            <span>2024</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {film.deskripsi || 'Film menarik yang menghadirkan pengalaman menonton yang tak terlupakan.'}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-sky-600 font-medium text-sm">
            {film.genre || 'Drama'}
          </span>
          <Link
            to={`/films/${film.slug || film.id}`}
            className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-sky-600 hover:to-blue-700 transition-all text-sm"
          >
            Detail
          </Link>
        </div>
      </div>
    </motion.div>
  );

  // Loading Skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="animate-pulse bg-white rounded-2xl overflow-hidden shadow-lg">
          <div className="aspect-[2/3] bg-gray-300"></div>
          <div className="p-6">
            <div className="h-6 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-16 bg-gray-200 rounded mb-4"></div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-8 bg-gray-300 rounded w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Semua Film
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Jelajahi koleksi lengkap film terbaru dan terpopuler yang sedang tayang di bioskop
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari film favorit Anda..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
              />
            </div>

   

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
            >
              <option value="newest">Terbaru</option>
              <option value="title">Judul A-Z</option>
              <option value="rating">Rating Tertinggi</option>
              <option value="duration">Durasi Terpanjang</option>
            </select>

           
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Menampilkan {filteredFilms.length} dari {films.length} film
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-6">🎬</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Oops! Terjadi Kesalahan</h3>
            <p className="text-gray-600 mb-8">{error}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchFilms}
              className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-sky-600 hover:to-blue-700 transition-all"
            >
              Coba Lagi
            </motion.button>
          </motion.div>
        ) : filteredFilms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Film Tidak Ditemukan</h3>
            <p className="text-gray-600">
              {searchTerm || selectedGenre 
                ? 'Coba ubah kata kunci pencarian atau filter Anda' 
                : 'Belum ada film yang tersedia saat ini'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <AnimatePresence>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredFilms.map((film) => (
                  <FilmCard key={film.id} film={film} />
                ))}
              </div>
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && selectedFilm && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-64">
                <img
                  src={selectedFilm.poster_url || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3'}
                  alt={selectedFilm.judul}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
                <div className="absolute bottom-4 left-6 text-white">
                  <h2 className="text-2xl font-bold mb-2">{selectedFilm.judul}</h2>
                  <div className="flex items-center gap-4 text-sm">
                    <span>⭐ 8.5</span>
                    <span>🕒 {selectedFilm.durasi || '120'} min</span>
                    <span>📅 2024</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {selectedFilm.deskripsi || 'Film menarik yang menghadirkan pengalaman menonton yang tak terlupakan.'}
                </p>
                
                <div className="flex gap-4">
                  <Link
                    to={`/films/${selectedFilm.slug || selectedFilm.id}`}
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-center py-3 rounded-xl font-semibold hover:from-sky-600 hover:to-blue-700 transition-all"
                  >
                    <TicketIcon className="h-5 w-5 inline mr-2" />
                    Beli Tiket
                  </Link>
                  <button className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:border-sky-500 hover:text-sky-600 transition-all">
                    Tonton Trailer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AllFilms;