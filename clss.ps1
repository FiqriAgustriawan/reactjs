{
  "CinemaBookPageComponent": {
    "scope": "javascript,typescript,typescriptreact,javascriptreact",
    "prefix": "cinemabookpage",
    "body": [
      "'use client';",
      "import React, { useState, useEffect } from 'react';",
      "import { motion, AnimatePresence } from 'framer-motion';",
      "import {",
      "  MdPlayArrow,",
      "  MdAccessTime,",
      "  MdStar,",
      "  MdLocationOn,",
      "  MdMenu,",
      "  MdClose,",
      "  MdPerson,",
      "  MdHome,",
      "  MdSchedule,",
      "  MdConfirmationNumber,",
      "  MdArrowForward",
      "} from 'react-icons/md';",
      "import { getFilmPosterUrl, generateFilmData, preloadFilmImages } from '../utils/imageUtils';",
      "",
      "function Page() {",
      "  const [films, setFilms] = useState([]);",
      "  const [selectedFilm, setSelectedFilm] = useState(null);",
      "  const [isLoading, setIsLoading] = useState(true);",
      "  const [showBookingModal, setShowBookingModal] = useState(false);",
      "  const [user, setUser] = useState(null);",
      "  const [showLoginModal, setShowLoginModal] = useState(false);",
      "  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);",
      "  const [activeTab, setActiveTab] = useState('semua');",
      "",
      "  // Base film data without poster URLs",
      "  const baseFilmData = [",
      "    { id: 1, judul: \"Avengers: Endgame\", slug: \"avengers-endgame\", harga_tiket: 45000, deskripsi: \"Epic conclusion to the Infinity Saga where the remaining Avengers must reverse Thanos' snap.\", tanggal_rilis: \"2024-06-01\", durasi: \"181 menit\", genre: \"Action, Adventure, Drama\", rating: 8.4, is_active: true, kategori: \"action\" },",
      "    { id: 2, judul: \"Spider-Man: No Way Home\", slug: \"spider-man-no-way-home\", harga_tiket: 50000, deskripsi: \"Peter Parker's multiverse adventure brings together previous Spider-Man universes.\", tanggal_rilis: \"2024-06-15\", durasi: \"148 menit\", genre: \"Action, Adventure, Sci-Fi\", rating: 8.7, is_active: true, kategori: \"action\" },",
      "    { id: 3, judul: \"The Batman\", slug: \"the-batman\", harga_tiket: 42000, deskripsi: \"Dark and gritty Batman story focusing on detective work and psychological thriller elements.\", tanggal_rilis: \"2024-06-20\", durasi: \"176 menit\", genre: \"Action, Crime, Drama\", rating: 7.8, is_active: true, kategori: \"action\" },",
      "    { id: 4, judul: \"Dune\", slug: \"dune\", harga_tiket: 48000, deskripsi: \"Epic sci-fi saga about Paul Atreides and his journey on the desert planet Arrakis.\", tanggal_rilis: \"2024-07-01\", durasi: \"155 menit\", genre: \"Sci-Fi, Drama, Adventure\", rating: 8.0, is_active: true, kategori: \"sci-fi\" },",
      "    { id: 5, judul: \"Top Gun: Maverick\", slug: \"top-gun-maverick\", harga_tiket: 46000, deskripsi: \"After thirty years, Maverick is still pushing the envelope as a top naval aviator.\", tanggal_rilis: \"2024-07-10\", durasi: \"130 menit\", genre: \"Action, Drama\", rating: 8.3, is_active: true, kategori: \"action\" },",
      "    { id: 6, judul: \"Everything Everywhere All at Once\", slug: \"everything-everywhere-all-at-once\", harga_tiket: 44000, deskripsi: \"A Chinese-American laundromat owner gets swept up in a wild adventure across the multiverse.\", tanggal_rilis: \"2024-07-15\", durasi: \"139 menit\", genre: \"Comedy, Drama, Sci-Fi\", rating: 7.8, is_active: true, kategori: \"comedy\" },",
      "    { id: 7, judul: \"Black Panther: Wakanda Forever\", slug: \"black-panther-wakanda-forever\", harga_tiket: 47000, deskripsi: \"The nation of Wakanda faces a new threat while mourning the loss of their king.\", tanggal_rilis: \"2024-07-20\", durasi: \"161 menit\", genre: \"Action, Adventure, Drama\", rating: 8.1, is_active: true, kategori: \"action\" },",
      "    { id: 8, judul: \"Avatar: The Way of Water\", slug: \"avatar-the-way-of-water\", harga_tiket: 52000, deskripsi: \"Jake Sully and Neytiri's family faces new challenges in the underwater world of Pandora.\", tanggal_rilis: \"2024-07-25\", durasi: \"192 menit\", genre: \"Sci-Fi, Adventure, Fantasy\", rating: 8.2, is_active: true, kategori: \"sci-fi\" },",
      "    { id: 9, judul: \"The Menu\", slug: \"the-menu\", harga_tiket: 41000, deskripsi: \"A young couple travels to a remote island to eat at an exclusive restaurant.\", tanggal_rilis: \"2024-08-01\", durasi: \"107 menit\", genre: \"Comedy, Horror, Thriller\", rating: 7.6, is_active: true, kategori: \"comedy\" },",
      "    { id: 10, judul: \"Glass Onion: A Knives Out Mystery\", slug: \"glass-onion-knives-out\", harga_tiket: 43000, deskripsi: \"Detective Benoit Blanc solves another mystery with a new cast of colorful suspects.\", tanggal_rilis: \"2024-08-05\", durasi: \"139 menit\", genre: \"Comedy, Crime, Drama\", rating: 7.9, is_active: true, kategori: \"comedy\" },",
      "    { id: 11, judul: \"Nope\", slug: \"nope\", harga_tiket: 44500, deskripsi: \"Residents of a lonely gulch in California bear witness to an uncanny and chilling discovery.\", tanggal_rilis: \"2024-08-10\", durasi: \"130 menit\", genre: \"Horror, Mystery, Sci-Fi\", rating: 7.5, is_active: true, kategori: \"sci-fi\" },",
      "    { id: 12, judul: \"The Whale\", slug: \"the-whale\", harga_tiket: 40000, deskripsi: \"A reclusive English teacher suffering from severe obesity attempts to reconnect with his estranged daughter.\", tanggal_rilis: \"2024-08-15\", durasi: \"117 menit\", genre: \"Drama\", rating: 8.3, is_active: true, kategori: \"drama\" },",
      "    { id: 13, judul: \"Tar\", slug: \"tar\", harga_tiket: 41500, deskripsi: \"Set in the international world of classical music, the film centers on Lydia Tár.\", tanggal_rilis: \"2024-08-20\", durasi: \"158 menit\", genre: \"Drama, Music\", rating: 7.8, is_active: true, kategori: \"drama\" },",
      "    { id: 14, judul: \"The Fabelmans\", slug: \"the-fabelmans\", harga_tiket: 42500, deskripsi: \"A coming-of-age story about a young man's discovery of a shattering family secret.\", tanggal_rilis: \"2024-08-25\", durasi: \"151 menit\", genre: \"Drama, Comedy\", rating: 8.0, is_active: true, kategori: \"drama\" },",
      "    { id: 15, judul: \"Babylon\", slug: \"babylon\", harga_tiket: 45500, deskripsi: \"A tale of outsized ambition and outrageous excess in 1920s Hollywood.\", tanggal_rilis: \"2024-09-01\", durasi: \"189 menit\", genre: \"Drama, Comedy\", rating: 7.7, is_active: true, kategori: \"drama\" }",
      "  ];",
      "",
      "  const categories = [",
      "    { id: 'semua', name: 'Semua Film' },",
      "    { id: 'action', name: 'Action' },",
      "    { id: 'sci-fi', name: 'Sci-Fi' },",
      "    { id: 'comedy', name: 'Comedy' },",
      "    { id: 'drama', name: 'Drama' }",
      "  ];",
      "",
      "  useEffect(() => {",
      "    // Simulate API call with image generation",
      "    const loadFilmsData = async () => {",
      "      try {",
      "        // Generate film data with poster URLs",
      "        const filmsWithPosters = generateFilmData(baseFilmData);",
      "",
      "        // Preload images for better UX",
      "        const filmIds = filmsWithPosters.map(film => film.id);",
      "        await preloadFilmImages(filmIds);",
      "",
      "        // Set films data",
      "        setTimeout(() => {",
      "          setFilms(filmsWithPosters);",
      "          setIsLoading(false);",
      "        }, 1500);",
      "",
      "      } catch (error) {",
      "        console.error('Error loading films:', error);",
      "        // Fallback: set films without preloading",
      "        setFilms(generateFilmData(baseFilmData));",
      "        setIsLoading(false);",
      "      }",
      "    };",
      "",
      "    loadFilmsData();",
      "  }, []);",
      "",
      "  const handleBookTicket = (film) => {",
      "    if (!user) {",
      "      setShowLoginModal(true);",
      "      return;",
      "    }",
      "    setSelectedFilm(film);",
      "    setShowBookingModal(true);",
      "  };",
      "",
      "  const handleLogin = () => {",
      "    // Mock login",
      "    setUser({ name: 'John Doe', email: 'john@example.com' });",
      "    setShowLoginModal(false);",
      "  };",
      "",
      "  const formatRupiah = (amount) => {",
      "    return new Intl.NumberFormat('id-ID', {",
      "      style: 'currency',",
      "      currency: 'IDR'",
      "    }).format(amount);",
      "  };",
      "",
      "  const filteredFilms = activeTab === 'semua'",
      "    ? films",
      "    : films.filter(film => film.kategori === activeTab);",
      "",
      "  // Enhanced Image Component with Error Handling",
      "  const FilmPosterImage = ({ film, className }) => {",
      "    const [imageError, setImageError] = useState(false);",
      "    const [imageLoaded, setImageLoaded] = useState(false);",
      "",
      "    const handleImageError = () => {",
      "      setImageError(true);",
      "      console.warn(`Failed to load image for film: ${film.judul}`);",
      "    };",
      "",
      "    const handleImageLoad = () => {",
      "      setImageLoaded(true);",
      "    };",
      "",
      "    return (",
      "      <div className={`relative ${className}`}>",
      "        {!imageLoaded && (",
      "          <div className=\"absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center\">",
      "            <div className=\"text-gray-400 text-sm\">Loading...</div>",
      "          </div>",
      "        )}",
      "        <img",
      "          src={imageError ? '/assets-film/placeholder.jpg' : film.poster_url}",
      "          alt={film.judul}",
      "          className={`${className} ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}",
      "          onError={handleImageError}",
      "          onLoad={handleImageLoad}",
      "        />",
      "      </div>",
      "    );",
      "  };",
      "",
      "  if (isLoading) {",
      "    return (",
      "      <div className=\"min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center\">",
      "        <motion.div",
      "          animate={{",
      "            scale: [1, 1.2, 1],",
      "            rotate: [0, 180, 360],",
      "          }}",
      "          transition={{",
      "            duration: 2,",
      "            repeat: Infinity,",
      "            ease: \"easeInOut\",",
      "          }}",
      "          className=\"w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full\"",
      "        />",
      "      </div>",
      "    );",
      "  }",
      "",
      "  return (",
      "    <div className=\"min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50\">",
      "      {/* Your page JSX continues here */}",
      "    </div>",
      "  );",
      "}",
      "",
      "export default Page;"
    ],
    "description": "CinemaBook React Page"
  },

  "CinemaBookUtils": {
    "scope": "javascript,typescript,typescriptreact,javascriptreact",
    "prefix": "cinemabookutils",
    "body": [
      "export const getFilmPosterUrl = (filmId, fallbackUrl = null) => {",
      "  const localPath = `/assets-film/film_${filmId}.jpg`;",
      "  // You can add logic here to check if the local image exists",
      "  // For now, we'll assume all local images exist",
      "  return localPath;",
      "};",
      "",
      "export const getRandomFilmAsset = () => {",
      "  const randomId = Math.floor(Math.random() * 30) + 1;",
      "  return `/assets-film/film_${randomId}.jpg`;",
      "};",
      "",
      "// Additional utility functions",
      "export const getFilmPosterWithFallback = (filmId, fallbackUrl = '/assets-film/placeholder.jpg') => {",
      "  return `/assets-film/film_${filmId}.jpg`;",
      "};",
      "",
      "export const generateFilmData = (baseFilmData) => {",
      "  return baseFilmData.map(film => ({",
      "    ...film,",
      "    poster_url: getFilmPosterUrl(film.id)",
      "  }));",
      "};",
      "",
      "// Image preloader utility",
      "export const preloadImage = (src) => {",
      "  return new Promise((resolve, reject) => {",
      "    const img = new Image();",
      "    img.onload = () => resolve(img);",
      "    img.onerror = reject;",
      "    img.src = src;",
      "  });",
      "};",
      "",
      "// Batch preload images",
      "export const preloadFilmImages = async (filmIds) => {",
      "  const promises = filmIds.map(id =>",
      "    preloadImage(getFilmPosterUrl(id))",
      "  );",
      "",
      "  try {",
      "    await Promise.all(promises);",
      "    console.log('All film images preloaded successfully');",
      "  } catch (error) {",
      "    console.warn('Some images failed to preload:', error);",
      "  }",
      "};"
    ],
    "description": "CinemaBook Page utility functions"
  }
}
# 'use client';
# import React, { useState, useEffect } from 'react';
# import { motion, AnimatePresence } from 'framer-motion';
# import {
#   MdPlayArrow,
#   MdAccessTime,
#   MdStar,
#   MdLocationOn,
#   MdMenu,
#   MdClose,
#   MdPerson,
#   MdHome,
#   MdSchedule,
#   MdConfirmationNumber,
#   MdArrowForward
# } from 'react-icons/md';
# import { getFilmPosterUrl, generateFilmData, preloadFilmImages } from '../utils/imageUtils';

