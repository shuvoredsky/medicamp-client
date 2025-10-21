import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import useParticipantAnalytics from "../../Hooks/useParticipantAnalytics";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#a78bfa",
  "#f472b6",
];

const ParticipantAnalytics = () => {
  const { data = [], isLoading } = useParticipantAnalytics();

  if (isLoading) {
    return <p className="text-center py-10 text-base">Loading Chart...</p>;
  }

  if (!data.length) {
    return (
      <p className="text-center py-10 text-gray-500 text-base">
        No registered camp data available to show.
      </p>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-white shadow-md rounded-lg max-w-full overflow-hidden">
      <h2 className="text-xl sm:text-2xl font-bold text-teal-600 text-center mb-6">
        Camp Registration Analytics (Pie Chart)
      </h2>

      {/* Chart Container */}
      <div className="w-full h-[300px] sm:h-[400px] mb-10">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="fees"
              nameKey="campName"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, value }) => `${name}: ৳${value}`}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `৳${value}`} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Registered Camps Details
        </h3>

        <table className="min-w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border px-3 py-2">#</th>
              <th className="border px-3 py-2">Camp Name</th>
              <th className="border px-3 py-2">Fees</th>
              <th className="border px-3 py-2">Location</th>
              <th className="border px-3 py-2">Doctor</th>
              <th className="border px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((camp, index) => (
              <tr key={camp._id || index} className="hover:bg-gray-50">
                <td className="border px-3 py-2">{index + 1}</td>
                <td className="border px-3 py-2">{camp.campName}</td>
                <td className="border px-3 py-2">৳{camp.fees}</td>
                <td className="border px-3 py-2">{camp.location}</td>
                <td className="border px-3 py-2">{camp.doctorName}</td>
                <td className="border px-3 py-2 capitalize text-green-600 font-medium">
                  {camp.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ParticipantAnalytics;
