'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import CarViewer from './car-viewer/CarViewer';

const ALL_SPECS = [
  // Mechanical
  { id: "01", category: "CHASSIS", title: "Space Frame", desc: "AISI 4130 Chromoly steel structure with optimized Torsional Rigidity.", icon: "🏗️", stat: "2,200", unit: "Nm/deg", type: "mechanical", color: "#FFC600" },
  { id: "02", category: "STEERING", title: "Rack & Pinion", desc: "Custom designed steering geometry for optimal driver feedback.", icon: "🎯", stat: "12:1", unit: "Ratio", type: "mechanical", color: "#00C8E0" },
  { id: "03", category: "SUSPENSION", title: "Double Wishbone", desc: "Push-rod actuated Ohlins TTX25 dampers with adjustable anti-roll bars.", icon: "🛞", stat: "4", unit: "Way Adj", type: "mechanical", color: "#FF6B6B" },
  { id: "04", category: "DRIVETRAIN", title: "Direct Drive", desc: "Optimized gear reduction system for maximum torque transfer.", icon: "⚙️", stat: "98", unit: "% Eff.", type: "mechanical", color: "#4ECDC4" },
  // Electrical
  { id: "05", category: "BATTERY", title: "Accumulator Pack", desc: "LCO cell chemistry with custom BMS monitoring 144 series segments.", icon: "🔋", stat: "6.4", unit: "kWh", type: "electrical", color: "#FFC600" },
  { id: "06", category: "MOTOR", title: "Emrax 228 MV", desc: "80 kW peak power output with custom liquid cooling system.", icon: "⚡", stat: "80", unit: "kW", type: "electrical", color: "#00C8E0" },
  { id: "07", category: "TELEMETRY", title: "Real-time DAQ", desc: "CAN-based communication with 120Hz sensor sampling for G-force mapping.", icon: "📡", stat: "120", unit: "Hz", type: "electrical", color: "#FF6B6B" },
];

export default function Specs() {
  const [activePart, setActivePart] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);

  return (
    <section className="py-20 md:py-28 relative overflow-hidden" id="specs">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Glow orbs */}
      <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-[#00C8E0]/8 blur-[150px] rounded-full" />
      <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-[#FFC600]/8 blur-[150px] rounded-full" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] px-4 py-2 rounded-full mb-8"
          >
            <span className="text-[10px] font-mono text-[#00C8E0] tracking-[0.3em]">SYS:SPECS_LOADED</span>
            <span className="w-1.5 h-1.5 bg-[#00C8E0] rounded-full animate-pulse" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl lg:text-9xl font-black text-white uppercase tracking-tighter leading-[0.85]"
          >
            BUILT<br />
            <span className="text-outline text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>
              DIFFERENT
            </span>
          </motion.h2>
        </div>

        {/* 3D Viewer - Full Width */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mb-20"
        >
          <CarViewer activePart={activePart} onPartClick={setActivePart} />
        </motion.div>

        {/* Specs - Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-min">
          {ALL_SPECS.map((spec, index) => {
            const isActive = activePart === spec.category;
            const isExpanded = expandedCard === spec.id;
            
            // Make some cards span more columns for visual interest
            const spanClass = index === 0 || index === 3 || index === 5 
              ? 'md:col-span-2 md:row-span-1' 
              : index === 6 
                ? 'md:col-span-2 lg:col-span-2' 
                : '';

            return (
              <motion.div
                key={spec.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  setActivePart(isActive ? null : spec.category);
                  setExpandedCard(isExpanded ? null : spec.id);
                }}
                whileHover={{ scale: 1.02, zIndex: 10 }}
                className={`${spanClass} relative group cursor-pointer overflow-hidden rounded-3xl border transition-all duration-500 ${
                  isActive
                    ? 'bg-white/[0.04] border-white/20 shadow-[0_0_40px_rgba(0,200,224,0.1)]'
                    : 'bg-white/[0.01] border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.02]'
                }`}
              >
                {/* Diagonal shine on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="p-6 md:p-8 h-full flex flex-col justify-between">
                  {/* Top Section */}
                  <div>
                    {/* ID & Type Badge */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-mono text-[10px] text-white/20 tracking-[0.2em]">
                        [{spec.id}]
                      </span>
                      <span className={`text-[9px] font-bold tracking-[0.2em] uppercase px-2 py-1 rounded-md ${
                        spec.type === 'mechanical' 
                          ? 'bg-[#00C8E0]/10 text-[#00C8E0]' 
                          : 'bg-[#FFC600]/10 text-[#FFC600]'
                      }`}>
                        {spec.type}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-500">
                      {spec.icon}
                    </div>

                    {/* Category */}
                    <span className="text-[10px] font-bold text-white/30 tracking-[0.2em] uppercase block mb-2">
                      {spec.category}
                    </span>

                    {/* Title */}
                    <h3 className={`text-xl md:text-2xl font-black mb-3 transition-colors duration-300 ${
                      isActive ? 'text-white' : 'text-white/70 group-hover:text-white'
                    }`}>
                      {spec.title}
                    </h3>

                    {/* Description - visible on expand or hover */}
                    <motion.p
                      animate={{ 
                        height: isExpanded ? 'auto' : '0px',
                        opacity: isExpanded ? 1 : 0,
                        marginTop: isExpanded ? 8 : 0
                      }}
                      className="text-xs text-white/40 leading-relaxed overflow-hidden"
                    >
                      {spec.desc}
                    </motion.p>
                  </div>

                  {/* Bottom Section - Big Stat */}
                  <div className="mt-6 pt-6 border-t border-white/[0.05]">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl md:text-5xl font-black tracking-tighter transition-all duration-500 ${
                        isActive ? 'text-white' : 'text-white/40 group-hover:text-white/60'
                      }`}>
                        {spec.stat}
                      </span>
                      <span className="text-sm text-white/20 font-bold uppercase tracking-wider">
                        {spec.unit}
                      </span>
                    </div>
                  </div>

                  {/* Active glow indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeSpecGlow"
                      className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-[40px]"
                      style={{ background: spec.color, opacity: 0.3 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>

                {/* Corner accent line */}
                <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-0 right-0 w-2 h-12 bg-gradient-to-b from-white/10 to-transparent rotate-45 translate-x-4 -translate-y-4" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-16 flex flex-wrap justify-center gap-6 md:gap-12"
        >
          {[
            { label: 'Total Power', value: '80 kW' },
            { label: 'Battery Capacity', value: '6.4 kWh' },
            { label: 'Data Rate', value: '120 Hz' },
            { label: 'Torsion', value: '2200 Nm/deg' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl md:text-3xl font-black text-white">{stat.value}</div>
              <div className="text-[10px] text-white/30 uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}