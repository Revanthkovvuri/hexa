"use client";

import { useState, useEffect, useRef } from "react";
import ContributionModal from "./ContributionModal";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const TOTAL_SEGMENTS = 30;

export default function Crowdfunding() {
  const [stats, setStats] = useState({
    targetGoal: 3000000,
    raised: 0,
    supporters: 0,
    campaignId: null,
  });
  const [prevRaised, setPrevRaised] = useState(null);
  const [isLiveUpdating, setIsLiveUpdating] = useState(false);
  const [recentDonors, setRecentDonors] = useState([]);
  const [showContributionModal, setShowContributionModal] = useState(false);
  const channelRef = useRef(null);

  useEffect(() => {
    async function fetchCrowdfundingData() {
      const { data: campaign } = await supabase
        .from("campaigns")
        .select("*")
        .eq("is_active", true)
        .single();

      if (campaign) {
        const { data: supportersData } = await supabase
          .from("donations")
          .select("donor_email")
          .eq("campaign_id", campaign.id)
          .eq("status", "SUCCESS");

        let supportersCount = 0;
        if (supportersData) {
          const uniqueEmails = new Set(
            supportersData
              .map(d => d.donor_email)
              .filter(email => email && email.trim() !== '')
          );
          supportersCount = uniqueEmails.size;
        }

        setStats({
          targetGoal: Math.round(campaign.goal_amount_paise / 100),
          raised: Math.round(campaign.total_raised_paise / 100),
          supporters: supportersCount,
          campaignId: campaign.id,
        });
      }

      const { data: recentDonations } = await supabase
        .from("donations")
        .select("donor_name, amount_paise, message, created_at, is_anonymous, donor_email")
        .eq("status", "SUCCESS")
        .order("created_at", { ascending: false })
        .limit(5);

      if (recentDonations) {
        setRecentDonors(recentDonations.map(d => ({
          name: d.is_anonymous ? "Anonymous" : d.donor_name,
          amount: Math.round(d.amount_paise / 100),
          message: d.message,
          time: d.created_at,
        })));
      }
    }

    fetchCrowdfundingData();
  }, []);

  useEffect(() => {
    const campaignChannel = supabase
      .channel("campaign-live-updates")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "campaigns" },
        async (payload) => {
          const newData = payload.new;
          setPrevRaised(stats.raised);
          
          const { data: supportersData } = await supabase
            .from("donations")
            .select("donor_email")
            .eq("campaign_id", newData.id)
            .eq("status", "SUCCESS");

          let supportersCount = 0;
          if (supportersData) {
            const uniqueEmails = new Set(
              supportersData
                .map(d => d.donor_email)
                .filter(email => email && email.trim() !== '')
            );
            supportersCount = uniqueEmails.size;
          }

          setStats(prev => ({
            ...prev,
            targetGoal: Math.round(newData.goal_amount_paise / 100),
            raised: Math.round(newData.total_raised_paise / 100),
            supporters: supportersCount,
          }));

          setIsLiveUpdating(true);
          setTimeout(() => setIsLiveUpdating(false), 2000);
        }
      )
      .subscribe();

    const donationChannel = supabase
      .channel("donation-live-updates")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "donations", filter: "status=eq.SUCCESS" },
        async (payload) => {
          const newDonation = payload.new;
          
          setRecentDonors(prev => [{
            name: newDonation.is_anonymous ? "Anonymous" : newDonation.donor_name,
            amount: Math.round(newDonation.amount_paise / 100),
            message: newDonation.message,
            time: newDonation.created_at,
          }, ...prev].slice(0, 5));

          const { data: supportersData } = await supabase
            .from("donations")
            .select("donor_email")
            .eq("campaign_id", newDonation.campaign_id)
            .eq("status", "SUCCESS");

          let supportersCount = 0;
          if (supportersData) {
            const uniqueEmails = new Set(
              supportersData
                .map(d => d.donor_email)
                .filter(email => email && email.trim() !== '')
            );
            supportersCount = uniqueEmails.size;
          }

          setStats(prev => ({
            ...prev,
            supporters: supportersCount,
          }));
        }
      )
      .subscribe();

    channelRef.current = { campaignChannel, donationChannel };

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current.campaignChannel);
        supabase.removeChannel(channelRef.current.donationChannel);
      }
    };
  }, [stats.raised]);

  const percentageRaw = stats.targetGoal > 0 ? (stats.raised / stats.targetGoal) * 100 : 0;
  const PERCENTAGE = Math.min(100, Math.max(0, Math.round(percentageRaw)));
  const ACTIVE_SEGMENTS = Math.round((PERCENTAGE / 100) * TOTAL_SEGMENTS);
  const justAdded = prevRaised ? stats.raised - prevRaised : 0;
  const remaining = stats.targetGoal - stats.raised;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <section className="py-20 md:py-28 px-6 md:px-8 max-w-[1440px] mx-auto relative z-10" id="crowdfund">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00C8E0]/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FFC600]/3 blur-[120px] rounded-full pointer-events-none" />

      <AnimatePresence>
        {isLiveUpdating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-24 right-6 z-50 flex items-center gap-2 bg-[#00C8E0]/20 backdrop-blur-xl border border-[#00C8E0]/40 px-4 py-2 rounded-full"
          >
            <span className="w-2 h-2 bg-[#00C8E0] rounded-full animate-pulse shadow-[0_0_8px_rgba(0,200,224,0.8)]" />
            <span className="text-[#00C8E0] text-[10px] font-bold tracking-[0.2em] uppercase">LIVE UPDATE</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#00C8E0]/50" />
          <div className="flex items-center gap-2 bg-[#00C8E0]/5 border border-[#00C8E0]/20 px-4 py-2 rounded-full">
            <span className="w-1.5 h-1.5 bg-[#00C8E0] rounded-full shadow-[0_0_8px_rgba(0,200,224,0.8)] animate-pulse" />
            <span className="text-[#00C8E0] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase">Crowdfunding Initiative</span>
          </div>
          <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#00C8E0]/50" />
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl lg:text-6xl font-black text-white text-center uppercase tracking-tight leading-[1.1] mb-6"
        >
          WE ARE ACCEPTING{" "}
          <span className="relative inline-block">
            <span className="text-[#00C8E0] italic drop-shadow-[0_0_25px_rgba(0,200,224,0.5)]">CROWDFUNDING</span>
          </span>
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-sm md:text-base text-white/60 text-center max-w-2xl mx-auto leading-relaxed mb-12"
        >
          Our journey to the podium isn&apos;t just about engineering—it&apos;s about the community that fuels our ambition.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-4 mb-10"
        >
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5 md:p-6 text-center">
            <p className="text-[10px] md:text-xs text-white/30 uppercase tracking-[0.2em] font-bold mb-3">Target Goal</p>
            <p className="text-lg md:text-2xl font-black text-white/60">{formatCurrency(stats.targetGoal)}</p>
          </div>

          <div className="bg-[#FFC600]/5 backdrop-blur-xl border border-[#FFC600]/20 rounded-2xl p-5 md:p-6 text-center relative overflow-hidden">
            <AnimatePresence>
              {isLiveUpdating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.5, 0] }}
                  transition={{ duration: 1.5 }}
                  className="absolute inset-0 bg-[#FFC600]/20"
                />
              )}
            </AnimatePresence>
            <p className="text-[10px] md:text-xs text-[#FFC600]/60 uppercase tracking-[0.2em] font-bold mb-3 relative z-10">Raised</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={stats.raised}
                initial={{ scale: 1.2, y: -10 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="text-xl md:text-3xl font-black text-[#FFC600] drop-shadow-[0_0_20px_rgba(255,198,0,0.3)] relative z-10"
              >
                {formatCurrency(stats.raised)}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5 md:p-6 text-center">
            <p className="text-[10px] md:text-xs text-white/30 uppercase tracking-[0.2em] font-bold mb-3">Supporters</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={stats.supporters}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="text-lg md:text-2xl font-black text-white/60"
              >
                {stats.supporters}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 md:p-8 mb-8"
        >
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold mb-2">Progress</p>
              <div className="flex items-baseline gap-1">
                <AnimatePresence mode="wait">
                  <motion.span key={PERCENTAGE} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="text-4xl md:text-5xl font-black text-white">{PERCENTAGE}</motion.span>
                </AnimatePresence>
                <span className="text-xl text-white/40">%</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold mb-2">Remaining</p>
              <p className="text-sm md:text-base font-bold text-white/40">{formatCurrency(remaining)}</p>
            </div>
          </div>

          <div className="flex gap-1 mb-4">
            {Array.from({ length: TOTAL_SEGMENTS }, (_, i) => (
              <motion.div key={i} className={`h-8 md:h-10 flex-1 rounded-sm transition-all duration-500 ${i < ACTIVE_SEGMENTS ? "bg-gradient-to-b from-[#00C8E0] to-[#00C8E0]/60 shadow-[0_0_10px_rgba(0,200,224,0.4)]" : "bg-white/[0.04]"}`} />
            ))}
          </div>

          <div className="flex justify-between text-[10px] text-white/20 font-mono uppercase tracking-wider">
            <span>0%</span><span>50%</span><span>100%</span>
          </div>
        </motion.div>

        {recentDonors.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }} className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5 mb-8">
            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold mb-4 text-center">Recent Supporters</p>
            <div className="space-y-3">
              {recentDonors.map((donor, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FFC600]/10 border border-[#FFC600]/20 flex items-center justify-center text-[#FFC600] text-xs font-bold">{donor.name[0]}</div>
                    <div>
                      <p className="text-white/70 text-xs font-bold">{donor.name}</p>
                      {donor.message && <p className="text-white/30 text-[10px]">{donor.message}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#FFC600] text-xs font-bold">{formatCurrency(donor.amount)}</p>
                    <p className="text-white/20 text-[9px]">{timeAgo(donor.time)}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }} className="text-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowContributionModal(true)}
            className="group relative inline-flex items-center gap-3 bg-[#FFC600] text-black px-10 py-5 rounded-2xl font-black text-lg md:text-xl uppercase tracking-wider overflow-hidden shadow-[0_8px_30px_rgba(255,198,0,0.3)] hover:shadow-[0_12px_40px_rgba(255,198,0,0.5)] transition-all duration-300"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <span className="relative z-10 flex items-center gap-3">
              <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
              SUPPORT THE TEAM
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </motion.button>
          <p className="text-white/20 text-[10px] mt-4 font-mono tracking-wider uppercase">● Secure Transaction ● Tax Benefits Available</p>
        </motion.div>
      </div>

      <ContributionModal 
        isOpen={showContributionModal}
        onClose={() => setShowContributionModal(false)}
        campaignId={stats.campaignId || "d599abca-8174-47f0-baaa-9cad315b2636"}
      />
    </section>
  );
}