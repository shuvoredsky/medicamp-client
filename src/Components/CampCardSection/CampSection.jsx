import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import axios from "axios";

const fetchCamps = async () => {
  const res = await axios.get("http://localhost:3000//camps");
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

  if (isLoading) return <p className="text-center py-10">Loading camps...</p>;
  if (isError)
    return <p className="text-center text-red-500">Failed to load camps.</p>;

  // Sort by highest participants and take top 6
  const popularCamps = [...camps]
    .sort((a, b) => b.participants - a.participants)
    .slice(0, 6);

  return (
    <section className="py-10 px-4 max-w-7xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-semibold text-center text-blue-700 mb-6">
        Popular Medical Camps
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {popularCamps.map((camp) => (
          <div
            key={camp._id}
            className="bg-white rounded-lg border-2 border-blue-500 shadow hover:shadow-lg transition-all duration-200"
          >
            <img
              src={camp.image}
              alt={camp.campName}
              className="w-full h-40 sm:h-48 object-cover rounded-t-lg"
            />
            <div className="p-4 space-y-1 text-sm">
              <h3 className="text-base font-bold text-blue-600">
                {camp.campName}
              </h3>
              <p className="text-gray-600">📍 {camp.location}</p>
              <p className="text-gray-600">💰 ${camp.fees}</p>
              <p className="text-gray-600">🗓️ {camp.dateTime}</p>
              <p className="text-gray-600">👨‍⚕️ {camp.doctorName}</p>
              <p className="text-green-600 font-medium">
                👥 {camp.participants || 0} Participants
              </p>
              <p className="text-gray-500 text-xs line-clamp-2">
                {camp.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          to="/available-camps"
          className="inline-block text-sm px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          See All Camps
        </Link>
      </div>
    </section>
  );
};

export default CampSection;
