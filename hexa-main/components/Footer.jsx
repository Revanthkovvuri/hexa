"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

// ─── SUPABASE SETUP ───────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const FOOTER_LINKS = [
  { label: "Technical Documentation", href: "#" },
  { label: "Sponsorship Deck", href: "#" },
  { label: "Privacy Protocol", href: "#" },
  { label: "Contact HQ", href: "#" },
];

const SOCIAL_ICONS = [
  { icon: "share", href: "#" },
  { icon: "mail", href: "#" },
];

export default function Footer() {
  // Set the local image as the initial fallback state
  const [logoUrl, setLogoUrl] = useState("/images/logo.png");

  useEffect(() => {
    async function fetchFooterData() {
      const { data } = await supabase
        .from("site_images")
        .select("image_url")
        .eq("section", "footer")
        .eq("key", "logo")
        .single();

      if (data && data.image_url) {
        setLogoUrl(data.image_url);
      }
    }

    fetchFooterData();
  }, []);

  return (
    <footer className="bg-navy border-t border-navy-elevated w-full mt-16 md:mt-24">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 px-6 md:px-12 py-12 md:py-16 max-w-[1440px] mx-auto">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-3">
            <Image
              src={logoUrl}
              alt="HEXAWATTS RACING TEAM"
              width={32}
              height={32}
              className="h-6 md:h-8 w-auto"
            />
            <span className="text-base md:text-lg font-bold text-white font-grotesk">
              HEXAWATTS RACING TEAM
            </span>
          </div>
          <p className="font-grotesk text-[10px] tracking-widest uppercase text-navy-muted text-center md:text-left">
            © 2024 HEXAWATTS RACING TEAM. ENGINEERED FOR SPEED.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              className="font-grotesk text-[10px] tracking-widest uppercase text-navy-muted hover:text-primary transition-colors cursor-pointer"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Social */}
        <div className="flex gap-4">
          {SOCIAL_ICONS.map((s) => (
            <a
              key={s.icon}
              className="w-10 h-10 border border-navy-elevated flex items-center justify-center text-navy-muted hover:text-primary hover:border-primary transition-all"
              href={s.href}
            >
              <span className="material-symbols-outlined text-sm">{s.icon}</span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}