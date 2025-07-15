import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { AuthContext } from "../Provider/AuthProvider";
import { imageUpload } from "../api/utils"; // Import the imageUpload function

const AddCamp = () => {
  const { user } = React.useContext(AuthContext);
  console.log(user);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);

  // Mutation to post new camp data
  const { mutate, isPending } = useMutation({
    mutationFn: async (campData) => {
      const res = await axios.post("http://localhost:3000/camps", campData);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Camp added successfully!");
      reset();
      setUploadedImage(null); // Reset image after success
    },
    onError: () => {
      toast.error("Failed to add camp.");
    },
  });

  // Submit handler with image upload
  const onSubmit = async (data) => {
    setIsUploading(true);
    try {
      let imageUrl = uploadedImage;
      if (data.image && data.image[0]) {
        // Upload image if a new file is selected
        imageUrl = await imageUpload(data.image[0]);
        setUploadedImage(imageUrl);
      }

      const newCamp = {
        campName: data.campName,
        image: imageUrl,
        fees: parseFloat(data.fees),
        organizerName: user.displayName,
        organizerEmail: user.email,
        dateTime: data.dateTime,
        location: data.location,
        doctorName: data.doctorName,
        participants: 0,
        description: data.description,
      };

      mutate(newCamp);
    } catch (error) {
      setImageUploadError("Image upload failed");
      console.log(error);
      toast.error("Failed to process image.");
    } finally {
      setIsUploading(false);
    }
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

        {/* Image Upload */}
        <div>
          <label className="block font-medium">Camp Image</label>
          <input
            type="file"
            {...register("image", { required: !uploadedImage })}
            className="w-full border px-3 py-2 rounded"
            onChange={async (e) => {
              if (e.target.files[0]) {
                setIsUploading(true);
                try {
                  const url = await imageUpload(e.target.files[0]);
                  setUploadedImage(url);
                  setImageUploadError(null);
                } catch (error) {
                  setImageUploadError("Image upload failed");
                  console.log(error);
                } finally {
                  setIsUploading(false);
                }
              }
            }}
          />
          {imageUploadError && (
            <p className="text-red-500 text-sm">{imageUploadError}</p>
          )}
          {uploadedImage && (
            <div className="mt-2">
              <p className="text-green-500">Image uploaded successfully!</p>
              <img
                src={uploadedImage}
                alt="Uploaded Camp"
                className="mt-2 w-32 h-32 object-cover"
              />
            </div>
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
          disabled={isPending || isUploading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending || isUploading ? "Processing..." : "Add Camp"}
        </button>
      </form>
    </div>
  );
};

export default AddCamp;
