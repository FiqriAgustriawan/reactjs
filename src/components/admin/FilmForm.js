import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const FilmForm = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    judul: initialData?.judul || "",
    deskripsi: initialData?.deskripsi || "",
    harga_tiket: initialData?.harga_tiket || "",
    tanggal_rilis: initialData?.tanggal_rilis || "",
    durasi: initialData?.durasi || "",
    is_active: initialData?.is_active ?? true,
    poster: null,
  });

  const [previewImage, setPreviewImage] = useState(
    initialData?.poster_url || null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError("File size must be less than 2MB");
        return;
      }

      setFormData((prev) => ({ ...prev, poster: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Create FormData for file upload
      const submitData = new FormData();

      // Append all form fields
      submitData.append("judul", formData.judul);
      submitData.append("deskripsi", formData.deskripsi);
      submitData.append("harga_tiket", formData.harga_tiket);
      submitData.append("tanggal_rilis", formData.tanggal_rilis);

      // PERBAIKAN: Pastikan durasi dikirim sebagai integer
      if (formData.durasi) {
        submitData.append("durasi", parseInt(formData.durasi, 10));
      }

      submitData.append("is_active", formData.is_active ? "1" : "0");

      // Append poster file if selected
      if (formData.poster) {
        submitData.append("poster", formData.poster);
      }

      await onSubmit(submitData);

      // Reset form after successful submission
      setFormData({
        judul: "",
        deskripsi: "",
        harga_tiket: "",
        tanggal_rilis: "",
        durasi: "",
        is_active: true,
        poster: null,
      });
      setPreviewImage(null);
      onClose();
    } catch (error) {
      setError(
        error.response?.data?.message || error.message || "Failed to save film"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? "Edit Film" : "Add New Film"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Film Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Film Title *
            </label>
            <input
              type="text"
              name="judul"
              value={formData.judul}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter film title"
            />
          </div>

          {/* Poster Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Poster Image
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Max file size: 2MB. Supported formats: JPG, PNG, GIF
                </p>
              </div>
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="h-20 w-16 object-cover rounded border"
                />
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter film description"
            />
          </div>

          {/* Price and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ticket Price (Rp) *
              </label>
              <input
                type="number"
                name="harga_tiket"
                value={formData.harga_tiket}
                onChange={handleInputChange}
                required
                min="0"
                step="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="50000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                name="durasi"
                value={formData.durasi}
                onChange={handleInputChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="120"
              />
            </div>
          </div>

          {/* Release Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Release Date
            </label>
            <input
              type="date"
              name="tanggal_rilis"
              value={formData.tanggal_rilis}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Active (film will be visible to users)
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              )}
              {loading ? "Saving..." : initialData ? "Update Film" : "Add Film"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilmForm;
