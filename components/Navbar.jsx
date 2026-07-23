"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
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

// Extra breathing room below the fixed header when jumping to a section
const SCROLL_OFFSET_PADDING = 16;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [hoveredLink, setHoveredLink] = useState(null);
  const headerRef = useRef(null);

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

  // Lock body scroll while the mobile menu is open, so the page behind
  // it doesn't scroll on touch devices.
  useEffect(() => {
    if (mobileOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [mobileOpen]);

  // Close the mobile menu on escape, and on resize past the xl breakpoint
  useEffect(() => {
    if (!mobileOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    const handleResize = () => {
      if (window.innerWidth >= 1280) setMobileOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("resize", handleResize);
    };
  }, [mobileOpen]);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (!target) return;

    // Wait a tick so the mobile menu can close (and body scroll unlock)
    // before we measure/scroll, otherwise the offset math can be off.
    requestAnimationFrame(() => {
      const headerHeight = headerRef.current?.offsetHeight ?? 0;
      const targetTop =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight -
        SCROLL_OFFSET_PADDING;

      window.scrollTo({ top: Math.max(targetTop, 0), behavior: "smooth" });
    });
  };

  const handleDonateClick = () => {
    setMobileOpen(false);
    window.open(DONATE_FORM_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <header ref={headerRef} className="fixed top-0 w-full z-50 flex flex-col">
      <div
        className={`transition-all duration-500 ${
          scrolled
            ? "bg-black/60 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
            : "bg-black/30 backdrop-blur-lg border-b border-white/[0.03]"
        }`}
      >
        <div className="flex justify-between items-center px-4 sm:px-6 xl:px-8 py-3 sm:py-4 max-w-[1440px] mx-auto w-full">

          {/* Logo + Brand */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/";
            }}
            className="flex items-center gap-2 sm:gap-3 group cursor-pointer flex-shrink-0"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-[#42AACC]/20 blur-xl rounded-full scale-150 group-hover:bg-[#42AACC]/40 transition-all duration-500" />
              <Image
                src="/images/logo.png"
                alt="HEXAWATTS RACING TEAM LOGO"
                width={40}
                height={40}
                className="h-7 sm:h-8 xl:h-10 w-auto relative z-10 drop-shadow-[0_0_15px_rgba(0,200,224,0.3)] group-hover:drop-shadow-[0_0_20px_rgba(0,200,224,0.5)] transition-all duration-500"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm xl:text-base font-black italic tracking-tighter text-white font-grotesk leading-none">
                JNTU Hexawatts Racing Team
              </span>
              <span className="text-[7px] sm:text-[8px] xl:text-[9px] font-bold tracking-[0.2em] text-[#42AACC]/60 uppercase leading-none mt-0.5">
                Where Power Meets Geometry
              </span>
              <span className="text-[6px] sm:text-[7px] xl:text-[8px] font-medium tracking-[0.15em] text-white/30 uppercase leading-none mt-0.5">
                We Drive with Ingenuity
              </span>
            </div>
          </a>

          {/* Desktop: Nav Links + Donate Button */}
          <div className="hidden xl:flex items-center gap-1">
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
                    className={`relative px-3 xl:px-4 py-2 font-grotesk text-xs tracking-[0.15em] uppercase transition-colors duration-300 rounded-lg ${
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
                      animate={
                        isHovered
                          ? { y: -2, letterSpacing: "0.2em", transition: { duration: 0.2, ease: "easeOut" } }
                          : { y: 0, letterSpacing: "0.15em", transition: { duration: 0.2 } }
                      }
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
              className="ml-3 xl:ml-4 group relative inline-flex items-center gap-2 bg-[#F2A93B] text-black px-4 xl:px-5 py-2 xl:py-2.5 rounded-xl font-black text-xs xl:text-sm uppercase tracking-wider overflow-hidden shadow-[0_4px_20px_rgba(0,200,224,0.3)] hover:shadow-[0_6px_25px_rgba(0,200,224,0.5)] transition-all duration-300 flex-shrink-0"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10 flex items-center gap-2 sm:gap-3">
             DONATE NOW
             </span>
            </motion.button>
          </div>

          {/* Mobile/Tablet: Donate Button + Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 xl:hidden">
            <motion.button
              onClick={handleDonateClick}
              whileTap={{ scale: 0.95 }}
              className="relative inline-flex items-center gap-1 sm:gap-1.5 bg-[#F2A93B] text-black px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-wider overflow-hidden shadow-[0_4px_15px_rgba(0,200,224,0.3)] flex-shrink-0"
            >
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="hidden sm:inline">DONATE</span>
            </motion.button>

            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/[0.03] border border-white/[0.08] text-white/70 hover:text-[#42AACC] hover:border-[#42AACC]/30 transition-all duration-300 flex-shrink-0"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <motion.span
                animate={mobileOpen ? { rotate: 180 } : { rotate: 0 }}
                transition={{ duration: 0.3 }}
                className="material-symbols-outlined text-xl sm:text-2xl leading-none select-none"
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
          <>
            {/* Backdrop: tap outside to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="xl:hidden fixed inset-0 top-full -z-10 bg-black/40"
              style={{ height: "100vh" }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="xl:hidden bg-black/95 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_20px_40px_rgba(0,0,0,0.6)] overflow-hidden max-h-[calc(100dvh-64px)] overflow-y-auto"
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
          </>
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#42AACC]/30 to-transparent opacity-50" />
    </header>
  );
}
