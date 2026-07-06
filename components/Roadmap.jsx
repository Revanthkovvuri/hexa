'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const MILESTONES = [
  {
    phase: '01',
    title: 'Design & FEA',
    date: 'Q3 2024',
    progress: 100,
  },
  {
    phase: '02',
    title: 'Manufacturing',
    date: 'Q4 2024',
    progress: 60,
  },
  {
    phase: '03',
    title: 'Validation',
    date: 'Q1 2025',
    progress: 0,
  },
  {
    phase: '04',
    title: 'Competition',
    date: 'FEB 2025',
    progress: 0,
  },
];

export default function Roadmap() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className="relative bg-[#0a0a0f] py-16 sm:py-20 md:py-28 lg:py-36 overflow-hidden">
      {/* Background depth layers */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] bg-[#FFC600]/[0.02] rounded-full blur-[120px] sm:blur-[150px] md:blur-[180px] lg:blur-[200px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] md:w-[450px] md:h-[450px] lg:w-[500px] lg:h-[500px] bg-[#FFD700]/[0.015] rounded-full blur-[100px] sm:blur-[130px] md:blur-[160px] lg:blur-[180px]" />
        
        {/* Grid - only on desktop */}
        <div 
          className="hidden lg:block absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,198,0,0.1) 1px, transparent 1px), 
                             linear-gradient(90deg, rgba(255,198,0,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
            transform: 'perspective(1000px) rotateX(60deg) scale(2)',
            transformOrigin: 'center top',
          }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24"
        >
          <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-[#FFC600]/10 border border-[#FFC600]/20 rounded-full text-[#FFC600] text-[10px] sm:text-xs font-bold tracking-[0.15em] sm:tracking-[0.2em] mb-4 sm:mb-6">
            DEVELOPMENT ROADMAP
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-white mb-3 sm:mb-4">
            ROAD TO <span className="text-[#FFC600]">PODIUM 2025</span>
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm md:text-base lg:text-lg max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto">
            From the workshops of JNTU to Kari Motor Speedway — follow our journey.
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative pb-10 sm:pb-16 lg:pb-20">
          {/* SVG Wavy Path - Desktop only */}
          <svg
            className="hidden lg:block absolute top-0 left-0 w-full h-full pointer-events-none"
            viewBox="0 0 800 400"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFC600" stopOpacity="0.1" />
                <stop offset="25%" stopColor="#FFC600" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#FFD700" stopOpacity="0.8" />
                <stop offset="75%" stopColor="#FFC600" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#FFC600" stopOpacity="0.1" />
              </linearGradient>
              <filter id="pathGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            <path
              d="M0,200 C100,100 150,100 200,200 C250,300 300,300 350,200 C400,100 450,100 500,200 C550,300 600,300 650,200 C700,100 750,100 800,200"
              fill="none"
              stroke="url(#pathGradient)"
              strokeWidth="3"
              filter="url(#pathGlow)"
            />
            
            <path
              d="M0,200 C100,100 150,100 200,200 C250,300 300,300 350,200 C400,100 450,100 500,200 C550,300 600,300 650,200 C700,100 750,100 800,200"
              fill="none"
              stroke="#FFC600"
              strokeWidth="1"
              opacity="0.15"
              transform="translate(0, 4)"
            />
          </svg>

          {/* Vertical Line - Mobile/Tablet only */}
          <div className="lg:hidden absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#FFC600]/30 to-transparent" />

          {/* Milestone Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 relative">
            {MILESTONES.map((milestone, index) => {
              const desktopOffsets = [
                'lg:mt-8',
                'lg:mt-32',
                'lg:mt-8',
                'lg:mt-32',
              ];

              return (
                <motion.div
                  key={milestone.phase}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  className={`relative ${desktopOffsets[index]} ${
                    isMobile ? '' : ''
                  }`}
                >
                  {/* Card with 2.5D effect */}
                  <div className="relative group ml-8 sm:ml-0">
                    {/* Shadow layers */}
                    <div 
                      className="absolute inset-0 rounded-xl sm:rounded-2xl translate-y-2 sm:translate-y-3 translate-x-0.5 sm:translate-x-1 opacity-20"
                      style={{ background: '#000' }}
                    />
                    <div 
                      className="absolute inset-0 rounded-xl sm:rounded-2xl translate-y-1 sm:translate-y-2 translate-x-0.5 opacity-30"
                      style={{ background: '#111' }}
                    />
                    
                    {/* Card body */}
                    <div 
                      className="relative rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 text-center transition-all duration-300"
                      style={{
                        background: 'linear-gradient(180deg, rgba(20,20,30,0.95) 0%, rgba(15,15,25,0.98) 100%)',
                        border: '1px solid rgba(255,198,0,0.15)',
                        transform: isMobile ? 'none' : 'perspective(800px) rotateX(2deg) rotateY(-2deg)',
                        transformStyle: 'preserve-3d',
                        boxShadow: `
                          0 1px 0 rgba(255,198,0,0.1),
                          0 2px 0 rgba(0,0,0,0.3),
                          0 4px 8px rgba(0,0,0,0.4),
                          0 8px 16px rgba(0,0,0,0.3),
                          0 16px 32px rgba(0,0,0,0.2),
                          0 0 20px rgba(255,198,0,0.03)
                        `,
                      }}
                    >
                      {/* Side edges */}
                      <div 
                        className="absolute -bottom-1 left-2 right-2 h-1.5 sm:h-2 rounded-b-lg lg:rounded-b-xl opacity-20"
                        style={{
                          background: 'linear-gradient(180deg, rgba(255,198,0,0.3) 0%, transparent 100%)',
                        }}
                      />
                      
                      {/* Top glow line */}
                      <div className="absolute top-0 left-3 right-3 sm:left-4 sm:right-4 h-px bg-gradient-to-r from-transparent via-[#FFC600]/30 to-transparent" />
                      
                      {/* Phase number */}
                      <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white/[0.03] absolute top-2 right-3 sm:top-3 sm:right-4 select-none leading-none">
                        {milestone.phase}
                      </div>

                      {/* Content */}
                      <div className="relative z-10">
                        {/* Progress bar */}
                        <div className="w-full h-1 bg-white/5 rounded-full mb-4 sm:mb-5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${milestone.progress}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: index * 0.2 }}
                            className="h-full rounded-full"
                            style={{
                              background: 'linear-gradient(90deg, #FFC600, #FFD700)',
                              boxShadow: '0 0 8px rgba(255,198,0,0.4)',
                            }}
                          />
                        </div>

                        {/* Title */}
                        <h3 
                          className="text-base sm:text-lg lg:text-xl font-bold mb-1 sm:mb-2"
                          style={{
                            color: milestone.progress === 100 ? '#00DCC8' : 
                                   milestone.progress > 0 ? '#FFC600' : '#555',
                            textShadow: milestone.progress > 0 
                              ? '0 0 15px rgba(255,198,0,0.2)' 
                              : 'none',
                          }}
                        >
                          {milestone.title}
                        </h3>

                        {/* Date */}
                        <p className="text-[10px] sm:text-xs text-gray-500 font-mono tracking-wider">
                          {milestone.date}
                        </p>
                      </div>

                      {/* Hover glow */}
                      <div 
                        className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{
                          background: 'radial-gradient(circle at center, rgba(255,198,0,0.06) 0%, transparent 70%)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Connector dot */}
                  <div className="flex justify-center mt-4 sm:mt-5 lg:mt-6">
                    <div 
                      className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 rounded-full"
                      style={{
                        background: milestone.progress === 100 ? '#00DCC8' : 
                                   milestone.progress > 0 ? '#FFC600' : '#1a1a2e',
                        border: `2px solid ${milestone.progress === 100 ? '#00DCC8' : 
                                             milestone.progress > 0 ? '#FFC600' : '#333'}`,
                        boxShadow: milestone.progress > 0 
                          ? '0 0 10px rgba(255,198,0,0.3)' 
                          : 'none',
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}