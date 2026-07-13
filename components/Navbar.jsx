"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const DONATE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeG8mEykVCpS4x4HbjOmtTQoKZ7KcoDe7lZd2JFSHyTuf931A/viewform?usp=publish-editor";

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

  const reversedSectionIds = useMemo(
    () => NAV_LINKS.map(link => link.href.replace("#", "")).reverse(),
    []
  );

  useEffect(() => {
    const handleActiveSection = () => {
      for (const section of reversedSectionIds) {
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
  }, [reversedSectionIds]);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleDonateClick = () => {
    setMobileOpen(false);
    window.open(DONATE_FORM_URL, "_blank");
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
        <div className="flex justify-between items-center px-4 sm:px-6 md:px-8 py-3 sm:py-4 max-w-[1440px] mx-auto w-full">
          
          {/* Logo + Brand */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group cursor-pointer flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-[#42AACC]/20 blur-xl rounded-full scale-150 group-hover:bg-[#42AACC]/40 transition-all duration-500" />
              <Image
                src="/images/logo.png"
                alt="HEXAWATTS RACING TEAM LOGO"
                width={40}
                height={40}
                className="h-7 sm:h-8 md:h-10 w-auto relative z-10 drop-shadow-[0_0_15px_rgba(0,200,224,0.3)] group-hover:drop-shadow-[0_0_20px_rgba(0,200,224,0.5)] transition-all duration-500"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm md:text-base font-black italic tracking-tighter text-white font-grotesk leading-none">
                JNTU Hexawatts Racing Team
              </span>
              <span className="text-[7px] sm:text-[8px] md:text-[9px] font-bold tracking-[0.2em] text-[#42AACC]/60 uppercase leading-none mt-0.5">
                Where Power Meets Geometry
              </span>
              <span className="text-[6px] sm:text-[7px] md:text-[8px] font-medium tracking-[0.15em] text-white/30 uppercase leading-none mt-0.5">
                We Drive with Ingenuity
              </span>
            </div>
          </Link>

          {/* Desktop: Nav Links + Donate Button */}
          <div className="hidden md:flex items-center gap-1">
            <nav className="flex items-center gap-1">
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
                    className={`relative px-3 lg:px-4 py-2 font-grotesk text-xs tracking-[0.15em] uppercase transition-colors duration-300 rounded-lg ${
                      isActive 
                        ? "text-[#42AACC]" 
                        : "text-white/50 hover:text-[#42AACC]"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeNavBg"
                        className="absolute inset-0 rounded-lg bg-[#42AACC]/10"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    {isActive && (
                      <motion.span
                        layoutId="activeNav"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[#42AACC] rounded-full shadow-[0_0_10px_rgba(0,200,224,0.6)]"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    <motion.span
                      className="relative z-10 inline-block"
                      animate={isHovered ? {
                        y: -2,
                        letterSpacing: '0.2em',
                        transition: { duration: 0.2, ease: "easeOut" }
                      } : {
                        y: 0,
                        letterSpacing: '0.15em',
                        transition: { duration: 0.2 }
                      }}
                    >
                      {link.label}
                    </motion.span>
                  </a>
                );
              })}
            </nav>

            {/* DONATE NOW Button - Desktop */}
            <motion.button
              onClick={handleDonateClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="ml-3 lg:ml-4 relative inline-flex items-center gap-2 bg-[#42AACC] text-black px-4 lg:px-5 py-2 lg:py-2.5 rounded-xl font-black text-xs lg:text-sm uppercase tracking-wider overflow-hidden shadow-[0_4px_20px_rgba(0,200,224,0.3)] hover:shadow-[0_6px_25px_rgba(0,200,224,0.5)] transition-all duration-300 flex-shrink-0"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                DONATE NOW
              </span>
            </motion.button>
          </div>

          {/* Mobile: Donate Button + Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* DONATE NOW Button - Mobile */}
            <motion.button
              onClick={handleDonateClick}
              whileTap={{ scale: 0.95 }}
              className="md:hidden relative inline-flex items-center gap-1 sm:gap-1.5 bg-[#42AACC] text-black px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-wider overflow-hidden shadow-[0_4px_15px_rgba(0,200,224,0.3)] flex-shrink-0"
            >
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="hidden sm:inline">DONATE</span>
            </motion.button>

            {/* Mobile Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="md:hidden relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/[0.03] border border-white/[0.08] text-white/70 hover:text-[#42AACC] hover:border-[#42AACC]/30 transition-all duration-300 flex-shrink-0"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <motion.span
                animate={mobileOpen ? { rotate: 180 } : { rotate: 0 }}
                transition={{ duration: 0.3 }}
                className="material-symbols-outlined text-xl sm:text-2xl"
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
            className="md:hidden bg-black/95 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_20px_40px_rgba(0,0,0,0.6)] overflow-hidden"
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
                        ? "text-[#42AACC] bg-[#42AACC]/5 border border-[#42AACC]/20" 
                        : "text-white/50 hover:text-white hover:bg-white/[0.03] border border-transparent"
                    }`}
                  >
                    {link.label}
                  </motion.a>
                );
              })}
              
              {/* Donate button in mobile menu */}
              <motion.button
                onClick={handleDonateClick}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.05 }}
                className="w-full mt-3 relative inline-flex items-center justify-center gap-2 bg-[#42AACC] text-black px-6 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider shadow-[0_4px_20px_rgba(0,200,224,0.3)]"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                DONATE NOW
              </motion.button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#42AACC]/30 to-transparent opacity-50" />
    </header>
  );
}