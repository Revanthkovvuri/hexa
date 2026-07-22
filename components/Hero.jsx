"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import supabase from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

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

  useEffect(() => {
    async function fetchHeroSlides() {
      const { data } = await supabase
        .from("hero_slides")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (data && data.length > 0) {
        setSlides(data);
      } else {
        setSlides([
          {
            id: "hero-1",
            image_url: "/images/carousel-1.jpg",
            cta_label: "PRESERVING THE PURSUIT OF SPEED",
            headline: "Beyond the Apex.",
            subtext: "The only EV category team from both the Telugu states.",
            stats: "0-100 in 2.1s • 1000HP • AWD",
          },
          {
            id: "hero-2",
            image_url: "/images/carousel-2.jpg",
            cta_label: "AERODYNAMICS",
            headline: "Slicing the Wind.",
            subtext: "Active aero elements producing massive downforce at top speeds.",
            stats: "DRS ENABLED • 300KG DOWNFORCE",
          },
          {
            id: "hero-3",
            image_url: "/images/carousel-3.jpg",
            cta_label: "POWERTRAIN",
            headline: "Pure Electric Voltage.",
            subtext: "Custom-built accumulator with advanced thermal management.",
            stats: "600V • LI-ION • 80kW",
          },
        ]);
      }
      setLoading(false);
    }

    fetchHeroSlides();
  }, []);

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
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
    }, AUTO_PLAY_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
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
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
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
      </section>
    );
  }

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
    </section>
  );
}