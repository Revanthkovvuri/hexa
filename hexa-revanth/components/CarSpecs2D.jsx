'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';
import CarViewer from './car-viewer/CarViewer';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function CarSpecs2D() {
  const [mechanicalSpecs, setMechanicalSpecs] = useState([]);
  const [electricalSpecs, setElectricalSpecs] = useState([]);
  const [activePart, setActivePart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSpecs() {
      try {
        const [mechRes, elecRes] = await Promise.all([
          supabase.from('mechanical_specs').select('*').order('display_order'),
          supabase.from('electrical_specs').select('*').order('display_order'),
        ]);

        if (mechRes.data) setMechanicalSpecs(mechRes.data);
        if (elecRes.data) setElectricalSpecs(elecRes.data);
      } catch (error) {
        console.error('Error fetching specs:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSpecs();
  }, []);

  return (
    <section className="py-20 md:py-28 relative overflow-hidden" id="specs-2d">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#FFC600]/3 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#00C8E0]/3 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-8 relative z-10">

        {/* ── Section Header ── */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-black border border-white/[0.08] px-5 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-[#FFC600] rounded-full animate-pulse shadow-[0_0_8px_rgba(255,198,0,0.8)]" />
            <span className="text-[#FFC600] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase">
              Technical Blueprint
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-[0.95] mb-4">
            CAR{" "}
            <span className="text-[#FFC600] italic drop-shadow-[0_0_20px_rgba(255,198,0,0.4)]">
              SPECIFICATIONS
            </span>
          </h2>
          
          <p className="text-[#00C8E0]/60 text-sm max-w-lg mx-auto leading-relaxed">
            Every component engineered for maximum performance and reliability
          </p>
        </div>

        {/* ── Hero Image ── */}
        <div className="flex justify-center mb-16">
          <div
            className="relative rounded-2xl overflow-hidden flex items-center justify-center shadow-lg w-full max-w-5xl
              bg-black border border-white/[0.08]"
            style={{
              aspectRatio: '16/9',
              boxShadow: '0 0 48px rgba(0,200,224,0.05)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 pointer-events-none" />
            <img 
              src="/images/car specs photo.jpeg" 
              alt="Hexawatts Racing Car"
              className="w-full h-full object-contain p-4 relative z-10" 
            />
          </div>
        </div>

        {/* ── Loading State ── */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 bg-black border border-white/[0.08] px-4 py-2 rounded-full">
              <span className="w-1.5 h-1.5 bg-[#FFC600] rounded-full animate-pulse" />
              <span className="text-white/40 text-[10px] font-bold tracking-[0.3em] uppercase">
                Loading Specifications...
              </span>
            </div>
          </div>
        )}

        {/* ── Mechanical Specs ── */}
        {!loading && mechanicalSpecs.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 bg-black border border-white/[0.08] px-5 py-2 rounded-full mb-4">
                <span className="w-1.5 h-1.5 bg-[#FFC600] rounded-full shadow-[0_0_8px_rgba(255,198,0,0.8)] animate-pulse" />
                <span className="text-[#FFC600] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase">
                  Mechanical Systems
                </span>
              </div>
              <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight">
                Mechanical Specs
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {mechanicalSpecs.map((spec) => (
                <div
                  key={spec.id}
                  className="group relative rounded-2xl overflow-hidden flex flex-col bg-black border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-white/[0.15] hover:-translate-y-1 transition-all duration-500"
                >
                  {/* Gold accent line */}
                  <div className="absolute left-0 top-4 bottom-4 w-[2px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-[#FFC600] via-[#FFC600]/50 to-transparent" />

                  {/* Header */}
                  <div className="p-5 pb-3">
                    <h4 className="font-black text-white text-lg uppercase tracking-tight">
                      {spec.name}
                    </h4>
                  </div>

                  {/* Image Area */}
                  <div className="relative w-full overflow-hidden flex items-center justify-center bg-black/40 border-t border-b border-white/[0.06]" style={{ aspectRatio: '4/3' }}>
                    {spec.image_url ? (
                      <Image src={spec.image_url} alt={spec.name} fill className="object-contain p-3" unoptimized />
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-7xl font-black text-white/5">{spec.name.charAt(0)}</span>
                        <span className="text-[9px] tracking-widest uppercase mt-2 text-white/15">Photo Coming Soon</span>
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-5 pt-3 flex-1 flex flex-col">
                    {spec.description && (
                      <p className="text-white/50 text-xs leading-relaxed mb-4">
                        {spec.description}
                      </p>
                    )}

                    {/* Details Points */}
                    {spec.details && spec.details.length > 0 && (
                      <div className="mt-auto pt-4 border-t border-white/[0.06]">
                        <ul className="space-y-2">
                          {spec.details.map((detail, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-white/60 font-medium">
                              <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-[#FFC600] shadow-[0_0_6px_rgba(255,198,0,0.4)]" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Electrical Specs ── */}
        {!loading && electricalSpecs.length > 0 && (
          <div>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 bg-black border border-white/[0.08] px-5 py-2 rounded-full mb-4">
                <span className="w-1.5 h-1.5 bg-[#00C8E0] rounded-full shadow-[0_0_8px_rgba(0,200,224,0.8)] animate-pulse" />
                <span className="text-[#00C8E0] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase">
                  Electrical Systems
                </span>
              </div>
              <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight">
                Electrical Specs
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {electricalSpecs.map((spec) => (
                <div
                  key={spec.id}
                  className="group relative rounded-2xl overflow-hidden flex flex-col bg-black border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-white/[0.15] hover:-translate-y-1 transition-all duration-500"
                >
                  {/* Cyan accent line */}
                  <div className="absolute left-0 top-4 bottom-4 w-[2px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-[#00C8E0] via-[#00C8E0]/50 to-transparent" />

                  {/* Header */}
                  <div className="p-5 pb-3">
                    <h4 className="font-black text-white text-lg uppercase tracking-tight">
                      {spec.name}
                    </h4>
                  </div>

                  {/* Image Area */}
                  <div className="relative w-full overflow-hidden flex items-center justify-center bg-black/40 border-t border-b border-white/[0.06]" style={{ aspectRatio: '4/3' }}>
                    {spec.image_url ? (
                      <Image src={spec.image_url} alt={spec.name} fill className="object-contain p-3" unoptimized />
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-7xl font-black text-white/5">{spec.name.charAt(0)}</span>
                        <span className="text-[9px] tracking-widest uppercase mt-2 text-white/15">Photo Coming Soon</span>
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-5 pt-3 flex-1 flex flex-col">
                    {spec.description && (
                      <p className="text-white/50 text-xs leading-relaxed mb-4">
                        {spec.description}
                      </p>
                    )}

                    {/* Details Points */}
                    {spec.details && spec.details.length > 0 && (
                      <div className="mt-auto pt-4 border-t border-white/[0.06]">
                        <ul className="space-y-2">
                          {spec.details.map((detail, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-white/60 font-medium">
                              <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-[#00C8E0] shadow-[0_0_6px_rgba(0,200,224,0.4)]" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}