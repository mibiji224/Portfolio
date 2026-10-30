import {
  ArrowLeft, ChevronLeft, ChevronRight, Code, ExternalLink,
  GitBranch, Image as ImageIcon,
  Loader2,
  Maximize2, Palette,
  PenTool, X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Rail from '@/components/Rail'
import SectionLabel from '@/components/SectionLabel'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'

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
      className={`relative overflow-hidden bg-secondary group ${containerClassName}`}
      onClick={onClick}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-secondary">
          <Loader2 className="w-8 h-8 text-primary-strong animate-spin" />
        </div>
      )}

      {isMulti && !isLoading && (
        <>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={scrollPrev}
            disabled={currentSlide === 1}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 h-7 w-7 bg-neutral-900/55 text-white backdrop-blur-sm border border-white/20 hover:bg-primary hover:text-primary-foreground disabled:opacity-0 disabled:pointer-events-none opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={scrollNext}
            disabled={currentSlide === images.length}
            aria-label="Next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 h-7 w-7 bg-neutral-900/55 text-white backdrop-blur-sm border border-white/20 hover:bg-primary hover:text-primary-foreground disabled:opacity-0 disabled:pointer-events-none opacity-0 group-hover:opacity-100"
          >
            <ChevronRight />
          </Button>
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
        <div className="absolute bottom-3 right-3 z-30 bg-neutral-900/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full border border-white/20 pointer-events-none">
          {currentSlide} / {images.length}
        </div>
      )}
    </div>
  );
};

// Art and graphics are image only: no captions, just the work. Opens the lightbox.
const GalleryImage = ({ item, onClick }) => {
  const src = Array.isArray(item.image) ? item.image[0] : item.image;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={item.title}
      className="shrink-0 snap-start min-w-40 h-60 sm:h-72 overflow-hidden rounded-xl border border-border bg-secondary cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <img src={src} alt={item.title} loading="lazy" decoding="async" className="h-full w-auto block" />
    </button>
  );
};

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
const SUBSECTIONS = [
  { id: 'dev', title: 'Development', icon: <Code className="w-4 h-4 shrink-0" /> },
  { id: 'art', title: 'Creative Arts', icon: <Palette className="w-4 h-4 shrink-0" /> },
  { id: 'graphics', title: 'Graphics', icon: <PenTool className="w-4 h-4 shrink-0" /> },
];

// One continuous page: the three subsections stack, and the sidebar scrolls
// between them (each has the id `projects-<id>`).
const Subsection = ({ id, title, icon, children }) => (
  <div id={`projects-${id}`} className="mt-12 first:mt-0">
    <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold tracking-tight text-foreground">
      <span className="text-primary-strong">{icon}</span>
      {title}
    </h2>
    {children}
  </div>
);

