'use client';

import { useEffect, useState } from 'react';
import supabase from '@/lib/supabase';
import Image from 'next/image';

export default function PantherAnimation({
  size = 850,
  opacity = 0.75,
  glowColor = '#00DCC8',
}) {
  const [pantherUrl, setPantherUrl] = useState(null);
  const [responsiveSize, setResponsiveSize] = useState(size);

  useEffect(() => {
    async function fetchPanther() {
      const { data } = await supabase
        .from('hero_slides')
        .select('image_url')
        .eq('id', '98582114-ce02-4308-b07f-ca48a29a3b23')
        .single();

      if (data?.image_url) {
        console.log('✅ Panther image loaded:', data.image_url);
        setPantherUrl(data.image_url);
      } else {
        console.log('❌ No panther image found');
      }
    }

    fetchPanther();
  }, []);

  useEffect(() => {
    const updateSize = () => {
      const vw = window.innerWidth;
      
      // Desktop: use the full size prop
      // Tablet (768-1024px): scale down to 70%
      // Mobile (<768px): scale down to 50%
      if (vw >= 1024) {
        setResponsiveSize(size);
      } else if (vw >= 768) {
        setResponsiveSize(size * 0.7);
      } else {
        setResponsiveSize(size * 0.5);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [size]);

  if (!pantherUrl) return null;

  return (
    <div
      id="panther-overlay"
      aria-hidden="true"
      style={{
        position: 'fixed',
        zIndex: 0,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        userSelect: 'none',
        width: `${responsiveSize}px`,
        height: `${responsiveSize}px`,
        filter: `opacity(${opacity}) drop-shadow(0 0 30px ${glowColor}40)`,
      }}
    >
      <Image
        src={pantherUrl}
        alt="Hexawatts Panther"
        fill
        className="object-contain"
        style={{ mixBlendMode: 'screen' }}
        unoptimized
        priority
      />
    </div>
  );
}