import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { BsTools } from "react-icons/bs";
import { MdDesignServices, MdEngineering } from "react-icons/md";
import { PiPackageFill } from "react-icons/pi";

const solutions = [
  {
    title: "Design",
    desc: "Expertly crafted designs ensure efficiency and longevity, tailored to meet specific project requirements while maximizing functionality and performance across various systems.",
    icon: MdDesignServices,
  },
  {
    title: "Installation",
    desc: "Our precise installation services guarantee seamless integration, ensuring that systems function optimally and safely, while adhering to industry standards and regulations.",
    icon: MdEngineering,
  },
  {
    title: "Supply",
    desc: "We provide high-quality, reliable supplies that meet the demands of modern infrastructure, ensuring access to the best materials and technologies for any project.",
    icon: PiPackageFill,
  },
  {
    title: "Maintainance",
    desc: "Regular maintenance services help extend system lifespan and prevent costly downtime, ensuring continued efficiency and performance with minimal disruptions.",
    icon: BsTools,
  },
];

const typings = [
  {
    title: "Reliable Building Solutions",
    desc: "Looking for seamless building solutions? From electrical to mechanical and plumbing, we provide expert services designed to keep your property running smoothly. Let us handle the details, so you can focus on what matters most.",
  },
  {
    title: "Comprehensive Property Care",
    desc: "Simplify your property management with our all-in-one electrical, mechanical, and plumbing services. We’re here to ensure everything works efficiently, helping you maintain a safe and functional environment with ease.",
  },
  {
    title: "Expert Maintenance for Your Property",
    desc: "Trust our skilled team to handle all your building’s maintenance needs. Whether it’s electrical, mechanical, or plumbing, we’ve got you covered with reliable services that keep your property in top shape.",
  },
];

const Solutions = () => {
  const titleRef: any = useRef(null);
  const descRef: any = useRef(null);
  const tl: any = useRef(null);
  const solutionsRef = useRef<HTMLDivElement[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const userRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let index = 0;

    const changeText = () => {
      const { title, desc } = typings[index];

      gsap.to([titleRef.current, descRef.current], {
        opacity: 0,
        y: -20,
        duration: 0.8,
        onComplete: () => {
          titleRef.current.innerHTML = title;
          descRef.current.innerHTML = desc;

          gsap.to([titleRef.current, descRef.current], {
            opacity: 1,
            y: 0,
            duration: 0.5,
          });
        },
      });

      index = (index + 1) % typings.length;
    };

    tl.current = gsap.timeline({ repeat: -1, repeatDelay: 2 });
    tl.current.call(changeText).repeatDelay(4);

    return () => {
      tl.current.kill();
    };
  }, []);

  useLayoutEffect(() => {
    gsap.fromTo(
      solutionsRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.3,
        ease: "power4.out",
        scrollTrigger: {
          trigger: solutionsRef.current[0],
          start: "top 80%",
          end: "top 20%",
          scrub: true,
        },
      }
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
          start: "top 100%",
          end: "top 50%",
          scrub: true,
        },
      }
    );

    gsap.fromTo(
      userRef.current,
      { opacity: 0, x: 200 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        scrollTrigger: {
          trigger: userRef.current,
          start: "top 100%",
          end: "top 50%",
          scrub: true,
        },
      }
    );
  }, []);

  return (
    <div id="services" className="min-h-screen relative overflow-hidden">
      <div className="absolute top-0 left-0 bg-black solutions w-[60%] aspect-[9/6]"></div>
      <div className="flex xs:flex-row flex-col items-center justify-center content-around pt-6 py-4 sm:px-10 px-4">
        <div ref={headingRef} className="4xl:max-w-[750px] 3xl:max-w-[640px] max-w-[500px]">
          <h1 className="md:text-[40px] sm:text-[30px] text-[24px] font-semibold">
            Explore Our solutions and Services
          </h1>
          <p className="md:text-base text-sm">
            Discover a wide range of tailored solutions and services designed to
            meet the evolving needs of various industries. From cutting-edge
            technologies to expert consultations, we offer innovative strategies
            that drive success and ensure lasting results for every project.
          </p>
        </div>
        <div ref={userRef} className="relative">
          <div className="absolute left-0 right-0 bottom-0 h-12 cover"></div>
          <img src="/images/boss.png" alt="" />
        </div>
      </div>
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 pb-10 sm:px-10 px-5">
        {solutions.map((solution, index) => (
          <div
            ref={(el: any) => (solutionsRef.current[index] = el!)}
            className="w-full xs:p-8 p-4 rounded-lg border-2 border-[#AAAAAA] hover:bg-white"
          >
            <div className="flex flex-wrap items-center gap-2">
              <div className="w-fit aspect-square sm:p-3 p-2 rounded-full border-2 border-[#AAAAAA]">
                <solution.icon className="text-primary text-3xl" />
              </div>
              <h3 className="sm:text-xl text-base font-semibold">
                {solution.title}
              </h3>
            </div>
            <p className="sm:text-sm text-xs mt-2">{solution.desc}</p>
          </div>
        ))}
        <div
          ref={(el: any) => (solutionsRef.current[3] = el!)}
          className="w-full sm:col-span-2 rounded-lg dark-box p-5 lg:h-auto xxs:min-h-[200px] h-[300px]"
        >
          <div className="z-10 absolute left-1/2 md:top-1/2 top-[50%] transform -translate-x-1/2 -translate-y-1/2 w-full flex flex-col gap-2 justify-center sm:px-10 px-4 xs:text-left text-center">
            <h1
              ref={titleRef}
              className="sm:text-2xl text-xl font-bold text-white z-10"
            >
              Reliable Building Solutions
            </h1>
            <p
              ref={descRef}
              className="text-white z-[9999] md:text-base sm:text-sm text-xs"
            >
              Looking for seamless building solutions? From electrical to
              mechanical and plumbing, we provide expert services designed to
              keep your property running smoothly. Let us handle the details, so
              you can focus on what matters most.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Solutions;
