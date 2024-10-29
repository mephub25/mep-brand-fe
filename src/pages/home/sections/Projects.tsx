import { Box, Button, Skeleton, Typography, useMediaQuery } from "@mui/material";
import gsap from "gsap";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Carousel, { CarouselRef } from "../../../components/Carousel";
import Title from "../../../components/Title";
import { getAllProjects, selectAllProjects } from "../../../store/slices/project.slice";

const ProjectCard = ({
  position,
  project,
  onPrevious,
  onNext,
}: {
  position: number;
  project: any;
  onPrevious: () => void;
  onNext: () => void;
}) => {
  const { image, name, location, startDate, endDate } = project;
  const num = position < 10 ? `0${position}` : position.toString();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const period = useMemo(() => {
    const start = new Date(startDate).getFullYear();
    const end = endDate && new Date(endDate).getFullYear();
    if (!endDate || start === end) return start;
    return `${start} - ${end}`;
  }, [startDate, endDate]);

  return !isMobile ? (
    <div className="size-full flex flex-row">
      <div className="size-full max-w-[60%] lg:max-w-[42%] bg-secondary flex flex-row relative z-10">
        <div className="text-white/25 text-[128px] font-bold my-auto m-4">{num}</div>
        <div className="px-4 py-8 grow flex flex-col justify-between gap-4 text-white">
          <div className="overflow-hidden w-[calc(100%_+_100px)] z-1">
            <p className="italic font-extralight px-[6px]">{period}</p>
            <Typography
              title="MOUNTAIN VIEW APARTMENT HOTEL GISOZI"
              component="h2"
              sx={{
                textShadow: (theme) => `
									4px 4px ${theme.palette.secondary.main},
									-4px -4px ${theme.palette.secondary.main},
									4px 0px ${theme.palette.secondary.main},
									-4px 0px ${theme.palette.secondary.main},
									4px -4px ${theme.palette.secondary.main},
									-4px 4px ${theme.palette.secondary.main},
									0px 4px ${theme.palette.secondary.main},
									0px -4px ${theme.palette.secondary.main}
								`,
              }}
              className="font-bold text-[44px] leading-snug line-clamp-3"
            >
              {name}
            </Typography>
          </div>

          <div className="flex flex-col grow">
            <div className="grow flex">
              <div className="mt-auto mb-8 max-w-[200px]">
                <img src="/map-pin.png" alt="map-pin" className="w-9 mb-2 opacity-50" />
                <p className="font-semibold leading-none">Located: {location}</p>
              </div>
            </div>
            <Link to={`/projects/${project._id}`}>
              <Button
                variant="outlined"
                color="inherit"
                className="capitalize text-base w-fit px-[60px] py-[14px] font-normal"
              >
                See More
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 -right-[26px] flex flex-col gap-4 text-white">
          <Button variant="contained" className="p-2 rounded-none shadow-none" onClick={onNext}>
            <MdOutlineKeyboardArrowRight size="36px" />
          </Button>
          <Button id="#nextButton" variant="contained" className="p-2 rounded-none shadow-none" onClick={onPrevious}>
            <MdOutlineKeyboardArrowLeft size="36px" />
          </Button>
        </div>
      </div>
      <div className="size-full grow bg-background">
        <img src={image} alt="project image" className="size-full object-cover brightness-95" />
      </div>
    </div>
  ) : (
    <div className="size-full flex flex-col relative">
      <img
        src={image}
        alt="project image"
        className="size-full object-cover absolute top-0 bottom-0 -z-10 brightness-95 border-collapse"
      />
      <div className="grow m-4">
        <Typography className="text-secondary text-[64px] xs:text-[88px] font-bold leading-none">{num}</Typography>
      </div>
      <div className="p-4 px-6 flex flex-col gap-2 min-h-[50%] text-white bg-gradient-to-t from-secondary from-40% to-secondary/0">
        <Typography
          title="MOUNTAIN VIEW APARTMENT HOTEL GISOZI"
          component="h2"
          sx={{
            textShadow: (theme) => `
									2px 2px ${theme.palette.secondary.main},
									-2px -2px ${theme.palette.secondary.main},
									2px 0px ${theme.palette.secondary.main},
									-2px 0px ${theme.palette.secondary.main},
									2px -2px ${theme.palette.secondary.main},
									-2px 2px ${theme.palette.secondary.main},
									0px 2px ${theme.palette.secondary.main},
									0px -2px ${theme.palette.secondary.main}
								`,
          }}
          className="font-bold text-[28px] xs:text-[40px] sm:text-[44px] leading-snug line-clamp-3"
        >
          {name}
        </Typography>
        <p className="text-sm sm:text-base italic font-extralight mb-auto">{period}</p>
        <Link to={`/projects/${project._id}`}>
          <Button
            variant="outlined"
            color="inherit"
            className="capitalize w-full px-[40px] py-[8px] xs:py-[12px] mt-2 font-normal"
          >
            See More
          </Button>
        </Link>
      </div>
    </div>
  );
};

