"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function LoadingScreen({ isLoading }) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loading-screen" /* 👈 THIS IS THE CRITICAL FIX */
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.6, ease: "easeInOut" }
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
        >
          {/* Background effects */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Animated grid */}
            <div 
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `linear-gradient(rgba(0,200,224,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,224,0.3) 1px, transparent 1px)`,
                backgroundSize: '80px 80px',
              }}
            />
            
            {/* Glow orbs */}
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00C8E0]/10 blur-[100px] rounded-full"
            />
            <motion.div
              animate={{
                scale: [1.5, 1, 1.5],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#FFC600]/5 blur-[80px] rounded-full"
            />
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Panther Logo Container */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 20,
                duration: 1 
              }}
              className="relative mb-8"
            >
              {/* Outer glow ring */}
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute -inset-8 border-2 border-dashed border-[#00C8E0]/20 rounded-full"
              />
              
              {/* Middle pulse ring */}
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.3, 1],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -inset-4 border border-[#FFC600]/20 rounded-full"
              />
              
              {/* Logo */}
              <motion.div
                animate={{ 
                  y: [0, -8, 0],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center"
              >
                <Image
                  src="/images/logo.png"
                  alt="Hexawatts Panther"
                  width={160}
                  height={160}
                  className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(0,200,224,0.5)]"
                  priority
                />
              </motion.div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center space-y-3"
            >
              <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">
                HEXAWATTS
                <span className="text-[#00C8E0] ml-2">RACING</span>
              </h1>
              
              {/* Loading bar */}
              <div className="w-48 h-1 bg-white/[0.08] rounded-full overflow-hidden mx-auto">
                <motion.div
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#FFC600] to-transparent rounded-full"
                />
              </div>

              <p className="text-[10px] text-white/30 font-mono tracking-[0.3em] uppercase">
                Loading
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ...
                </motion.span>
              </p>
            </motion.div>
          </div>

          {/* Corner decorations */}
          <div className="absolute bottom-8 left-8 text-white/10 text-[8px] font-mono tracking-widest uppercase">
            ENGINEERED FOR SPEED
          </div>
          <div className="absolute top-8 right-8 text-white/10 text-[8px] font-mono tracking-widest uppercase">
            SYS:INITIALIZING
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}