'use client';

import { motion } from 'framer-motion';
import { API_BASE_URL } from '@/config/config';

interface ProductCardProps {
  title: string;
  description: string;
  price?: string;
  image: string;
  category: string;
  className?: string;
}

export default function ProductCard({ 
  title, 
  description, 
  price, 
  image, 
  category,
  className = '' 
}: ProductCardProps) {
  const getImageUrl = () => {
    if (image && image.startsWith('http')) {
      return image;
    }
    if (image) {
      return `${API_BASE_URL}/uploads/${image}`;
    }
    return null;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Elektronik': 'bg-blue-100 text-blue-800',
      'Giyim & Aksesuar': 'bg-pink-100 text-pink-800',
      'Ev & Yaşam': 'bg-green-100 text-green-800',
      'Spor & Outdoor': 'bg-orange-100 text-orange-800',
      'Kitap & Dergi': 'bg-purple-100 text-purple-800',
      'Müzik & Enstrüman': 'bg-yellow-100 text-yellow-800',
      'Sanat & Koleksiyon': 'bg-indigo-100 text-indigo-800',
      'Otomotiv': 'bg-gray-100 text-gray-800',
      'Diğer': 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors['Diğer'];
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}
    >
      {/* Image */}
      <div className="h-48 bg-gray-100 relative overflow-hidden">
        {getImageUrl() ? (
          <img
            src={getImageUrl()!}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-gray-400 text-4xl">📦</div>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(category)}`}>
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
          {title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {description}
        </p>
        
        {price && (
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-blue-600">
              {price}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              İncele
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}