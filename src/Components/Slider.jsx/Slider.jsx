import React, { useState, useEffect } from "react";
import img1 from "../../assets/img1.jpg";
import img2 from "../../assets/img2.jpg";
import img3 from "../../assets/img3.jpg";

const images = [img1, img2, img3];
const sliderTexts = [
  {
    title: "Empowering Communities Through Health",
    subtitle: "Organize and join medical camps with ease.",
    caption: "A healthier community starts with one medical camp at a time.",
  },
  {
    title: "Your Health, Our Mission",
    subtitle: "Access affordable healthcare through our medical camps.",
    caption: "Bringing medical services closer to those who need them most.",
  },
  {
    title: "Connecting Participants and Professionals",
    subtitle: "Streamlined management for every camp.",
    caption: "Efficiently coordinate camps and improve public health outcomes.",
  },
];

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-screen-xl mx-auto mt-4">
      <div className="relative h-56 md:h-96 overflow-hidden rounded-lg">
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={img}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60"></div>

            {/* Text content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
              <h2 className="text-2xl md:text-4xl font-bold drop-shadow-lg">
                {sliderTexts[index].title}
              </h2>
              <p className="text-lg md:text-xl mt-2 drop-shadow-md">
                {sliderTexts[index].subtitle}
              </p>
              <p className="mt-4 italic text-sm md:text-base max-w-md drop-shadow-sm">
                {sliderTexts[index].caption}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Previous Button */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20 bg-gray-200 p-2 rounded-full hover:bg-gray-400"
      >
        ❮
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20 bg-gray-200 p-2 rounded-full hover:bg-gray-400"
      >
        ❯
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-purple-600" : "bg-gray-300"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
