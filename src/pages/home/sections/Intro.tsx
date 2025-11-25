import { useState } from "react";
import NavBar from "../../../components/NavBar";
import IntroSlider from "../../../components/IntroSlider";
import LoginOverlay from "../../authontication/login";

const slides = [
  {
    image: "/images/worker2.png",
    header:
      "Innovative Electrical and Mechanical Solutions for a Better Future",
    paragraph:
      "Our groundbreaking electrical and mechanical services are designed to push boundaries and drive progress. We focus on delivering efficient, sustainable solutions that meet today’s challenges while shaping a brighter tomorrow, ensuring your projects are future-ready and built to last.",
  },
  {
    image: "/images/worker3.png",
    header:
      "Precision Engineering Services That Enhance and Empower Everyday Life",
    paragraph:
      "We offer precision engineering services that seamlessly integrate into daily life, delivering top-tier solutions that empower communities and industries alike. Our attention to detail and commitment to quality ensure every project meets the highest standards of excellence.",
  },
  {
    image: "/images/worker4.png",
    header: "Expertly Crafted Systems Designed to Meet Your Unique Needs",
    paragraph:
      "Our systems are meticulously designed to cater to your unique requirements, providing reliable and innovative solutions. We take pride in crafting customized systems that blend innovation with practical application, offering efficiency and performance at every stage.",
  },
];

  

const Intro = () => {
  // Add state to control login overlay
 const [loginOpen, setLoginOpen] = useState(false);

  const handleCloseLogin = () => setLoginOpen(false);

  return (
    <div
      id="home"
      className="md:h-[calc(100vh_-_64px)] h-screen min-h-[500px] relative intro-container"
    >
      <div className="z-10">
        <NavBar />
        <IntroSlider slides={slides} setLoginOpen={setLoginOpen} />


      
       {/* Login overlay */}
        <LoginOverlay isOpen={loginOpen} onClose={handleCloseLogin} />
      </div>
    </div>
  );
};

export default Intro;