const Projects = ({ projectsData }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isFullView, setIsFullView] = useState(false);
  
  // PAGINATION STATE
  const [currentDevPage, setCurrentDevPage] = useState(1);
  const [direction, setDirection] = useState('right');
  
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
  // Uses Supabase data when available; falls back to hardcoded array while DB is empty.
  const _hardcodedDevProjects = [
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
      image: ["https://placehold.co/600x400/FFDBE0/CE3D51?text=Top+Secret"]
    },
    {
      id: 6,
      title: "Coming Soon 6",
      description: "A top-secret project currently under wraps.",
      tags: ["Confidential"],
      links: { demo: "#", github: "#" },
      image: ["https://placehold.co/600x400/FFDBE0/CE3D51?text=Top+Secret"]
    }
  ]

  // Supabase dev projects are mapped to the same shape the carousel expects
  const supabaseDevProjects = projectsData
    ?.filter((p) => p.category === 'development')
    .map((p) => ({
      id: p.id,
      title: p.title,
      subtitle: p.subtitle || '',
      description: p.description || '',
      tags: Array.isArray(p.tech_stack) ? p.tech_stack : [],
      image: Array.isArray(p.images)
        ? p.images.map((img) => (typeof img === 'string' ? img : img.src))
        : [],
      links: { demo: p.demo_url || '#', github: p.github_url || '#' },
      isComingSoon: p.is_coming_soon,
    }))

  const devProjects =
    supabaseDevProjects?.length ? supabaseDevProjects : _hardcodedDevProjects

  // Art and graphics come from the same table, one row per piece. With no rows
  // yet, the built-in lists below are shown instead.
  const gallery = (category) => {
    const rows = projectsData?.filter((p) => p.category === category) ?? []
    if (!rows.length) return null
    return rows.map((p) => {
      const srcs = (Array.isArray(p.images) ? p.images : []).map((img) => (typeof img === 'string' ? img : img.src))
      return {
        id: p.id,
        title: p.title,
        category: p.subtitle || '',
        description: p.description || '',
        tools: Array.isArray(p.tech_stack) ? p.tech_stack.join(', ') : '',
        image: srcs.length > 1 ? srcs : srcs[0] || '',
      }
    })
  }

  const artProjects = gallery('art') ?? artProjectsData;

  const _hardcodedGraphicProjects = [
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

  const graphicProjects = gallery('graphics') ?? _hardcodedGraphicProjects;

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
    <section className="text-foreground py-10 lg:py-14 px-4 sm:px-6 lg:px-10 font-sans">

      {/* Styles for Animations */}
      <style>{`
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
          <div className="flex-1">
            <SectionLabel index="06" className="mb-6">projects</SectionLabel>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">Projects</h1>
          </div>
        </div>

        {/* --- DEVELOPMENT TAB --- */}
        <Subsection {...SUBSECTIONS[0]}>
          <Rail>
              {devProjects.map((project) => (
                <div
                    key={project.id}
                    onClick={() => setSelectedImage(project)}
                    className="group w-[80%] md:w-[calc((100%-1rem)/1.5)] max-w-[36rem] shrink-0 snap-start self-stretch bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 cursor-pointer"
                >
                  <div className="h-48 md:h-64 overflow-hidden relative">
                    <ImageWithLoader
                      src={project.image}
                      alt={project.title}
                      containerClassName="w-full h-full"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="absolute top-3 right-3 z-20 p-1.5 bg-background/80 backdrop-blur-md rounded-lg border border-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-3.5 h-3.5 text-primary-strong" />
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary-strong transition-colors">{project.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 4).map((tag, idx) => (
                        <Badge key={idx} variant="outline" size="sm" className="rounded font-mono">{tag}</Badge>
                      ))}
                      {project.tags.length > 4 && (
                        <span className="text-[10px] font-mono text-muted-foreground/80 px-1.5 py-0.5">+{project.tags.length - 4}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </Rail>
        </Subsection>

        {/* --- ARTS & GRAPHICS TABS (Masonry) --- */}
        {[['art', artProjects], ['graphics', graphicProjects]].map(([tabId, items]) => (
          <Subsection key={tabId} {...SUBSECTIONS.find((x) => x.id === tabId)}>
            <Rail>
              {items.map((item, index) => (
                <GalleryImage key={index} item={item} onClick={() => setSelectedImage(item)} />
              ))}
            </Rail>
          </Subsection>
        ))}

      </div>


      {/* LIGHTBOX MODAL */}
      <Dialog
        open={Boolean(selectedImage)}
        onOpenChange={(open) => !open && setSelectedImage(null)}
      >
        {selectedImage && (
          <DialogContent
            showCloseButton={false}
            style={{ boxShadow: '0 28px 70px -24px rgb(0 0 0 / 0.35)' }}
            className={`bg-background border-border/70 p-0 overflow-hidden transition-all duration-500 ease-in-out ${
              isFullView
                ? 'w-[calc(100%-2rem)] max-w-5xl h-[90vh] flex flex-col'
                : 'w-[calc(100%-2rem)] max-w-lg max-h-[90vh] overflow-y-auto modern-scrollbar block'
            }`}
          >
            {/* Named for screen readers; the visible heading lives in the body. */}
            <DialogTitle className="sr-only">{selectedImage.title}</DialogTitle>

            <button
              onClick={() => setSelectedImage(null)}
              aria-label="Close"
              className="absolute top-3 right-3 z-30 p-1.5 bg-neutral-900/60 backdrop-blur text-white rounded-full hover:bg-neutral-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {isFullView ? (
              <div className="relative w-full h-full flex flex-col">
                <div className="flex-1 bg-neutral-950 flex items-center justify-center overflow-hidden p-2">
                  <ImageWithLoader
                    src={selectedImage.image}
                    alt={selectedImage.title}
                    containerClassName="w-full h-full flex items-center justify-center bg-neutral-950"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="px-4 py-3 bg-background border-t border-border flex justify-between items-center gap-3">
                  <h3 className="text-foreground font-semibold text-base truncate min-w-0">{selectedImage.title}</h3>
                  <Button variant="outline" size="sm" onClick={() => setIsFullView(false)} className="shrink-0 font-semibold">
                    <ArrowLeft className="w-4 h-4 shrink-0" /> <span className="hidden sm:inline">Back to Details</span><span className="sm:hidden">Back</span>
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsFullView(true)}
                  aria-label="View full image"
                  className="relative block h-48 sm:h-60 w-full shrink-0 overflow-hidden bg-neutral-950 group cursor-zoom-in"
                >
                  <ImageWithLoader
                    src={selectedImage.image}
                    alt={selectedImage.title}
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-neutral-900/60 backdrop-blur px-2.5 py-1 text-[11px] font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3 h-3" /> Expand
                  </span>
                </button>

                <div className="p-5 sm:p-6 space-y-5">
                  <header className="space-y-2">
                    <span className="inline-flex items-center rounded-full bg-muted/60 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {selectedImage.category ? selectedImage.category : "Development"}
                    </span>
                    <h5 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground leading-tight">
                      {selectedImage.title}
                    </h5>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {selectedImage.description || "No description provided."}
                    </p>
                  </header>

                  {(selectedImage.tools || selectedImage.tags?.length > 0) && (
                    <dl className="divide-y divide-border border-y border-border text-sm">
                      {selectedImage.tools && (
                        <div className="flex items-baseline gap-4 py-3">
                          <dt className="w-16 shrink-0 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Tools</dt>
                          <dd className="font-mono text-xs text-foreground">{selectedImage.tools}</dd>
                        </div>
                      )}
                      {selectedImage.tags?.length > 0 && (
                        <div className="flex items-start gap-4 py-3">
                          <dt className="w-16 shrink-0 pt-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Tags</dt>
                          <dd className="flex flex-wrap gap-1.5">
                            {selectedImage.tags.map((t, i) => (
                              <span key={i} className="rounded-md border border-border bg-muted/40 px-2 py-0.5 font-mono text-xs text-foreground">
                                {t}
                              </span>
                            ))}
                          </dd>
                        </div>
                      )}
                    </dl>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedImage.links ? (
                      <>
                        <Button asChild className="rounded-lg font-semibold bg-foreground text-background hover:bg-foreground/90">
                          <a href={selectedImage.links.demo} target="_blank" rel="noreferrer">
                            <ExternalLink className="w-4 h-4" /> Live Demo
                          </a>
                        </Button>
                        <Button asChild variant="outline" className="rounded-lg font-semibold">
                          <a href={selectedImage.links.github} target="_blank" rel="noreferrer">
                            <GitBranch className="w-4 h-4" /> Source Code
                          </a>
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => setIsFullView(true)} className="sm:col-span-2 rounded-lg font-semibold bg-foreground text-background hover:bg-foreground/90">
                        <Maximize2 className="w-4 h-4" /> View Full Image
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        )}
      </Dialog>

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