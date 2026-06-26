"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import PageLoader from '@/components/PageTransition';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const TEAL    = '#00C8E0';
const NAVY    = '#0D1A3A';
const NAVY_EL = '#1E3A6E';

function getInitials(name = '') {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function FullTeamPage() {
  const [groupedRoster, setGroupedRoster] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompleteRoster() {
      setLoading(true); // Show loader
      
      try {
        const [domainsRes, leadsRes, membersRes] = await Promise.all([
          supabase.from('domains').select('*').order('display_order'),
          supabase.from('team_leads').select('*'),
          supabase.from('members').select('*'),
        ]);

        const rawDomains = domainsRes.data || [];
        const rawLeads = leadsRes.data || [];
        const rawMembers = membersRes.data || [];

        const formattedDomains = rawDomains.map(domain => {
          const lead = rawLeads.find(l => l.domain_id === domain.id);
          const members = rawMembers.filter(m => m.domain_id === domain.id);

          const allEngineersInDomain = [];

          if (lead) {
            allEngineersInDomain.push({
              id: `lead-${lead.id}`,
              name: lead.name || 'TBA',
              role: lead.role_title || 'Domain Lead',
              photoUrl: lead.photo_url,
              isLead: true,
            });
          }

          members.forEach(m => {
            allEngineersInDomain.push({
              id: `member-${m.id}`,
              name: m.NAME || m.name || 'Unknown',
              role: 'Sub-Team Engineer', 
              photoUrl: m.photo_url,
              isLead: false,
            });
          });

          return {
            name: domain.name || 'General',
            icon: domain.icon || '⚙️',
            engineers: allEngineersInDomain
          };
        }).filter(group => group.engineers.length > 0);

        setGroupedRoster(formattedDomains);
      } catch (error) {
        console.error("Error gathering full team profiles:", error);
      } finally {
        setLoading(false); // Hide loader
      }
    }
    fetchCompleteRoster();
  }, []);

  return (
    <>
      <PageLoader isLoading={loading} />
      
      <main className="min-h-screen bg-black text-white py-16 md:py-24 px-6 md:px-12 relative">
        {/* Background atmosphere */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FFC600]/3 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#00C8E0]/3 blur-[130px] rounded-full pointer-events-none" />
        
        <div className="max-w-[1440px] mx-auto relative z-10">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 pb-6 border-b border-white/[0.06] flex flex-col sm:flex-row justify-between sm:items-end gap-4"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-[1px] w-12 bg-gradient-to-r from-[#00C8E0]/50 to-transparent" />
                <span className="text-[#00C8E0] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase">
                  Hexawatts Racing Sub-Teams
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase text-white">
                OUR{" "}
                <span className="text-[#FFC600] italic drop-shadow-[0_0_20px_rgba(255,198,0,0.4)]">
                  TEAM
                </span>
              </h1>
            </div>
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-white/50 hover:text-[#00C8E0] transition-colors bg-white/[0.03] border border-white/[0.08] px-5 py-2.5 rounded-full hover:border-[#00C8E0]/30 group"
            >
              <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
              BACK TO HOME
            </Link>
          </motion.div>

          {/* Domain Sections */}
          <div className="space-y-24">
            {groupedRoster.map((group, groupIndex) => (
              <motion.section 
                key={group.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: groupIndex * 0.1 }}
                className="space-y-8"
              >
                
                {/* Domain Header */}
                <div className="flex items-center gap-4">
                  <div className="w-[3px] h-8 bg-gradient-to-b from-[#FFC600] to-[#FFC600]/20 rounded-full" />
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{group.icon}</span>
                    <h2 className="text-2xl md:text-3xl font-black uppercase text-white tracking-tight">
                      {group.name}
                      <span className="text-white/20 font-normal text-lg ml-2">Domain</span>
                    </h2>
                  </div>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-white/[0.06] to-transparent" />
                  <span className="text-[10px] font-bold text-white/20 tracking-wider uppercase bg-white/[0.02] border border-white/[0.06] px-3 py-1 rounded-full">
                    {group.engineers.length} Members
                  </span>
                </div>

                {/* Members Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {group.engineers.map((engineer, index) => (
                    <motion.div
                      key={engineer.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -6 }}
                      className="group relative bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl overflow-hidden flex flex-col transition-all duration-500 hover:shadow-[0_8px_40px_rgba(0,200,224,0.1)] hover:border-[#00C8E0]/20"
                    >
                      {/* Left accent line */}
                      <div className={`absolute left-0 top-4 bottom-4 w-[2px] rounded-full transition-all duration-500 ${
                        engineer.isLead 
                          ? 'bg-gradient-to-b from-[#FFC600] via-[#FFC600]/50 to-transparent opacity-70' 
                          : 'bg-gradient-to-b from-transparent via-white/[0.06] to-transparent group-hover:via-[#00C8E0]/30'
                      }`} />

                      {/* Photo Area */}
                      <div className="relative aspect-square sm:aspect-[4/5] w-full bg-black/40 overflow-hidden border-b border-white/[0.06] flex items-center justify-center">
                        {engineer.photoUrl ? (
                          <img 
                            src={engineer.photoUrl} 
                            alt={engineer.name}
                            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div 
                            className="w-full h-full flex flex-col items-center justify-center"
                            style={{
                              background: `linear-gradient(135deg, rgba(30,58,110,0.6) 0%, rgba(13,26,58,0.4) 100%)`,
                            }}
                          >
                            <span className="text-5xl font-bold opacity-30 tracking-widest font-mono text-white">
                              {getInitials(engineer.name)}
                            </span>
                          </div>
                        )}
                        
                        {/* Hover glow */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#00C8E0]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        
                        {/* Lead Badge */}
                        {engineer.isLead && (
                          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-[#FFC600] px-3 py-1.5 rounded-lg text-[9px] font-bold tracking-widest shadow-lg border border-[#FFC600]/30 uppercase flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-[#FFC600] rounded-full shadow-[0_0_6px_rgba(255,198,0,0.6)]" />
                            LEAD
                          </div>
                        )}

                        {/* Corner dot */}
                        <div className={`absolute top-3 right-3 w-2 h-2 rounded-full transition-all duration-500 ${
                          engineer.isLead 
                            ? 'bg-[#FFC600] shadow-[0_0_8px_rgba(255,198,0,0.6)]' 
                            : 'bg-white/[0.1] group-hover:bg-[#00C8E0]/50'
                        }`} />
                      </div>

                      {/* Info Section */}
                      <div className="p-5 flex-1 flex flex-col justify-start bg-transparent">
                        <h3 className="font-bold text-white text-base md:text-lg leading-tight mb-1 group-hover:text-[#00C8E0] transition-colors duration-300">
                          {engineer.name}
                        </h3>
                        <p className={`text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                          engineer.isLead 
                            ? 'text-[#FFC600]/70 group-hover:text-[#FFC600]' 
                            : 'text-white/40 group-hover:text-white/60'
                        }`}>
                          {engineer.role}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

              </motion.section>
            ))}
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-24 pt-8 border-t border-white/[0.06] text-center"
          >
            <Link 
              href="/" 
              className="inline-flex items-center gap-3 text-white/30 hover:text-[#FFC600] transition-colors duration-300 group"
            >
              <span className="text-xs font-bold tracking-[0.3em] uppercase">← Back to Home</span>
              <span className="w-8 h-[1px] bg-white/20 group-hover:bg-[#FFC600] group-hover:w-12 transition-all duration-300" />
            </Link>
          </motion.div>

        </div>
      </main>
    </>
  );
}