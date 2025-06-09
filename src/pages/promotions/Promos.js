import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  SparklesIcon,
  FireIcon,
  BoltIcon,
  GiftIcon,
  TicketIcon,
  HeartIcon,
  ClockIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const Promos = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const promos = [
    {
      id: 1,
      title: "Weekend Special",
      description: "Diskon 30% untuk tiket weekend",
      discount: "30%",
      validUntil: "2024-12-31",
      category: "weekend",
      color: "from-purple-500 to-pink-500",
      icon: SparklesIcon,
      terms: [
        "Berlaku Sabtu-Minggu",
        "Maksimal 4 tiket",
        "Tidak berlaku hari libur",
      ],
    },
    {
      id: 2,
      title: "Student Discount",
      description: "Potongan 25% untuk mahasiswa",
      discount: "25%",
      validUntil: "2024-12-31",
      category: "student",
      color: "from-green-500 to-emerald-500",
      icon: FireIcon,
      terms: [
        "Wajib tunjukkan KTM",
        "Berlaku setiap hari",
        "Minimal pembelian 1 tiket",
      ],
    },
    {
      id: 3,
      title: "Family Package",
      description: "Beli 3 tiket gratis 1 popcorn",
      discount: "GRATIS",
      validUntil: "2024-12-31",
      category: "family",
      color: "from-orange-500 to-red-500",
      icon: BoltIcon,
      terms: [
        "Minimal 3 tiket",
        "Gratis popcorn medium",
        "Berlaku setiap hari",
      ],
    },
    {
      id: 4,
      title: "Birthday Special",
      description: "Tiket gratis di bulan ulang tahun",
      discount: "100%",
      validUntil: "2024-12-31",
      category: "birthday",
      color: "from-blue-500 to-cyan-500",
      icon: GiftIcon,
      terms: [
        "Tunjukkan KTP",
        "1 tiket gratis per bulan",
        "Berlaku untuk semua film",
      ],
    },
    {
      id: 5,
      title: "Couple Package",
      description: "Beli 2 tiket dapat combo makanan",
      discount: "COMBO",
      validUntil: "2024-12-31",
      category: "couple",
      color: "from-pink-500 to-rose-500",
      icon: HeartIcon,
      terms: ["Minimal 2 tiket", "Gratis combo couple", "Berlaku hari kerja"],
    },
    {
      id: 6,
      title: "Early Bird",
      description: "Beli tiket H-3 dapat diskon 20%",
      discount: "20%",
      validUntil: "2024-12-31",
      category: "early",
      color: "from-indigo-500 to-purple-500",
      icon: ClockIcon,
      terms: [
        "Beli 3 hari sebelumnya",
        "Berlaku semua film",
        "Tidak dapat refund",
      ],
    },
  ];

  const categories = [
    { id: "all", name: "Semua Promo" },
    { id: "weekend", name: "Weekend" },
    { id: "student", name: "Mahasiswa" },
    { id: "family", name: "Keluarga" },
    { id: "birthday", name: "Ulang Tahun" },
    { id: "couple", name: "Couple" },
    { id: "early", name: "Early Bird" },
  ];

  const filteredPromos =
    selectedCategory === "all"
      ? promos
      : promos.filter((promo) => promo.category === selectedCategory);

  const PromoCard = ({ promo }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className={`bg-gradient-to-br ${promo.color} rounded-3xl p-6 text-white relative overflow-hidden shadow-xl`}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <promo.icon className="h-10 w-10" />
          <div className="text-right">
            <div className="text-2xl font-bold">{promo.discount}</div>
            <div className="text-sm opacity-90">OFF</div>
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-2">{promo.title}</h3>
        <p className="text-white/90 mb-4">{promo.description}</p>

        <div className="space-y-2 mb-6">
          {promo.terms.map((term, index) => (
            <div key={index} className="flex items-center text-sm">
              <div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>
              <span className="opacity-90">{term}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <div className="opacity-75">Berlaku hingga</div>
            <div className="font-semibold">
              {new Date(promo.validUntil).toLocaleDateString("id-ID")}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-gray-900 px-6 py-2 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            Gunakan
          </motion.button>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full transform -translate-x-10 translate-y-10" />
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Promo Spesial
          </h1>
          <p className="text-xl text-gray-600">
            Dapatkan penawaran menarik untuk menonton film
          </p>
        </motion.div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
                selectedCategory === category.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Promo Grid */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPromos.map((promo, index) => (
            <motion.div
              key={promo.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PromoCard promo={promo} />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white"
        >
          <UserGroupIcon className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">
            Bergabung dengan Member VIP
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Dapatkan akses eksklusif ke promo terbaru dan potongan harga khusus
            member
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-colors"
          >
            Daftar Sekarang
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Promos;
