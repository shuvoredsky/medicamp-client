import React from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { Spin } from "antd";

const UpdateCamp = () => {
  const { campId } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { data: camp, isLoading } = useQuery({
    queryKey: ["campDetails", campId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/available-camps/${campId}`);
      reset(res.data); // preload form
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (updatedData) => {
      return await axiosSecure.patch(`/update-camp/${campId}`, updatedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["campDetails", campId]);
      Swal.fire({
        icon: "success",
        title: "Camp Updated!",
        text: "Your medical camp has been successfully updated.",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        navigate("/dashboard/manage-camps");
      });
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Something went wrong. Please try again later.",
      });
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-10">
        <Spin tip="Loading feedbacks..." size="large" />
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center text-teal-600">
        Update Camp
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="text"
          placeholder="Camp Name"
          {...register("campName", { required: true })}
          className="w-full p-2 border rounded"
        />
        {errors.campName && (
          <span className="text-red-500">Camp Name is required</span>
        )}

        <input
          type="text"
          placeholder="Image URL"
          {...register("image")}
          className="w-full p-2 border rounded"
        />

        <input
          type="number"
          placeholder="Camp Fees"
          {...register("fees", { required: true })}
          className="w-full p-2 border rounded"
        />
        {errors.fees && <span className="text-red-500">Fees are required</span>}

        <input
          type="datetime-local"
          {...register("dateTime", { required: true })}
          className="w-full p-2 border rounded"
        />
        {errors.dateTime && (
          <span className="text-red-500">Date & Time is required</span>
        )}

        <input
          type="text"
          placeholder="Location"
          {...register("location", { required: true })}
          className="w-full p-2 border rounded"
        />
        {errors.location && (
          <span className="text-red-500">Location is required</span>
        )}

        <input
          type="text"
          placeholder="Doctor Name"
          {...register("doctorName", { required: true })}
          className="w-full p-2 border rounded"
        />
        {errors.doctorName && (
          <span className="text-red-500">Doctor Name is required</span>
        )}

        <textarea
          placeholder="Description"
          {...register("description")}
          className="w-full p-2 border rounded h-28"
        />

        <button
          type="submit"
          className="w-full cursor-pointer bg-teal-600 text-white p-2 rounded hover:bg-teal-700 transition"
        >
          Update Camp
        </button>
      </form>
    </div>
  );
};

export default UpdateCamp;
