import {
  ArrowLeft, ChevronLeft, ChevronRight, Code, ExternalLink,
  GitBranch, Image as ImageIcon,
  Loader2,
  Maximize2, Palette,
  PenTool, X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLazyLoad } from '../hooks/useLazyLoad';

// ==========================================
// 1. CUSTOM COMPONENT: SMART CAROUSEL LOADER
// ==========================================
const ImageWithLoader = ({ src, alt, className, containerClassName, onClick }) => {
  const images = Array.isArray(src) ? src : [src];
  const isMulti = images.length > 1;

  const [loadedCount, setLoadedCount] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(1);
  const scrollRef = useRef(null);

  const isLoading = loadedCount < 1;

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const width = scrollRef.current.offsetWidth;
      const index = Math.round(scrollLeft / width) + 1;
      setCurrentSlide(index);
    }
  };

  const handleImageLoad = () => {
    setLoadedCount((prev) => prev + 1);
  };

  const scrollPrev = (e) => {
    e.stopPropagation();
    if (scrollRef.current) {
      const width = scrollRef.current.offsetWidth;
      scrollRef.current.scrollBy({ left: -width, behavior: 'smooth' });
    }
  };

  const scrollNext = (e) => {
    e.stopPropagation();
    if (scrollRef.current) {
      const width = scrollRef.current.offsetWidth;
      scrollRef.current.scrollBy({ left: width, behavior: 'smooth' });
    }
  };

  return (
    <div 
      className={`relative overflow-hidden bg-[#1a1a1a] group ${containerClassName}`}
      onClick={onClick}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-[#1a1a1a]">
          <Loader2 className="w-8 h-8 text-[#db0a0a] animate-spin" />
        </div>
      )}

      {isMulti && !isLoading && (
        <>
          <button
            onClick={scrollPrev}
            disabled={currentSlide === 1}
            className={`absolute left-2 top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-full bg-black/50 text-white backdrop-blur-sm border border-white/10 transition-all duration-200 hover:bg-[#db0a0a] disabled:opacity-0 disabled:pointer-events-none opacity-0 group-hover:opacity-100`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={scrollNext}
            disabled={currentSlide === images.length}
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-full bg-black/50 text-white backdrop-blur-sm border border-white/10 transition-all duration-200 hover:bg-[#db0a0a] disabled:opacity-0 disabled:pointer-events-none opacity-0 group-hover:opacity-100`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className={`flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-700`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} 
      >
        {images.map((imgSrc, index) => (
          <div key={index} className="w-full flex-shrink-0 h-full snap-center relative flex items-center justify-center">
            <img
              src={imgSrc}
              alt={`${alt} - view ${index + 1}`}
              loading="lazy"
              decoding="async"
              onLoad={handleImageLoad}
              className={`${className} block`}
            />
          </div>
        ))}
      </div>

      {isMulti && !isLoading && (
        <div className="absolute bottom-3 right-3 z-30 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full border border-white/10 pointer-events-none">
          {currentSlide} / {images.length}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 1b. LAZY MASONRY ITEM - only loads image when scrolled into view
// ==========================================
const LazyMasonryItem = ({ item, activeTab, onClick }) => {
  const [ref, isVisible] = useLazyLoad({ rootMargin: '300px' });
  return (
    <div
      ref={ref}
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl bg-[#0f0f0f] border border-white/5 cursor-pointer"
    >
      {isVisible ? (
        <ImageWithLoader
          src={item.image}
          alt={item.title}
          className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
          containerClassName="w-full h-full"
        />
      ) : (
        <div className="w-full aspect-[3/4] bg-[#1a1a1a]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-20 pointer-events-none">
        <span className="text-[#db0a0a] text-[10px] font-bold uppercase tracking-wider mb-1">{item.category}</span>
        <h3 className="text-sm font-bold text-white mb-1 leading-tight">{item.title}</h3>
        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono border-t border-white/10 pt-2 mt-1">
          {activeTab === 'art' ? <ImageIcon className="w-3 h-3" /> : <PenTool className="w-3 h-3" />}
          {item.tools}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
const Projects = () => {
  const [activeTab, setActiveTab] = useState('dev');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isFullView, setIsFullView] = useState(false);
  
  // PAGINATION STATE
  const [currentDevPage, setCurrentDevPage] = useState(1);
  const [direction, setDirection] = useState('right');
  
  // MASONRY STATE
  const [numCols, setNumCols] = useState(2);

  // --- RESIZE HANDLER FOR MASONRY ---
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) setNumCols(5);
      else if (width >= 768) setNumCols(3);
      else setNumCols(2);
    };
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getDistributedColumns = (items) => {
    const columns = Array.from({ length: numCols }, () => []);
    items.forEach((item, index) => {
      columns[index % numCols].push(item);
    });
    return columns;
  };

  const itemsPerPage = 6;

  useEffect(() => {
    if (selectedImage) {
      setIsFullView(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedImage]);


  // ==========================================
  // DATA SECTIONS
  // ==========================================
  const devProjects = [
    {
      id: 1,
      title: "BiteTrack",
      description: "Bitetrack is a modern nutrition tracker developed with a clean UI. Users can record meals, monitor calories and macros, and view personalized progress analytics.",
      tags: ["PHP", "TailwindCSS", "JavaScript", "MySQL", "HTML", "CSS", "InfinityFree"],
      links: { demo: "https://bitetrack.page.gd/", github: "https://github.com/mibiji224/BiteTrack" },
      image: [ "/img-bitetrack/01.jpg", "/img-bitetrack/02.jpg", "/img-bitetrack/03.jpg"]
    },
    {
      id: 2,
      title: "Personal Portfolio",
      description: "A responsive Single Page Application (SPA) designed to showcase my multidisciplinary work. Features include interactive modals, optimized image loading, and a custom dark aesthetic.",
      tags: ["React", "TailwindCSS", "Vite", "Node.js", "Javascipt", "Vercel"],
      links: { demo: "https://desireesoronio.vercel.app/", github: "https://github.com/mibiji224/Portfolio" },
      image: ["/img-drs/01.jpg", "/img-drs/02.jpg"]
    },
    {
      id: 3,
      title: "AMHere",
      description: "A modern attendance tracking web application built with Next.js and PostgreSQL. Features real-time check-ins, user management, and analytics dashboard for monitoring attendance records.",
      tags: ["Next.js", "PostgreSQL", "Prisma", "NeonDB", "TailwindCSS"],
      links: { demo: "#", github: "#" },
      image: ["/img-am-here/01.png", "/img-am-here/02.png", "/img-am-here/03.png", "/img-am-here/04.png", "/img-am-here/05.png", "/img-am-here/06.png", "/img-am-here/07.png", "/img-am-here/08.png", "/img-am-here/09.png", "/img-am-here/10.png", "/img-am-here/11.png", "/img-am-here/12.png", "/img-am-here/13.png"]
    },
    {
      id: 4,
      title: "XChange",
      description: "A marketplace platform connecting influencers and businesses. XChange streamlines brand collaborations by enabling businesses to discover and partner with content creators, manage campaigns, and process transactions seamlessly.",
      tags: ["Next.js", "Supabase", "Genkit", "GA4", "Square"],
      links: { demo: "https://app-delta-lemon-26.vercel.app/", github: "#" },
      image: [
        "/img-xchange/01.png",
        "/img-xchange/02.png",
        "/img-xchange/03.png",
        "/img-xchange/04.png",
        "/img-xchange/05.png",
        "/img-xchange/06.png",
        "/img-xchange/07.png",
        "/img-xchange/08.png",
        "/img-xchange/09.png"
      ]
    },
    {
      id: 5,
      title: "Coming Soon 5",
      description: "A top-secret project currently under wraps.",
      tags: ["Confidential"],
      links: { demo: "#", github: "#" },
      image: ["https://placehold.co/600x400/1a1a1a/db0a0a?text=Top+Secret"]
    },
    {
      id: 6,
      title: "Coming Soon 6",
      description: "A top-secret project currently under wraps.",
      tags: ["Confidential"],
      links: { demo: "#", github: "#" },
      image: ["https://placehold.co/600x400/1a1a1a/db0a0a?text=Top+Secret"]
    }
  ];

  const artProjects = artProjectsData; 

  const graphicProjects = [
    { title: "Marketing", category: "UI Design", tools: "Canva", image: "/graphics/09.jpg" },
    { title: "Marketing", category: "UI Design", tools: "Canva", image: "/graphics/11.jpg" },
    { title: "Marketing", category: "UI Design", tools: "Canva", image: "/graphics/10.jpg" },
    { title: "Marketing", category: "UI Design", tools: "Canva", image: "/graphics/12.jpeg" },
    { title: "Marketing", category: "UI Design", tools: "Canva", image: "/graphics/13.jpeg" },
    { title: "STEAM Empower Countdown", category: "Event Branding", tools: "Canva", image: "/graphics/01.jpg" }, 
    { title: "Girl Up Davao Board Meeting", category: "Publication Material", tools: "Canva", image: "/graphics/02.jpg" },
    { title: "Board Members of Girl Up Davao", category: "Social Media", tools: "Canva", image: "/graphics/03.jpg" },
    { title: "Annual Report Layout", category: "Editorial", tools: "InDesign", image: "/graphics/04.png" },
    { title: "Mobile App UI Kit", category: "UI Design", tools: "Figma", image: "/graphics/06.jpg" },
    { title: "Mobile App UI Kit v2", category: "UI Design", tools: "Figma", image: ["/graphics/07.jpg", "/graphics/08.jpg"] }
  ];

  // --- Pagination Logic ---
  const indexOfLastItem = currentDevPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDevProjects = devProjects.slice(indexOfFirstItem, indexOfLastItem);
  const totalDevPages = Math.ceil(devProjects.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber === currentDevPage) return;
    setDirection(pageNumber > currentDevPage ? 'right' : 'left');
    setCurrentDevPage(pageNumber);
  };
  
  const nextPage = () => {
    if (currentDevPage < totalDevPages) {
        setDirection('right');
        setCurrentDevPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentDevPage > 1) {
        setDirection('left');
        setCurrentDevPage(prev => prev - 1);
    }
  };

  return (
    <section className="bg-[#080707] text-white pt-10 pb-16 px-2 lg:px-12 font-sans" id="projects">

      {/* Styles for Animations & Scrollbars */}
      <style>{`
        .modern-scrollbar::-webkit-scrollbar { width: 6px; }
        .modern-scrollbar::-webkit-scrollbar-track { background: #1a1a1a; border-radius: 4px; }
        .modern-scrollbar::-webkit-scrollbar-thumb { background: #db0a0a; border-radius: 4px; }
        .modern-scrollbar::-webkit-scrollbar-thumb:hover { background: #ff1f1f; }
        
        .stagger-enter { animation-fill-mode: both; }

        /* Slide Animations */
        .slide-enter-right { 
          animation: slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
        .slide-enter-left { 
          animation: slideInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }

        @keyframes slideInRight {
          0% { opacity: 0; transform: translateX(30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeft {
          0% { opacity: 0; transform: translateX(-30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="max-w-[1600px] mx-auto">

        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <h3 className="text-4xl lg:text-4xl font-bold text-white mb-4">Projects</h3>
            <div className="w-20 h-1 bg-[#db0a0a]"></div>
          </div>

          <div className="bg-[#1a1a1a] p-1.5 rounded-xl w-full md:w-auto grid grid-cols-3 md:flex gap-1 border border-white/5">
            {['dev', 'art', 'graphics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === tab
                    ? 'bg-[#db0a0a] text-white shadow-[0_0_15px_rgba(219,10,10,0.4)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                {tab === 'dev' && <Code className="w-4 h-4" />}
                {tab === 'art' && <Palette className="w-4 h-4" />}
                {tab === 'graphics' && <PenTool className="w-4 h-4" />}
                <span className="capitalize">{tab === 'dev' ? 'Development' : tab === 'art' ? 'Creative Arts' : 'Graphics'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* --- DEVELOPMENT TAB --- */}
        {activeTab === 'dev' && (
          <div className="overflow-hidden">
            {/* The Grid of Projects */}
            <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {devProjects.map((project) => (
                <div
                    key={project.id}
                    onClick={() => setSelectedImage(project)}
                    className="group bg-[#0f0f0f] border border-white/5 rounded-xl overflow-hidden hover:border-[#db0a0a]/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="h-36 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] to-transparent z-10 opacity-60 pointer-events-none"></div>

                    <ImageWithLoader
                      src={project.image}
                      alt={project.title}
                      containerClassName="w-full h-full"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="absolute top-3 right-3 z-20 p-1.5 bg-black/50 backdrop-blur-md rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-3.5 h-3.5 text-[#db0a0a]" />
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-base font-bold text-white mb-1 group-hover:text-[#db0a0a] transition-colors">{project.title}</h3>
                    <p className="text-gray-400 text-xs mb-3 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 4).map((tag, idx) => (
                        <span key={idx} className="text-[10px] font-mono text-[#db0a0a] bg-[#db0a0a]/10 px-1.5 py-0.5 rounded border border-[#db0a0a]/20">{tag}</span>
                      ))}
                      {project.tags.length > 4 && (
                        <span className="text-[10px] font-mono text-gray-500 px-1.5 py-0.5">+{project.tags.length - 4}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- ARTS & GRAPHICS TABS (Masonry) --- */}
        {(activeTab === 'art' || activeTab === 'graphics') && (
          <div className="h-[800px] overflow-y-auto modern-scrollbar pr-2" style={{ overscrollBehavior: 'contain' }}>
            <div className="flex gap-4 items-start animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
              {getDistributedColumns(activeTab === 'art' ? artProjects : graphicProjects).map((columnItems, colIndex) => (
                <div key={colIndex} className="flex-1 flex flex-col gap-4">
                  {columnItems.map((item, index) => (
                    <LazyMasonryItem key={index} item={item} activeTab={activeTab} onClick={() => setSelectedImage(item)} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* LIGHTBOX MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className={`
              bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative transition-all duration-500 ease-in-out
              ${isFullView ? 'w-full max-w-5xl h-[90vh] flex flex-col' : 'w-full max-w-md block'}
            `}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 z-30 p-1.5 bg-black/50 text-white rounded-full hover:bg-[#db0a0a] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {isFullView ? (
              <div className="relative w-full h-full flex flex-col">
                <div className="flex-1 bg-black flex items-center justify-center overflow-hidden p-2">
                  <ImageWithLoader
                    src={selectedImage.image}
                    alt={selectedImage.title}
                    containerClassName="w-full h-full flex items-center justify-center bg-black"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="p-4 bg-[#1a1a1a] border-t border-white/10 flex justify-between items-center">
                  <h3 className="text-white font-bold text-lg truncate mr-4">{selectedImage.title}</h3>
                  <button
                    onClick={() => setIsFullView(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Details
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="relative h-64 w-full overflow-hidden bg-black group">
                  <ImageWithLoader
                    src={selectedImage.image}
                    alt={selectedImage.title}
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="p-6">
                  <span className="text-[#db0a0a] text-xs font-bold uppercase tracking-wider mb-2 block">
                    {selectedImage.category ? selectedImage.category : "Development"}
                  </span>
                  
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-white leading-tight">
                    {selectedImage.title}
                  </h5>
                  
                  <p className="mb-6 text-gray-400 text-sm leading-relaxed">
                    {selectedImage.description || "No description provided."}
                    <br />
                    
                    {selectedImage.tools && (
                      <span className="inline-block mt-3 text-xs font-mono text-gray-500 border border-white/10 px-2 py-1 rounded">
                        Tool: {selectedImage.tools}
                      </span>
                    )}

                    {selectedImage.tags && (
                      <div className="flex flex-wrap gap-2 mt-3">
                         {selectedImage.tags.map((t, i) => (
                           <span key={i} className="text-xs font-mono text-[#db0a0a] bg-[#db0a0a]/10 px-2 py-1 rounded">
                             {t}
                           </span>
                         ))}
                      </div>
                    )}
                  </p>

                  <div className="flex flex-col gap-3">
                    <button
                        onClick={() => setIsFullView(true)}
                        className="inline-flex items-center justify-center w-full px-5 py-2.5 text-sm font-medium text-white bg-[#db0a0a] rounded-lg hover:bg-red-700 transition-all shadow-lg hover:shadow-red-900/20"
                    >
                        View Full Image
                        <Maximize2 className="w-4 h-4 ml-2" />
                    </button>

                    {selectedImage.links && (
                       <div className="flex gap-2">
                          <a href={selectedImage.links.github} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-bold hover:bg-white/10 transition-colors">
                             <GitBranch className="w-4 h-4" /> Code
                          </a>
                          <a href={selectedImage.links.demo} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-bold hover:bg-white/10 transition-colors">
                             <ExternalLink className="w-4 h-4" /> Demo
                          </a>
                       </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </section>
  );
};



export default Projects;




// ==========================================
// DATA: MANUALLY EDIT ART PROJECTS HERE
// ==========================================
const artProjectsData = [
  // --- ORIGINAL UNIQUE ITEMS (000 - 006) ---
  {
    id: "art-0",
    title: "Three Heroes Sketch",
    category: "Character Design",
    description: "Sketching the Monuments for The Greatest Heroes Art",
    tools: "IArtbook",
    image: "/arts/0000.jpg"
  },
  {
    id: "art-1",
    title: "The Greatest Heroes",
    category: "Illustration",
    description: "Inspired by the anime 'My Hero Academia', this piece showcases three iconic heroes in a dynamic composition.",
    tools: "Sketchbook, iArtbook",
    image: "/arts/001.jpg"
  },
  {
    id: "art-2",
    title: "Dark Deku",
    category: "Portrait",
    description: "Inspired by the 'Dark Deku' arc, this piece shows the light in his eyes finally extinguished by the burden of the upcoming war.",
    tools: "ibisPaint",
    image: "/arts/002.jpg"
  },
  {
    id: "art-3",
    title: "Katsuki",
    category: "Portrait",
    description: "",
    tools: "ibisPaint",
    image: "/arts/003.jpg"
  },
  {
    id: "art-4",
    title: "Fallen Angel",
    category: "Illustration",
    description: "Inspired by Touya's tragic backstory, this piece depicts his new identity, Dabi, in a literal fall. This symbolizes his metaphorical transformation from an innocent youth into a 'fallen angel.'",
    tools: "iArtbook",
    image: "/arts/004.jpg"
  },
  {
    id: "art-5",
    title: "Innocent Angel",
    category: "Illustration",
    description: "Inspired by Touya's tragic backstory, this piece depicts his new identity, Dabi, in a literal fall. This symbolizes his metaphorical transformation from an innocent youth into a 'fallen angel.'",
    tools: "iArtbook",
    image: "/arts/005.jpg"
  },
  {
    id: "art-6",
    title: "Dabi in the Final War",
    category: "Illustration",
    description: "Inspired by the climactic battles in My Hero Academia, this piece captures Dabi amidst the chaos of the final war, showcasing his decaying skin from constant burns almost taking over his entire body.",
    tools: "ibisPaint",
    image: "/arts/006.jpg"
  },

  {
    id: "art-7",
    title: "Doctor Katsuki",
    category: "Illustration",
    description: "",
    tools: "iArtbook",
    image: "/arts/007.jpg"
  },
  {
    id: "art-8",
    title: "Shoto",
    category: "Illustration",
    description: "Description for artwork 008...",
    tools: "iArtBook",
    image: "/arts/008.jpg"
  },
  {
    id: "art-9",
    title: "Open the door",
    category: "Illustration",
    description: "Description for artwork 009...",
    tools: "iArtBook",
    image: "/arts/009.jpg"
  },
  {
    id: "art-10",
    title: "Spill of Light",
    category: "Illustration",
    description: "Description for artwork 010...",
    tools: "iArtBook",
    image: "/arts/0010.jpg"
  },
  {
    id: "art-11",
    title: "The Wind",
    category: "Illustration",
    description: "Description for artwork 011...",
    tools: "iArtBook",
    image: "/arts/0011.jpg"
  },
  {
    id: "art-12",
    title: "Katsuki Bakuguo",
    category: "Illustration",
    description: "Description for artwork 012...",
    tools: "iArtBook",
    image: "/arts/0012.jpg"
  },
  {
    id: "art-13",
    title: "Deku",
    category: "Illustration",
    description: "Description for artwork 013...",
    tools: "iArtBook",
    image: "/arts/0013.jpg"
  },
  {
    id: "art-14",
    title: "The Art Master",
    category: "Illustration",
    description: "Description for artwork 014...",
    tools: "iArtBook",
    image: "/arts/0014.jpg"
  },
  {
    id: "art-15",
    title: "Spy",
    category: "Illustration",
    description: "Description for artwork 015...",
    tools: "iArtBook",
    image: "/arts/0015.jpg"
  },
  {
    id: "art-16",
    title: "Three Young Women Who Gave Life To Heroes",
    category: "Illustration",
    description: "Description for artwork 016...",
    tools: "iArtBook",
    image: "/arts/0016.jpg"
  },
  {
    id: "art-17",
    title: "Birthday Boy",
    category: "Illustration",
    description: "Description for artwork 017...",
    tools: "iArtBook",
    image: "/arts/0017.jpg"
  },
  {
    id: "art-18",
    title: "Shota",
    category: "Illustration",
    description: "Description for artwork 018...",
    tools: "iArtBook",
    image: "/arts/0018.jpg"
  },
  {
    id: "art-19",
    title: "Stranger Things (Deku)",
    category: "Illustration",
    description: "Description for artwork 019...",
    tools: "iArtBook",
    image: ["/arts/0019.jpg", "/arts/0020.jpg"]
  },
  {
    id: "art-21",
    title: "Basketball Game",
    category: "Illustration",
    description: "Description for artwork 021...",
    tools: "iArtBook",
    image: "/arts/0021.jpg"
  },
  {
    id: "art-22",
    title: "Blood Sucker",
    category: "Illustration",
    description: "Description for artwork 022...",
    tools: "iArtBook",
    image: "/arts/0022.jpg"
  },
  {
    id: "art-23",
    title: "Umbrella",
    category: "Illustration",
    description: "Description for artwork 023...",
    tools: "iArtBook",
    image: "/arts/0023.jpg"
  },
  {
    id: "art-24",
    title: "The Trio",
    category: "Illustration",
    description: "Description for artwork 024...",
    tools: "iArtBook",
    image: "/arts/0024.jpg"
  },
  {
    id: "art-25",
    title: "Fair Skin",
    category: "Illustration",
    description: "Description for artwork 025...",
    tools: "iArtBook",
    image: "/arts/0025.jpg"
  },
  {
    id: "art-26",
    title: "Basketball Game",
    category: "Illustration",
    description: "Description for artwork 026...",
    tools: "iArtBook",
    image: "/arts/0026.jpg"
  },
  {
    id: "art-27",
    title: "Red Eyes",
    category: "Commissioned",
    description: "Description for artwork 027...",
    tools: "iArtBook",
    image: "/arts/0027.jpg"
  },
  {
    id: "art-28",
    title: "Anya's Mischievous Smile",
    category: "Illustration",
    description: "Description for artwork 028...",
    tools: "iArtBook",
    image: "/arts/0028.jpg"
  },
  {
    id: "art-29",
    title: "Yor",
    category: "Illustration",
    description: "Description for artwork 029...",
    tools: "iArtBook",
    image: "/arts/0029.jpg"
  },
  {
    id: "art-30",
    title: "Blood",
    category: "Commissioned",
    description: "Description for artwork 030...",
    tools: "iArtBook",
    image: "/arts/0030.jpg"
  },
  {
    id: "art-31",
    title: "Golden Child",
    category: "Commissioned",
    description: "Description for artwork 031...",
    tools: "iArtBook",
    image: "/arts/0031.jpg"
  },
  {
    id: "art-32",
    title: "Female Version",
    category: "Commissioned",
    description: "Description for artwork 032...",
    tools: "iArtBook",
    image: "/arts/0032.jpg"
  },
  {
    id: "art-33",
    title: "Bike Boy",
    category: "Illustration",
    description: "Description for artwork 033...",
    tools: "iArtBook",
    image: "/arts/0033.jpg"
  },
  {
    id: "art-34",
    title: "Guitarist",
    category: "Illustration",
    description: "Description for artwork 034...",
    tools: "iArtBook",
    image: "/arts/0034.jpg"
  },
  {
    id: "art-35",
    title: "Mr. Doctor",
    category: "Illustration",
    description: "Description for artwork 035...",
    tools: "iArtBook",
    image: "/arts/0035.jpg"
  },
  {
    id: "art-36",
    title: "Crawling Out",
    category: "Commissioned",
    description: "Description for artwork 036...",
    tools: "iArtBook",
    image: "/arts/0036.jpg"
  },
  {
    id: "art-37",
    title: "Before Shigaraki",
    category: "Illustration",
    description: "Description for artwork 037...",
    tools: "iArtBook",
    image: "/arts/0037.jpg"
  },
  {
    id: "art-38",
    title: "Toga",
    category: "Illustration",
    description: "Description for artwork 038...",
    tools: "iArtBook",
    image: "/arts/0038.jpg"
  },
  {
    id: "art-39",
    title: "Spike",
    category: "Commissioned",
    description: "Description for artwork 039...",
    tools: "iArtBook",
    image: "/arts/0039.jpg"
  },
  {
    id: "art-40",
    title: "Uraraka and Katsuki",
    category: "Illustration",
    description: "Description for artwork 040...",
    tools: "iArtBook",
    image: "/arts/0040.jpg"
  },
  {
    id: "art-41",
    title: "Cold Night",
    category: "Illustration",
    description: "Description for artwork 041...",
    tools: "iArtBook",
    image: "/arts/0041.jpg"
  }
];