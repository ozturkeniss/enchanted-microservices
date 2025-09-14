'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import userService from '@/services/userService';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Always redirect to home page
    router.push('/home');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-purple-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="text-white text-xl">Yönlendiriliyor...</div>
      </motion.div>
    </div>
  );
}