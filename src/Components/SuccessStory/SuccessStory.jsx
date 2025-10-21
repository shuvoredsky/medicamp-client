import React from "react";
import ScrollStack, { ScrollStackItem } from "./ScrollStack"; // Path adjust
import "./ScrollStack.css";

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

  const handleStackComplete = () => {
    console.log("Story stack animation complete!");
  };

  return (
    <div className="py-12 bg-black text-white">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-[#00E5FF] px-4">
        Success Stories
      </h2>

      <ScrollStack
        useWindowScroll={false} // Fix: Container-based, no global conflict
        className="max-w-4xl mx-auto px-4 min-h-screen" // Add min-h for scroll space
        itemDistance={60} // Increased gap
        itemScale={0.04} // Slightly less scale for subtle effect
        itemStackDistance={60} // More spacing in stack
        stackPosition="50%" // Later start for gradual animation
        scaleEndPosition="5%" // Longer animation duration
        baseScale={0.95} // Bigger base
        rotationAmount={1} // Reduced rotation
        blurAmount={0.5} // Reduced blur
        onStackComplete={handleStackComplete}
      >
        {stories.map((story, index) => (
          <ScrollStackItem key={index}>
            <div className="story-card bg-white rounded-xl border border-teal-100 shadow-md flex flex-col overflow-hidden">
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
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </div>
  );
};

export default SuccessStory;
