import "./style/About.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider, { Settings } from "react-slick";
import NavBar from "../../components/NavBar";
import BackButton from "../../components/BackButton";
import Title from "../../components/Title";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllMembers,
  selectAllMembers,
} from "../../store/slices/member.slice";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Skeleton } from "@mui/material";
import {
  getAllCertificates,
  selectAllCertificates,
} from "../../store/slices/certificate.slice";
// ADD THIS ⬇️
import {
  getAllCompanyGallery,
  selectCompanyGallery,
} from "../../store/slices/companyGallery.slice";
import Footer from "../../components/Footer";
import { GoDotFill } from "react-icons/go";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TopBar from "../../components/TopBar";

gsap.registerPlugin(ScrollTrigger);

const images = [
  {
    src: "/gallery/image1.jpg",
    alt: "image1",
  },
  {
    src: "/gallery/image2.jpg",
    alt: "image2",
  },
  {
    src: "/gallery/image3.jpg",
    alt: "image3",
  },
  {
    src: "/gallery/image4.jpg",
    alt: "image4",
  },
  {
    src: "/gallery/image5.jpg",
    alt: "image5",
  },
  {
    src: "/gallery/image6.jpg",
    alt: "image6",
  },
  {
    src: "/gallery/image7.jpg",
    alt: "image7",
  },
  {
    src: "/gallery/image8.jpg",
    alt: "image8",
  },
  {
    src: "/gallery/image9.jpg",
    alt: "image9",
  },
  // {
  //   src: "/gallery/image10.jpg",
  //   alt: "image10",
  // },
];