# function Page() {
#   const [films, setFilms] = useState([]);
#   const [selectedFilm, setSelectedFilm] = useState(null);
#   const [isLoading, setIsLoading] = useState(true);
#   const [showBookingModal, setShowBookingModal] = useState(false);
#   const [user, setUser] = useState(null);
#   const [showLoginModal, setShowLoginModal] = useState(false);
#   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
#   const [activeTab, setActiveTab] = useState('semua');

#   // Base film data without poster URLs
#   const baseFilmData = [
#     {
#       id: 1,
#       judul: "Avengers: Endgame",
#       slug: "avengers-endgame",
#       harga_tiket: 45000,
#       deskripsi: "Epic conclusion to the Infinity Saga where the remaining Avengers must reverse Thanos' snap.",
#       tanggal_rilis: "2024-06-01",
#       durasi: "181 menit",
#       genre: "Action, Adventure, Drama",
#       rating: 8.4,
#       is_active: true,
#       kategori: "action"
#     },
#     {
#       id: 2,
#       judul: "Spider-Man: No Way Home",
#       slug: "spider-man-no-way-home",
#       harga_tiket: 50000,
#       deskripsi: "Peter Parker's multiverse adventure brings together previous Spider-Man universes.",
#       tanggal_rilis: "2024-06-15",
#       durasi: "148 menit",
#       genre: "Action, Adventure, Sci-Fi",
#       rating: 8.7,
#       is_active: true,
#       kategori: "action"
#     },
#     {
#       id: 3,
#       judul: "The Batman",
#       slug: "the-batman",
#       harga_tiket: 42000,
#       deskripsi: "Dark and gritty Batman story focusing on detective work and psychological thriller elements.",
#       tanggal_rilis: "2024-06-20",
#       durasi: "176 menit",
#       genre: "Action, Crime, Drama",
#       rating: 7.8,
#       is_active: true,
#       kategori: "action"
#     },
#     {
#       id: 4,
#       judul: "Dune",
#       slug: "dune",
#       harga_tiket: 48000,
#       deskripsi: "Epic sci-fi saga about Paul Atreides and his journey on the desert planet Arrakis.",
#       tanggal_rilis: "2024-07-01",
#       durasi: "155 menit",
#       genre: "Sci-Fi, Drama, Adventure",
#       rating: 8.0,
#       is_active: true,
#       kategori: "sci-fi"
#     },
#     {
#       id: 5,
#       judul: "Top Gun: Maverick",
#       slug: "top-gun-maverick",
#       harga_tiket: 46000,
#       deskripsi: "After thirty years, Maverick is still pushing the envelope as a top naval aviator.",
#       tanggal_rilis: "2024-07-10",
#       durasi: "130 menit",
#       genre: "Action, Drama",
#       rating: 8.3,
#       is_active: true,
#       kategori: "action"
#     },
#     {
#       id: 6,
#       judul: "Everything Everywhere All at Once",
#       slug: "everything-everywhere-all-at-once",
#       harga_tiket: 44000,
#       deskripsi: "A Chinese-American laundromat owner gets swept up in a wild adventure across the multiverse.",
#       tanggal_rilis: "2024-07-15",
#       durasi: "139 menit",
#       genre: "Comedy, Drama, Sci-Fi",
#       rating: 7.8,
#       is_active: true,
#       kategori: "comedy"
#     },
#     {
#       id: 7,
#       judul: "Black Panther: Wakanda Forever",
#       slug: "black-panther-wakanda-forever",
#       harga_tiket: 47000,
#       deskripsi: "The nation of Wakanda faces a new threat while mourning the loss of their king.",
#       tanggal_rilis: "2024-07-20",
#       durasi: "161 menit",
#       genre: "Action, Adventure, Drama",
#       rating: 8.1,
#       is_active: true,
#       kategori: "action"
#     },
#     {
#       id: 8,
#       judul: "Avatar: The Way of Water",
#       slug: "avatar-the-way-of-water",
#       harga_tiket: 52000,
#       deskripsi: "Jake Sully and Neytiri's family faces new challenges in the underwater world of Pandora.",
#       tanggal_rilis: "2024-07-25",
#       durasi: "192 menit",
#       genre: "Sci-Fi, Adventure, Fantasy",
#       rating: 8.2,
#       is_active: true,
#       kategori: "sci-fi"
#     },
#     {
#       id: 9,
#       judul: "The Menu",
#       slug: "the-menu",
#       harga_tiket: 41000,
#       deskripsi: "A young couple travels to a remote island to eat at an exclusive restaurant.",
#       tanggal_rilis: "2024-08-01",
#       durasi: "107 menit",
#       genre: "Comedy, Horror, Thriller",
#       rating: 7.6,
#       is_active: true,
#       kategori: "comedy"
#     },
#     {
#       id: 10,
#       judul: "Glass Onion: A Knives Out Mystery",
#       slug: "glass-onion-knives-out",
#       harga_tiket: 43000,
#       deskripsi: "Detective Benoit Blanc solves another mystery with a new cast of colorful suspects.",
#       tanggal_rilis: "2024-08-05",
#       durasi: "139 menit",
#       genre: "Comedy, Crime, Drama",
#       rating: 7.9,
#       is_active: true,
#       kategori: "comedy"
#     },
#     {
#       id: 11,
#       judul: "Nope",
#       slug: "nope",
#       harga_tiket: 44500,
#       deskripsi: "Residents of a lonely gulch in California bear witness to an uncanny and chilling discovery.",
#       tanggal_rilis: "2024-08-10",
#       durasi: "130 menit",
#       genre: "Horror, Mystery, Sci-Fi",
#       rating: 7.5,
#       is_active: true,
#       kategori: "sci-fi"
#     },
#     {
#       id: 12,
#       judul: "The Whale",
#       slug: "the-whale",
#       harga_tiket: 40000,
#       deskripsi: "A reclusive English teacher suffering from severe obesity attempts to reconnect with his estranged daughter.",
#       tanggal_rilis: "2024-08-15",
#       durasi: "117 menit",
#       genre: "Drama",
#       rating: 8.3,
#       is_active: true,
#       kategori: "drama"
#     },
#     {
#       id: 13,
#       judul: "Tar",
#       slug: "tar",
#       harga_tiket: 41500,
#       deskripsi: "Set in the international world of classical music, the film centers on Lydia Tár.",
#       tanggal_rilis: "2024-08-20",
#       durasi: "158 menit",
#       genre: "Drama, Music",
#       rating: 7.8,
#       is_active: true,
#       kategori: "drama"
#     },
#     {
#       id: 14,
#       judul: "The Fabelmans",
#       slug: "the-fabelmans",
#       harga_tiket: 42500,
#       deskripsi: "A coming-of-age story about a young man's discovery of a shattering family secret.",
#       tanggal_rilis: "2024-08-25",
#       durasi: "151 menit",
#       genre: "Drama, Comedy",
#       rating: 8.0,
#       is_active: true,
#       kategori: "drama"
#     },
#     {
#       id: 15,
#       judul: "Babylon",
#       slug: "babylon",
#       harga_tiket: 45500,
#       deskripsi: "A tale of outsized ambition and outrageous excess in 1920s Hollywood.",
#       tanggal_rilis: "2024-09-01",
#       durasi: "189 menit",
#       genre: "Drama, Comedy",
#       rating: 7.7,
#       is_active: true,
#       kategori: "drama"
#     }
#   ];

