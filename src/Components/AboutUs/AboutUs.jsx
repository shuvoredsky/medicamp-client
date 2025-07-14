import React from "react";
import { useNavigate } from "react-router";

const AboutUs = () => {
  const navigate = useNavigate();
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">
          About Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-gray-700">
            <p className="mb-4">
              MediCamp is a dedicated non-profit initiative launched in 2023,
              aimed at bringing free healthcare services to underserved rural
              areas. Our mission is to ensure that everyone has access to basic
              medical care, regardless of their financial situation. Through our
              mobile health camps, we provide free check-ups, vaccinations, and
              health consultations across Bangladesh.
            </p>
            <p className="mb-4">
              With a team of skilled healthcare professionals and volunteers,
              we’ve successfully served thousands of patients, improving lives
              one camp at a time. Join us in our journey to make healthcare
              accessible to all.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="bg-blue-100 rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold text-blue-800 mb-2">
                Our Mission
              </h3>
              <p className="text-gray-600">
                To provide affordable and quality healthcare services to every
                community, fostering a healthier future.
              </p>
              <button
                onClick={() => navigate("/available-camps")}
                className="mt-4 cursor-pointer bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
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
