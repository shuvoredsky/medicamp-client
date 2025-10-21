import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import axios from "axios";
import { Spin } from "antd";

const fetchCamps = async () => {
  const res = await axios.get("https://medicamp-api.onrender.com/camps");
  return res.data;
};

const CampSection = () => {
  const {
    data: camps = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["camps"],
    queryFn: fetchCamps,
  });

  if (isLoading)
    return (
      <div className="flex justify-center py-10">
        <Spin tip="Loading feedbacks..." size="large" />
      </div>
    );
  if (isError)
    return <p className="text-center text-red-500">Failed to load camps.</p>;

  // Sort by highest participants and take top 6
  const popularCamps = [...camps]
    .sort((a, b) => b.participants - a.participants)
    .slice(0, 6);

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto bg-teal-50">
      <h2 className="text-3xl md:text-4xl font-extrabold text-teal-800 mb-8 text-center tracking-tight">
        Popular Medical Camps
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {popularCamps.map((camp) => (
          <div
            key={camp._id}
            className="bg-gradient-to-br from-teal-100 to-teal-50 rounded-xl border border-teal-200 shadow-lg hover:shadow-xl hover:scale-105 hover:border-teal-300 transition-all duration-300 overflow-hidden group"
          >
            <img
              src={camp.image}
              alt={camp.campName}
              className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-300"
            />
            <div className="p-5 space-y-2 text-sm">
              <h3 className="text-lg font-semibold text-teal-900 line-clamp-1">
                {camp.campName}
              </h3>
              <p className="text-teal-700">📍 {camp.location}</p>
              <p className="text-teal-700">💰 ${camp.fees}</p>
              <p className="text-teal-700">🗓️ {camp.dateTime}</p>
              <p className="text-teal-700">👨‍⚕️ {camp.doctorName}</p>
              <p className="text-teal-800 font-medium">
                👥 {camp.participants || 0} Participants
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <Link
          to="/available-camps"
          className="inline-block px-6 py-3 font-semibold bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg shadow-md hover:from-teal-700 hover:to-teal-800 transition-all duration-300 transform hover:scale-105"
        >
          See All Camps
        </Link>
      </div>
    </section>
  );
};

export default CampSection;
