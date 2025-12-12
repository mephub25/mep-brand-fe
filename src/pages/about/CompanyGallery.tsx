import { Typography, Button, IconButton } from "@mui/material";
import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NavBar from "../../components/NavBar";
import TopBar from "../../components/TopBar";
import Footer from "../../components/Footer";
import BackButton from "../../components/BackButton";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ZoomInIcon from "@mui/icons-material/ZoomIn";

import "./style/About.css";


import {
  getCompanyGallery,
  selectCompanyGallery,
  selectGalleryPagination,
} from "../../store/slices/companyGallery.slice";

gsap.registerPlugin(ScrollTrigger);

const CompanyGalleryPage = () => {
  const dispatch = useDispatch<any>();
  const gallery = useSelector(selectCompanyGallery);
  const { total, limit } = useSelector(selectGalleryPagination);

  const [currentPage, setCurrentPage] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const headerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const paginationRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    dispatch(getCompanyGallery({ page: currentPage, limit }));
  }, [dispatch, currentPage, limit]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);

    if (!headerRef.current || !titleRef.current || !subtitleRef.current) return;

    const ctx = gsap.context(() => {
      // Header animations
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 1, ease: "power4.out" }
      );

      gsap.fromTo(
        titleRef.current,
        { opacity: 0, x: -100 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          delay: 0.3,
          ease: "power4.out",
        }
      );

      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          delay: 0.5,
          ease: "power4.out",
        }
      );

      // Gallery items staggered animation
      if (galleryRef.current) {
        const galleryItems = galleryRef.current.querySelectorAll(".gallery-item");
        gsap.fromTo(
          galleryItems,
          {
            opacity: 0,
            y: 50,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: galleryRef.current,
              start: "top 80%",
              end: "top 50%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Pagination animation
      if (paginationRef.current && totalPages > 1) {
        gsap.fromTo(
          paginationRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.3,
            ease: "power3.out",
          }
        );
      }
    });

    return () => ctx.clear();
  }, [gallery, currentPage]);

  const totalPages = Math.ceil(total / limit);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleImageClick = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    // Animation on lightbox open
    gsap.fromTo(
      ".yarl__container",
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out" }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <TopBar />
      <NavBar />

      {/* Header Section with Parallax Effect */}
      <div className="relative w-full overflow-hidden bg-gray-900/90">
        <div className="absolute top-0 left-0 w-full h-72 overflow-hidden -z-10">
          <img
            src="/images/gallery-bg-top.jpg"
            alt="gallery top"
            className="w-full h-full object-cover transform scale-110"
            style={{ 
              filter: "brightness(0.7) contrast(1.1)",
              animation: "slowZoom 20s infinite alternate ease-in-out"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900"></div>
        </div>
        
        <div
          ref={headerRef}
          className="pt-24 pb-16 px-4 sm:px-8 md:px-16 flex flex-col items-center relative z-10"
        >
          <BackButton className="mb-6 self-start transform hover:scale-105 transition-transform duration-200" />
          <Typography
            ref={titleRef}
            variant="h1"
            className="text-white text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-wide text-center drop-shadow-lg"
            style={{
              textShadow: "2px 2px 8px rgba(0,0,0,0.5)"
            }}
          >
            Company Gallery
          </Typography>
          <Typography
            ref={subtitleRef}
            variant="body1"
            className="text-gray-200 text-lg sm:text-xl md:text-2xl mt-4 text-center max-w-2xl"
          >
            Explore our company memory through captivating images
          </Typography>
          
          {/* Animated decorative elements */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="w-48 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Gallery Section with Enhanced Layout */}
      <div className="max-w-7xl mx-auto">
        <div ref={galleryRef} className="w-full px-4 py-12 md:px-8 lg:px-16">
          {/* Gallery Stats */}
          <div className="mb-8 flex justify-between items-center px-2">
            <Typography variant="h6" className="text-gray-700">
              Showing {gallery.length} of {total} images
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              Page {currentPage} of {totalPages}
            </Typography>
          </div>

          {/* Enhanced Gallery Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
            {gallery.map((item, index) => (
              <div
                key={item._id}
                className="gallery-item group cursor-pointer rounded-xl overflow-hidden shadow-lg bg-white transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                onClick={() => handleImageClick(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Image Container with Hover Effects */}
                <div className="relative overflow-hidden h-64">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <Typography 
                        variant="h6" 
                        className="text-white font-semibold truncate"
                      >
                        {item.title}
                      </Typography>
                      {item.description && (
                        <Typography 
                          variant="body2" 
                          className="text-gray-200 mt-1 line-clamp-2"
                        >
                          {item.description}
                        </Typography>
                      )}
                    </div>
                  </div>
                  
                  {/* Zoom Icon */}
                  <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <ZoomInIcon className="text-gray-800" />
                  </div>
                  
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>

                {/* Title (Visible on mobile) */}
                <div className="p-4 md:hidden">
                  <h3 className="font-semibold text-gray-800">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Pagination with Next/Previous Buttons */}
          {totalPages > 1 && (
            <div
              ref={paginationRef}
              className="flex flex-col sm:flex-row justify-center items-center mt-12 gap-4 px-4"
            >
              <Button
                variant="contained"
                startIcon={<ChevronLeftIcon />}
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="min-w-[120px] py-2 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                sx={{
                  backgroundColor: currentPage === 1 ? 'gray.300' : 'primary.main',
                  '&:hover': {
                    backgroundColor: currentPage === 1 ? 'gray.300' : 'primary.dark',
                    transform: 'translateX(-2px)'
                  },
                  '&:active': {
                    transform: 'translateX(0)'
                  }
                }}
              >
                Previous
              </Button>

              {/* Page Indicator */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 shadow-inner">
                  <span className="text-gray-700 font-medium">
                    Page <span className="text-primary font-bold">{currentPage}</span> of {totalPages}
                  </span>
                </div>
              </div>

              <Button
                variant="contained"
                endIcon={<ChevronRightIcon />}
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="min-w-[120px] py-2 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                sx={{
                  backgroundColor: currentPage === totalPages ? 'gray.300' : 'primary.main',
                  '&:hover': {
                    backgroundColor: currentPage === totalPages ? 'gray.300' : 'primary.dark',
                    transform: 'translateX(2px)'
                  },
                  '&:active': {
                    transform: 'translateX(0)'
                  }
                }}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Lightbox */}
      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={gallery.map((g) => ({ 
            src: g.images[0],
            alt: g.title,
            description: g.description
          }))}
          index={currentIndex}
          animation={{ fade: 400, swipe: 300 }}
          controller={{ closeOnBackdropClick: true }}
          carousel={{ finite: false }}
          render={{
            buttonPrev: gallery.length > 1 ? undefined : () => null,
            buttonNext: gallery.length > 1 ? undefined : () => null,
          }}
         on={{
    view: (index) => {
    gsap.fromTo(
      '.yarl__slide_image',
      { opacity: 0, scale: 2 },
      { opacity: 1, scale: 1, duration: 2, ease: "power2.out" }
    );
  }
}}
       styles={{
  container: { backgroundColor: 'rgba(0, 0, 0, 1)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  slide: { padding: '20px 0' }
}}

        />
      )}

      <Footer />

      {/* Add CSS for custom animations */}
      <style jsx global>{`
        @keyframes slowZoom {
          0% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1.15);
          }
        }

        .gallery-item {
          will-change: transform, opacity;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }

.yarl__container {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  background-color: rgba(0, 0, 0, 0.92) !important;
}



  /* Lightbox slide image */
.yarl__slide img {
  width: auto !important;
  max-width: 90vw !important;
  height: auto !important;
  max-height: 80vh !important;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  object-fit: contain;
}


      `}</style>
    </div>
  );
};

export default CompanyGalleryPage;