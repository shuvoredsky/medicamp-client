import React, { useContext, useState } from "react";
import { Card, Button, Modal, Form, Input, Avatar } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { AuthContext } from "../../Provider/AuthProvider";
import Swal from "sweetalert2";
import { updateProfile } from "firebase/auth";
import { auth } from "../../firebase/firebase-init"; // Adjust the import path
import { toast } from "react-toastify";

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
      const res = await axiosSecure.get(
        `/participant-profile?email=${user?.email}`
      );
      return res.data || {};
    },
    enabled: !!user?.email,
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

  const handleFinish = async (values) => {
    const { name, photoURL, contact } = values;

    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photoURL,
      });
      toast.success("Firebase Profile Updated Successfully");

      // Update participant profile in backend
      await mutation.mutateAsync({
        email: user?.email,
        name,
        photoURL,
        contact,
      });

      // Optionally reload the page or update state
      // window.location.reload(); // Use with caution, consider state management instead
    } catch (error) {
      console.error("Profile Update Error:", error.message);
      toast.error("Failed to update profile");
    }
  };

  if (isLoading) {
    return <p className="text-center py-10 text-base">Loading...</p>;
  }

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
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
        <Card className="shadow-md rounded-lg">
          <div className="flex flex-col items-center gap-4 p-4 sm:flex-row sm:items-start sm:gap-6">
            <Avatar
              src={user?.photoURL || "/default-avatar.png"}
              size={100}
              className="mx-auto"
            />
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                {profile?.name || user?.displayName || "No Name"}
              </h2>
              <p className="text-sm text-gray-600">
                Contact: {profile?.contact || "Not Provided"}
              </p>
              <Button
                type="primary"
                size="middle"
                onClick={() => setIsModalOpen(true)}
                className="mt-4 w-full sm:w-auto"
              >
                Update Profile
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Modal
        title="Update Profile"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        width={500}
      >
        <Form
          layout="vertical"
          initialValues={{
            name: user?.displayName,
            photoURL: user?.photoURL,
            contact: profile?.contact || "",
          }}
          onFinish={handleFinish}
          className="p-1"
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
              loading={mutation.isPending}
              block
              className="mt-2"
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
