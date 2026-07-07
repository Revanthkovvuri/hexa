"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Crowdfund", href: "#crowdfund" },
  { label: "Sponsors", href: "#sponsors" },
  { label: "Specs", href: "#specs-2d" },
  { label: "Team", href: "#team" },
  { label: "Performance", href: "#performance" },
  { label: "Roadmap", href: "#roadmap" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [hoveredLink, setHoveredLink] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleActiveSection = () => {
      const sections = NAV_LINKS.map(link => link.href.replace("#", ""));
      for (const section of sections.reverse()) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleActiveSection, { passive: true });
    return () => window.removeEventListener("scroll", handleActiveSection);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 flex flex-col">
      <div 
        className={`transition-all duration-500 ${
          scrolled 
            ? "bg-black/60 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.5)]" 
            : "bg-black/30 backdrop-blur-lg border-b border-white/[0.03]"
        }`}
      >
        <div className="flex justify-between items-center px-6 md:px-8 py-4 max-w-[1440px] mx-auto w-full">
          
          {/* Logo + Brand - Click to refresh */}
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-[#00C8E0]/20 blur-xl rounded-full scale-150 group-hover:bg-[#00C8E0]/40 transition-all duration-500" />
              <Image
                src="/images/logo.png"
                alt="HEXAWATTS RACING TEAM LOGO"
                width={40}
                height={40}
                className="h-8 md:h-10 w-auto relative z-10 drop-shadow-[0_0_15px_rgba(0,200,224,0.3)] group-hover:drop-shadow-[0_0_20px_rgba(0,200,224,0.5)] transition-all duration-500"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm md:text-base font-black italic tracking-tighter text-white font-grotesk leading-none">
                JNTU Hexawatts Racing Team
              </span>
              <span className="text-[8px] md:text-[9px] font-bold tracking-[0.2em] text-[#00C8E0]/60 uppercase leading-none mt-0.5">
                Where Power Meets Geometry
              </span>
              <span className="text-[7px] md:text-[8px] font-medium tracking-[0.15em] text-white/30 uppercase leading-none mt-0.5">
                We Drive with Ingenuity
              </span>
            </div>
          </Link>

          {/* Desktop: Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const sectionId = link.href.replace("#", "");
              const isActive = activeSection === sectionId;
              const isHovered = hoveredLink === link.href;
              
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  onMouseEnter={() => setHoveredLink(link.href)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className={`relative px-4 py-2 font-grotesk text-xs tracking-[0.15em] uppercase transition-colors duration-300 rounded-lg ${
                    isActive 
                      ? "text-[#00C8E0]" 
                      : "text-white/50 hover:text-[#00C8E0]"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeNavBg"
                      className="absolute inset-0 rounded-lg bg-[#00C8E0]/10"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}

                  {isActive && (
                    <motion.span
                      layoutId="activeNav"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[#00C8E0] rounded-full shadow-[0_0_10px_rgba(0,200,224,0.6)]"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  
                  <span className="relative z-10 flex">
                    {link.label.split("").map((char, i) => (
                      <motion.span
                        key={i}
                        className="inline-block"
                        animate={isHovered ? {
                          y: [0, -3, 0],
                          transition: { duration: 0.3, delay: i * 0.02, ease: "easeOut" }
                        } : {
                          y: 0,
                          transition: { duration: 0.2 }
                        }}
                      >
                        {char === " " ? "\u00A0" : char}
                      </motion.span>
                    ))}
                  </span>
                </a>
              );
            })}
          </nav>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-full bg-white/[0.03] border border-white/[0.08] text-white/70 hover:text-[#00C8E0] hover:border-[#00C8E0]/30 transition-all duration-300"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <motion.span
                animate={mobileOpen ? { rotate: 180 } : { rotate: 0 }}
                transition={{ duration: 0.3 }}
                className="material-symbols-outlined text-2xl"
              >
                {mobileOpen ? "close" : "menu"}
              </motion.span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-black/90 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_20px_40px_rgba(0,0,0,0.6)] overflow-hidden"
          >
            <nav className="flex flex-col items-center gap-1 py-6 px-8 max-w-[1440px] mx-auto w-full">
              {NAV_LINKS.map((link, index) => {
                const sectionId = link.href.replace("#", "");
                const isActive = activeSection === sectionId;
                
                return (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`w-full text-center py-3 font-grotesk text-sm tracking-[0.2em] uppercase transition-all duration-300 rounded-lg ${
                      isActive 
                        ? "text-[#00C8E0] bg-[#00C8E0]/5 border border-[#00C8E0]/20" 
                        : "text-white/50 hover:text-white hover:bg-white/[0.03] border border-transparent"
                    }`}
                  >
                    {link.label}
                  </motion.a>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00C8E0]/30 to-transparent opacity-50" />
    </header>
  );
}