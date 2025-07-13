import React, { useContext, useState } from "react";
import { Card, Button, Modal, Form, Input, Avatar } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { AuthContext } from "../../Provider/AuthProvider";
import Swal from "sweetalert2";

const ParticipantProfile = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: profile = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ["participant-profile", user?.email],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get(
          `/participant-profile?email=${user?.email}`
        );
        console.log("Profile Data:", res.data);
        return res.data || {};
      } catch (err) {
        console.error("Query Error:", err.response?.data || err.message);
        throw err;
      }
    },
    enabled: !!user?.email,
    onError: (err) => {
      console.error(
        "Query Failed:",
        err.message,
        err.response?.status,
        err.response?.data
      );
    },
  });

  const mutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await axiosSecure.patch("/update-profile", updatedData);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Success", "Profile updated successfully", "success");
      queryClient.invalidateQueries(["participant-profile", user?.email]);
      setIsModalOpen(false);
    },
    onError: (error) => {
      Swal.fire("Error", error.message || "Failed to update profile", "error");
    },
  });

  const handleFinish = (values) => {
    mutation.mutate({ email: user?.email, ...values });
  };

  if (isLoading) return <p className="text-center py-10">Loading...</p>;
  if (error && error.response?.status === 404) {
    return (
      <p className="text-center py-10 text-red-500">
        User not found. Please contact admin.
      </p>
    );
  }
  if (error) {
    return (
      <p className="text-center py-10 text-red-500">Error: {error.message}</p>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <Card className="max-w-full md:max-w-md lg:max-w-lg mx-auto shadow-lg rounded-lg">
        <div className="flex flex-col items-center space-y-4 p-4">
          <Avatar
            src={profile?.photoURL || user?.photoURL || "/default-avatar.png"}
            size={{ xs: 60, sm: 80, md: 100 }}
            className="mb-2"
          />
          <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-800">
            {profile?.name || "No Name"}
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            Contact: {profile?.contact || "Not Provided"}
          </p>
          <Button
            type="primary"
            size="large"
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto"
          >
            Update Profile
          </Button>
        </div>
      </Card>

      <Modal
        title="Update Profile"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        className="md:max-w-md lg:max-w-lg mx-auto"
      >
        <Form
          layout="vertical"
          initialValues={{
            name: profile?.name || "",
            photoURL: profile?.photoURL || "",
            contact: profile?.contact || "",
          }}
          onFinish={handleFinish}
          className="p-4"
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>
          <Form.Item
            name="photoURL"
            label="Photo URL"
            rules={[{ required: true, message: "Please enter photo URL" }]}
          >
            <Input placeholder="Enter your photo URL" />
          </Form.Item>
          <Form.Item
            name="contact"
            label="Contact"
            rules={[{ required: true, message: "Please enter contact" }]}
          >
            <Input placeholder="Enter your contact" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={mutation.isPending}
              className="mt-4"
            >
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ParticipantProfile;
