'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';

const TOTAL_FRAMES = 19;

const FRAME_NAMES = Array.from({ length: TOTAL_FRAMES }, (_, i) =>
  `/images/ezgif-split/frame_${String(i*2).padStart(2, '0')}_delay-0.1s.gif`
);

export default function PantherAnimation({
  size = 480,
  opacity = 0.75,
  glowColor = '#00DCC8',
}) {
  const [frame, setFrame] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const rafRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const scrolled = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrolled / maxScroll : 0;
      const nextFrame = Math.min(TOTAL_FRAMES - 1, Math.floor(progress * TOTAL_FRAMES));
      setFrame(nextFrame);
      setIsScrolling(true);
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 150);
    });
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(scrollTimeoutRef.current);
    };
  }, [handleScroll]);

  // Preload all frames on mount
  useEffect(() => {
    FRAME_NAMES.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  const glowSize = isScrolling ? '32px' : '18px';
  const glowAlpha = isScrolling ? '60' : '30';

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        // ✅ transform is on its own layer — no opacity here to create stacking context
        transform: 'translate(-50%, -50%)',
        // ✅ high enough to float above page content, below modals/drawers
        zIndex: 0,
        pointerEvents: 'none',
        userSelect: 'none',
        width: size,
        height: 'auto',
        // ✅ opacity moved into filter chain — filter: opacity() does NOT
        // create a new stacking context, unlike the opacity CSS property.
        // This means z-index works correctly and nothing gets buried.
        filter: [
          `opacity(${opacity})`,
          `drop-shadow(0 0 ${glowSize} ${glowColor}${glowAlpha})`,
          `drop-shadow(0 0 60px ${glowColor}18)`,
        ].join(' '),
        transition: 'filter 0.25s ease',
      }}
    >
      <Image
        src={FRAME_NAMES[frame]}
        alt=""
        width={size}
        height={size}
        style={{
          width: '100%',
          height: 'auto',
          objectFit: 'contain',
          // ✅ mixBlendMode scoped to the image only, not the wrapper.
          // Applying it on the wrapper would create yet another stacking context.
          mixBlendMode: 'screen',
          // ✅ display block removes the inline gap below the image
          display: 'block',
        }}
        priority={frame === 0}
        unoptimized
      />
    </div>
  );
}