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
        "https://medicamp-api.onrender.com/feedbacks"
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
    <div className="py-12 px-4 md:px-10 bg-black">
      <h2 className="text-3xl md:text-4xl font-extrabold text-[#00E5FF] mb-8 text-center tracking-wide">
        Participants Feedback
      </h2>
      {feedbacks && feedbacks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedbacks.map((fb) => (
            <div
              key={fb._id}
              className="bg-gradient-to-br from-teal-700 to-teal-800 rounded-xl shadow-md p-6 hover:shadow-xl hover:scale-105 hover:from-teal-800 hover:to-teal-900 transition-all duration-300 transform"
            >
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2 line-clamp-1">
                {fb.participantEmail}
              </h3>
              <p className="text-white mb-4 text-sm md:text-base line-clamp-3">
                {fb.comment}
              </p>
              <div className="flex items-center justify-between">
                <Rate
                  disabled
                  defaultValue={fb.rating || 0}
                  style={{ color: "gold" }}
                />
                <span className="text-xs md:text-sm text-teal-100">
                  {dayjs(fb.submittedAt).format("DD MMM, YYYY")}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-teal-600 text-lg">
          No feedbacks available.
        </p>
      )}
    </div>
  );
};

export default FeedBacksSection;
