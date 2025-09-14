'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown, ShoppingCart, User, LogIn } from 'lucide-react';
import userService from '@/services/userService';

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = userService.isAuthenticated();
      setIsAuthenticated(authenticated);
      if (authenticated) {
        setUser(userService.getCurrentUser());
      }
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    router.push('/login');
  };

  const handleProfile = () => {
    router.push('/dashboard');
  };

  const handleLogout = () => {
    userService.logout();
  };

  const handleHome = () => {
    router.push('/home');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={handleHome}
              className="text-2xl font-bold text-gray-900 tracking-wider hover:text-blue-600 transition-colors cursor-pointer"
            >
              ENCHANTED
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Yeni İlan Button */}
            <button
              onClick={() => router.push('/new-listing')}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              + Yeni İlan
            </button>

            {/* Search Icon (Mobile) */}
            <button className="p-2 text-gray-400 hover:text-gray-500 lg:hidden">
              <Search className="h-6 w-6" />
            </button>

            {/* Dropdown Menu */}
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <ChevronDown className="h-6 w-6" />
            </button>

            {/* Shopping Cart */}
            <button className="relative p-2 text-gray-400 hover:text-gray-500">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                1
              </span>
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleProfile}
                  className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium">
                    {user?.username}
                  </span>
                </button>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Çıkış
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <LogIn className="h-5 w-5" />
                <span className="hidden sm:block text-sm font-medium">
                  Giriş Yap
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
