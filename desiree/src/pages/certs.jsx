import { Award } from 'lucide-react';

// =============================================
// CERTIFICATE DATA - Add your certificate images here
// Place images in /public/certs/ directory
// Use landscape orientation photos for best results
// =============================================
const certificates = [
  { src: '/certs/Academic Excellence Award.jpg', alt: 'Academic Excellence Award' },
  { src: '/certs/Certificate Of Recognition.jpg', alt: 'Certificate Of Recognition' },
  { src: '/certs/Certificate Of Recognition(1).jpg', alt: 'Certificate Of Recognition' },
  { src: '/certs/Certificate Of Recognition(2).jpg', alt: 'Certificate Of Recognition' },
  { src: '/certs/Certificate Of Recognition(3).jpg', alt: 'Certificate Of Recognition' },
  { src: '/certs/Certificate Of Recognition(4).jpg', alt: 'Certificate Of Recognition' },
  { src: '/certs/Certificate Of Recognition(5).jpg', alt: 'Certificate Of Recognition' },
  { src: '/certs/Certificate Of Recognition(6).jpg', alt: 'Certificate Of Recognition' },
  { src: '/certs/Certification Of Achievement.jpg', alt: 'Certification Of Achievement' },
  { src: '/certs/Senior High School Diploma.jpg', alt: 'Senior High School Diploma' },
];

// Split into two rows for the dual-lane marquee
const row1 = certificates.filter((_, i) => i % 2 === 0);
const row2 = certificates.filter((_, i) => i % 2 === 1);

const MarqueeRow = ({ items, direction = 'left', speed = 30 }) => {
  // Duplicate items enough times for seamless loop
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div className="overflow-hidden w-full">
      <div
        className={`flex gap-6 w-max ${direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {repeated.map((cert, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[420px] h-[300px] rounded-2xl overflow-hidden bg-[#080707] group transition-all duration-300 relative"
          >
            <div className="absolute inset-0 z-10 pointer-events-none" style={{
              background: 'linear-gradient(to right, #080707, transparent 8%, transparent 92%, #080707)'
            }} />
            <img
              src={cert.src}
              alt={cert.alt}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `
                  <div class="w-full h-full flex flex-col items-center justify-center bg-[#111] text-gray-500 p-6">
                    <svg class="w-10 h-10 mb-3 text-[#db0a0a]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                    </svg>
                    <span class="text-xs text-center leading-relaxed">${cert.alt}</span>
                  </div>`;
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

function Certs() {
  return (
    <section className="bg-[#080707] text-white py-20 font-sans overflow-hidden" id="certifications">
      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-left {
          animation: marquee-left linear infinite;
        }
        .animate-marquee-right {
          animation: marquee-right linear infinite;
        }
        .animate-marquee-left:hover,
        .animate-marquee-right:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-[1600px] mx-auto px-2 lg:px-12 mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Award className="w-6 h-6 text-[#db0a0a]" />
          <h3 className="text-4xl lg:text-4xl font-bold text-white">Certifications & Awards</h3>
        </div>
        <div className="w-20 h-1 bg-[#db0a0a]"></div>
        <p className="text-gray-400 mt-4 text-lg font-light max-w-2xl">
          A showcase of professional certifications and recognitions earned throughout my career.
        </p>
      </div>

      {/* Two-row scrolling marquee */}
      <div className="space-y-6">
        <MarqueeRow items={row1} direction="left" speed={35} />
        <MarqueeRow items={row2} direction="right" speed={40} />
      </div>
    </section>
  );
}

export default Certs;
