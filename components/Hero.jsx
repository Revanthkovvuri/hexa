"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import supabase from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

<<<<<<< HEAD
const AUTO_PLAY_INTERVAL = 3000;

export default function Hero() {
  const [slides, setSlides]           = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading]         = useState(true);
  const [isHovered, setIsHovered]     = useState(false);
  const [dotsReady, setDotsReady]     = useState(false);

  const containerRef  = useRef(null);
  const intervalRef   = useRef(null);

  const bgDots = useRef([...Array(40)].map(() => ({
    x:        Math.random() * 100,
    y:        Math.random() * 100,
    size:     Math.random() * 2.5 + 0.5,
    delay:    Math.random() * 6,
    duration: 4 + Math.random() * 5,
    opacity:  Math.random() * 0.35 + 0.05,
    driftX:   (Math.random() - 0.5) * 2,
    driftY:   (Math.random() - 0.5) * 2,
  })));
=======
const AUTO_PLAY_INTERVAL = 5000;
const SWIPE_THRESHOLD = 50; // px

export default function Hero() {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [failedImages, setFailedImages] = useState(() => new Set());

  const isHoveredRef = useRef(false);
  const isPausedRef = useRef(false);
  const intervalRef = useRef(null);
  const touchStartX = useRef(null);
  const touchDeltaX = useRef(0);
>>>>>>> 38363c7cebbf08db380e2e3a626a0d9c21eb0ab1

  useEffect(() => {
    async function fetchHeroSlides() {
      const { data } = await supabase
        .from("hero_slides")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

<<<<<<< HEAD
      if (data && data.length > 1) {
=======
      if (data && data.length > 0) {
>>>>>>> 38363c7cebbf08db380e2e3a626a0d9c21eb0ab1
        setSlides(data);
      } else {
        setSlides([
          {
<<<<<<< HEAD
            id: 'hero-1',
            image_url: "/images/carousel-1.jpg",
            cta_label: "PRESERVING THE PURSUIT OF SPEED",
            headline: "BEYOND THE APEX.",
=======
            id: "hero-1",
            image_url: "/images/carousel-1.jpg",
            cta_label: "PRESERVING THE PURSUIT OF SPEED",
            headline: "Beyond the Apex.",
>>>>>>> 38363c7cebbf08db380e2e3a626a0d9c21eb0ab1
            subtext: "The only EV category team from both the Telugu states.",
            stats: "0-100 in 2.1s • 1000HP • AWD",
          },
          {
<<<<<<< HEAD
            id: 'hero-2',
            image_url: "/images/carousel-2.jpg",
            cta_label: "AERODYNAMICS",
            headline: "SLICING THE WIND.",
=======
            id: "hero-2",
            image_url: "/images/carousel-2.jpg",
            cta_label: "AERODYNAMICS",
            headline: "Slicing the Wind.",
>>>>>>> 38363c7cebbf08db380e2e3a626a0d9c21eb0ab1
            subtext: "Active aero elements producing massive downforce at top speeds.",
            stats: "DRS ENABLED • 300KG DOWNFORCE",
          },
          {
<<<<<<< HEAD
            id: 'hero-3',
            image_url: "/images/carousel-3.jpg",
            cta_label: "POWERTRAIN",
            headline: "PURE ELECTRIC VOLTAGE.",
=======
            id: "hero-3",
            image_url: "/images/carousel-3.jpg",
            cta_label: "POWERTRAIN",
            headline: "Pure Electric Voltage.",
>>>>>>> 38363c7cebbf08db380e2e3a626a0d9c21eb0ab1
            subtext: "Custom-built accumulator with advanced thermal management.",
            stats: "600V • LI-ION • 80kW",
          },
        ]);
      }
      setLoading(false);
    }

    fetchHeroSlides();
  }, []);

<<<<<<< HEAD
  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setDotsReady(true), 500);
      return () => clearTimeout(t);
    }
  }, [loading]);

  useEffect(() => {
    if (slides.length <= 1) return;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (!isHovered) {
=======
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(slides.length, 1));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % Math.max(slides.length, 1));
  }, [slides.length]);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return undefined;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (!isPausedRef.current) {
>>>>>>> 38363c7cebbf08db380e2e3a626a0d9c21eb0ab1
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
    }, AUTO_PLAY_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
