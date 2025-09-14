'use client';

import { motion } from 'framer-motion';

export default function WaveSection() {
  return (
    <div className="relative h-64 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      {/* Wave Layers */}
      <div className="absolute inset-0">
        {/* Top Wave - Dark Blue */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute top-0 w-full h-20 bg-gradient-to-r from-blue-400 to-blue-500 rounded-b-full"
        />
        
        {/* Second Wave - White */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: '-100%' }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute top-8 w-full h-16 bg-white rounded-b-full"
        />
        
        {/* Third Wave - Light Blue */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="absolute top-16 w-full h-14 bg-gradient-to-r from-blue-200 to-blue-300 rounded-b-full"
        />
        
        {/* Fourth Wave - Very Light Blue */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: '-100%' }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
          className="absolute top-24 w-full h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-b-full"
        />
        
        {/* Fifth Wave - Almost White */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          className="absolute top-32 w-full h-10 bg-gradient-to-r from-blue-50 to-blue-100 rounded-b-full"
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0">
        {/* Bubbles */}
        <motion.div
          animate={{ 
            y: [-10, 10, -10],
            x: [0, 5, 0]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
          className="absolute top-20 left-1/4 w-3 h-3 bg-white/60 rounded-full"
        />
        <motion.div
          animate={{ 
            y: [10, -10, 10],
            x: [0, -5, 0]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: 'easeInOut',
            delay: 1
          }}
          className="absolute top-32 right-1/3 w-2 h-2 bg-white/40 rounded-full"
        />
        <motion.div
          animate={{ 
            y: [-5, 15, -5],
            x: [0, 3, 0]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity, 
            ease: 'easeInOut',
            delay: 2
          }}
          className="absolute top-28 left-2/3 w-1.5 h-1.5 bg-white/50 rounded-full"
        />
      </div>
    </div>
  );
}
