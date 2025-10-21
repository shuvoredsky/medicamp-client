import React from "react";

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
    <div className="py-12 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-[#00E5FF]">
          Health Tips
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-teal-100 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 p-6 text-center"
            >
              {/* Icon Circle */}
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-r from-teal-500 to-teal-600 text-white text-3xl">
                {tip.icon}
              </div>

              <h3 className="text-xl font-semibold text-teal-700 mb-2">
                {tip.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthTips;
