"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Crowdfunding from "@/components/Crowdfunding";
import CarSpecs2D from "@/components/CarSpecs2D";
import Team from "@/components/Team";
import Performance from "@/components/Performance";
import Roadmap from "@/components/Roadmap";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import PageLoader from "@/components/PageTransition";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time or wait for critical data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // 2.5 seconds loading

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <PageLoader isLoading={isLoading} />
      
      <div className="bg-black text-white font-body-md overflow-x-hidden pt-32 md:pt-40">
        <Navbar />
        <Hero />
        <ScrollReveal><Crowdfunding /></ScrollReveal>
        <ScrollReveal><CarSpecs2D /></ScrollReveal>
        <ScrollReveal><Team /></ScrollReveal>
        <ScrollReveal><Performance /></ScrollReveal>
        <ScrollReveal><Roadmap /></ScrollReveal>
        <Footer />
      </div>
    </>
  );
}