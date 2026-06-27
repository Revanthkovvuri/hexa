"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";

// ─── SUPABASE SETUP ───────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const AUTO_PLAY_INTERVAL = 3000;

// ─── CSS for dot animation — add this to your globals.css instead ─────────────
// @keyframes dotFloat {
//   0%, 100% { opacity: var(--opacity-min); transform: translate(0,0) scale(1); }
//   50%       { opacity: var(--opacity-max); transform: translate(var(--drift-x), var(--drift-y)) scale(1.4); }
// }
// ─────────────────────────────────────────────────────────────────────────────

export default function Hero() {
  const [slides, setSlides]           = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading]         = useState(true);
  const [isHovered, setIsHovered]     = useState(false);

  // ── NEW: defer dots until carousel is painted ──────────────────────────────
  const [dotsReady, setDotsReady]     = useState(false);

  const containerRef  = useRef(null);
  const intervalRef   = useRef(null);

  // ── Dot data generated once, never changes ─────────────────────────────────
  const bgDots = useRef([...Array(60)].map(() => ({
    x:        Math.random() * 100,
    y:        Math.random() * 100,
    size:     Math.random() * 2.5 + 0.5,
    delay:    Math.random() * 6,
    duration: 4 + Math.random() * 5,
    opacity:  Math.random() * 0.35 + 0.05,
    driftX:   (Math.random() - 0.5) * 2,
    driftY:   (Math.random() - 0.5) * 2,
  })));

  // ── Fetch slides ───────────────────────────────────────────────────────────
  useEffect(() => {
    async function fetchHeroSlides() {
      const { data } = await supabase
        .from("hero_slides")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (data && data.length > 1) {
        setSlides(data);
      } else {
        setSlides([
          {
            id: 'hero-1',
            image_url: "/images/carousel-1.jpg",
            cta_label: "PRESERVING THE PURSUIT OF SPEED",
            headline: "BEYOND THE APEX.",
            subtext: "The only EV category team from both the Telugu states.",
            stats: "0-100 in 2.1s • 1000HP • AWD",
          },
          {
            id: 'hero-2',
            image_url: "/images/carousel-2.jpg",
            cta_label: "AERODYNAMICS",
            headline: "SLICING THE WIND.",
            subtext: "Active aero elements producing massive downforce at top speeds.",
            stats: "DRS ENABLED • 300KG DOWNFORCE",
          },
          {
            id: 'hero-3',
            image_url: "/images/carousel-3.jpg",
            cta_label: "POWERTRAIN",
            headline: "PURE ELECTRIC VOLTAGE.",
            subtext: "Custom-built accumulator with advanced thermal management.",
            stats: "600V • LI-ION • 80kW",
          },
        ]);
      }
      setLoading(false);
    }

    fetchHeroSlides();
  }, []);

  // ── Defer dots: wait 500ms after carousel is ready ────────────────────────
  // This gives the carousel, images and Framer Motion carousel animations
  // breathing room to paint before we mount 60 more DOM elements.
  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setDotsReady(true), 500);
      return () => clearTimeout(t);
    }
  }, [loading]);

  // ── Auto-play ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (slides.length <= 1) return;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (!isHovered) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
    }, AUTO_PLAY_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [slides.length, isHovered]);

  // ── Navigation ─────────────────────────────────────────────────────────────
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        if (!isHovered) setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, AUTO_PLAY_INTERVAL);
    }
  };

  // ── Keyboard ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft')  prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const formatHeadline = (text) => {
    if (!text) return null;
    const words = text.split(" ");
    if (words.length <= 1) return <>{text}</>;
    return (
      <>
        {words.slice(0, -1).join(" ")}{" "}
        <span className="relative inline-block">
          <span className="text-white italic drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
            {words[words.length - 1]}
          </span>
        </span>
      </>
    );
  };

  const getPrevIndex     = (i) => (i - 1 + slides.length) % slides.length;
  const getNextIndex     = (i) => (i + 1) % slides.length;
  const getPrevPrevIndex = (i) => (i - 2 + slides.length) % slides.length;
  const getNextNextIndex = (i) => (i + 2) % slides.length;

  // ── Loading state — simplified spinner, no heavy Framer Motion ────────────
  // Previously: 3 motion.divs each animating rotate+scale+opacity simultaneously
  // Now: single CSS spinner, zero JS animation cost during the most
  // resource-constrained moment (Supabase fetch + image preload happening).
  if (loading) {
    return (
      <section className="relative h-screen w-full bg-black">
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-10 h-10 rounded-full border border-white/10 border-t-white/50"
            style={{ animation: 'spin 1s linear infinite' }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </section>
    );
  }

  const activeSlideData    = slides[currentSlide]              || {};
  const prevSlideData      = slides[getPrevIndex(currentSlide)]     || {};
  const nextSlideData      = slides[getNextIndex(currentSlide)]     || {};
  const prevPrevSlideData  = slides[getPrevPrevIndex(currentSlide)] || {};
  const nextNextSlideData  = slides[getNextNextIndex(currentSlide)] || {};

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-black"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Background Dots ────────────────────────────────────────────────────
          CHANGED: motion.div → plain div with CSS custom properties.
          Same visual output (random drift, opacity, scale per dot) but runs
          entirely on the GPU compositor thread — zero JS after mount.
          Deferred 500ms so the carousel gets first paint priority.
          
          ADD THIS TO globals.css:
          @keyframes dotFloat {
            0%, 100% { opacity: var(--opacity-min); transform: translate(0,0) scale(1); }
            50%       { opacity: var(--opacity-max); transform: translate(var(--drift-x), var(--drift-y)) scale(1.4); }
          }
      ────────────────────────────────────────────────────────────────────── */}
      {dotsReady && (
        <div className="absolute inset-0 pointer-events-none z-0">
          {bgDots.current.map((dot, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/15"
              style={{
                left:   `${dot.x}%`,
                top:    `${dot.y}%`,
                width:  `${dot.size}px`,
                height: `${dot.size}px`,
                boxShadow: dot.size > 1.5 ? '0 0 4px rgba(255,255,255,0.2)' : 'none',

                // CSS custom properties carry the random values into the keyframe
                '--drift-x':    `${dot.driftX * 8}px`,
                '--drift-y':    `${dot.driftY * 8}px`,
                '--opacity-min': dot.opacity * 0.3,
                '--opacity-max': dot.opacity,

                // unique timing per dot — same values as before, now CSS-driven
                animationName:            'dotFloat',
                animationDuration:        `${dot.duration}s`,
                animationDelay:           `${dot.delay}s`,
                animationTimingFunction:  'ease-in-out',
                animationIterationCount:  'infinite',
              }}
            />
          ))}
        </div>
      )}

      {/* Radial vignette — unchanged */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 0%, transparent 60%, rgba(0,0,0,0.7) 100%)' }}
      />

      {/* ── Apple Cover Flow Carousel — unchanged ─────────────────────────── */}
      <div
        className="absolute inset-0 flex items-center justify-center z-10"
        style={{ perspective: '1100px', perspectiveOrigin: '50% 45%' }}
      >
        <div
          className="relative w-full max-w-[2000px] h-[75vh] flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >

          {/* Far Left Card */}
          <motion.div
            className="absolute w-[30%] h-[58%]"
            style={{
              zIndex: 5,
              transform: 'translateX(-140%) translateZ(-550px) rotateY(62deg)',
              WebkitBoxReflect: 'below 15px linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 100%)',
              filter: 'brightness(0.25) saturate(0.4)',
            }}
          >
            <div className="relative w-full h-full overflow-hidden rounded-lg border border-white/5 bg-gray-900">
              {prevPrevSlideData.image_url && (
                <Image src={prevPrevSlideData.image_url} alt="" fill className="object-cover" />
              )}
            </div>
          </motion.div>

          {/* Previous Card */}
          <motion.div
            className="absolute w-[34%] h-[63%] cursor-pointer group"
            style={{
              zIndex: 10,
              transform: 'translateX(-70%) translateZ(-300px) rotateY(52deg)',
              WebkitBoxReflect: 'below 20px linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.45) 80%)',
              filter: 'brightness(0.45) saturate(0.65)',
            }}
            onClick={prevSlide}
            whileHover={{
              transform: 'translateX(-67%) translateZ(-230px) rotateY(47deg)',
              filter: 'brightness(0.65) saturate(0.85)',
            }}
          >
            <div className="relative w-full h-full overflow-hidden rounded-xl border border-white/10 bg-gray-900 shadow-2xl">
              {prevSlideData.image_url && (
                <Image src={prevSlideData.image_url} alt="" fill className="object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          </motion.div>

          {/* Center Card */}
          <motion.div
            className="absolute w-[48%] h-[76%]"
            style={{
              zIndex: 30,
              transform: 'translateZ(0px)',
              WebkitBoxReflect: 'below 25px linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.55) 90%)',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="relative w-full h-full overflow-hidden rounded-xl border border-white/15 bg-black shadow-[0_35px_90px_rgba(0,0,0,0.9)]"
              >
                {activeSlideData.image_url && (
                  <motion.div
                    initial={{ scale: 1.05 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={activeSlideData.image_url}
                      alt={activeSlideData.headline || ""}
                      fill
                      className="object-cover"
                      priority
                      quality={100}
                    />
                  </motion.div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                <div className="absolute inset-0 flex items-end p-10 md:p-12 lg:p-14">
                  <motion.div
                    key={`content-${currentSlide}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                    className="space-y-4 md:space-y-5 max-w-2xl"
                  >
                    <span className="inline-block text-[11px] md:text-xs text-white/60 font-medium tracking-[0.3em] uppercase bg-black/40 backdrop-blur-sm px-4 py-2 rounded-md border border-white/10">
                      {activeSlideData.cta_label}
                    </span>

                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-white tracking-tight leading-[1.1]">
                      {formatHeadline(activeSlideData.headline)}
                    </h2>

                    <p className="text-sm md:text-base text-white/50 leading-relaxed max-w-lg">
                      {activeSlideData.subtext}
                    </p>

                    {activeSlideData.stats && (
                      <div className="flex flex-wrap gap-2">
                        {activeSlideData.stats.split(' • ').map((stat, i) => (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                            className="text-[10px] font-mono text-white/40 bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-md border border-white/5"
                          >
                            {stat}
                          </motion.span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Next Card */}
          <motion.div
            className="absolute w-[34%] h-[63%] cursor-pointer group"
            style={{
              zIndex: 10,
              transform: 'translateX(70%) translateZ(-300px) rotateY(-52deg)',
              WebkitBoxReflect: 'below 20px linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.45) 80%)',
              filter: 'brightness(0.45) saturate(0.65)',
            }}
            onClick={nextSlide}
            whileHover={{
              transform: 'translateX(67%) translateZ(-230px) rotateY(-47deg)',
              filter: 'brightness(0.65) saturate(0.85)',
            }}
          >
            <div className="relative w-full h-full overflow-hidden rounded-xl border border-white/10 bg-gray-900 shadow-2xl">
              {nextSlideData.image_url && (
                <Image src={nextSlideData.image_url} alt="" fill className="object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          </motion.div>

          {/* Far Right Card */}
          <motion.div
            className="absolute w-[30%] h-[58%]"
            style={{
              zIndex: 5,
              transform: 'translateX(140%) translateZ(-550px) rotateY(-62deg)',
              WebkitBoxReflect: 'below 15px linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 100%)',
              filter: 'brightness(0.25) saturate(0.4)',
            }}
          >
            <div className="relative w-full h-full overflow-hidden rounded-lg border border-white/5 bg-gray-900">
              {nextNextSlideData.image_url && (
                <Image src={nextNextSlideData.image_url} alt="" fill className="object-cover" />
              )}
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── Navigation — unchanged ─────────────────────────────────────────── */}
      {slides.length > 1 && (
        <div className="absolute bottom-10 left-0 right-0 z-40">
          <div className="max-w-[2000px] mx-auto px-8">
            <div className="flex items-center justify-center gap-8">

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={prevSlide}
                className="w-10 h-10 bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all rounded-full group"
              >
                <svg className="w-4 h-4 text-white/50 group-hover:text-white/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>

              <div className="flex gap-3 items-center">
                {slides.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className="relative"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? 'bg-white scale-125'
                        : 'bg-white/20 hover:bg-white/40'
                    }`} />
                    {index === currentSlide && !isHovered && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-white/30"
                        initial={{ scale: 1, opacity: 1 }}
                        animate={{ scale: 3, opacity: 0 }}
                        transition={{
                          duration: AUTO_PLAY_INTERVAL / 1000,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextSlide}
                className="w-10 h-10 bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all rounded-full group"
              >
                <svg className="w-4 h-4 text-white/50 group-hover:text-white/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>

            </div>

            <div className="flex justify-center mt-5">
              <p className="text-white/15 text-[10px] font-mono tracking-[0.2em]">
                {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Glass reflection floor — unchanged */}
      <div className="absolute bottom-0 left-0 right-0 h-[35vh] bg-gradient-to-t from-white/[0.02] via-transparent to-transparent pointer-events-none z-5" />
      <div className="absolute left-0 right-0 pointer-events-none z-5" style={{ bottom: '30vh', height: '1px' }}>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
      </div>
    </section>
  );
}