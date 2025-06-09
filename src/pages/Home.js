import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { filmService } from "../services/filmService";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/parallax";
import {
  PlayIcon,
  ClockIcon,
  StarIcon,
  MagnifyingGlassIcon,
  TicketIcon,
  FilmIcon,
  ShoppingBagIcon,
  BuildingOfficeIcon,
  XMarkIcon,
  CalendarDaysIcon,
  ArrowRightIcon,
  FireIcon,
  EyeIcon,
  HeartIcon,
  ShareIcon,
  BoltIcon,
  SparklesIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

// Import banner images
import banner1 from "../assets/image/banner1.jpg";
import banner2 from "../assets/image/banner2.jpg";

// Floating particles background
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full opacity-20"
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 100 - 50, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 10,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
};

// Enhanced Top Banner with News/Promo - Made sticky
const TopBanner = ({ onClose }) => {
  const [currentPromo, setCurrentPromo] = useState(0);
  const promos = [
    "🎉 GRAND OPENING! Diskon 50% untuk 100 pembeli pertama!",
    "🍿 Paket Hemat! Beli 2 tiket + popcorn mulai 89K",
    "💝 Weekend Special! Buy 1 Get 1 untuk couple seat",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white py-3 overflow-hidden sticky top-16 z-40"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
    >
      <FloatingParticles />
      <div className="container mx-auto px-4 flex items-center justify-center relative z-10">
        <motion.div
          key={currentPromo}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex items-center"
        >
          <span className="bg-yellow-400 text-sky-900 px-3 py-1 text-xs font-bold rounded-full mr-3 animate-pulse">
            HOT
          </span>
          <p className="text-sm font-medium">{promos[currentPromo]}</p>
        </motion.div>
        <button
          onClick={onClose}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
        >
          <XMarkIcon className="h-4 w-4 text-white" />
        </button>
      </div>
    </motion.div>
  );
};