#   const categories = [
#     { id: 'semua', name: 'Semua Film' },
#     { id: 'action', name: 'Action' },
#     { id: 'sci-fi', name: 'Sci-Fi' },
#     { id: 'comedy', name: 'Comedy' },
#     { id: 'drama', name: 'Drama' }
#   ];

#   useEffect(() => {
#     // Simulate API call with image generation
#     const loadFilmsData = async () => {
#       try {
#         // Generate film data with poster URLs
#         const filmsWithPosters = generateFilmData(baseFilmData);

#         // Preload images for better UX
#         const filmIds = filmsWithPosters.map(film => film.id);
#         await preloadFilmImages(filmIds);

#         // Set films data
#         setTimeout(() => {
#           setFilms(filmsWithPosters);
#           setIsLoading(false);
#         }, 1500);

#       } catch (error) {
#         console.error('Error loading films:', error);
#         // Fallback: set films without preloading
#         setFilms(generateFilmData(baseFilmData));
#         setIsLoading(false);
#       }
#     };

#     loadFilmsData();
#   }, []);

#   const handleBookTicket = (film) => {
#     if (!user) {
#       setShowLoginModal(true);
#       return;
#     }
#     setSelectedFilm(film);
#     setShowBookingModal(true);
#   };

#   const handleLogin = () => {
#     // Mock login
#     setUser({ name: 'John Doe', email: 'john@example.com' });
#     setShowLoginModal(false);
#   };

