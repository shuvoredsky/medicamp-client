import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import useAxiosSecure from "../../Hooks/useAxiosSecure"; // Adjust path if needed

const AvailableCamps = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: camps = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["available-camps"],
    queryFn: async () => {
      const res = await axiosSecure.get("/available-camps");
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center py-10">Loading camps...</p>;
  if (isError)
    return <p className="text-center text-red-500">Failed to load camps.</p>;

  return (
    <section className="py-10 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-semibold text-center text-blue-700 mb-8">
        Available Medical Camps
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {camps.map((camp) => (
          <div
            key={camp._id}
            className="bg-white rounded-lg shadow hover:shadow-md transition"
          >
            <img
              src={camp.image}
              alt={camp.campName}
              className="w-full h-48 object-cover rounded-t-lg"
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

              <div className="pt-2">
                <Link
                  to={`/camp-details/${camp._id}`}
                  className="inline-block text-xs px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AvailableCamps;
