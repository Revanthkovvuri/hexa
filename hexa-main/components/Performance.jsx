const STATS = [
  { value: "04", label: "Overall Rank", desc: "Formula Bharath 2023 Electric Category" },
  { value: "01", label: "Design Winner", desc: "Best Mechanical Packaging & Chassis Rigidity" },
  { value: "4.2s", label: "Acceleration", desc: "0-75m Sprint Time at Kari Motor Speedway" },
];

export default function Performance() {
  // FIX 1: Removed bg-white from section so it remains dark/transparent
  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-transparent" id="performance">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 -skew-x-12 translate-x-1/2" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-8 relative z-10">
        <div className="mb-16">
          <h2 className="font-headline-md md:font-headline-lg text-white uppercase italic">
            TRACK <span className="text-primary">LEGACY</span>
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {STATS.map((stat) => (
            /* FIX 2: Removed /40 and /70 to make the background 100% solid. Added a shadow-lg for better depth. */
            <div
              key={stat.value}
              className="border-l-2 border-navy-elevated p-8 bg-navy-elevated hover:bg-[#1E3A6E] shadow-lg transition-all duration-300"
            >
              <h3 className="font-data-mono text-primary text-4xl mb-4">{stat.value}</h3>
              <p className="font-label-caps text-navy-muted uppercase tracking-widest mb-2">
                {stat.label}
              </p>
              <p className="text-white font-body-md">{stat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}