const Projects = () => {
  const dispatch = useDispatch<any>();
  const projects = useSelector(selectAllProjects);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const carouselRef = useRef<CarouselRef>(null);
  const projectsContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const isSmallMobile = useMediaQuery("(max-width: 425px)");

  useEffect(() => {
    dispatch(getAllProjects({ skip: 0, limit: 10 })).then(() => {
      setIsLoading(false);
    });
  }, [dispatch]);
  useLayoutEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 100, x: -100 },
      {
        opacity: 1,
        y: 0,
        x: 0,
        duration: 1,
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 150%",
          end: "top 20%",
          scrub: true,
          toggleActions: "play none none none",
        },
      }
    );

    gsap.fromTo(
      buttonRef.current,
      { opacity: 0, y: 100, x: 100 },
      {
        opacity: 1,
        y: 0,
        x: 0,
        duration: 1,
        scrollTrigger: {
          trigger: buttonRef.current,
          start: "top 150%",
          end: "top 20%",
          scrub: true,
          toggleActions: "play none none none",
        },
      }
    );

    gsap.fromTo(
      carouselContainerRef.current,
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: carouselContainerRef.current,
          start: "top 150%",
          end: "top 20%",
          scrub: true,
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  return (
    <div
      ref={projectsContainerRef}
      id="projects"
      className="px-4 py-8 md:p-8 flex flex-col gap-8 relative overflow-hidden"
    >
      <Box
        component="img"
        src="/images/bg-3.png"
        className="size-full -z-10 absolute top-0 left-0 object-cover opacity-20"
      />
      <div className="w-full flex flex-row flex-wrap gap-4 justify-between items-center">
        <Title title="PROJECTS" ref={titleRef} />
        {!isSmallMobile && (
          <Link to="/projects">
            <Button
              ref={buttonRef}
              variant="contained"
              color="secondary"
              className="capitalize text-base w-fit px-10 font-normal"
            >
              View All
            </Button>
          </Link>
        )}
      </div>
      <div
        ref={carouselContainerRef}
        className="aspect-square md:aspect-auto w-full md:size-full min-h-[350px] md:h-[521px] relative"
      >
        {isLoading && (
          <Skeleton
            animation="wave"
            variant="rectangular"
            height="100%"
            width="100%"
            className="flex items-center justify-center font-bold text-3xl text-secondary"
          >
            Fetching Projects...
          </Skeleton>
        )}
        {!isLoading && projects?.length > 0 && (
          <Carousel ref={carouselRef}>
            {projects.slice(0, 10).map((project, index) => (
              <ProjectCard
                onPrevious={() => carouselRef.current?.onPreviousClick()}
                onNext={() => carouselRef.current?.onNextClick()}
                key={project._id}
                position={index + 1}
                project={project}
              />
            ))}
          </Carousel>
        )}
        {!isLoading && !(projects?.length > 0) && (
          <div className="size-full flex items-center justify-center">
            <div className="text-center max-w-[900px] px-8 py-16 mx-auto col-span-full bg-white/50">
              <h3 className="text-primary-foreground font-medium text-xl md:text-3xl mb-2">No projects found!</h3>
              <p className="text-dark text-sm md:text-base">
                We are currently working on new projects. Please check back later!
              </p>
            </div>
          </div>
        )}
      </div>
      {isSmallMobile && (
        <Link to="/projects">
          <Button variant="contained" color="secondary" className="capitalize text-base w-full px-10 font-normal">
            View All
          </Button>
        </Link>
      )}
    </div>
  );
};

export default Projects;
