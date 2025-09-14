'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import WaveSection from '@/components/WaveSection';
import ProductCard from '@/components/ProductCard';
import userService from '@/services/userService';
import productService, { Product } from '@/services/productService';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getProducts();
        setProducts(response.products || []);
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setError('Ürünler yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Wave Section */}
      <WaveSection />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Discover Our Collection
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our curated selection of modern designs, natural elements, and artistic creations 
            that bring beauty and tranquility to your space.
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
        >
          {loading ? (
            // Loading skeleton
            Array.from({ length: 5 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-white rounded-lg shadow-md p-4 animate-pulse"
              >
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </motion.div>
            ))
          ) : error ? (
            // Error state
            <div className="col-span-full text-center py-12">
              <div className="text-red-500 text-lg mb-4">⚠️</div>
              <p className="text-gray-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tekrar Dene
              </button>
            </div>
          ) : products.length === 0 ? (
            // Empty state
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Henüz ürün yok
              </h3>
              <p className="text-gray-600 mb-6">
                İlk ürünü eklemek için "Yeni İlan" butonuna tıklayın
              </p>
              <button
                onClick={() => window.location.href = '/new-listing'}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Yeni İlan Ekle
              </button>
            </div>
          ) : (
            // Products
            products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <ProductCard
                  title={product.title}
                  description={product.description}
                  price={`₺${product.price.toFixed(2)}`}
                  image={product.image_url || ""}
                  category={product.category}
                />
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Space?
          </h3>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Join thousands of satisfied customers who have transformed their homes with our unique collection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
              Shop Now
            </button>
            <button className="px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
              Learn More
            </button>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">ENCHANTED</h3>
            <p className="text-gray-600 text-sm">
              Bringing beauty and tranquility to your space
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
