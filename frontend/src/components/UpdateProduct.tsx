'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, AlertCircle } from 'lucide-react';
import productService, { Product, UpdateProductRequest } from '@/services/productService';

interface UpdateProductProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedProduct: Product) => void;
}

export default function UpdateProduct({ product, isOpen, onClose, onUpdate }: UpdateProductProps) {
  const [formData, setFormData] = useState({
    title: product.title,
    description: product.description,
    price: product.price.toString(),
    category: product.category,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && product) {
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
      });
      setSelectedImage(null);
      setImagePreview(null);
      setError(null);
    }
  }, [isOpen, product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Ürün adı gereklidir');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Ürün açıklaması gereklidir');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Geçerli bir fiyat giriniz');
      return false;
    }
    if (!formData.category) {
      setError('Kategori seçiniz');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const updateData: UpdateProductRequest = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
      };

      const response = await productService.updateProduct(product.id, updateData);
      
      // Update image if selected
      if (selectedImage) {
        try {
          await productService.uploadProductImage(product.id, selectedImage);
        } catch (imageError) {
          console.warn('Resim güncellenemedi:', imageError);
          // Continue anyway - product was updated successfully
        }
      }

      if (response.product) {
        onUpdate(response.product);
        onClose();
      } else {
        setError('Ürün güncellenirken beklenmeyen bir hata oluştu');
      }
    } catch (error: any) {
      console.error('Error updating product:', error);
      setError('Ürün güncellenirken hata oluştu: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Ürünü Güncelle</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ürün Adı *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ürün adını giriniz"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Açıklama *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Ürün açıklamasını giriniz"
              required
            />
          </div>

          {/* Price and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fiyat (₺) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Kategori seçiniz</option>
                <option value="Elektronik">Elektronik</option>
                <option value="Giyim & Aksesuar">Giyim & Aksesuar</option>
                <option value="Ev & Yaşam">Ev & Yaşam</option>
                <option value="Spor & Outdoor">Spor & Outdoor</option>
                <option value="Kitap & Dergi">Kitap & Dergi</option>
                <option value="Müzik & Enstrüman">Müzik & Enstrüman</option>
                <option value="Sanat & Koleksiyon">Sanat & Koleksiyon</option>
                <option value="Otomotiv">Otomotiv</option>
                <option value="Diğer">Diğer</option>
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ürün Resmi
            </label>
            <div className="space-y-4">
              {/* Current Image */}
              {product.image_url && !imagePreview && (
                <div className="relative">
                  <img
                    src={`http://localhost:8090/uploads/${product.image_url}`}
                    alt="Current product"
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                    Mevcut Resim
                  </div>
                </div>
              )}

              {/* New Image Preview */}
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="New product"
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs">
                    Yeni Resim
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Resim seçmek için tıklayın</span>
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 10MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Güncelleniyor...' : 'Ürünü Güncelle'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
