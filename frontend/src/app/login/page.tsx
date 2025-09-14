'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import userService, { LoginRequest } from '@/services/userService';

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await userService.login(formData);
      router.push('/home');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-purple-900 flex items-center justify-center relative overflow-hidden">
      {/* Su altı arka plan efektleri */}
      <div className="absolute inset-0">
        {/* Işık huzmeleri */}
        <div className="absolute top-0 left-1/4 w-1 bg-yellow-200 h-96 opacity-30 animate-pulse"></div>
        <div className="absolute top-0 left-1/2 w-1 bg-yellow-300 h-80 opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute top-0 right-1/4 w-1 bg-yellow-200 h-72 opacity-25 animate-pulse delay-2000"></div>
        
        {/* Kabarcıklar */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full opacity-60 animate-bounce"></div>
        <div className="absolute top-32 right-20 w-1 h-1 bg-white rounded-full opacity-40 animate-bounce delay-500"></div>
        <div className="absolute top-40 left-1/3 w-1.5 h-1.5 bg-white rounded-full opacity-50 animate-bounce delay-1000"></div>
        
        {/* Mercanlar */}
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-800 rounded-full opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-800 rounded-full opacity-15"></div>
      </div>

      {/* Ahtapot ve Login Formu */}
      <div className="relative z-10 flex items-center justify-center">
        {/* Ahtapot */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute z-0"
        >
          {/* Ahtapot gövdesi */}
          <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-red-600 rounded-full relative">
            {/* Gözler */}
            <div className="absolute top-8 left-6 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-black rounded-full"></div>
            </div>
            <div className="absolute top-8 right-6 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-black rounded-full"></div>
            </div>
            
            {/* Dokunaçlar */}
            <div className="absolute -top-4 left-4 w-3 h-16 bg-gradient-to-b from-purple-600 to-pink-500 rounded-full transform rotate-12"></div>
            <div className="absolute -top-2 left-8 w-3 h-14 bg-gradient-to-b from-purple-600 to-pink-500 rounded-full transform rotate-6"></div>
            <div className="absolute -top-2 right-8 w-3 h-14 bg-gradient-to-b from-purple-600 to-pink-500 rounded-full transform -rotate-6"></div>
            <div className="absolute -top-4 right-4 w-3 h-16 bg-gradient-to-b from-purple-600 to-pink-500 rounded-full transform -rotate-12"></div>
            <div className="absolute top-16 left-2 w-3 h-12 bg-gradient-to-b from-purple-600 to-pink-500 rounded-full transform rotate-45"></div>
            <div className="absolute top-16 right-2 w-3 h-12 bg-gradient-to-b from-purple-600 to-pink-500 rounded-full transform -rotate-45"></div>
            <div className="absolute top-20 left-8 w-3 h-10 bg-gradient-to-b from-purple-600 to-pink-500 rounded-full transform rotate-90"></div>
            <div className="absolute top-20 right-8 w-3 h-10 bg-gradient-to-b from-purple-600 to-pink-500 rounded-full transform -rotate-90"></div>
          </div>
        </motion.div>

        {/* Login Formu */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-8 w-96 border border-cyan-400/30 shadow-2xl"
        >
          {/* Neon mavi parıltı efekti */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-cyan-400/20 animate-pulse"></div>
          
          <div className="relative z-10">
            {/* Başlık */}
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-3xl font-bold text-white text-center mb-8 drop-shadow-lg"
            >
              Login
            </motion.h1>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="relative"
              >
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-300 w-5 h-5" />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-cyan-100/20 border border-cyan-300/50 rounded-xl text-white placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
                  required
                />
              </motion.div>

              {/* Password Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="relative"
              >
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-300 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-3 bg-cyan-100/20 border border-cyan-300/50 rounded-xl text-white placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-300 hover:text-cyan-100 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </motion.div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-300 text-sm text-center bg-red-500/20 rounded-lg p-2"
                >
                  {error}
                </motion.div>
              )}

              {/* Login Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? 'Giriş Yapılıyor...' : 'Log in'}
              </motion.button>
            </form>

            {/* Register Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="text-center mt-6"
            >
              <p className="text-cyan-200">
                Hesabın yok mu?{' '}
                <a
                  href="/register"
                  className="text-cyan-300 hover:text-cyan-100 font-semibold transition-colors"
                >
                  Kayıt Ol
                </a>
              </p>
            </motion.div>

            {/* Guest Continue Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="text-center mt-4"
            >
              <button
                onClick={() => router.push('/home')}
                className="text-cyan-300 hover:text-cyan-100 font-semibold transition-colors underline"
              >
                Ziyaretçi olarak devam et
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
