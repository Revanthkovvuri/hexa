'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Domain / spec data ───────────────────────────────────────────────────────

const DOMAINS = [
  {
    id: 'chassis',
    name: 'Chassis',
    subTeam: 'Frame & Composites',
    icon: '🏗️',
    description: 'Tubular steel space-frame with carbon-fiber monocoque crash structure ensuring driver safety, torsional rigidity, and a lightweight foundational structure for optimal performance.',
    specs: [
      { label: 'Wheelbase', value: '1550 mm' },
      { label: 'Track (F/R)', value: '1240 / 1200 mm' },
      { label: 'Frame Weight', value: '32 kg' },
      { label: 'Material', value: 'AISI 4130 Chromoly' },
    ],
  },
  {
    id: 'powertrain',
    name: 'Powertrain',
    subTeam: 'EV Drive',
    icon: '⚡',
    description: 'Twin AMK rear motors with custom inverter delivering 80 kW peak output. Custom-built high-voltage battery pack providing consistent and reliable power delivery.',
    specs: [
      { label: 'Peak Power', value: '80 kW' },
      { label: 'Torque', value: '240 Nm' },
      { label: 'Battery', value: '7.2 kWh Li-ion' },
      { label: '0–100 km/h', value: '3.4 s' },
    ],
  },
  {
    id: 'braking',
    name: 'Braking',
    subTeam: 'Stopping Systems',
    icon: '🛑',
    description: 'Four-disc hydraulic braking system with regenerative blending under driver-set bias. Precision-engineered for maximum deceleration performance and consistency.',
    specs: [
      { label: 'Disc Diameter', value: '220 mm' },
      { label: 'Caliper', value: 'ISR 22-048' },
      { label: 'Regen Mix', value: 'Up to 30%' },
      { label: 'Decel Peak', value: '1.8 g' },
    ],
  },
  {
    id: 'aero',
    name: 'Aerodynamics',
    subTeam: 'Aero',
    icon: '🌬️',
    description: 'Multi-element front/rear wings and diffuser tuned through 60+ CFD iterations. Carbon pre-preg construction optimised for maximum downforce at minimum drag.',
    specs: [
      { label: 'Downforce @ 60 km/h', value: '85 kgf' },
      { label: 'Drag Coefficient', value: '0.92' },
      { label: 'L/D Ratio', value: '3.1' },
      { label: 'Wing Material', value: 'Carbon Pre-preg' },
    ],
  },
  {
    id: 'electronics',
    name: 'Electronics',
    subTeam: 'Vehicle Control',
    icon: '🔌',
    description: 'Custom VCU running torque-vectoring, traction control and real-time telemetry over CAN-FD. 120+ sensors feeding live data to pitlane engineers.',
    specs: [
      { label: 'ECU', value: 'Custom STM32-H7' },
      { label: 'CAN Channels', value: '4× CAN-FD' },
      { label: 'Sensors', value: '120+' },
      { label: 'Telemetry', value: 'LoRa 2.4 GHz' },
    ],
  },
  {
    id: 'suspension',
    name: 'Suspension',
    subTeam: 'Vehicle Dynamics',
    icon: '🔄',
    description: 'Pull-rod actuated double-wishbone front, push-rod rear with fully adjustable ARB. Independent camber and caster adjustments for optimal cornering performance.',
    specs: [
      { label: 'Geometry', value: 'Double Wishbone' },
      { label: 'Damper', value: 'Öhlins TTX25' },
      { label: 'Travel', value: '60 mm' },
      { label: 'Roll Center', value: 'Tunable' },
    ],
  },
];

// ─── Colour tokens ────────────────────────────────────────────────────────────
const GOLD    = '#FFC600';
const TEAL    = '#00C8E0';
const NAVY    = '#0D1A3A';
const NAVY_E  = '#1E3A6E';

// ─── Main export ──────────────────────────────────────────────────────────────

