'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Menu, Bell, User, Settings, LogOut, Package } from 'lucide-react';
import Header from '@/components/Header';
import userService, { User as UserType } from '@/services/userService';

export default function DashboardPage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (!userService.isAuthenticated()) {
        router.push('/login');
        return;
      }

      try {
        const currentUser = userService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setNewEmail(currentUser.email);
        } else {
          const profile = await userService.getProfile();
          setUser(profile.user);
          setNewEmail(profile.user.email);
        }
      } catch (error) {
        console.error('Profil bilgileri alınamadı:', error);
        userService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    userService.logout();
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || newEmail === user.email) return;

    setUpdating(true);
    setMessage('');

    try {
      await userService.updateProfile({ email: newEmail });
      setUser({ ...user, email: newEmail });
      setMessage('Email başarıyla güncellendi!');
      setShowSettings(false);
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600 text-xl">Yükleniyor...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Header */}
      <div className="relative z-20">
        <Header />
      </div>

      {/* Background Waves */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Waves */}
        <div className="absolute top-0 left-0 w-full h-32">
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-blue-100/40 to-blue-200/40 rounded-b-full transform -translate-y-10"></div>
          <div className="absolute top-4 left-0 w-full h-16 bg-gradient-to-r from-blue-200/30 to-blue-300/30 rounded-b-full transform -translate-y-5"></div>
        </div>

        {/* Center Waves */}
        <div className="absolute top-1/2 left-0 w-full h-24 transform -translate-y-1/2">
          <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-r from-blue-100/25 to-blue-200/25 rounded-full"></div>
          <div className="absolute top-2 left-0 w-full h-8 bg-gradient-to-r from-blue-200/20 to-blue-300/20 rounded-full"></div>
        </div>

        {/* Bottom Waves */}
        <div className="absolute bottom-0 left-0 w-full h-40">
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-r from-blue-400/50 to-blue-500/50 rounded-t-full"></div>
          <div className="absolute bottom-4 left-0 w-full h-24 bg-gradient-to-r from-blue-500/40 to-blue-600/40 rounded-t-full"></div>
          <div className="absolute bottom-8 left-0 w-full h-16 bg-gradient-to-r from-blue-600/30 to-blue-700/30 rounded-t-full"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-20 pb-16">
        {/* Profile Section */}
        <div className="text-center mb-16">
          {/* Profile Icon */}
          <div className="relative inline-block mb-6">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
              <User className="w-16 h-16 text-white" />
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-30 blur-xl"></div>
          </div>

          {/* User Name */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {user.username}
          </h1>

          {/* Status */}
          <p className="text-gray-600 text-lg">
            Enchanted Micro User
          </p>
        </div>

        {/* Action Buttons */}
        <div className="text-center mb-12">
          <motion.button
            onClick={() => router.push('/my-products')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white/90 backdrop-blur-sm text-blue-600 font-semibold rounded-2xl shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300"
          >
            <Package className="w-6 h-6" />
            Ürünlerim
          </motion.button>
        </div>

        {/* User Info Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-8 relative z-10">
            Profile Information
          </h2>
          
          <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:bg-white transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Email</h3>
              <p className="text-gray-600 text-sm break-all">{user.email}</p>
            </div>

            {/* Username Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:bg-white transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Username</h3>
              <p className="text-gray-600 text-sm">{user.username}</p>
            </div>

            {/* Join Date Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:bg-white transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Member Since</h3>
              <p className="text-gray-600 text-sm">
                {new Date(user.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            {/* Account Status Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:bg-white transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Status</h3>
              <p className="text-green-600 text-sm font-medium">Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowSettings(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Profil Ayarları
            </h3>
            
            <form onSubmit={handleUpdateEmail} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              {message && (
                <div className={`text-sm p-2 rounded-lg ${
                  message.includes('başarıyla') 
                    ? 'text-green-700 bg-green-100' 
                    : 'text-red-700 bg-red-100'
                }`}>
                  {message}
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={updating || newEmail === user.email}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  {updating ? 'Güncelleniyor...' : 'Güncelle'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="flex-1 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <button
          onClick={() => setShowSettings(true)}
          className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
        <button
          onClick={handleLogout}
          className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}