'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { motion } from 'framer-motion';

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Constants
export const TEAL    = '#00C8E0';
export const NAVY    = '#0D1A3A';
export const NAVY_EL = '#1E3A6E';

// Helper function for fallback initials
export function getInitials(name = '') {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ------------------------------------------------------------------
// 1. DOMAIN CARD COMPONENT - Glassy with Yellow + Cyan Accents + Avatar Stack
// ------------------------------------------------------------------
function DomainCard({ domain }) {
  return (
    <div className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-xl flex flex-col overflow-hidden transition-all duration-500 hover:shadow-[0_8px_40px_rgba(255,198,0,0.1)] hover:-translate-y-2 hover:border-[#FFC600]/20">
      
      {/* Left accent line - Yellow */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#FFC600] via-[#FFC600]/50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500 z-10" />
      
      {/* Top Section: Large Rectangular Photo */}
      <div className="relative w-full aspect-[4/3] bg-black/40 flex items-center justify-center overflow-hidden border-b border-white/[0.06]">
        {domain.lead.photoUrl ? (
          <img
            src={domain.lead.photoUrl}
            alt={domain.lead.name}
            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div 
            className="w-full h-full flex flex-col items-center justify-center"
            style={{ background: `linear-gradient(135deg, rgba(30,58,110,0.6) 0%, rgba(13,26,58,0.4) 100%)` }}
          >
            <span className="text-5xl font-bold opacity-40 tracking-widest font-mono text-white">
              {getInitials(domain.lead.name)}
            </span>
          </div>
        )}
        
        {/* Floating Domain Tag - Yellow accent */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-[#FFC600] px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest shadow-lg border border-[#FFC600]/20 uppercase flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-[#FFC600] rounded-full shadow-[0_0_6px_rgba(255,198,0,0.6)]" />
          {domain.icon} {domain.name}
        </div>

        {/* Hover glow effect - Yellow/Cyan mix */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFC600]/5 via-transparent to-[#00C8E0]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>

      {/* Bottom Section: Name and Designation */}
      <div className="p-5 flex flex-col justify-start text-left bg-transparent flex-1">
        <h3 className="font-sans font-bold text-white text-lg md:text-xl leading-tight mb-1.5 group-hover:text-[#FFC600] transition-colors duration-300">
          {domain.lead.name}
        </h3>
        <p className="text-sm text-white/50 font-medium group-hover:text-white/70 transition-colors duration-300">
          {domain.lead.role}
        </p>

        {/* 🆕 Member Avatar Stack */}
        {domain.members.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="flex -space-x-2">
              {domain.members.slice(0, 4).map((member, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-black bg-gradient-to-br from-[#1E3A6E] to-[#0D1A3A] flex items-center justify-center text-[8px] font-bold text-white/60 hover:text-white hover:scale-110 transition-all duration-300 cursor-default"
                  title={member.name}
                >
                  {getInitials(member.name)}
                </div>
              ))}
              {domain.members.length > 4 && (
                <div className="w-8 h-8 rounded-full border-2 border-black bg-white/[0.08] flex items-center justify-center text-[8px] font-bold text-white/50">
                  +{domain.members.length - 4}
                </div>
              )}
            </div>
            <span className="text-[10px] text-white/20 font-bold tracking-wider uppercase">
              {domain.members.length} {domain.members.length === 1 ? 'Member' : 'Members'}
            </span>
          </div>
        )}

        {/* ✅ REMOVED: "View Team" line from here */}
      </div>

      {/* Corner accent dot - Yellow */}
      <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#FFC600]/30 group-hover:bg-[#FFC600] group-hover:shadow-[0_0_10px_rgba(255,198,0,0.6)] transition-all duration-500 z-10" />

    </div>
  );
}

// ------------------------------------------------------------------
// 2. MAIN PAGE COMPONENT
// ------------------------------------------------------------------
export default function Team() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeamData() {
      try {
        const [domainsRes, leadsRes, membersRes] = await Promise.all([
          supabase.from('domains').select('*').order('display_order'),
          supabase.from('team_leads').select('*'),
          supabase.from('members').select('*'),
        ]);

        const rawDomains  = domainsRes.data  || [];
        const rawLeads    = leadsRes.data    || [];
        const rawMembers  = membersRes.data  || [];

        const formattedDomains = rawDomains.map(domain => {
          const lead = rawLeads.find(l => l.domain_id === domain.id) || { name: 'TBA', role_title: 'Lead' };
          const members = rawMembers.filter(m => m.domain_id === domain.id);

          return {
            id:   domain.id,
            name: domain.name        || 'UNKNOWN',
            icon: domain.icon        || '⚙️',
            desc: domain.description || '',
            lead: {
              name:        lead.name       || 'TBA',
              role:        lead.role_title || 'Lead',
              photoUrl:    lead.photo_url  || null,
            },
            members: members.map(m => ({
              name:     m.NAME || m.name || '',
              photoUrl: m.photo_url  || null,
            })),
          };
        });

        setDomains(formattedDomains.filter(d => d.members.length > 0 || d.lead.name !== 'TBA'));
      } catch (err) {
        console.error("Error fetching team data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTeamData();
  }, []);

  if (loading) {
    return (
      <section className="py-16 md:py-24 px-6 md:px-8 max-w-[1440px] mx-auto min-h-[400px] flex items-center justify-center" id="team">
        <div className="font-bold tracking-widest uppercase text-xs animate-pulse text-white/40">
          Loading Team Roster…
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 px-6 md:px-8 max-w-[1440px] mx-auto relative" id="team">
      {/* Background accent - Yellow & Cyan glow orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFC600]/3 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#00C8E0]/3 blur-[100px] rounded-full pointer-events-none" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 border-b border-white/[0.06] pb-6">
        <div>
          <span className="font-bold text-[#00C8E0] tracking-widest uppercase mb-2 block text-xs">
            The Human Element
          </span>
          <Link href="/team" className="group inline-block">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase cursor-pointer group-hover:text-[#FFC600] transition-colors duration-200 tracking-tight">
              MEET THE <span className="text-[#FFC600] italic drop-shadow-[0_0_20px_rgba(255,198,0,0.4)]">LEADS</span>
            </h2>
          </Link>
          <div className="mt-4 w-24 h-[2px] bg-gradient-to-r from-[#FFC600] to-transparent" />
        </div>
      </div>

      {/* Glass Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {domains.map(domain => (
          <DomainCard key={domain.id} domain={domain} />
        ))}
      </div>
    </section>
  );
}