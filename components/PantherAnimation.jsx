'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// ─── Config ───────────────────────────────────────────────────────────────────
const TOTAL_FRAMES = 30;

const FRAME_NAMES = Array.from({ length: TOTAL_FRAMES }, (_, i) =>
  `/images/ezgif-split/frame_${String(i).padStart(2, '0')}_delay-0.1s.gif`
);

// ─── Component ────────────────────────────────────────────────────────────────
export default function PantherAnimation({
  size = 150,
  opacity = 0.75,
  glowColor = '#00DCC8',
}) {
  const containerRef   = useRef(null);
  const currentFrame   = useRef(0);
  const rafRef         = useRef(null);
  const scrollTimeout  = useRef(null);
  const isScrolling    = useRef(false);

  // ── Decode all frames into GPU memory on mount ──────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;
    const imgs = containerRef.current.querySelectorAll('img');
    imgs.forEach((img) => {
      if (img.complete) {
        img.decode().catch(() => {});
      } else {
        img.addEventListener('load', () => img.decode().catch(() => {}), { once: true });
      }
    });
  }, []);

  // ── Direct DOM frame switch — zero React re-renders ─────────────────────────
  const showFrame = useCallback((nextFrame) => {
    if (!containerRef.current) return;
    if (nextFrame === currentFrame.current) return;

    const imgs = containerRef.current.querySelectorAll('img');
    imgs[currentFrame.current].style.opacity = '0';
    imgs[nextFrame].style.opacity = '1';

    currentFrame.current = nextFrame;
  }, []);

  // ── Glow pulse ──────────────────────────────────────────────────────────────
  const [glowActive, setGlowActive] = useState(false);

  const triggerGlow = useCallback((active) => {
    if (isScrolling.current === active) return;
    isScrolling.current = active;
    setGlowActive(active);
  }, []);

  // ── Scroll handler ──────────────────────────────────────────────────────────
  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const scrolled  = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const progress  = maxScroll > 0 ? scrolled / maxScroll : 0;
      const nextFrame = Math.min(TOTAL_FRAMES - 1, Math.floor(progress * TOTAL_FRAMES));

      showFrame(nextFrame);
      triggerGlow(true);

      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => triggerGlow(false), 150);
    });
  }, [showFrame, triggerGlow]);

  // ── Event listener lifecycle ────────────────────────────────────────────────
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current)        cancelAnimationFrame(rafRef.current);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [handleScroll]);

  // ── Derived glow values ─────────────────────────────────────────────────────
  const glowSize  = glowActive ? '32px' : '18px';
  const glowAlpha = glowActive ? '60'   : '30';

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div
      id="panther-overlay"
      aria-hidden="true"
      style={{
        position:      'fixed',
        zIndex:        0, // ✅ FIX: Pushes the panther into the background
        top:           '60%',
        left:          '50%',
        transform:     'translate(-50%, -50%)',
        pointerEvents: 'none',
        userSelect:    'none',
        overflow:      'hidden',
        width:         `${size}px`,
        height:        `${size}px`,
        filter: [
          `opacity(${opacity})`,
          `drop-shadow(0 0 ${glowSize} ${glowColor}${glowAlpha})`,
          `drop-shadow(0 0 60px ${glowColor}18)`,
        ].join(' '),
        transition: 'filter 0.25s ease',
      }}
    >
      <div
        ref={containerRef}
        style={{ position: 'relative', width: '100%', height: '100%' }}
      >
        {FRAME_NAMES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            width={size}
            height={size}
            style={{
              position:    'absolute',
              top:         0,
              left:        0,
              width:       '100%',
              height:      '100%',
              objectFit:   'contain',
              display:     'block',
              mixBlendMode:'screen',
              opacity:      i === 0 ? 1 : 0,
              willChange:  'opacity',
            }}
          />
        ))}
      </div>
    </div>
  );
}