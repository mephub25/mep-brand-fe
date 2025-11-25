import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { HiArrowRight } from "react-icons/hi";
import { ScrollTrigger } from "gsap/ScrollTrigger";



interface IntroSliderProps {
  slides: any[];
  setLoginOpen: (value: boolean) => void; // prop to open login overlay
}

const IntroSlider = ({ slides, setLoginOpen }: IntroSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);
  const dotRefs = useRef<HTMLDivElement[]>([]);
  const intervalRef = useRef<any | null>(null);

  const changeSlide = (newIndex: number) => {
    if (newIndex !== currentIndex) {
      fadeOutCurrentSlide(() => {
        setCurrentIndex(newIndex);
        resetInterval();
      });
    }
  };

  const resetInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      fadeOutCurrentSlide(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      });
    }, 7000);
  };

  const fadeOutCurrentSlide = (onComplete: () => void) => {
    const image = imageRef.current;
    const header = headerRef.current;
    const paragraph = paragraphRef.current;

    const fadeOutTimeline = gsap.timeline({ onComplete });

    fadeOutTimeline.to(image, {
      x: "-20%",
      opacity: 0,
      duration: 1,
      ease: "power4.in",
    });

    fadeOutTimeline.to(
      [header, paragraph],
      {
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      },
      "-=0.8"
    );
  };

  useEffect(() => {
    const image = imageRef.current;
    const header = headerRef.current;
    const paragraph = paragraphRef.current;
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      mm.add("(min-width: 768px)", () => {
        gsap.fromTo(
          image,
          { x: "100%", opacity: 0, scale: 0.2, y: "50%" },
          {
            x: "0%",
            opacity: 1,
            duration: 2,
            delay: 0.5,
            scale: 1,
            y: "0%",
            stagger: 0.4,
            ease: "power3.out",
          }
        );

        ScrollTrigger.create({
          animation: gsap.fromTo(
            image,
            { x: "0%" },
            { x: "100%", duration: 3, z: 0.01 }
          ),
          trigger: image,
          start: "top 80%",
          end: "top 20%",
          toggleActions: "play none none none",
          scrub: true,
        });
      });

      mm.add("(max-width: 767px)", () => {
        gsap.fromTo(
          image,
          { x: "0%", opacity: 0, scale: 0.2, y: "50%" },
          {
            x: "0%",
            opacity: 1,
            duration: 2,
            delay: 0.5,
            scale: 1,
            y: "0%",
            stagger: 0.4,
            ease: "power3.out",
          }
        );

        ScrollTrigger.create({
          animation: gsap.to(image, { x: "200%", duration: 3 }),
          trigger: image,
          start: "top 80%",
          end: "top 20%",
          toggleActions: "play none none none",
          scrub: true,
        });
      });

      gsap.fromTo(
        header,
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
        paragraph,
        { y: 0, opacity: 0 },
        { y: 0, opacity: 1, duration: 2, delay: 0.5, ease: "circ.inOut" }
      );

      ScrollTrigger.create({
        animation: gsap.fromTo(header, { x: "0%" }, { x: "30%", duration: 3 }),
        trigger: header,
        start: "top 20%",
        end: "top -80%",
        toggleActions: "play none none none",
        scrub: true,
      });

      ScrollTrigger.create({
        animation: gsap.fromTo(paragraph, { y: 0 }, { y: 50, duration: 3 }),
        trigger: paragraph,
        start: "top 50%",
        end: "top 0%",
        toggleActions: "play none none none",
        scrub: true,
      });

      ScrollTrigger.create({
        animation: gsap.fromTo(
          dotRefs.current,
          { opacity: 1, scale: 1 },
          {
            opacity: 0.2,
            scale: 0.8,
            duration: 2,
            stagger: 0.1,
            ease: "power1.out",
          }
        ),
        trigger: dotRefs.current,
        start: "top 80%",
        end: "top 20%",
        toggleActions: "play none none none",
        scrub: true,
      });
    });

    // return () => {
    //   gsap.killTweensOf([image, header, paragraph]);
    // };

    return () => {
      ctx.clear();
      mm.revert();
    };
  }, [currentIndex]);

  useEffect(() => {
    const handleScroll = () => {
      resetInterval();
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    resetInterval();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [slides.length]);

  useEffect(() => {
    if (dotRefs.current.length) {
      gsap.fromTo(
        dotRefs.current,
        { opacity: 0.2, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 2,
          stagger: 0.1,
          ease: "power1.out",
        }
      );
    }
  }, [currentIndex]);

  return (
    <div className="flex md:flex-row flex-col items-center md:justify-center justify-around pt-10 pb-0 overflow-hidden relative md:h-[calc(100vh_-_64px)] h-screen min-h-[500px] z-10">
      <div className="flex flex-col md:items-start md:justify-center justify-end flex-1 space-y-4 lg:w-auto md:w-1/2 w-full pt-6 md:mb-0 mb-6 md:pl-10 xxs:px-6 px-2">
        <div
          ref={headerRef}
          className="xl:text-5xl lg:text-4xl xs:text-3xl text-2xl font-bold uppercase text-white sm:text-left text-center"
        >
          {slides[currentIndex].header}
        </div>
        <p
          ref={paragraphRef}
          className="lg:text-lg sm:text-base text-sm text-background/70 sm:text-left text-center"
        >
          {slides[currentIndex].paragraph}
        </p>

        <div className="absolute bottom-10 left-10 mt-4 sm:flex hidden items-center gap-4">
  {/* Slide Dots */}
  <div className="flex space-x-2">
    {slides.map((_: any, index: number) => (
      <div
        key={index}
        ref={(el) => (dotRefs.current[index] = el!)}
        className={`h-3 w-3 rounded-full cursor-pointer ${
          index === currentIndex
            ? "bg-secondary"
            : "bg-transparent border border-background/50"
        }`}
        onClick={() => changeSlide(index)}
      ></div>
    ))}
  </div>
   {/* Login Button */}
          <button
            onClick={() => setLoginOpen(true)}
            className="bg-secondary flex gap-2 text-white py-2 px-4 rounded-full text-sm hover:bg-secondary/90 transition-colors"
          >
            <HiArrowRight className="w-4 h-4" /> Login 
          </button>
</div>

      </div>

      <div className="flex flex-col flex-1 md:items-end items-center justify-end content-end overflow-hidden bg-fuchsia-600/0 h-full lg:w-auto md:w-1/2 w-full">
        <img
          ref={imageRef}
          src={slides[currentIndex].image}
          alt="Slide"
          className="object-contain w-auto max-h-full"
        />
      </div>
    </div>
  );
};

export default IntroSlider;
