import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import axios from "axios";
import { Spin } from "antd";
import { motion } from "framer-motion";

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
        <Spin tip="Loading camps..." size="large" />
      </div>
    );
  if (isError)
    return <p className="text-center text-red-500">Failed to load camps.</p>;

  const popularCamps = [...camps]
    .sort((a, b) => b.participants - a.participants)
    .slice(0, 6);

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto bg-black text-white">
      <h2 className="text-3xl md:text-4xl font-extrabold text-[#00E5FF] mb-8 text-center">
        Popular Medical Camps
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {popularCamps.map((camp) => (
          <motion.div
            key={camp._id}
            className="relative rounded-xl overflow-hidden bg-[#0f2027] border border-transparent p-[2px] group"
            whileHover={{
              background:
                "radial-gradient(circle at center, rgba(0, 102, 255, 0.4), transparent 70%)",
              boxShadow: "0 0 50px rgba(0, 108, 255, 4)",
            }}
            transition={{
              duration: 0.4,
              ease: "easeInOut",
            }}
          >
            {/* Glowing effect only on hover */}
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-transparent opacity-0 group-hover:opacity-100"
              animate={{
                background: [
                  "linear-gradient(90deg, #00E5FF, transparent)",
                  "linear-gradient(180deg, #00E5FF, transparent)",
                  "linear-gradient(270deg, #00E5FF, transparent)",
                  "linear-gradient(360deg, #00E5FF, transparent)",
                ],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              }}
              style={{
                maskImage:
                  "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
              }}
            />

            {/* Card content */}
            <div className="relative z-10 bg-[#0f2027] rounded-xl overflow-hidden">
              <motion.img
                src={camp.image}
                alt={camp.campName}
                className="w-full h-48 object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5 }}
              />
              <div className="p-5 space-y-2 text-sm">
                <h3 className="text-lg font-semibold text-[#00E5FF]">
                  {camp.campName}
                </h3>
                <p>📍 {camp.location}</p>
                <p>💰 ${camp.fees}</p>
                <p>🗓️ {camp.dateTime}</p>
                <p>👨‍⚕️ {camp.doctorName}</p>
                <p className="font-medium text-[#00B8FF]">
                  👥 {camp.participants || 0} Participants
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-10">
        <Link
          to="/available-camps"
          className="inline-block px-6 py-3 font-bold text-black rounded-lg shadow-md bg-[#00E5FF] transition-all duration-300 transform hover:scale-105"
        >
          See All Camps
        </Link>
      </div>
    </section>
  );
};

export default CampSection;
