import React from "react";

const SuccessStory = () => {
  const stories = [
    {
      name: "Rahim Ullah",
      quote:
        "Thanks to MediCamp's free check-up, my diabetes was detected, and I'm on the road to recovery!",
      camp: "Dhaka Health Camp - July 2024",
    },
    {
      name: "Fatima Begum",
      quote:
        "My son's vaccination was provided free at MediCamp, and I'm very grateful!",
      camp: "Chittagong Vaccination Camp - June 2024",
    },
    {
      name: "Md. Hasan",
      quote:
        "MediCamp's cancer awareness camp gave me life-changing consultation!",
      camp: "Sylhet Cancer Awareness Camp - May 2024",
    },
    {
      name: "Ayesha Khan",
      quote:
        "My family's health check-up was supported by MediCamp, and we're satisfied!",
      camp: "Rajshahi Family Health Camp - August 2024",
    },
    {
      name: "Kamal Hossain",
      quote:
        "MediCamp helped me get a free eye check-up, improving my vision significantly!",
      camp: "Khulna Eye Care Camp - September 2024",
    },
    {
      name: "Sara Ahmed",
      quote: "The dental camp by MediCamp saved me from a serious tooth issue!",
      camp: "Barisal Dental Health Camp - October 2024",
    },
  ];

  return (
    <div className="py-12 bg-teal-50">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-teal-700">
        Success Stories
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
        {stories.map((story, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-teal-100 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex flex-col overflow-hidden"
          >
            <div className="h-40 bg-teal-200 flex items-center justify-center text-white text-5xl">
              👨‍⚕️
            </div>
            <div className="p-6 text-center flex flex-col flex-1">
              <h3 className="text-lg font-bold text-teal-700 mb-2">
                {story.name}
              </h3>
              <p className="text-gray-600 mb-3 italic leading-relaxed">
                "{story.quote}"
              </p>
              <p className="text-teal-600 font-semibold mt-auto">
                {story.camp}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuccessStory;