<<<<<<< HEAD
  }, [slides.length, isHovered]);

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
=======
  }, [currentSlide, slides.length]);

  useEffect(() => {
    const handleVisibility = () => {
      isPausedRef.current = document.hidden || isHoveredRef.current;
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    isPausedRef.current = true;
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    isPausedRef.current = document.hidden;
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    isPausedRef.current = true;
  };

  const handleTouchMove = (e) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (Math.abs(touchDeltaX.current) > SWIPE_THRESHOLD) {
      if (touchDeltaX.current < 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
    isPausedRef.current = document.hidden || isHoveredRef.current;
>>>>>>> 38363c7cebbf08db380e2e3a626a0d9c21eb0ab1
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
<<<<<<< HEAD
      if (e.key === 'ArrowLeft')  prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide]);

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

  if (loading) {
    return (
      <section className="relative h-screen w-full bg-black">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Use Tailwind's built-in animate-spin (spin keyframe is in globals.css) */}
          <div className="w-10 h-10 rounded-full border border-white/10 border-t-white/50 animate-spin" />
        </div>
=======
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevSlide, nextSlide]);

  const handleImageError = (id) => {
    setFailedImages((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  // Container height = full viewport minus the navbar's *actual* measured
  // height (published as --navbar-height by Navbar.jsx). Falls back to a
  // sane default before the var is set on first paint.
  const heroHeightStyle = {
    height: "calc(100dvh - var(--navbar-height, 88px))",
    minHeight: "800px",
  };

  if (loading) {
    return (
      <section
        style={heroHeightStyle}
        className="relative w-full bg-black flex items-center justify-center"
      >
        <div className="w-8 h-8 rounded-full border border-white/10 border-t-white/50 animate-spin" />
>>>>>>> 38363c7cebbf08db380e2e3a626a0d9c21eb0ab1
      </section>
    );
  }

<<<<<<< HEAD
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
      {/* Background Dots - fewer on mobile */}
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
                '--drift-x':    `${dot.driftX * 8}px`,
                '--drift-y':    `${dot.driftY * 8}px`,
                '--opacity-min': dot.opacity * 0.3,
                '--opacity-max': dot.opacity,
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

      {/* Radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 0%, transparent 60%, rgba(0,0,0,0.7) 100%)' }}
      />

      {/* ── Apple Cover Flow Carousel ── */}
      <div
        className="absolute inset-0 flex items-center justify-center z-10"
        style={{ perspective: '1100px', perspectiveOrigin: '50% 45%' }}
      >
        <div
          className="relative w-full max-w-[2000px] h-[70vh] md:h-[75vh] flex items-center justify-center px-4 md:px-0"
          style={{ transformStyle: 'preserve-3d' }}
        >

          {/* Far Left Card - hidden on mobile */}
          <motion.div
            className="absolute w-[30%] h-[58%] hidden lg:block"
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

          {/* Previous Card - hidden on mobile */}
          <motion.div
            className="absolute w-[34%] h-[63%] cursor-pointer group hidden lg:block"
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

          {/* Center Card - responsive sizing */}
          <motion.div
            className="absolute w-[90%] sm:w-[80%] md:w-[65%] lg:w-[50%] h-[65%] sm:h-[72%] md:h-[78%]"
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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={activeSlideData.image_url}
                      alt={activeSlideData.headline || ""}
                      fill
                      className="object-contain md:object-cover object-center"
                      priority
                      quality={85}
                      sizes="(max-width: 640px) 90vw, (max-width: 768px) 80vw, (max-width: 1024px) 65vw, 50vw"
                    />
                  </motion.div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
                
                {/* Content - responsive text sizes */}
                <div className="absolute inset-0 flex items-end p-5 sm:p-8 md:p-10 lg:p-14">
                  <motion.div
                    key={`content-${currentSlide}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                    className="space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-5 max-w-2xl"
                  >
                    <span className="inline-block text-[9px] sm:text-[10px] md:text-xs text-white/60 font-medium tracking-[0.2em] sm:tracking-[0.3em] uppercase bg-black/40 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-md border border-white/10">
                      {activeSlideData.cta_label}
                    </span>

                    <h2 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-light text-white tracking-tight leading-[1.1]">
                      {formatHeadline(activeSlideData.headline)}
                    </h2>

                    <p className="text-xs sm:text-sm md:text-base text-white/50 leading-relaxed max-w-lg">
                      {activeSlideData.subtext}
                    </p>

                    {activeSlideData.stats && (
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {activeSlideData.stats.split(' • ').map((stat, i) => (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                            className="text-[8px] sm:text-[10px] font-mono text-white/40 bg-white/5 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1.5 rounded-md border border-white/5"
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

          {/* Next Card - hidden on mobile */}
          <motion.div
            className="absolute w-[34%] h-[63%] cursor-pointer group hidden lg:block"
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

          {/* Far Right Card - hidden on mobile */}
          <motion.div
            className="absolute w-[30%] h-[58%] hidden lg:block"
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

      {/* Navigation - responsive */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 sm:bottom-8 md:bottom-10 left-0 right-0 z-40">
          <div className="max-w-[2000px] mx-auto px-4 sm:px-8">
            <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8">

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={prevSlide}
                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all rounded-full group"
              >
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white/50 group-hover:text-white/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>

              <div className="flex gap-2 sm:gap-2.5 md:gap-3 items-center">
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
                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all rounded-full group"
              >
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white/50 group-hover:text-white/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>

            </div>

            <div className="flex justify-center mt-3 sm:mt-4 md:mt-5">
              <p className="text-white/15 text-[8px] sm:text-[10px] font-mono tracking-[0.2em]">
                {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Glass reflection floor */}
      <div className="absolute bottom-0 left-0 right-0 h-[25vh] sm:h-[30vh] md:h-[35vh] bg-gradient-to-t from-white/[0.02] via-transparent to-transparent pointer-events-none z-5" />
      <div className="absolute left-0 right-0 pointer-events-none z-5" style={{ bottom: '20vh', height: '1px' }}>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
      </div>
=======
  if (slides.length === 0) {
    return <section style={heroHeightStyle} className="relative w-full bg-black" />;
  }

  const activeSlide = slides[currentSlide] || {};
  const imageFailed = failedImages.has(activeSlide.id);
  // Optional per-slide vertical focal point (0-100) can come from Supabase
  // (e.g. a `focal_y` column) for images where the subject sits off-center;
  // defaults to plain center, which is the safest choice for unknown crops.
  const focalY = activeSlide.focal_y ?? 50;

  return (
    <section
      style={heroHeightStyle}
      className="relative w-full overflow-hidden bg-black"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slide image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {activeSlide.image_url && !imageFailed ? (
            <Image
              src={activeSlide.image_url}
              alt={activeSlide.headline || ""}
              fill
              priority={currentSlide === 0}
              quality={90}
              className="object-contain"
              style={{ objectPosition: `center ${focalY}%` }}
              sizes="100vw"
              onError={() => handleImageError(activeSlide.id)}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-900" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Content — sits on a small local scrim, not a wash over the whole image */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end">
        <div className="relative w-full px-5 sm:px-10 md:px-16 pb-[max(1.5rem,6dvh)] sm:pb-[max(2rem,7dvh)] md:pb-20">
          {/* Localized scrim: only as tall as the text block needs, so the
              rest of the photo above stays fully visible and unshaded. */}
          <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black/70 via-black/25 to-transparent pointer-events-none -z-10" />

          <div className="max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${currentSlide}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="space-y-2 sm:space-y-3 md:space-y-4"
              >
                <span className="inline-block text-[9px] sm:text-[10px] md:text-xs text-white/60 font-medium tracking-[0.2em] sm:tracking-[0.25em] uppercase">
                  {activeSlide.cta_label}
                </span>

                <h1 className="text-2xl sm:text-4xl md:text-6xl font-light text-white tracking-tight leading-tight">
                  {activeSlide.headline}
                </h1>

                <p className="text-xs sm:text-sm md:text-base text-white/60 max-w-lg leading-relaxed">
                  {activeSlide.subtext}
                </p>

                {activeSlide.stats && (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1 sm:pt-2">
                    {activeSlide.stats.split(" • ").map((stat, i) => (
                      <span
                        key={i}
                        className="text-[9px] sm:text-xs font-mono text-white/50 bg-white/5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md border border-white/10 whitespace-nowrap"
                      >
                        {stat}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center gap-3 sm:gap-4 px-5 sm:px-10">
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-amber-400/60 bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-amber-400/20 hover:border-amber-400 active:bg-amber-400/30 transition-colors shrink-0"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex gap-1.5 sm:gap-2 flex-wrap justify-center">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "w-8 bg-amber-400 shadow-lg shadow-amber-400/50" : "w-2 bg-amber-400/40 hover:bg-amber-400/70"
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-amber-400/60 bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-amber-400/20 hover:border-amber-400 active:bg-amber-400/30 transition-colors shrink-0"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
>>>>>>> 38363c7cebbf08db380e2e3a626a0d9c21eb0ab1
    </section>
  );
}