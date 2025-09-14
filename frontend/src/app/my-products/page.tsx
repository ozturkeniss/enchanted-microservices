'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Package } from 'lucide-react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import UpdateProduct from '@/components/UpdateProduct';
import userService from '@/services/userService';
import productService, { Product } from '@/services/productService';

export default function MyProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (!userService.isAuthenticated()) {
        router.push('/login');
        return;
      }
      await fetchProducts();
    };

    checkAuth();
  }, [router]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getMyProducts();
      setProducts(response.products || []);
    } catch (err: any) {
      console.error('Error fetching my products:', err);
      setError('Ürünleriniz yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: number) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      setDeletingId(productId);
      await productService.deleteProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
    } catch (err: any) {
      console.error('Error deleting product:', err);
      alert('Ürün silinirken hata oluştu: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsUpdateModalOpen(true);
  };

  const handleUpdate = (updatedProduct: Product) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    setIsUpdateModalOpen(false);
    setEditingProduct(null);
  };

  const handleCloseModal = () => {
    setIsUpdateModalOpen(false);
    setEditingProduct(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-gray-600 text-xl">Yükleniyor...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Package className="w-8 h-8 text-blue-600" />
                Ürünlerim
              </h1>
              <p className="text-gray-600 mt-2">
                Eklediğiniz ürünleri yönetin ve düzenleyin
              </p>
            </div>
            <motion.button
              onClick={() => router.push('/new-listing')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Yeni Ürün Ekle
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          // Error state
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Hata Oluştu
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchProducts}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tekrar Dene
            </button>
          </div>
        ) : products.length === 0 ? (
          // Empty state
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Henüz ürününüz yok
            </h3>
            <p className="text-gray-600 mb-6">
              İlk ürününüzü eklemek için "Yeni Ürün Ekle" butonuna tıklayın
            </p>
            <motion.button
              onClick={() => router.push('/new-listing')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              İlk Ürününüzü Ekleyin
            </motion.button>
          </div>
        ) : (
          // Products grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Image */}
                <div className="h-48 bg-gray-100 relative overflow-hidden">
                  {product.image_url ? (
                    <img
                      src={`http://localhost:8090/uploads/${product.image_url}`}
                      alt={product.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <div className="text-gray-400 text-4xl">📦</div>
                    </div>
                  )}
                  
                  {/* Action Buttons Overlay */}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(product)}
                      className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(product.id)}
                      disabled={deletingId === product.id}
                      className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      {deletingId === product.id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </motion.button>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
                    {product.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-600">
                      ₺{product.price.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>
                        {new Date(product.created_at).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Update Product Modal */}
      {editingProduct && isUpdateModalOpen && (
        <UpdateProduct
          product={editingProduct}
          isOpen={isUpdateModalOpen}
          onClose={handleCloseModal}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