#   const formatRupiah = (amount) => {
#     return new Intl.NumberFormat('id-ID', {
#       style: 'currency',
#       currency: 'IDR'
#     }).format(amount);
#   };

#   const filteredFilms = activeTab === 'semua'
#     ? films
#     : films.filter(film => film.kategori === activeTab);

#   // Enhanced Image Component with Error Handling
#   const FilmPosterImage = ({ film, className }) => {
#     const [imageError, setImageError] = useState(false);
#     const [imageLoaded, setImageLoaded] = useState(false);

#     const handleImageError = () => {
#       setImageError(true);
#       console.warn(`Failed to load image for film: ${film.judul}`);
#     };

#     const handleImageLoad = () => {
#       setImageLoaded(true);
#     };

#     return (
#       <div className={`relative ${className}`}>
#         {!imageLoaded && (
#           <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
#             <div className="text-gray-400 text-sm">Loading...</div>
#           </div>
#         )}
#         <img
#           src={imageError ? '/assets-film/placeholder.jpg' : film.poster_url}
#           alt={film.judul}
#           className={`${className} ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
#           onError={handleImageError}
#           onLoad={handleImageLoad}
#         />
#       </div>
#     );
#   };

#   if (isLoading) {
#     return (
#       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
#         <motion.div
#           animate={{
#             scale: [1, 1.2, 1],
#             rotate: [0, 180, 360],
#           }}
#           transition={{
#             duration: 2,
#             repeat: Infinity,
#             ease: "easeInOut",
#           }}
#           className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
#         />
#       </div>
#     );
#   }

