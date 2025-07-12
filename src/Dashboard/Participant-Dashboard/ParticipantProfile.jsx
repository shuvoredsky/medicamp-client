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
    data: participant = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ["participant-profile", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/participant-profile?email=${user?.email}`
      );
      console.log("Participant Data:", res.data); // Debug
      return res.data;
    },
    enabled: !!user?.email,
  });

  const mutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await axiosSecure.patch(
        `/update-participant/${participant._id}`,
        updatedData
      );
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
    mutation.mutate(values);
  };

  if (isLoading) return <p className="text-center py-10">Loading...</p>;
  if (error)
    return (
      <p className="text-center py-10 text-red-500">Error: {error.message}</p>
    );

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <Card className="max-w-full md:max-w-md lg:max-w-lg mx-auto shadow-lg rounded-lg">
        <div className="flex flex-col items-center space-y-4 p-4">
          <Avatar
            src={participant?.image || user?.photoURL || "/default-avatar.png"}
            size={{ xs: 60, sm: 80, md: 100 }}
            className="mb-2"
          />
          <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-800">
            {participant?.participantName || "No Name"}
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            {participant?.email || "No Email"}
          </p>
          <p className="text-sm md:text-base text-gray-600">
            Phone: {participant?.phone || "Not Provided"}
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
            participantName: participant?.participantName || "",
            image: participant?.image || "",
            phone: participant?.phone || "",
          }}
          onFinish={handleFinish}
          className="p-4"
        >
          <Form.Item
            name="participantName"
            label="Full Name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>
          <Form.Item name="image" label="Photo URL">
            <Input placeholder="Enter your photo URL" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: "Please enter your phone number" },
            ]}
          >
            <Input placeholder="Enter your phone number" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={mutation.isPending}
              className="mt-4"
            >
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ParticipantProfile;
