'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
    : null;

export const TEAL    = '#00C8E0';
export const NAVY    = '#0D1A3A';
export const NAVY_EL = '#1E3A6E';
export const YELLOW  = '#FFC600';

const PLACEHOLDER_SVG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'><stop offset='0%25' style='stop-color:%231E3A6E'/><stop offset='100%25' style='stop-color:%230D1A3A'/></linearGradient></defs><rect width='100' height='100' fill='url(%23g)'/><circle cx='50' cy='38' r='18' fill='%23FFFFFF18'/><ellipse cx='50' cy='82' rx='28' ry='20' fill='%23FFFFFF10'/></svg>`;

export function getInitials(name = '') {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ------------------------------------------------------------------
// MENTOR CARD - Bigger
// ------------------------------------------------------------------
function MentorCard({ mentor }) {
  return (
    <div
      className="group relative flex-shrink-0 w-[235px] h-[340px] rounded-xl overflow-hidden flex flex-col
        border border-[#FFC600]/20 
        bg-black
        shadow-[0_4px_24px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,198,0,0.1)]
        transition-all duration-300 ease-out
        hover:-translate-y-2 hover:shadow-[0_8px_32px_rgba(255,198,0,0.15),0_0_0_1px_rgba(255,198,0,0.2)]
        hover:border-[#FFC600]/40
        cursor-default select-none mx-auto"
    >
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FFC600]/40 to-transparent z-10 pointer-events-none" />

      <div className="relative w-full h-[225px] overflow-hidden bg-black/60 flex-shrink-0">
        <img
          src={mentor.photo_url || PLACEHOLDER_SVG}
          alt={mentor.name}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={e => { e.currentTarget.src = PLACEHOLDER_SVG; }}
        />
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

        <div className="absolute top-2 left-2 flex items-center gap-1 bg-[#FFC600] text-black px-2 py-[3px] rounded-md text-[9px] font-black tracking-widest uppercase shadow-[0_2px_8px_rgba(255,198,0,0.5)] z-10">
          <svg width="8" height="8" viewBox="0 0 10 10" fill="currentColor">
            <polygon points="5,0 6.5,3.5 10,4 7.5,6.5 8.5,10 5,8 1.5,10 2.5,6.5 0,4 3.5,3.5"/>
          </svg>
          MENTOR
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-4 py-3 text-center">
        <p className="text-[16px] font-bold text-white leading-tight break-words" title={mentor.name}>
          {mentor.name || 'TBA'}
        </p>
        {mentor.role && (
          <p className="text-[11px] text-[#FFC600]/80 font-medium mt-1 leading-snug break-words" title={mentor.role}>
            {mentor.role}
          </p>
        )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// CAPTAIN CARD
// ------------------------------------------------------------------
function CaptainCard({ captain }) {
  return (
    <div
      className="group relative flex-shrink-0 w-[200px] h-[290px] rounded-xl overflow-hidden flex flex-col
        border border-[#FFC600]/20 
        bg-black
        shadow-[0_4px_24px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,198,0,0.1)]
        transition-all duration-300 ease-out
        hover:-translate-y-2 hover:shadow-[0_8px_32px_rgba(255,198,0,0.15),0_0_0_1px_rgba(255,198,0,0.2)]
        hover:border-[#FFC600]/40
        cursor-default select-none mx-auto"
    >
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FFC600]/40 to-transparent z-10 pointer-events-none" />

      <div className="relative w-full h-[190px] overflow-hidden bg-black/60 flex-shrink-0">
        <img
          src={captain.photo_url || PLACEHOLDER_SVG}
          alt={captain.name}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={e => { e.currentTarget.src = PLACEHOLDER_SVG; }}
        />
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

        <div className="absolute top-2 left-2 flex items-center gap-1 bg-[#FFC600] text-black px-2 py-[3px] rounded-md text-[8px] font-black tracking-widest uppercase shadow-[0_2px_8px_rgba(255,198,0,0.5)] z-10">
          <svg width="8" height="8" viewBox="0 0 10 10" fill="currentColor">
            <polygon points="5,0 6.5,3.5 10,4 7.5,6.5 8.5,10 5,8 1.5,10 2.5,6.5 0,4 3.5,3.5"/>
          </svg>
          {captain.role || 'LEADERSHIP'}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-4 py-3 text-center">
        <p className="text-[15px] font-bold text-white leading-tight break-words" title={captain.name}>
          {captain.name || 'TBA'}
        </p>
        {captain.role && (
          <p className="text-[10px] text-[#FFC600]/80 font-medium mt-1 leading-snug break-words" title={captain.role}>
            {captain.role}
          </p>
        )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// MEMBER CARD
// ------------------------------------------------------------------
function MemberCard({ member, isLead = false }) {
  const cardH   = isLead ? 'h-[235px]'  : 'h-[210px]';
  const cardW   = isLead ? 'w-[165px]'  : 'w-[148px]';
  const imgH    = isLead ? 'h-[160px]'  : 'h-[142px]';
  const nameSize = isLead ? 'text-[13px]' : 'text-[11px]';

  return (
    <div
      className={`
        group relative flex-shrink-0 ${cardW} ${cardH} rounded-xl overflow-hidden flex flex-col
        border border-white/[0.10] 
        bg-black
        shadow-[0_4px_24px_rgba(0,0,0,0.45)]
        transition-all duration-300 ease-out
        hover:-translate-y-2 hover:shadow-[0_8px_32px_rgba(255,198,0,0.18)]
        hover:border-[#FFC600]/30
        cursor-default select-none
        ${isLead ? 'ring-1 ring-[#FFC600]/30 shadow-[0_4px_24px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,198,0,0.15)]' : ''}
      `}
    >
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10 pointer-events-none" />

      <div className={`relative w-full ${imgH} overflow-hidden bg-black/60 flex-shrink-0`}>
        <img
          src={member.photoUrl || PLACEHOLDER_SVG}
          alt={member.name}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={e => { e.currentTarget.src = PLACEHOLDER_SVG; }}
        />
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

        {isLead && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-[#FFC600] text-black px-2 py-[3px] rounded-md text-[8px] font-black tracking-widest uppercase shadow-[0_2px_8px_rgba(255,198,0,0.5)] z-10">
            <svg width="7" height="7" viewBox="0 0 10 10" fill="currentColor">
              <polygon points="5,0 6.5,3.5 10,4 7.5,6.5 8.5,10 5,8 1.5,10 2.5,6.5 0,4 3.5,3.5"/>
            </svg>
            LEAD
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center px-3 py-2">
        <p className={`${nameSize} font-bold text-white leading-tight break-words`} title={member.name}>
          {member.name || 'TBA'}
        </p>
        {isLead && member.role && (
          <p className="text-[9px] text-[#FFC600]/70 font-medium mt-0.5 break-words" title={member.role}>
            {member.role}
          </p>
        )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// DOMAIN ROW
// ------------------------------------------------------------------
function DomainRow({ domain, index }) {
  const scrollRef = useRef(null);
  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, [domain.id]);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  const totalMembers = 1 + domain.members.length;
  const accent = '#FFC600';

  return (
    <div className="relative">
      <div className="flex flex-col items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full flex-shrink-0 bg-[#FFC600] shadow-[0_0_8px_rgba(255,198,0,0.6)]" />
          <div className="flex items-center gap-2">
            <span className="text-base leading-none">{domain.icon}</span>
            <span className="text-xs font-black tracking-[0.18em] uppercase text-[#FFC600]">{domain.name}</span>
          </div>
          <div className="hidden sm:block h-[1px] w-20 bg-gradient-to-r from-[#FFC600]/40 to-transparent" />
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10px] text-white/25 font-bold tracking-widest uppercase">
            {totalMembers} {totalMembers === 1 ? 'Member' : 'Members'}
          </span>
          <button onClick={() => scroll(-1)} disabled={!canScrollLeft} className="w-7 h-7 rounded-lg border border-white/[0.08] bg-white/[0.04] flex items-center justify-center text-white/40 disabled:opacity-20 hover:enabled:bg-white/[0.10] hover:enabled:text-white hover:enabled:border-white/20 transition-all duration-200" aria-label="Scroll left">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="8,2 4,6 8,10"/></svg>
          </button>
          <button onClick={() => scroll(1)} disabled={!canScrollRight} className="w-7 h-7 rounded-lg border border-white/[0.08] bg-white/[0.04] flex items-center justify-center text-white/40 disabled:opacity-20 hover:enabled:bg-white/[0.10] hover:enabled:text-white hover:enabled:border-white/20 transition-all duration-200" aria-label="Scroll right">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="4,2 8,6 4,10"/></svg>
          </button>
        </div>
      </div>

      <div className="relative">
        {canScrollLeft && <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none rounded-l-xl" />}
        {canScrollRight && <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none rounded-r-xl" />}

        <div ref={scrollRef} className="no-scrollbar flex justify-center gap-3 overflow-x-auto pb-2" style={{ scrollSnapType: 'x proximity', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div style={{ scrollSnapAlign: 'start' }} className="flex-shrink-0">
            <MemberCard member={domain.lead} isLead={true} />
          </div>

          <div className="flex-shrink-0 self-stretch flex items-center">
            <div className="w-[1px] h-3/4 rounded-full bg-gradient-to-b from-transparent via-[#FFC600]/50 to-transparent" />
          </div>

          {domain.members.map((m, i) => (
            <div key={i} style={{ scrollSnapAlign: 'start' }} className="flex-shrink-0">
              <MemberCard member={m} />
            </div>
          ))}

          <div className="flex-shrink-0 w-4" />
        </div>
      </div>

      <div className="mt-6 h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    </div>
  );
}

// ------------------------------------------------------------------
// MAIN TEAM SECTION
// ------------------------------------------------------------------
export default function Team() {
  const [domains, setDomains] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [captains, setCaptains] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeamData() {
      if (!supabase) {
        console.error('Supabase client not initialized — missing env vars.');
        setLoading(false);
        return;
      }

      try {
        const [domainsRes, leadsRes, membersRes, mentorsRes, captainsRes] = await Promise.all([
          supabase.from('domains').select('*').order('display_order'),
          supabase.from('team_leads').select('*'),
          supabase.from('members').select('*'),
          supabase.from('mentors').select('*').order('display_order'),
          supabase.from('captains').select('*').order('display_order'),
        ]);

        const rawDomains  = domainsRes.data  || [];
        const rawLeads    = leadsRes.data    || [];
        const rawMembers  = membersRes.data  || [];
        const rawMentors  = mentorsRes.data  || [];
        const rawCaptains = captainsRes.data || [];

        if (rawMentors) setMentors(rawMentors);
        if (rawCaptains) setCaptains(rawCaptains);

        const formatted = rawDomains.map(domain => {
          const lead    = rawLeads.find(l => l.domain_id === domain.id) || {};
          const members = rawMembers.filter(m => m.domain_id === domain.id);
          return {
            id:   domain.id,
            name: domain.name        || 'UNKNOWN',
            icon: domain.icon        || '⚙️',
            desc: domain.description || '',
            lead: {
              name:     lead.name       || 'TBA',
              role:     lead.role_title || 'Lead',
              photoUrl: lead.photo_url  || null,
            },
            members: members.map(m => ({
              name:     m.NAME || m.name || '',
              photoUrl: m.photo_url || null,
            })),
          };
        });

        setDomains(formatted.filter(d => d.members.length > 0 || d.lead.name !== 'TBA'));
      } catch (err) {
        console.error('Error fetching team data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTeamData();
  }, []);

  return (
    <section className="relative py-20 md:py-28 px-6 md:px-10 max-w-[1440px] mx-auto overflow-hidden" id="team">
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}`}</style>

      <div className="pointer-events-none select-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-32 right-0 w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,198,0,0.05) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 -left-20 w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,198,0,0.04) 0%, transparent 70%)' }} />
        <svg className="absolute inset-0 w-full h-full opacity-[0.035]" preserveAspectRatio="xMidYMid slice">
          {Array.from({ length: 18 }).map((_, i) => (
            <line key={i} x1={`${-10 + i * 7}%`} y1="0%" x2={`${10 + i * 7}%`} y2="100%" stroke="#FFC600" strokeWidth="1" />
          ))}
        </svg>
      </div>

      <div className="relative mb-14">
        <span className="text-[#FFC600] text-[10px] font-black tracking-[0.25em] uppercase block mb-3">The Human Element</span>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <Link href="/team" className="group inline-block">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase leading-none tracking-tight group-hover:text-[#FFC600] transition-colors duration-200">
              MEET THE{' '}
              <span className="italic" style={{ color: YELLOW, textShadow: '0 0 40px rgba(255,198,0,0.35)' }}>TEAM</span>
            </h2>
          </Link>
          {!loading && domains.length > 0 && (
            <div className="flex items-center gap-2 bg-black border border-white/[0.08] rounded-full px-4 py-2 self-start sm:self-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFC600] shadow-[0_0_6px_#FFC600]" />
              <span className="text-[11px] font-bold text-white/50 tracking-widest uppercase">{domains.length} Domains</span>
            </div>
          )}
        </div>
        <div className="mt-5 flex items-center gap-3">
          <div className="h-[2px] w-16 bg-[#FFC600] rounded-full" />
          <div className="h-[1px] flex-1 bg-gradient-to-r from-white/[0.06] to-transparent" />
        </div>
      </div>

      {loading && (
        <div className="flex flex-col gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-3 w-32 bg-white/[0.06] rounded mb-4" />
              <div className="flex gap-3">
                {[1, 2, 3, 4].map(j => (
                  <div key={j} className="w-[142px] h-[200px] bg-black border border-white/[0.06] rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mentors Row */}
      {!loading && mentors.length > 0 && (
        <div className="relative z-10 mb-10">
          <div className="flex flex-col items-center mb-5">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full flex-shrink-0 bg-[#FFC600] shadow-[0_0_8px_rgba(255,198,0,0.6)]" />
              <span className="text-xs font-black tracking-[0.18em] uppercase text-[#FFC600]">Our Mentors</span>
              <div className="hidden sm:block h-[1px] w-20 bg-gradient-to-r from-[#FFC600]/40 to-transparent" />
            </div>
          </div>

          <div className="flex justify-center gap-5 overflow-x-auto pb-2 no-scrollbar">
            {mentors.map((mentor) => (
              <div key={mentor.id} className="flex-shrink-0">
                <MentorCard mentor={mentor} />
              </div>
            ))}
            <div className="flex-shrink-0 w-4" />
          </div>

          <div className="mt-8 h-[1px] bg-gradient-to-r from-[#FFC600]/20 via-white/[0.06] to-transparent" />
        </div>
      )}

      {/* Captains Row */}
      {!loading && captains.length > 0 && (
        <div className="relative z-10 mb-10">
          <div className="flex flex-col items-center mb-5">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full flex-shrink-0 bg-[#FFC600] shadow-[0_0_8px_rgba(255,198,0,0.6)]" />
              <span className="text-xs font-black tracking-[0.18em] uppercase text-[#FFC600]">Team Leadership</span>
              <div className="hidden sm:block h-[1px] w-20 bg-gradient-to-r from-[#FFC600]/40 to-transparent" />
            </div>
          </div>

          <div className="flex justify-center gap-5 overflow-x-auto pb-2 no-scrollbar">
            {captains.map((captain) => (
              <div key={captain.id} className="flex-shrink-0">
                <CaptainCard captain={captain} />
              </div>
            ))}
            <div className="flex-shrink-0 w-4" />
          </div>

          <div className="mt-8 h-[1px] bg-gradient-to-r from-[#FFC600]/20 via-white/[0.06] to-transparent" />
        </div>
      )}

      {/* Domain Rows */}
      {!loading && (
        <div className="relative z-10 flex flex-col gap-12">
          {domains.map((domain, i) => (   
            <DomainRow key={domain.id} domain={domain} index={i} />
          ))}
          {domains.length === 0 && (
            <p className="text-white/20 text-sm font-medium tracking-wide">No team data available yet.</p>
          )}
        </div>
      )}
    </section>
  );
}