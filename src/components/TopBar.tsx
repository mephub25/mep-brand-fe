import React from "react";
import { BsPhone } from "react-icons/bs";
import { IoPaperPlaneOutline } from "react-icons/io5";

const TopBar: React.FC = () => {
  return (
    <div className="bg-foreground md:flex hidden justify-between px-6 h-[64px] py-2">
      <img src="/logo-full.png" alt="logo" />
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <BsPhone className="text-secondary text-3xl" />
          <div className="">
            <h1 className="font-bold text-primary uppercase">Call Us</h1>
            <p className="text-dark text-sm">+250 781 175 264</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <IoPaperPlaneOutline className="text-secondary text-3xl" />
          <div className="">
            {" "}
            <h1 className="font-bold text-primary uppercase">Email Us</h1>
            <p className="text-dark text-sm">meperictric40@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
