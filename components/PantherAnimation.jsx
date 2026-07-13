'use client';

import { useEffect, useState } from 'react';
import supabase from '@/lib/supabase';

export default function PantherAnimation({
  size = 150,
  opacity = 0.75,
  glowColor = '#00DCC8',
}) {
  const [pantherUrl, setPantherUrl] = useState(null);

  useEffect(() => {
    async function fetchPanther() {
      try {
        const { data, error } = await supabase
          .from('site_images')
          .select('image_url')
          .eq('section', 'panther')
          .eq('key', 'background')
          .single();

        if (error) {
          console.error('❌ Supabase Fetch Error:', error.message);
          return;
        }

        if (data?.image_url) {
          setPantherUrl(data.image_url);
        }
      } catch (err) {
        console.error('❌ Unexpected Error:', err);
      }
    }

    fetchPanther();
  }, []);

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
        width: `${size}px`,
        height: `${size}px`,
        opacity: opacity,
        filter: `drop-shadow(0 0 30px ${glowColor}40)`,
      }}
    >
      <img
        src={pantherUrl}
        alt="Hexawatts Panther"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    </div>
  );
}