#   return (
#     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
#       {/* Header */}
#       <motion.header
#         initial={{ y: -100 }}
#         animate={{ y: 0 }}
#         transition={{ duration: 0.8 }}
#         className="bg-white/90 backdrop-blur-md shadow-lg border-b border-blue-200/50 sticky top-0 z-40"
#       >
#         <div className="container mx-auto px-4 py-4">
#           <div className="flex justify-between items-center">
#             {/* Logo */}
#             <motion.div
#               whileHover={{ scale: 1.05 }}
#               className="flex items-center space-x-2"
#             >
#               <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
#                 <MdConfirmationNumber className="text-white text-xl" />
#               </div>
#               <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
#                 CinemaBook
#               </h1>
#             </motion.div>

#             {/* Desktop Navigation */}
#             <nav className="hidden md:flex items-center space-x-8">
#               <motion.a
#                 whileHover={{ scale: 1.05 }}
#                 href="#"
#                 className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
#               >
#                 <MdHome className="text-lg" />
#                 <span>Beranda</span>
#               </motion.a>
#               <motion.a
#                 whileHover={{ scale: 1.05 }}
#                 href="#"
#                 className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
#               >
#                 <MdSchedule className="text-lg" />
#                 <span>Jadwal</span>
#               </motion.a>
#               <motion.a
#                 whileHover={{ scale: 1.05 }}
#                 href="#"
#                 className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
#               >
#                 <MdConfirmationNumber className="text-lg" />
#                 <span>Tiket Saya</span>
#               </motion.a>
#             </nav>