// Enhanced Interactive Search Component
const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const searchTabs = [
    { id: "all", label: "Semua", icon: MagnifyingGlassIcon },
    { id: "films", label: "Film", icon: FilmIcon },
    { id: "theaters", label: "Bioskop", icon: BuildingOfficeIcon },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsSearching(true);
      setTimeout(() => {
        const allResults = [
          {
            id: 1,
            title: "Ballerina",
            type: "film",
            rating: 8.5,
            genre: "Action",
          },
          { id: 2, title: "Gowes", type: "film", rating: 7.8, genre: "Drama" },
          {
            id: 3,
            title: "Cinema XXI Jakarta",
            type: "theater",
            location: "Jakarta",
          },
          {
            id: 4,
            title: "Cinema XXI Bandung",
            type: "theater",
            location: "Bandung",
          },
        ];

        let filteredResults = allResults.filter((item) =>
          item.title.toLowerCase().includes(query.toLowerCase())
        );

        if (activeTab !== "all") {
          filteredResults = filteredResults.filter((item) =>
            activeTab === "films"
              ? item.type === "film"
              : item.type === "theater"
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
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-start justify-center pt-20"
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
                  ref={inputRef}
                  type="text"
                  placeholder="Cari film, bioskop, atau jadwal..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-14 pr-14 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-sky-500 transition-colors"
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
                    className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
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
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto">
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
                  {results.map((result) => (
                    <motion.div
                      key={result.id}
                      className="p-4 hover:bg-gray-50 rounded-xl cursor-pointer flex items-center transition-colors"
                      whileHover={{ x: 5 }}
                      onClick={() => {
                        onClose();
                        navigate(
                          result.type === "film"
                            ? `/films/${result.id}`
                            : `/theaters/${result.id}`
                        );
                      }}
                    >
                      <div
                        className={`rounded-full p-3 mr-4 ${
                          result.type === "film" ? "bg-sky-100" : "bg-green-100"
                        }`}
                      >
                        {result.type === "film" ? (
                          <FilmIcon className="h-6 w-6 text-sky-600" />
                        ) : (
                          <BuildingOfficeIcon className="h-6 w-6 text-green-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {result.title}
                        </h3>
                        {result.type === "film" ? (
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <span>⭐ {result.rating}</span>
                            <span>{result.genre}</span>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 mt-1">
                            📍 {result.location}
                          </p>
                        )}
                      </div>
                      <ArrowRightIcon className="h-5 w-5 text-gray-400" />
                    </motion.div>
                  ))}
                </div>
              ) : query ? (
                <div className="p-8 text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Tidak ditemukan
                  </h3>
                  <p className="text-gray-500">
                    Hasil pencarian untuk "{query}" tidak ditemukan
                  </p>
                </div>
              ) : (
                <div className="p-6">
                  <h4 className="font-semibold text-gray-700 mb-4">
                    🔥 Pencarian Populer
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Ballerina",
                      "GILS",
                      "Karate Kid",
                      "Cinema Jakarta",
                      "Waktu Maghrib",
                      "Action",
                      "Romance",
                    ].map((term, i) => (
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

// Enhanced Modern Hero Section
const HeroSection = ({ films = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const desktopBanners = [
    {
      id: "banner-1",
      title: "Selamat Datang di CinemaXXI",
      subtitle: "Nikmati pengalaman menonton terbaik di bioskop modern",
      bgImage: banner1,
      releaseDate: "2024",
      genre: "Premium Experience",
      rating: 9.5,
      description:
        "Rasakan sensasi menonton film dengan teknologi terdepan dan kenyamanan maksimal di CinemaXXI.",
      slug: "cinemaXXI-experience",
    },
    {
      id: "banner-2",
      title: "Film Terbaru & Terpopuler",
      subtitle: "Jangan lewatkan film-film blockbuster terbaru",
      bgImage: banner2,
      releaseDate: "2024",
      genre: "Latest Movies",
      rating: 9.0,
      description:
        "Saksikan film-film terbaru dan terpopuler dengan kualitas audio visual terbaik hanya di CinemaXXI.",
      slug: "latest-movies",
    },
  ];

  const mobileFilms =
    films.length > 0
      ? films.slice(0, 3).map((film) => ({
          id: film.slug || film.id,
          title: film.judul,
          subtitle:
            film.deskripsi?.substring(0, 50) + "..." ||
            "Film menarik yang wajib ditonton",
          bgImage:
            film.poster_url ||
            "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3",
          releaseDate: film.tanggal_rilis
            ? new Date(film.tanggal_rilis).toLocaleDateString("id-ID")
            : "2024",
          genre: "Action, Drama",
          rating: 8.5,
          description:
            film.deskripsi ||
            "Film menarik yang menghadirkan pengalaman menonton yang tak terlupakan.",
          slug: film.slug,
        }))
      : desktopBanners;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  const slideData = isMobile ? mobileFilms : desktopBanners;

  return (
    <section className="relative h-[100vh] md:h-[60vh] lg:h-[70vh] xl:h-[65vh] overflow-hidden">
      {/* Background Slider */}
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        speed={1500}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet !bg-white !bg-opacity-50",
          bulletActiveClass: "swiper-pagination-bullet-active !bg-white",
        }}
        onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
        className="absolute inset-0 w-full h-full"
      >
        {slideData.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              <img
                src={slide.bgImage}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover object-center"
                style={{ filter: "brightness(0.5)" }}
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Content Overlay */}
      <div className="relative h-full z-10 flex items-center">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-white"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3 mb-3"
                >
                  <span className="bg-yellow-400 text-black px-3 py-1 text-sm font-bold rounded-full">
                    {slideData[currentSlide].releaseDate}
                  </span>
                  <div className="flex items-center gap-1">
                    <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">
                      {slideData[currentSlide].rating}
                    </span>
                  </div>
                </motion.div>

                <motion.h1
                  className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  {slideData[currentSlide].title}
                </motion.h1>

                <motion.p
                  className="text-base md:text-lg lg:text-xl text-gray-300 mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {slideData[currentSlide].subtitle}
                </motion.p>

                <motion.div
                  className="flex items-center gap-2 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="text-sky-400 font-medium">
                    {slideData[currentSlide].genre}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-300">Premium Quality</span>
                </motion.div>

                <motion.p
                  className="text-gray-300 text-sm md:text-base lg:text-lg mb-6 max-w-lg leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {slideData[currentSlide].description}
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Link
                    to={
                      isMobile
                        ? `/films/${
                            slideData[currentSlide].slug ||
                            slideData[currentSlide].id
                          }`
                        : "/films"
                    }
                    className="group relative bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-2xl text-sm md:text-base lg:text-lg font-semibold transition-all hover:shadow-2xl hover:shadow-sky-500/25 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      <TicketIcon className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                      {isMobile ? "Beli Tiket Sekarang" : "Jelajahi Film"}
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>

                  <button
                    onClick={() =>
                      window.open(
                        isMobile
                          ? `https://www.youtube.com/results?search_query=${slideData[currentSlide].title}+trailer`
                          : "https://www.youtube.com/results?search_query=cinema+trailer",
                        "_blank"
                      )
                    }
                    className="group border-2 border-white text-white px-6 py-3 md:px-8 md:py-4 rounded-2xl text-sm md:text-base lg:text-lg font-semibold transition-all hover:bg-white hover:text-gray-900 flex items-center justify-center"
                  >
                    <PlayIcon className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                    {isMobile ? "Tonton Trailer" : "Lihat Preview"}
                  </button>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:flex justify-center"
            >
              <div className="relative">
                <motion.div
                  className="w-48 h-64 lg:w-56 lg:h-72 xl:w-64 xl:h-80 bg-gradient-to-br from-sky-400 to-blue-600 rounded-3xl p-1 shadow-2xl"
                  whileHover={{ y: -10, rotateY: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-full h-full bg-gray-800 rounded-3xl overflow-hidden">
                    <img
                      src={slideData[currentSlide].bgImage}
                      alt={slideData[currentSlide].title}
                      className="w-full h-full object-cover object-center"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3";
                      }}
                    />
                  </div>
                </motion.div>

                <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 space-y-3">
                  <motion.button
                    className="bg-white text-gray-800 p-2 lg:p-3 rounded-full shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <HeartIcon className="h-5 w-5 lg:h-6 lg:w-6" />
                  </motion.button>
                  <motion.button
                    className="bg-white text-gray-800 p-2 lg:p-3 rounded-full shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ShareIcon className="h-5 w-5 lg:h-6 lg:w-6" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-3 md:bottom-4 lg:bottom-6 left-0 right-0 z-20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-3 gap-3 md:gap-6 max-w-xl lg:max-w-2xl mx-auto">
            <div className="text-center">
              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl lg:rounded-2xl p-2 md:p-3 lg:p-4 mb-1 md:mb-2">
                <BuildingOfficeIcon className="h-5 w-5 md:h-6 md:w-6 lg:h-8 lg:w-8 text-white mx-auto" />
              </div>
              <div className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-white">
                150+
              </div>
              <div className="text-xs md:text-sm text-gray-300">
                Lokasi Bioskop
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl lg:rounded-2xl p-2 md:p-3 lg:p-4 mb-1 md:mb-2">
                <TicketIcon className="h-5 w-5 md:h-6 md:w-6 lg:h-8 lg:w-8 text-white mx-auto" />
              </div>
              <div className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-white">
                500K+
              </div>
              <div className="text-xs md:text-sm text-gray-300">
                Tiket Terjual
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl lg:rounded-2xl p-2 md:p-3 lg:p-4 mb-1 md:mb-2">
                <FilmIcon className="h-5 w-5 md:h-6 md:w-6 lg:h-8 lg:w-8 text-white mx-auto" />
              </div>
              <div className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-white">
                50+
              </div>
              <div className="text-xs md:text-sm text-gray-300">
                Film Terbaru
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

// Quick Navigation Section
const QuickNavSection = () => {
  const navItems = [
    {
      icon: FilmIcon,
      label: "Semua Film",
      description: "Jelajahi koleksi film terlengkap",
      color: "from-sky-400 to-blue-500",
      to: "/films",
    },
    {
      icon: BoltIcon,
      label: "Now Playing",
      description: "Film yang sedang tayang",
      color: "from-yellow-400 to-orange-500",
      to: "/now-playing",
    },
    {
      icon: SparklesIcon,
      label: "Coming Soon",
      description: "Film yang akan datang",
      color: "from-purple-400 to-pink-500",
      to: "/coming-soon",
    },
    {
      icon: ShoppingBagIcon,
      label: "Promo",
      description: "Penawaran dan diskon menarik",
      color: "from-green-400 to-emerald-500",
      to: "/promo",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Jelajahi Cinema
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Temukan pengalaman menonton yang tak terlupakan dengan koleksi film
            terbaik
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {navItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                to={item.to}
                className="group block bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-sky-200"
              >
                <motion.div
                  className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <item.icon className="h-8 w-8 text-white" />
                </motion.div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-sky-600 transition-colors">
                  {item.label}
                </h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Enhanced Movie Card Component dengan fitur lengkap untuk slider
const MovieCard = ({ film, index, featured = false }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      {/* Poster Image - Fixed aspect ratio */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={
            film?.poster_url ||
            "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3"
          }
          alt={film?.judul || "Movie"}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3";
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsLiked(!isLiked);
                }}
                className={`p-3 rounded-full backdrop-blur-md transition-colors ${
                  isLiked
                    ? "bg-red-500 text-white"
                    : "bg-white bg-opacity-20 text-white"
                }`}
              >
                <HeartIcon
                  className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`}
                />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowDetails(true);
                }}
                className="p-3 rounded-full bg-white bg-opacity-20 backdrop-blur-md text-white"
              >
                <EyeIcon className="h-5 w-5" />
              </motion.button>

              <Link
                to={`/films/${
                  film?.slug || film?.judul?.toLowerCase().replace(/\s+/g, "-")
                }`}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 rounded-full text-center font-semibold backdrop-blur-md hover:from-sky-600 hover:to-blue-700 transition-all"
              >
                Beli Tiket
              </Link>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
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

        {/* Rating Badge */}
        <div className="absolute top-4 left-4">
          <div className="flex items-center gap-1 bg-black bg-opacity-50 backdrop-blur-md px-2 py-1 rounded-full">
            <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-white text-sm font-semibold">8.5</span>
          </div>
        </div>
      </div>

      {/* Content - Fixed height untuk konsistensi dalam slider */}
      <div className="p-6 h-48 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2 group-hover:text-sky-600 transition-colors min-h-[3.5rem]">
            {film?.judul || "Untitled Movie"}
          </h3>

          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <ClockIcon className="h-4 w-4" />
              <span>{film?.durasi || "120"} min</span>
            </div>
            <div className="text-sky-600 font-medium text-xs">
              {film?.genre || "Drama"}
            </div>
          </div>
        </div>

        <Link
          to={`/films/${
            film?.slug || film?.judul?.toLowerCase().replace(/\s+/g, "-")
          }`}
          className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white text-center py-3 rounded-2xl font-semibold hover:from-sky-600 hover:to-blue-700 transition-all"
        >
          Detail Film
        </Link>
      </div>

      {/* Film Details Modal - Mempertahankan fitur yang ada */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4"
            style={{ zIndex: 9999 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                transform: "none",
                position: "relative",
                zIndex: 10000,
              }}
            >
              <div className="relative h-64">
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
                <button
                  className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowDetails(false);
                  }}
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="p-8">
                <h2 className="text-3xl font-bold mb-4">
                  {film?.judul || "Untitled Movie"}
                </h2>

                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <StarIcon className="h-6 w-6 text-yellow-500 fill-current" />
                    <span className="text-xl font-semibold">8.5/10</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <ClockIcon className="h-5 w-5" />
                    <span>{film?.durasi || "120"} min</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CalendarDaysIcon className="h-5 w-5" />
                    <span>2024</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {film?.deskripsi ||
                    "Film menarik yang menghadirkan pengalaman menonton yang tak terlupakan dengan cerita yang memikat dan visual yang memukau."}
                </p>

                <div className="flex gap-4">
                  <Link
                    to={`/films/${film?.slug || film?.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDetails(false);
                    }}
                    className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-center py-4 rounded-2xl font-semibold hover:from-sky-600 hover:to-blue-700 transition-all"
                  >
                    Beli Tiket Sekarang
                  </Link>
                  <button
                    className="bg-gray-200 text-gray-800 px-6 py-4 rounded-2xl font-semibold hover:bg-gray-300 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(
                        `https://www.youtube.com/results?search_query=${film?.judul}+trailer`,
                        "_blank"
                      );
                    }}
                  >
                    Trailer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Main Home Component
const Home = () => {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState(null);
  const [showBanner, setShowBanner] = useState(true);

  // Navigation refs untuk slider
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);

  const fetchFilms = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await filmService.getAllFilms();

      let filmsData = [];
      let paginationData = null;

      if (response && typeof response === "object") {
        if (response.data && Array.isArray(response.data)) {
          filmsData = response.data;
          if (response.meta && response.meta.pagination) {
            paginationData = response.meta.pagination;
          } else {
            paginationData = {
              current_page: response.current_page,
              last_page: response.last_page,
              per_page: response.per_page,
              total: response.total,
            };
          }
        } else if (Array.isArray(response)) {
          filmsData = response;
        } else if (response.data) {
          filmsData = Array.isArray(response.data) ? response.data : [];
        }
      } else if (Array.isArray(response)) {
        filmsData = response;
      }

      setFilms(filmsData);
      setPagination(paginationData);
    } catch (error) {
      setError(
        "Failed to fetch films: " +
          (error.response?.data?.message || error.message)
      );
      setFilms([]);
      console.error("Error fetching films:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFilms();
  }, [fetchFilms]);

  // Skeleton loader
  const MovieCardSkeleton = () => (
    <div className="animate-pulse bg-white rounded-3xl overflow-hidden shadow-lg h-[520px]">
      <div className="aspect-[2/3] bg-gray-300"></div>
      <div className="p-6 h-48">
        <div className="h-6 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="h-10 bg-gray-300 rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Top Banner */}
      <AnimatePresence>
        {showBanner && <TopBanner onClose={() => setShowBanner(false)} />}
      </AnimatePresence>

      {/* Hero Section */}
      <div className={`${showBanner ? "" : ""}`}>
        <HeroSection films={films} />
      </div>

      {/* Quick Navigation */}
      <QuickNavSection />

      {/* Film Slider Section - SIMPLE HORIZONTAL SLIDER */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          {/* Header dengan Navigation Controls */}
          <div className="flex items-center justify-between mb-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                Film Sedang Tayang
              </h2>
              <p className="text-xl text-gray-600">
                Jangan lewatkan film-film terbaru yang sedang trending
              </p>
            </motion.div>

            {/* Custom Navigation Buttons */}
            <div className="flex gap-3">
              <motion.button
                ref={(node) => setPrevEl(node)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full hover:from-sky-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </motion.button>

              <motion.button
                ref={(node) => setNextEl(node)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full hover:from-sky-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </motion.button>
            </div>
          </div>

          {/* Film Slider */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {[...Array(10)].map((_, index) => (
                <MovieCardSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-6xl mb-6">🎬</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Oops! Terjadi Kesalahan
              </h3>
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
          ) : !Array.isArray(films) || films.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-6xl mb-6">🎭</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Belum Ada Film
              </h3>
              <p className="text-gray-600">
                Film akan segera hadir. Nantikan update terbaru!
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Simple Horizontal Slider dengan Swiper */}
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={24}
                slidesPerView={1}
                navigation={{
                  prevEl,
                  nextEl,
                }}
                pagination={{
                  clickable: true,
                  bulletClass:
                    "swiper-pagination-bullet !bg-sky-500 !opacity-40",
                  bulletActiveClass:
                    "swiper-pagination-bullet-active !bg-sky-600 !opacity-100",
                }}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 3,
                    spaceBetween: 24,
                  },
                  1024: {
                    slidesPerView: 4,
                    spaceBetween: 24,
                  },
                  1280: {
                    slidesPerView: 5,
                    spaceBetween: 24,
                  },
                }}
                className="!pb-12"
              >
                {films.slice(0, 15).map((film, index) => (
                  <SwiperSlide key={film?.id || `film-${index}`}>
                    <MovieCard film={film} index={index} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>
          )}

          {/* View All Button */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link
              to="/films"
              className="inline-flex items-center bg-gradient-to-r from-sky-500 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-sky-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              Lihat Semua Film
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Promo Section */}
      <section className="py-20 bg-gradient-to-br from-sky-50 to-blue-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Promo Spesial
            </h2>
            <p className="text-xl text-gray-600">
              Dapatkan penawaran menarik untuk pengalaman menonton yang lebih
              hemat
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Weekend Special",
                description: "Diskon 30% untuk tiket weekend",
                color: "from-purple-500 to-pink-500",
                icon: SparklesIcon,
              },
              {
                title: "Student Discount",
                description: "Potongan 25% untuk mahasiswa",
                color: "from-green-500 to-emerald-500",
                icon: FireIcon,
              },
              {
                title: "Family Package",
                description: "Beli 3 tiket gratis 1 popcorn",
                color: "from-orange-500 to-red-500",
                icon: BoltIcon,
              },
            ].map((promo, index) => (
              <motion.div
                key={promo.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-br ${promo.color} rounded-3xl p-8 text-white relative overflow-hidden`}
              >
                <div className="relative z-10">
                  <promo.icon className="h-12 w-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">{promo.title}</h3>
                  <p className="text-white/90 mb-6">{promo.description}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-gray-900 px-6 py-3 rounded-2xl font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Klaim Sekarang
                  </motion.button>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
