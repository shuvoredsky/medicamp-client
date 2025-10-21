import React from "react";
import Lottie from "lottie-react";
import heroLottie from "../../../public/medicamp-hero lottie.json";

const HeroSection = () => {
  return (
    <section className="bg-black text-white min-h-screen flex items-center justify-center px-6 md:px-16 py-10">
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl gap-10">
        {/* Left side text */}
        <div className="flex-1 text-center md:text-left space-y-5">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Welcome to{" "}
            <span className="text-[#00E5FF] drop-shadow-[0_0_8px_#00E5FF]">
              MediCamp
            </span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-md mx-auto md:mx-0">
            Join and manage medical camps effortlessly. Empower communities with
            better healthcare access and smart organization.
          </p>
          <div>
            <button className="mt-4 bg-[#00E5FF] text-black  px-8 py-3 rounded-full hover:bg-[#00bcd4] transition-all duration-300 font-bold">
              Explore Now
            </button>
          </div>
        </div>

        {/* Right side Lottie Animation */}
        <div className="flex-1 flex justify-center md:justify-end">
          <Lottie
            animationData={heroLottie}
            loop
            className="w-64 sm:w-80 md:w-[400px] lg:w-[500px]"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
