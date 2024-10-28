import { Button, TextField } from "@mui/material";
import { CiMail } from "react-icons/ci";
import { FiMapPin, FiPhone } from "react-icons/fi";
import BackButton from "../../components/BackButton";
import Footer, { mediaLinks } from "../../components/Footer";
import NavBar from "../../components/NavBar";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TopBar from "../../components/TopBar";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const backRef = useRef<HTMLDivElement | null>(null);
  const pageHeaderRef = useRef<HTMLDivElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const userRef: any = useRef(null);

  useLayoutEffect(() => {
    gsap.fromTo(
      backRef.current,
      { opacity: 0, x: -50, scale: 0.5 },
      {
        opacity: 1,
        x: 0,
        duration: 2,
        delay: 0.5,
        scale: 1,
        stagger: 0.3,
        ease: "power4.out",
      }
    );

    gsap.fromTo(
      boxRef.current,
      { opacity: 1, scale: 0.5 },
      {
        opacity: 1,
        duration: 2,
        delay: 0.5,
        scale: 1,
        stagger: 0.3,
        ease: "power4.out",
      }
    );

    gsap.fromTo(
      userRef.current,
      { opacity: 1, scale: 0.5, y: 70 },
      {
        opacity: 1,
        duration: 2,
        y: 0,
        delay: 0.5,
        scale: 1,
        stagger: 0.3,
        ease: "power4.out",
      }
    );

    ScrollTrigger.create({
      animation: gsap.fromTo(
        backRef.current,
        { opacity: 0, x: -50, scale: 0.5 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          scale: 1,
          stagger: 0.3,
          delay: 0.5,
          ease: "power4.out",
        }
      ),
      trigger: backRef.current,
      start: "top 100%",
      end: "top 50%",
      toggleActions: "play none none none",
      scrub: true,
    });

    ScrollTrigger.create({
      animation: gsap.fromTo(
        boxRef.current,
        { scale: 0.7 },
        {
          duration: 1,
          scale: 1,
          stagger: 0.3,
          delay: 0.5,
          ease: "power4.out",
        }
      ),
      trigger: boxRef.current,
      start: "top 100%",
      end: "top 50%",
      toggleActions: "play none none none",
      scrub: true,
    });

    gsap.fromTo(
      pageHeaderRef.current,
      { x: -100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        delay: 0.5,
        ease: "power4.out",
      }
    );
  }, []);
  return (
    <div>
      <TopBar />
      <NavBar />
      <div id="contact" className="min-h-[1440px] relative bg-background">
        <div className="relative md:h-[calc(100vh_-_64px)] h-screen contact-container flex flex-col max-h-[640px] md:min-h-[540px] min-h-auto">
          <div className="z-50 flex-1 w-full md:w-auto md:text-center text-left absolute md:left-[150px] left-1/2 md:top-1/3 top-[15%] transform md:translate-x-0 -translate-x-1/2 -translate-y-1/2">
            <div ref={backRef} className="md:pl-0 pl-4">
              <BackButton />
            </div>
          </div>
          <div
            ref={pageHeaderRef}
            className="z-50 flex-1 w-full md:w-auto text-center md:text-left absolute md:left-[150px] left-1/2 md:top-1/2 sm:top-[60%] top-[25%] transform md:translate-x-0 -translate-x-1/2 -translate-y-1/2"
          >
            <h1 className="text-white xs:text-6xl text-4xl font-bold uppercase">
              Contact Us
            </h1>
            <p className="text-white/90 md:block xs:hidden block">
              Twegere tuguhe ibyo ushaka byose
            </p>
          </div>
          <img
            ref={userRef}
            src="/images/secretary.png"
            className="w-auto md:h-[500px] h-auto absolute md:bottom-[60px] xs:bottom-[150px] bottom-[25%] right-0"
          />
        </div>
        <div className="z-10 relative">
          <div
            ref={boxRef}
            className="lg:w-[80%] xs:w-[90%] w-[98%] max-w-[1150px] min-h-[600px] absolute -top-[1px] left-1/2 -translate-x-1/2 -translate-y-[30%] flex items-stretch shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-[40px] z-10 bg-white"
          >
            <div className="bg-white w-2/5 min-w-[300px] h-full rounded-l-[40px] lg:px-6 px-3  py-10 md:block hidden">
              <h1 className="font-bold text-3xl text-center">Get in touch</h1>
              <div className="flex gap-2 mt-8">
                <div className="flex items-center justify-center w-14 h-14 p-3 bg-primary rounded-full">
                  <FiMapPin className="text-white text-3xl" />
                </div>
                <div className="">
                  <h1 className="text-[20px] font-bold">Head Office</h1>
                  <h1 className="">
                    Remera - Gisimenti/ Ikaze House F2-22; Kigali - Rwanda
                  </h1>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <div className="flex items-center justify-center w-14 h-14 p-3 bg-primary rounded-full">
                  <CiMail className="text-white text-4xl" />
                </div>
                <div className="">
                  <h1 className="text-[20px] font-bold">Email Us</h1>
                  <h1 className="">meperictric40@gmail.com</h1>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <div className="flex items-center justify-center w-14 h-14 p-3 bg-primary rounded-full">
                  <FiPhone className="text-white text-3xl" />
                </div>
                <div className="">
                  <h1 className="text-[20px] font-bold">Call Us </h1>
                  <h1 className="">
                    <span className="font-semibold">Phone:</span>
                    +250781175264{" "}
                  </h1>
                </div>
              </div>
              <div className="w-full h-[0.5px] bg-dark/50 my-10" />
              <div className="px-4">
                <h1 className="text-[18px] font-bold">
                  Follow our social media
                </h1>
                <div className="flex flex-row flex-wrap gap-2 items-center mt-3">
                  {mediaLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      className="text-white p-3 rounded-full bg-primary hover:bg-primary/80 transition-colors duration-200"
                    >
                      <link.component size="20px" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-primary md:rounded-r-[40px] rounded-r-[10px] md:rounded-l-none rounded-l-[10px] flex-1 py-10">
              <h1 className="sm:text-4xl text-2xl font-bold text-center text-white">
                Send us a message
              </h1>
              <div className="sm:px-8 px-4 pt-8">
                <div className="">
                  <h1 className="text-white mb-2">Names</h1>
                  <TextField
                    sx={{
                      input: {
                        color: "#fff",
                      },
                    }}
                    inputProps={{ style: { height: 36 } }}
                    variant="standard"
                    InputProps={{
                      disableUnderline: true,
                    }}
                    fullWidth
                    size="medium"
                    className="text-xs bg-white/20 text-white rounded-md ring-0 border-none pl-4"
                  />
                </div>
                <div className="mt-4">
                  <h1 className="text-white mb-2">Email</h1>
                  <TextField
                    sx={{
                      input: {
                        color: "#fff",
                      },
                    }}
                    inputProps={{ style: { height: 36 } }}
                    variant="standard"
                    InputProps={{
                      disableUnderline: true,
                    }}
                    fullWidth
                    size="medium"
                    className="text-xs bg-white/20 text-white rounded-md ring-0 border-none pl-4"
                  />
                </div>
                <div className="mt-4">
                  <h1 className="text-white mb-2">Subject</h1>
                  <TextField
                    sx={{
                      input: {
                        color: "#fff",
                      },
                    }}
                    inputProps={{ style: { height: 36 } }}
                    variant="standard"
                    InputProps={{
                      disableUnderline: true,
                    }}
                    fullWidth
                    size="medium"
                    className="text-xs bg-white/20 text-white rounded-md ring-0 border-none pl-4"
                  />
                </div>
                <div className="mt-4">
                  <h1 className="text-white mb-2">Message</h1>
                  <TextField
                    id="outlined-multiline-flexible"
                    sx={{
                      input: {
                        color: "#fff",
                      },
                    }}
                    inputProps={{ style: { height: 36 } }}
                    variant="standard"
                    InputProps={{
                      disableUnderline: true,
                    }}
                    fullWidth
                    multiline
                    rows={3}
                    size="medium"
                    className="text-xs bg-white/20 text-white rounded-md ring-0 border-none pl-4"
                  />
                </div>
                <Button
                  variant="contained"
                  className="mt-8 w-full bg-secondary text-white hover:bg-secondary/50 hover:text-white h-[45px] capitalize font-semibold text-xl"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-[100px] right-0 left-0 h-[400px] w-full bg-black/0 md:pt-0 pt-12">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.482461408577!2d30.105876074588245!3d-1.960674798021562!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca65447effcd3%3A0xd265fb1830816643!2sIKAZE%20Internet%20Cafe%20and%20photo%20studio%20Kismenti%20Remera!5e0!3m2!1sen!2srw!4v1725787049666!5m2!1sen!2srw"
            style={{ border: 0 }}
            loading="lazy"
            className="w-full h-full"
          ></iframe>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Contact;
