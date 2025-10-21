import React from "react";
import { useNavigate } from "react-router";

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="py-16 bg-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-teal-700">
          About Us
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left Content */}
          <div className="text-gray-700 leading-relaxed space-y-4">
            <p>
              MediCamp is a dedicated non-profit initiative launched in 2023,
              aimed at bringing free healthcare services to underserved rural
              areas. Our mission is to ensure that everyone has access to basic
              medical care, regardless of their financial situation. Through our
              mobile health camps, we provide free check-ups, vaccinations, and
              health consultations across Bangladesh.
            </p>
            <p>
              With a team of skilled healthcare professionals and volunteers,
              we’ve successfully served thousands of patients, improving lives
              one camp at a time. Join us in our journey to make healthcare
              accessible to all.
            </p>
          </div>

          {/* Right Mission Card */}
          <div className="flex justify-center">
            <div className="bg-teal-200 border border-teal-200 rounded-xl p-8 shadow-md w-full max-w-md">
              <h3 className="text-xl font-semibold text-gray-700 mb-3">
                Our Mission
              </h3>
              <p className="text-black leading-relaxed">
                To provide affordable and quality healthcare services to every
                community, fostering a healthier future.
              </p>
              <button
                onClick={() => navigate("/available-camps")}
                className="mt-6 cursor-pointer font-semibold bg-teal-700 text-white px-6 py-2 rounded-lg hover:bg-teal-900 transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
