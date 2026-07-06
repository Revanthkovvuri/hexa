'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PHASES = [
  {
    id: 'design',
    phase: '01',
    title: 'DESIGN & FEA',
    status: 'completed',
    date: 'Q3 2024',
    icon: '🔧',
    subtasks: [
      { name: 'Aerodynamic Simulation', done: true },
      { name: 'Chassis CAD Modeling', done: true },
      { name: 'Structural FEA Analysis', done: true },
      { name: 'Suspension Geometry', done: true },
    ],
  },
  {
    id: 'manufacturing',
    phase: '02',
    title: 'MANUFACTURING',
    status: 'current',
    date: 'Q4 2024',
    icon: '⚙️',
    subtasks: [
      { name: 'Space Frame Welding', done: true },
      { name: 'Composite Body Panels', done: true },
      { name: 'Harness & Electronics', done: false },
      { name: 'Powertrain Assembly', done: false },
    ],
  },
  {
    id: 'testing',
    phase: '03',
    title: 'TESTING & VALIDATION',
    status: 'upcoming',
    date: 'Q1 2025',
    icon: '🏎️',
    subtasks: [
      { name: 'Brake & Tilt Testing', done: false },
      { name: 'Noise & Emissions Check', done: false },
      { name: 'Driver Training Sessions', done: false },
      { name: 'Endurance Simulation', done: false },
    ],
  },
  {
    id: 'competition',
    phase: '04',
    title: 'COMPETITION',
    status: 'upcoming',
    date: 'FEB 2025',
    icon: '🏆',
    subtasks: [
      { name: 'Design Presentation', done: false },
      { name: 'Cost Report Defense', done: false },
      { name: 'Dynamic Events', done: false },
      { name: 'Podium Ceremony', done: false },
    ],
  },
];

