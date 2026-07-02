"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Crowdfund", href: "#crowdfund" },
  { label: "Specs", href: "#specs-2d" },
  { label: "Team", href: "#team" },
  { label: "Performance", href: "#performance" },
  { label: "Roadmap", href: "#roadmap" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  // Track scroll for glass effect intensity
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track active section for nav indicator
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
      {/* Main Nav Bar - Glass Morphism */}
      <div 
        className={`transition-all duration-500 ${
          scrolled 
            ? "bg-black/60 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.5)]" 
            : "bg-black/30 backdrop-blur-lg border-b border-white/[0.03]"
        }`}
      >
        <div className="flex justify-between items-center px-6 md:px-8 py-4 max-w-[1440px] mx-auto w-full">
          
          {/* Logo + Brand */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              {/* Glow ring behind logo */}
              <div className="absolute inset-0 bg-[#00C8E0]/20 blur-xl rounded-full scale-150 group-hover:bg-[#00C8E0]/40 transition-all duration-500" />
              <Image
                src="/images/logo.png"
                alt="HEXAWATTS RACING TEAM LOGO"
                width={40}
                height={40}
                className="h-8 md:h-10 w-auto relative z-10 drop-shadow-[0_0_15px_rgba(0,200,224,0.3)]"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-black italic tracking-tighter text-white font-grotesk leading-none">
                HEXAWATTS
              </span>
              <span className="text-[9px] md:text-[10px] font-bold tracking-[0.3em] text-[#00C8E0]/70 uppercase leading-none mt-0.5">
                Racing Team
              </span>
            </div>
          </div>

          {/* Desktop: Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const sectionId = link.href.replace("#", "");
              const isActive = activeSection === sectionId;
              
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative px-4 py-2 font-grotesk text-xs tracking-[0.15em] uppercase transition-all duration-300 rounded-lg group ${
                    isActive 
                      ? "text-[#00C8E0]" 
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  {/* Hover background */}
                  <span className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? "bg-[#00C8E0]/10" 
                      : "bg-transparent group-hover:bg-white/[0.05]"
                  }`} />
                  
                  {/* Active indicator line */}
                  {isActive && (
                    <motion.span
                      layoutId="activeNav"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-[#00C8E0] rounded-full shadow-[0_0_10px_rgba(0,200,224,0.6)]"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  
                  <span className="relative z-10">{link.label}</span>
                </a>
              );
            })}
          </nav>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-4">
            {/* Desktop CTA */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:flex items-center gap-2 bg-[#00C8E0]/10 border border-[#00C8E0]/30 hover:border-[#00C8E0]/60 px-5 py-2.5 rounded-full font-grotesk font-bold text-xs tracking-widest text-[#00C8E0] hover:text-white transition-all duration-300 group overflow-hidden relative"
            >
              {/* Glow on hover */}
              <span className="absolute inset-0 bg-gradient-to-r from-[#00C8E0]/0 via-[#00C8E0]/20 to-[#00C8E0]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10 uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#00C8E0] rounded-full shadow-[0_0_8px_rgba(0,200,224,0.8)] animate-pulse" />
                Support Team
              </span>
            </motion.button>

            {/* Mobile Menu Toggle */}
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

      {/* Mobile Menu - Slide Down */}
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
              
              {/* Mobile CTA */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileTap={{ scale: 0.95 }}
                className="w-full max-w-[250px] mt-4 bg-[#00C8E0]/10 border border-[#00C8E0]/30 hover:border-[#00C8E0]/60 px-6 py-3 rounded-full font-grotesk font-bold text-xs tracking-widest text-[#00C8E0] hover:text-white transition-all duration-300"
              >
                <span className="uppercase flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#00C8E0] rounded-full shadow-[0_0_8px_rgba(0,200,224,0.8)] animate-pulse" />
                  Support Team
                </span>
              </motion.button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top edge glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00C8E0]/30 to-transparent opacity-50" />
    </header>
  );
}