const About = () => {
  const dispatch = useDispatch<any>();
  const members = useSelector(selectAllMembers);
  const certificates = useSelector(selectAllCertificates);
  const [loading, setLoading] = useState<boolean>(true);
  const [certificatesLoading, setCertificatesLoading] = useState<boolean>(true);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);
  const imagesRef = useRef<any>([]);
  const teamRef = useRef<HTMLDivElement[]>([]);
  const certificateRef = useRef<any>([]);
  const pageHeaderRef = useRef<HTMLDivElement | null>(null);
  const subHeaderRef = useRef<HTMLParagraphElement | null>(null);
  const titleMissionRef = useRef<HTMLDivElement | null>(null);
  const titleTeamRef = useRef<HTMLDivElement | null>(null);
  const titleCertificateRef = useRef<HTMLDivElement | null>(null);
  const missionRef = useRef<HTMLDivElement | null>(null);
  const visionRef = useRef<HTMLDivElement | null>(null);
  const backRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const companyGallery = useSelector(selectCompanyGallery);
  interface CompanyGalleryItem {
  _id: string;
  title: string;
  description?: string;
  images: string[];
}


  useEffect(() => {
    dispatch(getAllMembers({ skip: 0, limit: 10 })).then(() => {
      setLoading(false);
    });

    dispatch(getAllCertificates({ skip: 0, limit: 10 })).then(() => {
      setCertificatesLoading(false);
    });
    
    dispatch(getAllCompanyGallery());
  }, [dispatch]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.5,
          ease: "power4.out",
        }
      );

      gsap.fromTo(
        pageHeaderRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.5,
          ease: "power4.out",
        }
      );

      gsap.fromTo(
        paragraphRef.current,
        { y: 0, opacity: 0 },
        { y: 0, opacity: 1, duration: 2, delay: 0.5, ease: "circ.inOut" }
      );

      gsap.fromTo(
        subHeaderRef.current,
        { y: 0, opacity: 0 },
        { y: 0, opacity: 1, duration: 2, delay: 0.5, ease: "circ.inOut" }
      );

      gsap.fromTo(
        headingRef.current,
        { opacity: 0, x: -200 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
            end: "top 20%",
            scrub: true,
          },
        }
      );

      ScrollTrigger.create({
        animation: gsap.fromTo(
          headerRef.current,
          { y: "0%", x: 150, opacity: 0 },
          { y: "0%", x: 0, duration: 3, opacity: 1 }
        ),
        trigger: headerRef.current,
        start: "top 100%",
        end: "top 50%",
        toggleActions: "play none none none",
        scrub: true,
      });

      ScrollTrigger.create({
        animation: gsap.fromTo(
          paragraphRef.current,
          { y: 0, x: -100, opacity: 0 },
          { y: 0, x: 0, opacity: 1, duration: 3 }
        ),
        trigger: paragraphRef.current,
        start: "top 100%",
        end: "top 70%",
        toggleActions: "play none none none",
        scrub: true,
      });
      

      ScrollTrigger.create({
        animation: gsap.fromTo(
          subHeaderRef.current,
          { y: 0 },
          { y: 25, duration: 3 }
        ),
        trigger: subHeaderRef.current,
        start: "top 50%",
        end: "top -50%",
        toggleActions: "play none none none",
        scrub: true,
      });

      gsap.fromTo(
        imagesRef.current,
        { opacity: 0, y: 50, scale: 0.5 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scale: 1,
          stagger: 0.3,
          ease: "power4.out",
        }
      );

      ScrollTrigger.create({
        animation: gsap.fromTo(
          imagesRef.current,
          { opacity: 0, y: 50, scale: 0.5 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            scale: 1,
            stagger: 0.3,
            ease: "power4.out",
          }
        ),
        trigger: imagesRef.current,
        start: "top 100%",
        end: "top 50%",
        toggleActions: "play none none none",
        scrub: true,
      });

      gsap.fromTo(
        teamRef.current,
        { opacity: 0, y: 50, scale: 0.5 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scale: 1,
          stagger: 0.3,
          ease: "power4.out",
          scrollTrigger: {
            trigger: teamRef.current,
            start: "top 100%",
            end: "top 50%",
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        certificateRef.current,
        { opacity: 0, y: 50, scale: 0.5 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scale: 1,
          stagger: 0.3,
          ease: "power4.out",
          scrollTrigger: {
            trigger: certificateRef.current,
            start: "top 100%",
            end: "top 0%",
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        titleMissionRef.current,
        { opacity: 0, y: 50, scale: 0.5 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scale: 1,
          stagger: 0.3,
          ease: "power4.out",
          scrollTrigger: {
            trigger: titleMissionRef.current,
            start: "top 100%",
            end: "top 0%",
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        titleTeamRef.current,
        { opacity: 0, y: 50, scale: 0.5 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scale: 1,
          stagger: 0.3,
          ease: "power4.out",
          scrollTrigger: {
            trigger: titleTeamRef.current,
            start: "top 100%",
            end: "top 0%",
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        titleCertificateRef.current,
        { opacity: 0, y: 50, scale: 0.5 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scale: 1,
          stagger: 0.3,
          ease: "power4.out",
          scrollTrigger: {
            trigger: titleCertificateRef.current,
            start: "top 100%",
            end: "top 0%",
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        missionRef.current,
        { opacity: 0, y: 50, scale: 0.5 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scale: 1,
          stagger: 0.3,
          ease: "power4.out",
          scrollTrigger: {
            trigger: missionRef.current,
            start: "top 100%",
            end: "top 0%",
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        visionRef.current,
        { opacity: 0, y: 50, scale: 0.5 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scale: 1,
          stagger: 0.3,
          ease: "power4.out",
          scrollTrigger: {
            trigger: visionRef.current,
            start: "top 100%",
            end: "top 0%",
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        backRef.current,
        { opacity: 0, y: 100, scale: 0.5 },
        {
          opacity: 1,
          y: 0,
          duration: 2,
          scale: 1,
          stagger: 0.3,
          ease: "power4.out",
        }
      );

      ScrollTrigger.create({
        animation: gsap.fromTo(
          backRef.current,
          { opacity: 0, y: 50, scale: 0.5 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            scale: 1,
            stagger: 0.3,
            ease: "power4.out",
          }
        ),
        trigger: backRef.current,
        start: "top 100%",
        end: "top 50%",
        toggleActions: "play none none none",
        scrub: true,
      });
    });

    return () => ctx.clear();
  }, []);

  const settings: Settings = {
    dots: false,
    draggable: true,
    infinite: true,
    slidesToScroll: 3,
    slidesToShow: 3,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    cssEase: "linear",
    arrows: false,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  };

  const scrollToSection = (section: string) => {
    const element = document.getElementById(section);
    element?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div>
      <TopBar />
      <NavBar />
      <div id="about" className="relative">
        <div className="relative about-container flex flex-col items-center justify-center py-[64px] pt-[120px]">
          <div className="z-10 flex-1 w-full md:w-auto md:text-center text-left absolute md:left-[150px] left-1/2 md:top-1/3 top-[25%] transform md:translate-x-0 -translate-x-1/2 -translate-y-1/2 md:ml-0 ml-4">
            <div ref={backRef}>
              <BackButton />
            </div>
          </div>
          <div className="z-10 w-full text-center md:text-left h-fit flex flex-col items-center gap-10">
            <h1
              ref={pageHeaderRef}
              className="text-white xs:text-6xl text-4xl font-bold uppercase text-center"
            >
              About Us
            </h1>
            <div
              ref={subHeaderRef}
              className="flex flex-wrap justify-center items-center gap-6 text-white/70"
            >
              <span
                onClick={() => scrollToSection("mission")}
                className="flex items-center gap-2 cursor-pointer hover:text-secondary"
              >
                <GoDotFill /> Mission & Vision
              </span>
              <span
                onClick={() => scrollToSection("team")}
                className="flex items-center gap-2 cursor-pointer hover:text-secondary"
              >
                <GoDotFill /> Our Team
              </span>
              <span
                onClick={() => scrollToSection("certificates")}
                className="flex items-center gap-2 cursor-pointer hover:text-secondary"
              >
                <GoDotFill /> Certificates
              </span>
              <span
                onClick={() => scrollToSection("companyGallery")}
                className="flex items-center gap-2 cursor-pointer hover:text-secondary"
              >
                <GoDotFill /> Company Gallery
              </span>
              
            </div>
          </div>
        </div>
        <div
          id="gallery"
          className="flex flex-wrap gap-4 items-center bg-pink-400/0 w-full xs:px-[1%] px-4 justify-evenly md:min-h-screen min-h-full py-8"
        >
          <div className="xl:w-[40%] sm:w-[70%] w-full lg:text-left text-center">
            <h1
              ref={headerRef}
              className="2xl:text-5xl xs:text-3xl text-xl uppercase font-bold"
            >
              Your Trusted Partner for Reliable Services and Innovative Solutions
            </h1>
            <p ref={paragraphRef} className="mt-5">
              At MEP ERICTRIC TECHNOLOGY, we are committed to delivering top
              quality MEP services to clients. We strive for excellence in
              everything we do and aim to provide cost effective and energy
              efficient solutions that meet our client’s needs{" "}
            </p>
          </div>
          <article className="gallery md:grid hidden m-0 place-items-center">
            {images.map((image, index) => (
              <span ref={(el) => (imagesRef.current[index] = el)} key={index}>
                <img src={image.src} alt={image.alt} />
              </span>
            ))}
          </article>
          <div className="sm:w-[99vw] xs:w-[96vw] w-[85vw] overflow-hidden mt-5 block md:hidden">
            <div className="slider-container">
              <Slider {...settings}>
                {images.map((image, index) => (
                  <div key={index}>
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full aspect-video object-cover"
                    />
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
        <div id="mission" className="min-h-[500px] bg-primary py-10 w-full">
          <h1
            ref={titleMissionRef}
            className="text-5xl text-center uppercase font-bold text-white"
          >
            mission & vision
          </h1>
          <div className="w-full flex sm:flex-row flex-col justify-center sm:gap-4 gap-11 pt-12 px-8">
            <div
              ref={missionRef}
              className="flex-1 bg-white/15 text-white flex flex-col items-center justify-center text-center lg:p-20 sm:p-12 p-6 max-w-[640px] relative"
            >
              <div className="absolute left-[5%] top-[0%] transform -translate-y-1/2 py-3 font-bold px-6 bg-secondary">
                OUR MISSION
              </div>
              Our mission is to provide high-quality MEP services to our clients
              while delivering excellent customer service. We aim to exceed our
              clients' expectations by providing cost-effective and
              energy-efficient solutions with the goal of delivering sustainable
              benefits for our clients.
            </div>
            <div
              ref={visionRef}
              className="flex-1 bg-white/15 text-white flex flex-col items-center justify-center text-center lg:p-20 sm:p-12 p-6 max-w-[640px] relative"
            >
              <div className="absolute left-[5%] top-[0%] transform -translate-y-1/2 py-3 font-bold px-6 bg-secondary">
                OUR VISION
              </div>
              Our vision is to be a leading provider of innovative, sustainable
              MEP solutions in Africa. We strive to provide clients
              with integrated MEP systems To improve building performance,
              safety, and energy efficiency.
            </div>
          </div>
        </div>
        {members?.length > 0 && (
          <div id="team">
            {loading ? (
              <Skeleton
                animation="wave"
                variant="rectangular"
                height="100%"
                width="100%"
                className="flex items-center justify-center text-xl text-dark/80 my-5 min-h-[400px]"
              >
                Loading team members...
              </Skeleton>
            ) : (
              <div className="relative">
                <div className="absolute top-0 right-0 bg-black solutions rotate-180 sm:w-[50%] w-[75%] aspect-[9/6] -scale-y-100"></div>
                <div className="absolute bottom-0 left-0 bg-black solutions rotate-270 sm:w-[50%] w-[75%] aspect-[9/6] -scale-y-100"></div>
                <div className="flex flex-col items-center py-12 relative">
                  <div className="max-w-[1200px]">
                    <div
                       ref={headingRef}
                      className="max-w-[680px] sm:px-10 px-5"
                    >
                      <h1 className="md:text-[40px] sm:text-[30px] text-[24px] font-semibold">
                        Meet our exceptional team
                      </h1>
                      <p className="md:text-base text-sm">
                        Meet the visionary founders and dedicated administration
                        team behind MEP ERICTRIC TECHNOLOGY. Together, they
                        drive innovation and excellence in the industry,
                        combining their expertise, leadership, and passion to
                        deliver advanced solutions and ensure smooth operations.
                      </p>
                    </div>

                    <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 justify-center gap-4 pt-10">
                      {members.map((member, index) => (
                        <div
                          ref={(el) => (teamRef.current[index] = el!)}
                          key={index}
                          className="flex flex-col items-center bg-white/15 rounded-lg p-4"
                        >
                          <div className="border-[2.5px] border-blue-500 rounded-full p-1">
                            <img
                              src={member.image}
                              alt={member.names}
                              className="w-44 h-44 rounded-full object-cover bg-gray-300/50"
                            />
                          </div>
                          <p className="font-bold text-lg text-dark text-center">
                            {member.names}
                          </p>
                          <p className="text-sm text-dark text-center">
                            {member.role}
                          </p>
                        </div>
                        // <div
                        //   ref={(el) => (teamRef.current[index] = el!)}
                        //   key={index}
                        //   className="flex flex-col items-center bg-white/15 rounded-lg p-4"
                        // >
                        //   <div className="bg-[#D9D9D9] rounded-md pb-0 w-fit aspect-square overflow-hidden">
                        //     <img
                        //       src={member.image}
                        //       alt={member.names}
                        //       className="w-[200px] h-[200px] object-cover "
                        //     />
                        //   </div>
                        //   <p className="font-bold text-lg text-dark">
                        //     {member.names}
                        //   </p>
                        //   <p className="text-sm text-dark">{member.role}</p>
                        // </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {certificates?.length > 0 && (
          <div id="certificates">
            {certificatesLoading ? (
              <Skeleton
                animation="wave"
                variant="rectangular"
                height="100%"
                width="100%"
                className="flex items-center justify-center text-xl text-dark/80 my-5 min-h-[400px]"
              >
                Loading certificates...
              </Skeleton>
            ) : (
              <div className="flex flex-col items-center py-12 bg-white">
                <Title
                  ref={titleCertificateRef}
                  title="OUR CERTIFICATES"
                  className="text-center"
                />
                <div className="lg:columns-3 sm:columns-2 columns-1 gap-4 p-10">
                  {certificates.map((certificate, index) => (
                    <div
                      ref={(el) => (certificateRef.current[index] = el!)}
                      key={certificate._id}
                      className="break-inside-avoid shadow-[0_3px_10px_rgb(0,0,0,0.2)] mt-4"
                    >
                      <img
                        src={certificate.image}
                        alt={certificate.name}
                        className="w-full object-cover bg-gray-300/50"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
       {companyGallery?.length > 0 && (
              <div id="companyGallery" className="flex flex-col items-center py-12 bg-white">
                <Title title="COMPANY GALLERY" className="text-center mb-8" />
            
                <div className="lg:columns-3 sm:columns-2 columns-1 gap-4 p-10">
                  {companyGallery.map((gallery: CompanyGalleryItem) => (
                    <div
                      key={gallery._id}
                      className="break-inside-avoid shadow-[0_3px_10px_rgb(0,0,0,0.2)] mb-4 rounded-lg overflow-hidden"
                    >
                      <img
                        src={gallery.images[0]} // first image in the gallery
                        alt={gallery.title}
                        className="w-full h-auto object-cover bg-gray-300/50"
                      />
                      <div className="p-4 bg-white">
                        <h3 className="font-bold text-lg">{gallery.title}</h3>
                        <p className="text-sm text-gray-600">{gallery.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
        
      </div>
      <Footer />
    </div>
  );
};

export default About;
