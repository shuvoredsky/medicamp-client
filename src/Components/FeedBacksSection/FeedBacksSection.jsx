import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Rate, Spin, Alert } from "antd";
import dayjs from "dayjs";

const FeedBacksSection = () => {
  const {
    data: feedbacks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["feedbacks"],
    queryFn: async () => {
      const res = await axios.get(
        "https://assignment-12-server-seven-plum.vercel.app/feedbacks"
      );
      return res.data;
    },
  });

  if (isLoading)
    return (
      <div className="flex justify-center py-10">
        <Spin tip="Loading feedbacks..." size="large" />
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center py-10">
        <Alert message="Error fetching feedbacks" type="error" showIcon />
      </div>
    );

  return (
    <div className="py-10 px-4 md:px-10 bg-gray-100">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
        What Participants Say About Our Camps
      </h2>

      {feedbacks && feedbacks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedbacks.map((fb) => (
            <div
              key={fb._id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {fb.participantEmail}
              </h3>
              <p className="text-gray-600 mb-3">{fb.comment}</p>
              <div className="flex items-center justify-between">
                <Rate disabled defaultValue={fb.rating || 0} />
                <span className="text-sm text-gray-400">
                  {dayjs(fb.submittedAt).format("DD MMM, YYYY")}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No feedbacks available.</p>
      )}
    </div>
  );
};

export default FeedBacksSection;
