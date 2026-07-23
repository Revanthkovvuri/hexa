'use client';

import { useEffect, useState } from 'react';
import supabase from '@/lib/supabase';

export default function PantherAnimation({
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
      /* 
         Increased width percentages to make the panther significantly larger
         while still remaining fully responsive.
      */
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0 
                 w-[95%] sm:w-[85%] md:w-[75%] lg:w-[70%] xl:w-[65%] aspect-square"
      style={{
        opacity: opacity,
        filter: `drop-shadow(0 0 30px ${glowColor}40)`,
      }}
    >
      <img
        src={pantherUrl}
        alt="Hexawatts Panther"
        className="w-full h-full object-contain"
      />
    </div>
  );
}