'use client';
import { motion, AnimatePresence } from 'framer-motion';

export default function FadeIn() {
  return (
          <AnimatePresence>
            <motion.div
            key={2}
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="absolute top-1/4 left-1/4 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 border border-[#3B82F6]/20 rounded-full"
            />
            <motion.div
            key={3}
              animate={{
                x: [0, -80, 0],
                y: [0, 120, 0],
                rotate: [0, -180, -360],
              }}
              transition={{
                duration: 25,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="absolute top-3/4 right-1/4 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-24 lg:h-24 border border-[#22D3EE]/20 rounded-lg rotate-45"
            />
            <motion.div
              animate={{
                x: [0, 60, 0],
                y: [0, -80, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 15,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="absolute top-1/2 right-1/3 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-[#6366F1]/10 to-[#22D3EE]/10 rounded-full"
            />
          </AnimatePresence>
  );
}
