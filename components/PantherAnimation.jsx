import Image from "next/image";


export default function PantherAnimation({
  opacity = 0.75,
  glowColor = '#00DCC8',
}) {
 





  return (
    <div
      id="panther-overlay"
      aria-hidden="true"
      /* 
         Increased width percentages to make the panther significantly larger
         while still remaining fully responsive.
      */
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0 
                 w-[95%] sm:w-[85%] md:w-[75%] lg:w-[70%] xl:w-[65%] aspect-square"
      style={{
        opacity: opacity,
        filter: `drop-shadow(0 0 30px ${glowColor}40)`,
      }}
    >
      <Image
  src="/images/background2.webp"
  alt="Hexawatts Panther"
  fill
  priority
  sizes="(max-width: 768px) 95vw, (max-width: 1200px) 75vw, 65vw"
  fetchPriority="high"
  className="object-contain"
/>
    </div>
  );
}