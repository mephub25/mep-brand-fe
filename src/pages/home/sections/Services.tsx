import clsx from "clsx";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import Title from "../../../components/Title";

gsap.registerPlugin(ScrollTrigger);

const servicesDetails = [
  {
    title: "Electrical services",
    detail:
      "Our electrical expertise extends to the design and installation of various systems, from high-voltage transmission lines and substations to distribution networks. We specialize in lighting and power supply solutions, as well as renewable energy systems such as solar panels, hydropower plants, and wind farms. Additionally, our services include low voltage systems, including distribution networks and domestic installations.",
    url: "/images/service-1.png",
  },
  {
    title: "Mechanical Services",
    detail:
      "We offer comprehensive mechanical services, including the design and installation of HVAC systems, such as air conditioning and ventilation units. Additionally, we specialize in providing and installing elevators, escalators, and fire suppression systems, ensuring safety and comfort in various environments.",
    url: "/images/service-2.png",
  },
  {
    title: "Plumbing services",
    detail:
      "We specialize in designing and installing efficient water heating systems, drainage and sanitary facilities, as well as water supply and distribution networks that optimize both performance and sustainability. Our dedicated maintenance team ensures long-lasting and problem-free plumbing systems, setting us apart as a trusted partner for all your plumbing needs.",
    url: "/images/service-3.png",
  },
];

const Services = () => {
  const servicesContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          delay: 0.5,
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 100%",
            end: "top 30%",
            scrub: 1,
          },
        }
      );

      if (servicesContainerRef.current?.children) {
        gsap.utils.toArray(servicesContainerRef.current.children).forEach((child) => {
          gsap.fromTo(
            child as HTMLElement,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              delay: 0.5,
              scrollTrigger: {
                trigger: child as HTMLElement,
                start: "top 100%",
                end: "top 50%",
                scrub: 1,
              },
            }
          );
        });
      }
    });

    return () => ctx.clear();
  }, []);

  return (
    <div id="services-1" className="h-max px-5 py-8 md:p-16 relative overflow-y-hidden">
      <Title ref={titleRef} title="OUR SERVICES" color="common.white" className="mx-auto my-8" />
      <img
        src="/images/bg-services-2.jpg"
        alt="services background"
        className="size-full object-cover absolute top-0 left-0 -z-10"
      />
      <div ref={servicesContainerRef} className="flex flex-col items-center gap-5 text-white">
        {servicesDetails.map(({ title, detail, url }, index) => {
          let bgClass;

          switch (index) {
            case 0:
              bgClass = "bg-secondary/90";
              break;
            case 1:
              bgClass = "bg-primary/90";
              break;
            default:
              bgClass = "bg-primary-foreground/90";
          }

          return (
            <div className="w-full max-w-[1150px] flex flex-col lg:flex-row gap-4 bg-black/5 backdrop-blur-sm border-2 border-primary-foreground rounded-2xl text-white overflow-clip">
              <div className={clsx("basis-1/2 relative", index % 2 !== 0 && "lg:order-last")}>
                <div className="aspect-video lg:aspect-auto lg:absolute top-0 left-0 bottom-0 right-0 overflow-hidden p-3 lg:p-0 m-auto lg:m-3">
                  <img src={url} alt={`service ${index}`} className="h-full object-scale-down m-auto" />
                </div>
              </div>
              <div
                className={clsx("basis-1/2 h-max px-[20px] py-[15px] xs:px-[40px] xs:py-[25px] sm:p-[55px]", bgClass)}
              >
                <h2 className="text-xl xxs:text-2xl sm:text-3xl font-bold mb-[5px] sm:mb-[10px] leading-tight xxs:leading-normal">
                  {title}
                </h2>
                <p className="text-sm sm:text-base leading-tight xxs:leading-normal">{detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Services;
