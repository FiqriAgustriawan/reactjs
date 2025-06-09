import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  PlayIcon,
  StarIcon,
  ClockIcon,
  CalendarDaysIcon,
  BellIcon,
  SparklesIcon,
  FireIcon,
} from "@heroicons/react/24/outline";

const ComingSoon = () => {
  const [notifyList, setNotifyList] = useState(new Set());

  const comingSoonFilms = [
    {
      id: 1,
      judul: "Avatar: The Way of Water",
      deskripsi: "Sequel dari film Avatar yang sangat dinanti.",
      poster_url:
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3",
      genre: "Sci-Fi",
      durasi: 192,
      release_date: "2024-12-15",
      rating: 9.2,
      status: "highly_anticipated",
    },
    {
      id: 2,
      judul: "Black Panther: Wakanda Forever",
      deskripsi: "Melanjutkan warisan T'Challa.",
      poster_url:
        "https://images.unsplash.com/photo-1634926878768-2a5b3c42f139?ixlib=rb-4.0.3",
      genre: "Action",
      durasi: 161,
      release_date: "2024-11-25",
      rating: 8.8,
      status: "coming_soon",
    },
    {
      id: 3,
      judul: "Spider-Man: Into the Spider-Verse 2",
      deskripsi: "Miles Morales kembali dalam petualangan multiverse.",
      poster_url:
        "https://images.unsplash.com/photo-1608889335941-32ac5f2041cd?ixlib=rb-4.0.3",
      genre: "Animation",
      durasi: 140,
      release_date: "2024-08-10",
      rating: 9.1,
      status: "highly_anticipated",
    },
  ];

  const handleNotify = (filmId, e) => {
    e.preventDefault();
    setNotifyList((prev) => {
      const newNotify = new Set(prev);
      if (newNotify.has(filmId)) {
        newNotify.delete(filmId);
      } else {
        newNotify.add(filmId);
      }
      return newNotify;
    });
  };

  const formatReleaseDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const daysUntilRelease = (dateString) => {
    const releaseDate = new Date(dateString);
    const today = new Date();
    const diffTime = releaseDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const FilmCard = ({ film }) => {
    const days = daysUntilRelease(film.release_date);

    return (
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
      >
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={film.poster_url}
            alt={film.judul}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
          />

          <div className="absolute top-4 left-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                film.status === "highly_anticipated"
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                  : "bg-purple-500 text-white"
              }`}
            >
              {film.status === "highly_anticipated" ? (
                <>
                  <FireIcon className="h-3 w-3" /> HOT
                </>
              ) : (
                <>
                  <SparklesIcon className="h-3 w-3" /> SOON
                </>
              )}
            </span>
          </div>

          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1 bg-black/70 px-2 py-1 rounded-full">
              <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-white text-sm">{film.rating}</span>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-black/70 backdrop-blur-sm rounded-full px-3 py-2 text-center">
              <div className="text-white text-sm">
                {days > 0 ? (
                  <>
                    <span className="font-bold text-lg">{days}</span>
                    <span className="ml-1">hari lagi</span>
                  </>
                ) : (
                  <span className="font-bold text-yellow-400">Segera!</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-bold text-lg mb-2">{film.judul}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {film.deskripsi}
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <CalendarDaysIcon className="h-4 w-4" />
              <span>{formatReleaseDate(film.release_date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <ClockIcon className="h-4 w-4" />
              <span>{film.durasi} min</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={(e) => handleNotify(film.id, e)}
              className={`flex-1 py-2 rounded-xl font-semibold transition-all text-sm ${
                notifyList.has(film.id)
                  ? "bg-purple-500 text-white"
                  : "bg-purple-100 text-purple-700 hover:bg-purple-200"
              }`}
            >
              <BellIcon className="h-4 w-4 inline mr-1" />
              {notifyList.has(film.id) ? "Aktif" : "Ingatkan"}
            </button>
            <button
              onClick={() =>
                window.open(
                  `https://www.youtube.com/results?search_query=${film.judul}+trailer`,
                  "_blank"
                )
              }
              className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50"
            >
              <PlayIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Coming Soon</h1>
          <p className="text-xl text-gray-600">Film yang akan segera tayang</p>
        </motion.div>

        <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comingSoonFilms.map((film, index) => (
            <motion.div
              key={film.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <FilmCard film={film} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ComingSoon;
