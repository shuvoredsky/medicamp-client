import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const AddCamp = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Mutation to post new camp data
  const { mutate, isPending } = useMutation({
    mutationFn: async (campData) => {
      const res = await axios.post("http://localhost:3000/camps", campData);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Camp added successfully!");
      reset();
    },
    onError: () => {
      toast.error("Failed to add camp.");
    },
  });

  // Submit handler
  const onSubmit = (data) => {
    const newCamp = {
      campName: data.campName,
      image: data.image,
      fees: parseFloat(data.fees),
      dateTime: data.dateTime,
      location: data.location,
      doctorName: data.doctorName,
      participants: 0,
      description: data.description,
    };

    mutate(newCamp);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Add Medical Camp
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Camp Name */}
        <div>
          <label className="block font-medium">Camp Name</label>
          <input
            type="text"
            {...register("campName", { required: "Camp Name is required" })}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.campName && (
            <p className="text-red-500 text-sm">{errors.campName.message}</p>
          )}
        </div>

        {/* Image URL */}
        <div>
          <label className="block font-medium">Image URL</label>
          <input
            type="text"
            {...register("image", { required: "Image URL is required" })}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image.message}</p>
          )}
        </div>

        {/* Fees */}
        <div>
          <label className="block font-medium">Camp Fees (BDT)</label>
          <input
            type="number"
            {...register("fees", { required: "Fees required", min: 0 })}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.fees && (
            <p className="text-red-500 text-sm">{errors.fees.message}</p>
          )}
        </div>

        {/* Date & Time */}
        <div>
          <label className="block font-medium">Date & Time</label>
          <input
            type="datetime-local"
            {...register("dateTime", { required: "Date and time required" })}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.dateTime && (
            <p className="text-red-500 text-sm">{errors.dateTime.message}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block font-medium">Location</label>
          <input
            type="text"
            {...register("location", { required: "Location is required" })}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location.message}</p>
          )}
        </div>

        {/* Doctor Name */}
        <div>
          <label className="block font-medium">
            Healthcare Professional Name
          </label>
          <input
            type="text"
            {...register("doctorName", { required: "Doctor name required" })}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.doctorName && (
            <p className="text-red-500 text-sm">{errors.doctorName.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            className="w-full border px-3 py-2 rounded"
            rows={4}
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? "Submitting..." : "Add Camp"}
        </button>
      </form>
    </div>
  );
};

export default AddCamp;
