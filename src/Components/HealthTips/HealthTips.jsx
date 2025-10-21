import React from "react";
import Lottie from "lottie-react";
import healthTipLottie from "../../../public/health-tips.json";

const HealthTips = () => {
  const tips = [
    {
      title: "Stay Hydrated",
      description:
        "Drink at least 8 glasses of water daily to maintain good health.",
      icon: "💧",
    },
    {
      title: "Exercise Regularly",
      description:
        "Aim for 30 minutes of physical activity every day to boost your energy.",
      icon: "🏃",
    },
    {
      title: "Eat Balanced Meals",
      description:
        "Include fruits, vegetables, and proteins in your diet for a healthy life.",
      icon: "🍎",
    },
  ];

  return (
    <section className="py-12 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-[#00E5FF]">
          Health Tips
        </h2>

        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Left side cards */}
          <div className="flex flex-col gap-4 flex-1">
            {/* First card */}
            <div className="bg-white rounded-xl border border-teal-100 shadow-md p-6 text-center hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex flex-col justify-center h-80">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-black text-white text-3xl">
                {tips[0].icon}
              </div>
              <h3 className="text-xl font-bold text-black mb-2">
                {tips[0].title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {tips[0].description}
              </p>
            </div>

            <div className="flex flex-row gap-4">
              {tips.slice(1).map((tip, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-teal-100 shadow-md p-4 text-center hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex flex-col justify-center h-40"
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center bg-black text-white text-2xl">
                    {tip.icon}
                  </div>
                  <h3 className="text-lg font-bold text-black mb-1">
                    {tip.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {tip.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right side Lottie */}
          <div className="flex-1 flex justify-center items-center">
            <Lottie
              animationData={healthTipLottie}
              loop={true}
              className="w-full max-w-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HealthTips;