#             {/* User Section */}
#             <div className="flex items-center space-x-4">
#               {user ? (
#                 <div className="flex items-center space-x-3">
#                   <div className="hidden sm:block text-right">
#                     <p className="text-sm font-medium text-gray-700">Hello, {user.name}</p>
#                     <p className="text-xs text-gray-500">{user.email}</p>
#                   </div>
#                   <motion.button
#                     whileHover={{ scale: 1.05 }}
#                     whileTap={{ scale: 0.95 }}
#                     onClick={() => setUser(null)}
#                     className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
#                   >
#                     Logout
#                   </motion.button>
#                 </div>
#               ) : (
#                 <motion.button
#                   whileHover={{ scale: 1.05 }}
#                   whileTap={{ scale: 0.95 }}
#                   onClick={() => setShowLoginModal(true)}
#                   className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg transition-all shadow-lg flex items-center space-x-2"
#                 >
#                   <MdPerson className="text-lg" />
#                   <span>Login</span>
#                 </motion.button>
#               )}

#               {/* Mobile Menu Button */}
#               <button
#                 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
#                 className="md:hidden p-2 rounded-lg hover:bg-gray-100"
#               >
#                 {mobileMenuOpen ? <MdClose className="text-xl" /> : <MdMenu className="text-xl" />}
#               </button>
#             </div>
#           </div>

#           {/* Mobile Navigation */}
#           <AnimatePresence>
#             {mobileMenuOpen && (
#               <motion.nav
#                 initial={{ height: 0, opacity: 0 }}
#                 animate={{ height: 'auto', opacity: 1 }}
#                 exit={{ height: 0, opacity: 0 }}
#                 className="md:hidden mt-4 pb-4 border-t border-gray-200"
#               >
#                 <div className="flex flex-col space-y-2 mt-4">
#                   <a href="#" className="flex items-center space-x-2 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors">
#                     <MdHome className="text-lg" />
#                     <span>Beranda</span>
#                   </a>
#                   <a href="#" className="flex items-center space-x-2 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors">
#                     <MdSchedule className="text-lg" />
#                     <span>Jadwal</span>
#                   </a>
#                   <a href="#" className="flex items-center space-x-2 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors">
#                     <MdConfirmationNumber className="text-lg" />
#                     <span>Tiket Saya</span>
#                   </a>
#                 </div>
#               </motion.nav>
#             )}
#           </AnimatePresence>
#         </div>
#       </motion.header>

#       {/* Hero Section */}
#       <section className="py-16 lg:py-24">
#         <div className="container mx-auto px-4">
#           <motion.div
#             initial={{ opacity: 0, y: 30 }}
#             animate={{ opacity: 1, y: 0 }}
#             transition={{ duration: 0.8 }}
#             className="text-center mb-12"
#           >
#             <h2 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
#               Nikmati Pengalaman
#               <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
#                 Menonton Terbaik
#               </span>
#             </h2>
#             <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
#               Pesan tiket bioskop favorit Anda dengan mudah dan nikmati film terbaru dengan kualitas terbaik
#             </p>
#             <motion.div
#               initial={{ scale: 0.8, opacity: 0 }}
#               animate={{ scale: 1, opacity: 1 }}
#               transition={{ delay: 0.3, duration: 0.6 }}
#               className="flex flex-wrap justify-center gap-4"
#             >
#               <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
#                 <MdLocationOn className="text-blue-500" />
#                 <span className="text-sm text-gray-700">21+ Bioskop</span>
#               </div>
#               <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
#                 <MdConfirmationNumber className="text-purple-500" />
#                 <span className="text-sm text-gray-700">Pemesanan Mudah</span>
#               </div>
#               <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
#                 <MdStar className="text-yellow-500" />
#                 <span className="text-sm text-gray-700">Film Berkualitas</span>
#               </div>
#             </motion.div>
#           </motion.div>
#         </div>
#       </section>

#       {/* Category Filter */}
#       <section className="container mx-auto px-4 mb-8">
#         <div className="flex flex-wrap justify-center gap-3">
#           {categories.map((category, index) => (
#             <motion.button
#               key={category.id}
#               initial={{ opacity: 0, y: 20 }}
#               animate={{ opacity: 1, y: 0 }}
#               transition={{ delay: index * 0.1 }}
#               whileHover={{ scale: 1.05 }}
#               whileTap={{ scale: 0.95 }}
#               onClick={() => setActiveTab(category.id)}
#               className={`px-6 py-3 rounded-full font-medium transition-all ${activeTab === category.id
#                 ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
#                 : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md'
#                 }`}
#             >
#               {category.name}
#             </motion.button>
#           ))}
#         </div>
#       </section>

#       {/* Movies Grid */}
#       <section className="container mx-auto px-4 pb-20">
#         <motion.h3
#           initial={{ opacity: 0 }}
#           animate={{ opacity: 1 }}
#           className="text-3xl font-bold text-gray-800 mb-8 text-center"
#         >
#           {activeTab === 'semua' ? 'Semua Film' : categories.find(c => c.id === activeTab)?.name}
#         </motion.h3>

#         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
#           {filteredFilms.map((film, index) => (
#             <motion.div
#               key={film.id}
#               initial={{ opacity: 0, y: 30 }}
#               animate={{ opacity: 1, y: 0 }}
#               transition={{ duration: 0.6, delay: index * 0.1 }}
#               whileHover={{ y: -10, scale: 1.02 }}
#               className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
#             >
#               <div className="relative overflow-hidden">
#                 <FilmPosterImage
#                   film={film}
#                   className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
#                 />
#                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

