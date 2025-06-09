import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { filmService } from "../../services/filmService";
import { bookingService } from "../../services/bookingService";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClockIcon,
  CurrencyDollarIcon,
  StarIcon,
  CalendarIcon,
  TicketIcon,
  PlayIcon,
  HeartIcon,
  ShareIcon,
  ArrowLeftIcon,
  XMarkIcon,
  MapPinIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

const FilmDetail = () => {
  const { slug } = useParams(); // Changed from id to slug to match your routing
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [film, setFilm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    fetchFilm();
  }, [slug]);

  const fetchFilm = async () => {
    try {
      setLoading(true);
      setError("");

      // Gunakan getFilm yang menggunakan slug
      const response = await filmService.getFilm(slug);

      // Handle Laravel Resource response
      let filmData = null;

      if (response && typeof response === "object") {
        // Check if it's a Resource response with data property
        filmData = response.data || response;
      }

      if (!filmData) {
        throw new Error("Film not found");
      }

      setFilm(filmData);
    } catch (error) {
      setError("Film tidak ditemukan");
      console.error("Error fetching film:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setBookingLoading(true);
    setError("");

    try {
      // Sesuaikan dengan PemesananController validation
      await bookingService.createBooking({
        film_id: film.id,
        jumlah_tiket: ticketQuantity,
        // total_harga akan dihitung otomatis di backend
      });

      setSuccess(
        "Pemesanan berhasil! Anda akan diarahkan ke halaman pemesanan."
      );
      setTimeout(() => {
        navigate("/bookings");
      }, 2000);
    } catch (error) {
      setError("Pemesanan gagal. Silakan coba lagi.");
      console.error("Booking error:", error);
    } finally {
      setBookingLoading(false);
    }
  };

  const calculateTotal = () => {
    if (film?.harga_tiket) {
      return parseInt(film.harga_tiket) * ticketQuantity;
    }
    return 0;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: film?.judul,
        text: film?.deskripsi,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setSuccess("Link berhasil disalin!");
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3">
                <div className="w-full h-96 md:h-full bg-gray-300 animate-pulse"></div>
              </div>
              <div className="md:w-2/3 p-8">
                <div className="h-8 bg-gray-300 rounded mb-4 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded mb-6 w-1/2 animate-pulse"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !film) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white p-8 rounded-xl shadow-lg"
        >
          <div className="text-6xl mb-4">🎬</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Film Tidak Ditemukan
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/films")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 inline mr-2" />
            Kembali ke Daftar Film
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <img
          src={
            film?.poster_url ||
            "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3"
          }
          alt={film?.judul}
          className="w-full h-full object-cover transform scale-105"
          style={{ filter: "brightness(0.3)" }}
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

        {/* Navigation */}
        <div className="absolute top-6 left-6 z-20">
          <button
            onClick={() => navigate(-1)}
            className="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all backdrop-blur-md"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-6 right-6 z-20 flex gap-3">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-3 rounded-full backdrop-blur-md transition-all ${
              isLiked
                ? "bg-red-500 text-white"
                : "bg-black bg-opacity-50 text-white hover:bg-opacity-70"
            }`}
          >
            <HeartIcon className={`h-6 w-6 ${isLiked ? "fill-current" : ""}`} />
          </button>

          <button
            onClick={handleShare}
            className="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all backdrop-blur-md"
          >
            <ShareIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Film Info Overlay */}
        <div className="absolute bottom-8 left-8 right-8 text-white z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-yellow-400 text-black px-3 py-1 text-sm font-bold rounded-full">
                {film?.tanggal_rilis
                  ? new Date(film.tanggal_rilis).getFullYear()
                  : "2024"}
              </span>
              <div className="flex items-center gap-1">
                <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="font-semibold">8.5</span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  film?.is_active
                    ? "bg-green-500 text-white"
                    : "bg-gray-500 text-white"
                }`}
              >
                {film?.is_active ? "Now Playing" : "Coming Soon"}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              {film?.judul}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-300 mb-6">
              <div className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5" />
                <span>{film?.durasi || "120"} menit</span>
              </div>
              <div className="flex items-center gap-2">
                <CurrencyDollarIcon className="h-5 w-5" />
                <span className="text-green-400 font-semibold">
                  Rp{" "}
                  {film?.harga_tiket
                    ? parseInt(film.harga_tiket).toLocaleString()
                    : "50,000"}
                </span>
              </div>
              {film?.tanggal_rilis && (
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  <span>
                    {new Date(film.tanggal_rilis).toLocaleDateString("id-ID")}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowTrailer(true)}
                className="flex items-center justify-center bg-white bg-opacity-20 backdrop-blur-md text-white px-6 py-3 rounded-xl font-semibold hover:bg-opacity-30 transition-all"
              >
                <PlayIcon className="h-5 w-5 mr-2" />
                Tonton Trailer
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Error Messages */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg"
            >
              {success}
            </motion.div>
          )}

          {error && film && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Poster */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="sticky top-8"
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="aspect-[2/3] relative">
                  <img
                    src={
                      film?.poster_url ||
                      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3"
                    }
                    alt={film?.judul}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3";
                    }}
                  />

                  {/* Overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* Quick Stats */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        8.5
                      </div>
                      <div className="text-sm text-gray-500">Rating</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {film?.durasi || "120"}
                      </div>
                      <div className="text-sm text-gray-500">Menit</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Details & Booking */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Sinopsis
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {film?.deskripsi ||
                  "Film menarik yang menghadirkan pengalaman menonton yang tak terlupakan dengan cerita yang memikat dan visual yang memukau. Sebuah perjalanan emosional yang akan membawa penonton merasakan berbagai perasaan dari awal hingga akhir."}
              </p>
            </motion.div>

            {/* Booking Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Pesan Tiket
              </h2>

              {film?.is_active ? (
                <div className="space-y-6">
                  {/* Ticket Quantity Selector */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center">
                      <TicketIcon className="h-6 w-6 text-blue-600 mr-3" />
                      <span className="text-gray-700 font-medium">
                        Jumlah Tiket:
                      </span>
                    </div>
                    <select
                      value={ticketQuantity}
                      onChange={(e) =>
                        setTicketQuantity(parseInt(e.target.value))
                      }
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num} Tiket
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Breakdown */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                    <div className="space-y-3">
                      <div className="flex justify-between text-gray-600">
                        <span>Harga per tiket:</span>
                        <span>
                          Rp{" "}
                          {film?.harga_tiket
                            ? parseInt(film.harga_tiket).toLocaleString()
                            : "50,000"}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Jumlah tiket:</span>
                        <span>{ticketQuantity}</span>
                      </div>
                      <hr className="border-gray-300" />
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">
                          Total:
                        </span>
                        <span className="text-2xl font-bold text-blue-600">
                          Rp {calculateTotal().toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleBooking}
                    disabled={bookingLoading}
                    className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl ${
                      bookingLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {bookingLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                        Memproses Pemesanan...
                      </div>
                    ) : (
                      <>
                        <TicketIcon className="h-5 w-5 inline mr-2" />
                        Pesan Sekarang
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="text-center p-8 bg-gray-50 rounded-xl">
                  <div className="text-4xl mb-4">🎬</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Segera Hadir
                  </h3>
                  <p className="text-gray-600">
                    Film ini belum tersedia untuk pemesanan. Tunggu pengumuman
                    resmi!
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      <AnimatePresence>
        {showTrailer && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTrailer(false)}
          >
            <motion.div
              className="bg-white rounded-xl overflow-hidden max-w-4xl w-full max-h-[80vh]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-xl font-semibold">
                  {film?.judul} - Trailer
                </h3>
                <button
                  onClick={() => setShowTrailer(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <PlayIcon className="h-16 w-16 mx-auto mb-4" />
                  <p>Trailer akan segera tersedia</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilmDetail;
