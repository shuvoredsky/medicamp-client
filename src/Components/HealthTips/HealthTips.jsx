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
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">
          Health Tips
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 text-center"
            >
              <div className="text-4xl mb-4">{tip.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {tip.title}
              </h3>
              <p className="text-gray-600">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthTips;
