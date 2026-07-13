"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Crowdfunding from "@/components/Crowdfunding";
import Sponsors from "@/components/Sponsors";
import JNTUHero from "@/components/JNTUHero";
import CarSpecs2D from "@/components/CarSpecs2D";
import Team from "@/components/Team";
import Performance from "@/components/Performance";
import Roadmap from "@/components/Roadmap";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import LoadingScreen from "@/components/LoadingScreen"; // Ensure you import it!

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hide the loading screen after 2.5 seconds (adjust time as needed)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* 
        The Loading Screen sits on top of everything. 
        It receives the isLoading state to know when to fade out.
      */}
      <LoadingScreen isLoading={isLoading} />

      <div className="bg-black text-white font-body-md overflow-x-hidden pt-32 md:pt-40">
        <Navbar />
        <Hero />
        <ScrollReveal><Crowdfunding /></ScrollReveal>
        <ScrollReveal><Sponsors /></ScrollReveal>
        <ScrollReveal><JNTUHero /></ScrollReveal>
        <ScrollReveal><CarSpecs2D /></ScrollReveal>
        <ScrollReveal><Team /></ScrollReveal>
        <ScrollReveal><Performance /></ScrollReveal>
        <ScrollReveal><Roadmap /></ScrollReveal>
        <Footer />
      </div>
    </>
  );
}