#                 {/* Rating Badge */}
#                 <div className="absolute top-4 left-4 bg-yellow-500 text-white px-2 py-1 rounded-lg text-sm font-bold flex items-center space-x-1">
#                   <MdStar className="text-xs" />
#                   <span>{film.rating}</span>
#                 </div>

#                 {/* Status Badge */}
#                 <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
#                   {film.is_active ? 'Tayang' : 'Segera'}
#                 </div>

#                 {/* Play Button Overlay */}
#                 <motion.div
#                   initial={{ scale: 0 }}
#                   whileHover={{ scale: 1 }}
#                   className="absolute inset-0 flex items-center justify-center"
#                 >
#                   <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
#                     <MdPlayArrow className="text-white text-2xl ml-1" />
#                   </div>
#                 </motion.div>
#               </div>

#               <div className="p-6">
#                 <h4 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{film.judul}</h4>
#                 <p className="text-gray-600 mb-3 text-sm line-clamp-2 leading-relaxed">{film.deskripsi}</p>

#                 <div className="space-y-3 mb-4">
#                   <div className="flex items-center text-sm text-gray-500">
#                     <MdAccessTime className="mr-2 text-blue-500" />
#                     <span>{film.durasi}</span>
#                   </div>
#                   <div className="text-sm text-gray-500">
#                     <span className="font-medium">Genre:</span> {film.genre}
#                   </div>
#                   <div className="text-sm text-gray-500">
#                     <span className="font-medium">Rilis:</span> {new Date(film.tanggal_rilis).toLocaleDateString('id-ID')}
#                   </div>
#                   <div className="flex justify-between items-center pt-2 border-t border-gray-100">
#                     <span className="text-gray-500 text-sm">Harga mulai</span>
#                     <span className="text-blue-600 font-bold text-lg">{formatRupiah(film.harga_tiket)}</span>
#                   </div>
#                 </div>

#                 <motion.button
#                   whileHover={{ scale: 1.02 }}
#                   whileTap={{ scale: 0.98 }}
#                   onClick={() => handleBookTicket(film)}
#                   className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
#                 >
#                   <MdConfirmationNumber className="text-lg" />
#                   <span>Pesan Tiket</span>
#                   <MdArrowForward className="text-lg" />
#                 </motion.button>
#               </div>
#             </motion.div>
#           ))}
#         </div>
#       </section>

#       {/* Login Modal */}
#       <AnimatePresence>
#         {showLoginModal && (
#           <motion.div
#             initial={{ opacity: 0 }}
#             animate={{ opacity: 1 }}
#             exit={{ opacity: 0 }}
#             className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
#           >
#             <motion.div
#               initial={{ opacity: 0, scale: 0.9, y: 20 }}
#               animate={{ opacity: 1, scale: 1, y: 0 }}
#               exit={{ opacity: 0, scale: 0.9, y: 20 }}
#               className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
#             >
#               <div className="text-center mb-6">
#                 <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
#                   <MdPerson className="text-white text-2xl" />
#                 </div>
#                 <h3 className="text-2xl font-bold text-gray-800 mb-2">Selamat Datang</h3>
#                 <p className="text-gray-600">Login untuk melanjutkan pemesanan tiket</p>
#               </div>

#               <form className="space-y-4">
#                 <div>
#                   <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
#                   <input
#                     type="email"
#                     placeholder="Masukkan email Anda"
#                     className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
#                   />
#                 </div>
#                 <div>
#                   <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
#                   <input
#                     type="password"
#                     placeholder="Masukkan password Anda"
#                     className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
#                   />
#                 </div>

#                 <div className="flex space-x-3 mt-6">
#                   <motion.button
#                     whileHover={{ scale: 1.02 }}
#                     whileTap={{ scale: 0.98 }}
#                     type="button"
#                     onClick={() => setShowLoginModal(false)}
#                     className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl transition-colors font-medium"
#                   >
#                     Batal
#                   </motion.button>
#                   <motion.button
#                     whileHover={{ scale: 1.02 }}
#                     whileTap={{ scale: 0.98 }}
#                     type="button"
#                     onClick={handleLogin}
#                     className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl transition-all font-semibold shadow-lg"
#                   >
#                     Login
#                   </motion.button>
#                 </div>
#               </form>

#               <div className="text-center mt-6">
#                 <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
#                   Lupa password?
#                 </a>
#               </div>
#             </motion.div>
#           </motion.div>
#         )}
#       </AnimatePresence>

