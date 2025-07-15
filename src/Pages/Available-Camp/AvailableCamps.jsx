import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router"; // Corrected import for Link
import useAxiosSecure from "../../Hooks/useAxiosSecure"; // Adjust path if needed
import { Helmet } from "react-helmet-async";

const AvailableCamps = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [layoutColumns, setLayoutColumns] = useState(3);

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

  // Filter and sort camps
  const filteredCamps = camps
    .filter(
      (camp) =>
        camp.campName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        camp.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        camp.dateTime.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "mostRegistered") {
        return (b.participants || 0) - (a.participants || 0);
      } else if (sortBy === "campFees") {
        return a.fees - b.fees;
      } else if (sortBy === "alphabetical") {
        return a.campName.localeCompare(b.campName);
      }
      return 0;
    });

  if (isLoading) return <p className="text-center py-10">Loading camps...</p>;
  if (isError)
    return <p className="text-center text-red-500">Failed to load camps.</p>;

  return (
    <section className="py-10 px-4 max-w-7xl mx-auto">
      <Helmet>
        <title>Medicamp | Available Camp</title>
      </Helmet>
      <h2 className="text-3xl font-semibold text-center text-blue-700 mb-8">
        Available Medical Camps
      </h2>

      {/* Search and Sort Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name, location, or date..."
          className="w-full sm:w-2/3 lg:w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="w-full sm:w-1/3 lg:w-1/4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="default">Sort By</option>
          <option value="mostRegistered">Most Registered</option>
          <option value="campFees">Camp Fees (Low to High)</option>
          <option value="alphabetical">Alphabetical Order</option>
        </select>
        <button
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={() => setLayoutColumns(layoutColumns === 3 ? 2 : 3)}
        >
          Switch to {layoutColumns === 3 ? "2" : "3"} Columns
        </button>
      </div>

      {/* Camps Grid */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 ${
          layoutColumns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"
        } gap-6`}
      >
        {filteredCamps.map((camp) => (
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
      {filteredCamps.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No camps found.</p>
      )}
    </section>
  );
};

export default AvailableCamps;