export default function RoadmapSection() {
  const [expandedPhase, setExpandedPhase] = useState(null);

  const completedCount = PHASES.filter(p => p.status === 'completed').length;
  const progressPercent = completedCount * 25 + (PHASES.find(p => p.status === 'current') ? 25 : 0);

  return (
    <section className="relative w-full min-h-screen bg-[#050508] py-12 md:py-20 lg:py-24 overflow-hidden">
      {/* Carbon Fiber Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none roadmap-bg-carbon" />

      {/* Ambient Glow Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#FFC600]/[0.03] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#00DCC8]/[0.02] rounded-full blur-[150px]" />
      </div>

      {/* Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] roadmap-scanlines" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFC600]/10 border border-[#FFC600]/20 rounded-full mb-6">
            <span className="w-2 h-2 bg-[#FFC600] rounded-full animate-pulse" />
            <span className="text-[#FFC600] text-xs md:text-sm font-bold tracking-[0.2em]">
              DEVELOPMENT ROADMAP
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 tracking-tight">
            ROAD TO{' '}
            <span className="bg-gradient-to-r from-[#FFC600] via-[#FFD700] to-[#FFC600] bg-clip-text text-transparent">
              PODIUM 2025
            </span>
          </h2>

          <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto">
            From the workshops of JNTU to Kari Motor Speedway — follow our journey to Formula Bharath glory.
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative w-full h-1 bg-white/5 rounded-full mb-12 md:mb-16 overflow-hidden"
        >
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#FFC600] to-[#FFD700] rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: `${progressPercent}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }}
          >
            <div className="absolute inset-0 roadmap-progress-shimmer" />
          </motion.div>
        </motion.div>

        {/* Bento Grid Phases */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {PHASES.map((phase, index) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              onMouseEnter={() => setExpandedPhase(phase.id)}
              onMouseLeave={() => setExpandedPhase(null)}
              className={`relative group cursor-pointer ${
                index === 0 ? 'lg:col-span-2 lg:row-span-2' :
                index === 3 ? 'lg:col-span-2' : ''
              }`}
            >
              {/* Card */}
              <motion.div
                animate={{
                  scale: expandedPhase === phase.id ? 1.02 : 1,
                  y: expandedPhase === phase.id ? -4 : 0,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`relative h-full rounded-2xl border backdrop-blur-xl overflow-hidden transition-all duration-500 ${
                  phase.status === 'completed'
                    ? 'bg-[#00DCC8]/[0.05] border-[#00DCC8]/20'
                    : phase.status === 'current'
                    ? 'bg-[#FFC600]/[0.08] border-[#FFC600]/30 shadow-lg shadow-[#FFC600]/10 roadmap-active-phase'
                    : 'bg-white/[0.02] border-white/[0.06]'
                }`}
              >
                {/* Content */}
                <div className="relative p-6 md:p-8 h-full flex flex-col">
                  {/* Header Row */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl md:text-4xl roadmap-phase-icon">{phase.icon}</span>
                    <span className={`text-[10px] md:text-xs font-bold tracking-widest px-3 py-1 rounded-full ${
                      phase.status === 'completed'
                        ? 'bg-[#00DCC8]/20 text-[#00DCC8]'
                        : phase.status === 'current'
                        ? 'bg-[#FFC600]/20 text-[#FFC600]'
                        : 'bg-white/5 text-gray-500'
                    }`}>
                      {phase.status === 'completed' ? 'COMPLETED' :
                       phase.status === 'current' ? 'IN PROGRESS' : 'UPCOMING'}
                    </span>
                  </div>

                  {/* Phase Number (Background) */}
                  <div className="absolute top-4 right-4 text-5xl md:text-7xl font-black text-white/5 select-none roadmap-phase-number">
                    {phase.phase}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-tight">
                    {phase.title}
                  </h3>

                  {/* Date */}
                  <p className={`text-sm font-mono mb-4 ${
                    phase.status === 'completed' ? 'text-[#00DCC8]' :
                    phase.status === 'current' ? 'text-[#FFC600]' : 'text-gray-500'
                  }`}>
                    {phase.date}
                  </p>

                  {/* Subtasks - Expand on Hover */}
                  <AnimatePresence>
                    {expandedPhase === phase.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden mt-auto"
                      >
                        <div className="space-y-2 pt-4 border-t border-white/10">
                          {phase.subtasks.map((task, i) => (
                            <motion.div
                              key={task.name}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="flex items-center gap-3"
                            >
                              <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                                task.done
                                  ? 'bg-[#00DCC8] border-[#00DCC8]'
                                  : 'border-gray-600'
                              }`}>
                                {task.done && (
                                  <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              <span className={`text-sm ${
                                task.done ? 'text-gray-300' : 'text-gray-500'
                              }`}>
                                {task.name}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Progress Dots */}
                  <div className="flex gap-1.5 mt-4">
                    {phase.subtasks.map((task, i) => (
                      <div
                        key={i}
                        className={`h-1 rounded-full flex-1 transition-all duration-300 ${
                          task.done
                            ? 'bg-[#00DCC8]'
                            : phase.status === 'current'
                            ? 'bg-[#FFC600]/30'
                            : 'bg-white/5'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-8 md:mt-12 grid grid-cols-3 gap-4"
        >
          {[
            { label: 'PHASES COMPLETED', value: `${completedCount}/${PHASES.length}`, color: '#00DCC8' },
            { label: 'CURRENT PHASE', value: PHASES.find(p => p.status === 'current')?.title || 'N/A', color: '#FFC600' },
            { label: 'NEXT MILESTONE', value: PHASES.find(p => p.status === 'upcoming')?.title || 'N/A', color: '#FF3333' },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white/[0.02] border border-white/5 rounded-xl p-4 md:p-6 text-center backdrop-blur-sm"
            >
              <div className="text-[10px] md:text-xs font-bold tracking-widest text-gray-500 mb-2">
                {stat.label}
              </div>
              <div
                className="text-sm md:text-base font-bold truncate"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}