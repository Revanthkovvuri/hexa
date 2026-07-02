"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Crowdfunding from "@/components/Crowdfunding";
import Sponsors from "@/components/Sponsors";
import CarSpecs2D from "@/components/CarSpecs2D";
import Team from "@/components/Team";
import Performance from "@/components/Performance";
import Roadmap from "@/components/Roadmap";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import PageLoader from "@/components/PageTransition"; // adjust path to match your actual file

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Matches the 2s progress-bar animation in PageLoader
    const timer = setTimeout(() => setIsLoading(false), 2200);

    // Safety net: never let the loader block the page for more than 5s
    const failsafe = setTimeout(() => setIsLoading(false), 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(failsafe);
    };
  }, []);

  // Lock scroll while loader is visible
  useEffect(() => {
    document.body.style.overflow = isLoading ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  return (
    <>
      <PageLoader isLoading={isLoading} />

      <div className="bg-black text-white font-body-md overflow-x-hidden pt-32 md:pt-40">
        <Navbar />
        <Hero />
        <ScrollReveal><Crowdfunding /></ScrollReveal>
        <ScrollReveal><Sponsors /></ScrollReveal>
        <ScrollReveal><CarSpecs2D /></ScrollReveal>
        <ScrollReveal><Team /></ScrollReveal>
        <ScrollReveal><Performance /></ScrollReveal>
        <ScrollReveal><Roadmap /></ScrollReveal>
        <Footer />
      </div>
    </>
  );
}