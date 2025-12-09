import { Box } from "@mui/material";
import { LandingNavLinks } from "../constants/landing-navlinks";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { HiOutlineMapPin } from "react-icons/hi2";
import { HiOutlineMail } from "react-icons/hi";
import { FiPhone } from "react-icons/fi";
import { PiXLogoFill } from "react-icons/pi";

import { FaInstagram } from "react-icons/fa";
import { ImFacebook } from "react-icons/im";
import { FaYoutube } from "react-icons/fa";
import { scrollToSection } from "../utils/scroll.utils";

export const mediaLinks = [
  {
    name: "X",
    href: "https://x.com/MEPerictrictech?t=XFikwxcM8oRoNxgj151f1w&s=09",
    component: PiXLogoFill,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/meperictrictechnologyltd/?igsh=aGc1NHUwNXFwbnU3",
    component: FaInstagram,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/meperictrictechnologyltd",
    component: ImFacebook,
  },
  {
    name: "Youtube",
    href: "https://www.youtube.com/@MepErictric",
    component: FaYoutube,
  },
];

const Footer = () => {
  const onLinkClicked = (slug: string) => (e: any) => {
    e.preventDefault();
    scrollToSection(slug);
  };
  return (
    <div>
      <div className="px-5 py-8 md:p-8 bg-[#003154] text-white md:text-base text-sm">
        <div className="flex flex-row flex-wrap gap-8 justify-between">
          <a href="/#" onClick={onLinkClicked("home")}>
            <img
              src="/logo-full.png"
              alt="logo"
              className="max-w-[328px] w-full h-min bg-white py-1 px-2"
            />
          </a>
          <div className="flex flex-row flex-wrap gap-4 justify-between grow">
            <div>
              <h2 className="font-semibold text-2xl mb-1">Quick Links</h2>
              {LandingNavLinks.map((link) => (
                <div
                  key={link.name}
                  className="flex flex-row gap-1 my-2 items-center"
                >
                  <MdOutlineKeyboardArrowRight
                    size="24px"
                    className="text-[#AAAAAA]"
                  />
                  <a
                    href={link.href}
                    className="capitalize hover:text-secondary transition-colors duration-200"
                    onClick={onLinkClicked(link.slug)}
                  >
                    {link.name}
                  </a>
                </div>
              ))}
            </div>

            <div>
              <h2 className="font-semibold text-2xl mb-1">Our Address</h2>
              <div className="flex flex-row items-center gap-2 my-3">
                <HiOutlineMapPin size="35px" className="text-secondary" />
                <p>
                  Remera - Gisimenti,
                  <br />
                  Ikaze House F2-22
                </p>
              </div>
              <div className="flex flex-row items-center gap-2 my-3">
                <FiPhone size="35px" className="text-secondary" />
                <p>
                  +250781175264,
                </p>
              </div>
              <div className="flex flex-row items-center gap-2 my-3">
                <HiOutlineMail size="35px" className="text-secondary" />
                <p>meperictric40@gmail.com</p>
              </div>
            </div>

            <div>
              <h2 className="font-semibold text-2xl mb-1">Business Hours</h2>
              <Box
                component="table"
                sx={{
                  ["& td"]: {
                    padding: "5px 0",
                  },
                }}
              >
                <tbody>
                  <tr>
                    <td align="right" className="!pr-2 font-semibold">
                      Mon - Fri:
                    </td>
                    <td>9:00 am - 5:00 pm</td>
                  </tr>
                  <tr>
                    <td align="right" className="!pr-2 font-semibold">
                      Sat:
                    </td>
                    <td>09:00 am - 12:00 pm</td>
                  </tr>
                  <tr>
                    <td align="right" className="!pr-2 font-semibold">
                      Sun:
                    </td>
                    <td>Closed</td>
                  </tr>
                </tbody>
              </Box>
            </div>
          </div>
        </div>
        <div className="flex flex-row flex-wrap gap-6 items-center mt-8">
          {mediaLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              className="text-secondary p-[11px] rounded-full bg-white hover:bg-background transition-colors duration-200"
            >
              <link.component size="20px" />
            </a>
          ))}
        </div>
      </div>
      <div className="px-5 md:px-8 py-5 flex flex-col flex-wrap md:flex-row gap-2 items-center md:justify-between text-center bg-muted selection:bg-white leading-tight relative md:text-base text-sm">
        <p className="text-[#818181]">
          © 2024 meperictric technology ltd. All Right Reserved.
        </p>
        <Box
          className="text-[#AAAAAA] hover:text-secondary transition-colors duration-200"
          component="a"
          target="_blank"
          href="https://kiglance.com"
        >
          Securely powered by Kiglance
        </Box>
      </div>
    </div>
  );
};

export default Footer;