#       {/* Booking Modal */}
#       <AnimatePresence>
#         {showBookingModal && selectedFilm && (
#           <motion.div
#             initial={{ opacity: 0 }}
#             animate={{ opacity: 1 }}
#             exit={{ opacity: 0 }}
#             className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
#           >
#             <motion.div
#               initial={{ opacity: 0, scale: 0.9, y: 20 }}
#               animate={{ opacity: 1, scale: 1, y: 0 }}
#               exit={{ opacity: 0, scale: 0.9, y: 20 }}
#               className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl my-8"
#             >
#               <div className="flex items-start space-x-6 mb-6">
#                 <FilmPosterImage
#                   film={selectedFilm}
#                   className="w-24 h-36 object-cover rounded-lg shadow-md"
#                 />
#                 <div className="flex-1">
#                   <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedFilm.judul}</h3>
#                   <p className="text-gray-600 mb-3 text-sm">{selectedFilm.deskripsi}</p>
#                   <div className="space-y-1 text-sm text-gray-500">
#                     <div>Genre: {selectedFilm.genre}</div>
#                     <div>Durasi: {selectedFilm.durasi}</div>
#                     <div className="flex items-center">
#                       <MdStar className="text-yellow-500 mr-1" />
#                       Rating: {selectedFilm.rating}
#                     </div>
#                   </div>
#                 </div>
#               </div>

#               <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl mb-6">
#                 <div className="flex justify-between items-center">
#                   <span className="text-gray-700 font-medium">Harga per tiket:</span>
#                   <span className="text-2xl font-bold text-blue-600">{formatRupiah(selectedFilm.harga_tiket)}</span>
#                 </div>
#               </div>

#               <form className="space-y-6">
#                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
#                   <div>
#                     <label className="block text-sm font-medium text-gray-700 mb-2">Bioskop</label>
#                     <select className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
#                       <option>CGV Mall Taman Anggrek</option>
#                       <option>XXI Grand Indonesia</option>
#                       <option>Cineplex Plaza Indonesia</option>
#                     </select>
#                   </div>

#                   <div>
#                     <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Tiket</label>
#                     <select className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
#                       <option value="1">1 Tiket</option>
#                       <option value="2">2 Tiket</option>
#                       <option value="3">3 Tiket</option>
#                       <option value="4">4 Tiket</option>
#                     </select>
#                   </div>
#                 </div>

#                 <div>
#                   <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal & Waktu</label>
#                   <div className="grid grid-cols-2 gap-4">
#                     <input
#                       type="date"
#                       className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
#                     />
#                     <select className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
#                       <option>13:00</option>
#                       <option>16:00</option>
#                       <option>19:00</option>
#                       <option>21:30</option>
#                     </select>
#                   </div>
#                 </div>

#                 <div className="flex space-x-4 mt-8">
#                   <motion.button
#                     whileHover={{ scale: 1.02 }}
#                     whileTap={{ scale: 0.98 }}
#                     type="button"
#                     onClick={() => setShowBookingModal(false)}
#                     className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl transition-colors font-medium"
#                   >
#                     Batal
#                   </motion.button>
#                   <motion.button
#                     whileHover={{ scale: 1.02 }}
#                     whileTap={{ scale: 0.98 }}
#                     type="submit"
#                     className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-xl transition-all font-semibold shadow-lg flex items-center justify-center space-x-2"
#                   >
#                     <MdConfirmationNumber className="text-lg" />
#                     <span>Konfirmasi Pesanan</span>
#                   </motion.button>
#                 </div>
#               </form>
#             </motion.div>
#           </motion.div>
#         )}
#       </AnimatePresence>

#       {/* Footer */}
#       <footer className="bg-gray-800 text-white py-12">
#         <div className="container mx-auto px-4">
#           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
#             <div>
#               <div className="flex items-center space-x-2 mb-4">
#                 <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
#                   <MdConfirmationNumber className="text-white text-lg" />
#                 </div>
#                 <h3 className="text-xl font-bold">CinemaBook</h3>
#               </div>
#               <p className="text-gray-400 text-sm">
#                 Platform pemesanan tiket bioskop terpercaya dengan pengalaman menonton terbaik.
#               </p>
#             </div>

#             <div>
#               <h4 className="font-semibold mb-4">Menu</h4>
#               <ul className="space-y-2 text-sm text-gray-400">
#                 <li><a href="#" className="hover:text-white transition-colors">Beranda</a></li>
#                 <li><a href="#" className="hover:text-white transition-colors">Jadwal Film</a></li>
#                 <li><a href="#" className="hover:text-white transition-colors">Tiket Saya</a></li>
#                 <li><a href="#" className="hover:text-white transition-colors">Promo</a></li>
#               </ul>
#             </div>

#             <div>
#               <h4 className="font-semibold mb-4">Bantuan</h4>
#               <ul className="space-y-2 text-sm text-gray-400">
#                 <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
#                 <li><a href="#" className="hover:text-white transition-colors">Cara Pesan</a></li>
#                 <li><a href="#" className="hover:text-white transition-colors">Hubungi Kami</a></li>
#                 <li><a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a></li>
#               </ul>
#             </div>

#             <div>
#               <h4 className="font-semibold mb-4">Kontak</h4>
#               <div className="space-y-2 text-sm text-gray-400">
#                 <div className="flex items-center space-x-2">
#                   <MdLocationOn className="text-blue-500" />
#                   <span>Jakarta, Indonesia</span>
#                 </div>
#                 <div>Email: info@cinemabook.com</div>
#                 <div>Phone: +62 21 1234 5678</div>
#               </div>
#             </div>
#           </div>

#           <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
#             <p>&copy; 2024 CinemaBook. All rights reserved.</p>
#           </div>
#         </div>
#       </footer>
#     </div>
#   );
# }

# export default Page;