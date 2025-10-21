import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Rate, Spin, Alert } from "antd";
import dayjs from "dayjs";
import { motion } from "framer-motion";

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

  // Framer Motion variant for border glow animation
  const glowVariant = {
    hover: {
      boxShadow: "0 0 15px 4px rgba(0, 102, 255, 0.7)",
      rotate: [0, 5, -5, 0], // subtle rotation for dynamic effect
      transition: {
        duration: 0.8,

        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="py-12 px-4 md:px-10 bg-black">
      <h2 className="text-3xl md:text-4xl font-extrabold text-[#00E5FF] mb-8 text-center tracking-wide">
        Participants Feedback
      </h2>

      {feedbacks && feedbacks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedbacks.map((fb) => (
            <motion.div
              key={fb._id}
              className="relative bg-white border-2 border-transparent rounded-xl shadow-md p-6 transform transition-all duration-300 overflow-hidden"
              whileHover="hover"
              variants={glowVariant}
            >
              <h3 className="text-lg md:text-xl font-semibold text-black mb-2 line-clamp-1">
                {fb.participantEmail}
              </h3>
              <p className="text-gray-700 mb-4 text-sm md:text-base line-clamp-3">
                {fb.comment}
              </p>
              <div className="flex items-center justify-between">
                <Rate
                  disabled
                  defaultValue={fb.rating || 0}
                  style={{ color: "gold" }}
                />
                <span className="text-xs md:text-sm text-teal-600">
                  {dayjs(fb.submittedAt).format("DD MMM, YYYY")}
                </span>
              </div>
            </motion.div>
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
