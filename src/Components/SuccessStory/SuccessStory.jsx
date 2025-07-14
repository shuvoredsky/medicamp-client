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
    <div className="py-8 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">
        Success Stories
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
        {stories.map((story, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col justify-between"
          >
            <div className="h-40 bg-blue-100 flex items-center justify-center">
              <span className="text-4xl">👨‍⚕️</span>
            </div>
            <div className="p-4 text-center">
              <h3 className="text-xl font-semibold mb-2">{story.name}</h3>
              <p className="text-gray-600 mb-2 italic">" {story.quote} "</p>
              <p className="text-blue-600 font-bold">Camp: {story.camp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuccessStory;