export default function CarSpecs2D() {
  const [active, setActive] = useState(null);

  return (
    // relative z-10 blocks the background panther from bleeding up
    <section className="py-16 md:py-24 relative z-10" id="specs-2d">
      <div className="max-w-[1440px] mx-auto px-6 md:px-8">

        {/* Header */}
        <div className="text-center mb-12 space-y-3 relative z-20">
          <h2 className="font-headline-md md:font-headline-lg uppercase italic tracking-tighter text-navy">
            HW-06 <span className="text-primary">THUNDERSTRIKE</span>
          </h2>
          <div className="h-1 w-24 bg-primary mx-auto" />
          <p className="text-secondary font-body-md max-w-xl mx-auto">
            Six engineering domains. One car. Click a domain card to explore the systems behind every lap.
          </p>
        </div>

        {/* Grid: 2D Image + domain cards */}
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] items-start">

          {/* 2D Image Container */}
          <div
            className="relative z-20 rounded-2xl overflow-hidden flex items-center justify-center shadow-lg"
            style={{
              aspectRatio: '4/3',
              backgroundColor: NAVY,
              backgroundImage: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_E} 50%, ${NAVY} 100%)`,
              border: `1px solid ${NAVY_E}`,
              boxShadow: `0 0 48px rgba(0,200,224,0.07)`,
            }}
          >
            <img 
              src="/images/car specs photo.jpeg" 
              alt="Hexawatts Racing Car"
              className="w-full h-full object-contain p-6 relative z-10" 
            />
          </div>

          {/* Domain cards */}
          <div className="grid grid-cols-2 gap-3 relative z-20">
            {DOMAINS.map((d) => (
              <button
                key={d.id}
                onClick={() => setActive(d)}
                className="relative z-30 overflow-hidden rounded-xl p-4 text-left transition-all duration-300 shadow-md"
                style={{ border: `1px solid ${NAVY_E}`, backgroundColor: NAVY }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = TEAL;
                  e.currentTarget.style.backgroundColor = NAVY_E;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 4px 16px rgba(0,200,224,0.15)`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = NAVY_E;
                  e.currentTarget.style.backgroundColor = NAVY;
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="flex items-center gap-1.5 mb-1 relative z-10">
                  <span className="text-xs">{d.icon}</span>
                  <span className="font-label-caps text-[9px] tracking-widest uppercase" style={{ color: TEAL }}>
                    {d.subTeam}
                  </span>
                </div>
                <div className="font-grotesk font-black text-white text-sm leading-tight relative z-10">
                  {d.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Slide-in spec panel */}
      <AnimatePresence>
        {active && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              style={{ backgroundColor: 'rgba(13,26,58,0.55)', backdropFilter: 'blur(4px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActive(null)}
            />
            <motion.aside
              className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto"
              style={{ backgroundColor: '#ffffff', borderLeft: '1px solid #C8D4E4', boxShadow: '-8px 0 40px rgba(13,26,58,0.12)' }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            >
              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-label-caps tracking-widest border mb-2"
                      style={{ borderColor: 'rgba(0,200,224,0.3)', color: TEAL, backgroundColor: 'rgba(0,200,224,0.05)' }}
                    >
                      {active.icon} {active.subTeam}
                    </div>
                    <h3 className="font-grotesk font-black text-navy text-2xl uppercase tracking-tight">
                      {active.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setActive(null)}
                    className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                    style={{ border: '1px solid #C8D4E4', color: '#3D5070' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = NAVY; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#C8D4E4'; }}
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                </div>

                <p className="text-secondary text-sm leading-relaxed mb-6">{active.description}</p>

                <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #E8EDF5' }}>
                  <div className="px-4 py-2.5" style={{ backgroundColor: '#F4F7FB', borderBottom: '1px solid #E8EDF5' }}>
                    <span className="font-label-caps text-[9px] tracking-widest text-outline uppercase">Technical Specifications</span>
                  </div>
                  <table className="w-full text-sm">
                    <tbody>
                      {active.specs.map((s, i) => (
                        <tr key={s.label} style={{ borderBottom: i < active.specs.length - 1 ? '1px solid #E8EDF5' : 'none' }}>
                          <td className="px-4 py-3 text-secondary">{s.label}</td>
                          <td className="px-4 py-3 text-right font-grotesk font-bold" style={{ color: NAVY }}>{s.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 h-1 rounded-full" style={{ backgroundImage: `linear-gradient(90deg, ${GOLD} 0%, ${TEAL} 100%)` }} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}