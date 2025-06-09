import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlayIcon,
  StarIcon,
  ClockIcon,
  TicketIcon,
  BoltIcon,
  CalendarDaysIcon,
  FilmIcon,
  HeartIcon,
  ShareIcon,
  EyeIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { filmService } from '../../services/filmService'; // Fixed import

const NowPlaying = () => {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [favoriteFilms, setFavoriteFilms] = useState(new Set());

  const fetchFilms = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await filmService.getAllFilms();
      
      let filmsData = [];
      if (response && typeof response === 'object') {
        if (response.data && Array.isArray(response.data)) {
          filmsData = response.data;
        } else if (Array.isArray(response)) {
          filmsData = response;
        }
      } else if (Array.isArray(response)) {
        filmsData = response;
      }
      
      setFilms(filmsData);
    } catch (error) {
      console.error('Error fetching films:', error);
      setError('Gagal memuat film. Silakan coba lagi.');
      setFilms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFilms();
  }, [fetchFilms]);

  const handleFavorite = (filmId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavoriteFilms(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(filmId)) {
        newFavorites.delete(filmId);
      } else {
        newFavorites.add(filmId);
      }
      return newFavorites;
    });
  };

  const handleShowDetails = (film, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedFilm(film);
    setShowDetails(true);
  };

  const FilmCard = ({ film, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={film.poster_url || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3'}
          alt={film.judul}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3';
          }}
        />
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg"
          >
            <BoltIcon className="h-3 w-3" />
            SEDANG TAYANG
          </motion.span>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-4 right-4">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full"
          >
            <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-white text-sm font-semibold">8.5</span>
          </motion.div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleFavorite(film.id, e)}
                className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                  favoriteFilms.has(film.id)
                    ? 'bg-red-500 text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <HeartIcon className={`h-4 w-4 ${favoriteFilms.has(film.id) ? 'fill-current' : ''}`} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleShowDetails(film, e)}
                className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors"
              >
                <EyeIcon className="h-4 w-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open(`https://www.youtube.com/results?search_query=${film.judul}+trailer`, '_blank')}
                className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors"
              >
                <PlayIcon className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-green-600 transition-colors">
          {film.judul || 'Untitled Movie'}
        </h3>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <ClockIcon className="h-4 w-4" />
            <span>{film.durasi || '120'} min</span>
          </div>
          <span className="text-green-600 font-medium">{film.genre || 'Drama'}</span>
        </div>
        
        <Link
          to={`/films/${film.slug || film.id}`}
          className="block w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center py-3 rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
        >
          <TicketIcon className="h-4 w-4 inline mr-2" />
          Beli Tiket Sekarang
        </Link>
      </div>
    </motion.div>
  );

  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-20">
      <div className="container mx-auto px-6">
        {/* Header Skeleton */}
        <div className="text-center mb-12">
          <div className="h-10 bg-gray-300 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
        </div>

        {/* Featured Film Skeleton */}
        <div className="h-96 bg-gray-300 rounded-3xl mb-12 animate-pulse"></div>

        {/* Grid Skeleton */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-300 aspect-[2/3] rounded-3xl mb-4"></div>
              <div className="h-5 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-3"></div>
              <div className="h-10 bg-gray-300 rounded-2xl"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <FilmIcon className="h-20 w-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Oops! Terjadi Kesalahan</h3>
            <p className="text-gray-600 mb-8">{error}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchFilms}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
            >
              Coba Lagi
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-20">
        <div className="container mx-auto px-6">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 bg-green-100 text-green-800 px-6 py-3 rounded-full font-semibold mb-6"
            >
              <SparklesIcon className="h-5 w-5" />
              Now Playing
            </motion.div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Sedang Tayang
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nikmati pengalaman menonton film terbaru yang sedang diputar di bioskop kami
            </p>
          </motion.div>

          {/* Enhanced Featured Film */}
          {films.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative h-[500px] rounded-3xl overflow-hidden mb-16 shadow-2xl"
            >
              <img
                src={films[0].poster_url || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3'}
                alt={films[0].judul}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/20"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-6">
                  <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="max-w-3xl text-white"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                        FILM UNGGULAN
                      </span>
                      <div className="flex items-center gap-2">
                        <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="font-semibold">8.5/10</span>
                      </div>
                    </div>
                    
                    <h2 className="text-5xl font-bold mb-4 leading-tight">
                      {films[0].judul || 'Featured Movie'}
                    </h2>
                    
                    <div className="flex items-center gap-6 mb-6 text-lg">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="h-5 w-5" />
                        <span>{films[0].durasi || '120'} menit</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarDaysIcon className="h-5 w-5" />
                        <span>2024</span>
                      </div>
                      <span className="text-green-400 font-semibold">
                        {films[0].genre || 'Drama'}
                      </span>
                    </div>
                    
                    <p className="text-xl text-gray-200 mb-8 leading-relaxed max-w-2xl">
                      {films[0].deskripsi || 'Film menarik yang wajib ditonton di bioskop dengan cerita yang memukau dan visual yang menakjubkan.'}
                    </p>
                    
                    <div className="flex gap-4">
                      <Link
                        to={`/films/${films[0].slug || films[0].id}`}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
                      >
                        <TicketIcon className="h-5 w-5 inline mr-2" />
                        Beli Tiket Sekarang
                      </Link>
                      <button
                        onClick={() => window.open(`https://www.youtube.com/results?search_query=${films[0].judul}+trailer`, '_blank')}
                        className="border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white hover:text-gray-900 transition-all backdrop-blur-sm"
                      >
                        <PlayIcon className="h-5 w-5 inline mr-2" />
                        Tonton Trailer
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Films Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Semua Film Yang Sedang Tayang</h3>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
              {films.map((film, index) => (
                <FilmCard key={film.id || index} film={film} index={index} />
              ))}
            </div>
          </motion.div>

          {films.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <FilmIcon className="h-20 w-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Belum Ada Film Yang Tayang</h3>
              <p className="text-gray-600 text-lg">Film akan segera hadir. Nantikan update terbaru!</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Enhanced Detail Modal */}
      <AnimatePresence>
        {showDetails && selectedFilm && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative h-80">
                <img
                  src={selectedFilm.poster_url || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3'}
                  alt={selectedFilm.judul}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                
                <button
                  className="absolute top-4 right-4 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                  onClick={() => setShowDetails(false)}
                >
                  ✕
                </button>

                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h2 className="text-3xl font-bold mb-2">{selectedFilm.judul}</h2>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="font-semibold">8.5/10</span>
                    </div>
                    <span>{selectedFilm.genre || 'Drama'}</span>
                    <span>{selectedFilm.durasi || '120'} min</span>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <h3 className="text-2xl font-bold mb-4">Tentang Film</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {selectedFilm.deskripsi || 'Film menarik yang menghadirkan pengalaman menonton yang tak terlupakan.'}
                    </p>
                    
                    <div className="flex gap-4">
                      <Link
                        to={`/films/${selectedFilm.slug || selectedFilm.id}`}
                        onClick={() => setShowDetails(false)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center py-3 rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all"
                      >
                        <TicketIcon className="h-5 w-5 inline mr-2" />
                        Beli Tiket
                      </Link>
                      <button
                        onClick={() => window.open(`https://www.youtube.com/results?search_query=${selectedFilm.judul}+trailer`, '_blank')}
                        className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-2xl font-semibold hover:border-green-500 hover:text-green-600 transition-all"
                      >
                        <PlayIcon className="h-5 w-5 inline mr-2" />
                        Trailer
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3">Detail Film</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Durasi:</span>
                          <span className="font-semibold">{selectedFilm.durasi || '120'} menit</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Genre:</span>
                          <span className="font-semibold">{selectedFilm.genre || 'Drama'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className="font-semibold text-green-600">Sedang Tayang</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => handleFavorite(selectedFilm.id, e)}
                        className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                          favoriteFilms.has(selectedFilm.id)
                            ? 'border-red-500 bg-red-50 text-red-600'
                            : 'border-gray-200 hover:border-red-300 text-gray-600'
                        }`}
                      >
                        <HeartIcon className={`h-5 w-5 mx-auto ${favoriteFilms.has(selectedFilm.id) ? 'fill-current' : ''}`} />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 p-3 rounded-xl border-2 border-gray-200 hover:border-blue-300 text-gray-600 hover:text-blue-600 transition-all"
                      >
                        <ShareIcon className="h-5 w-5 mx-auto" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NowPlaying;