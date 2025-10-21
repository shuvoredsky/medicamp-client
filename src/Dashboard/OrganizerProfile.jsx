import React, { useContext, useState, useEffect } from "react";
import { Card, Button, Modal, Form, Input, Avatar, Spin } from "antd";
import { AuthContext } from "../Provider/AuthProvider";
import Swal from "sweetalert2";
import { updateProfile } from "firebase/auth";
import { auth } from "../firebase/firebase-init";
import { toast } from "react-toastify";

const OrganizerProfile = () => {
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.displayName || "",
    photoURL: user?.photoURL || "",
    contact: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setProfile({
      name: user?.displayName || "",
      photoURL: user?.photoURL || "",
      contact: profile.contact || "",
    });
  }, [user]);

  const handleFinish = async (values) => {
    const { name, photoURL, contact } = values;
    setIsLoading(true);
    setError(null);

    try {
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photoURL,
      });
      toast.success("Firebase Profile Updated Successfully");

      await auth.currentUser.reload();

      setProfile((prev) => ({ ...prev, name, photoURL, contact }));

      Swal.fire("Success", "Profile updated successfully", "success");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Profile Update Error:", err.message);
      setError(err.message);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-10">
        <Spin tip="Loading feedbacks..." size="large" />
      </div>
    );

  if (error && error.includes("404")) {
    return (
      <p className="text-center py-10 text-red-500">
        User not found. Please contact admin.
      </p>
    );
  }

  if (error) {
    return <p className="text-center py-10 text-red-500">Error: {error}</p>;
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 bg-teal-50">
      <div className="max-w-full  sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
        <Card className="shadow-md rounded-lg ">
          <div className="flex flex-col items-center gap-4 p-4 sm:flex-row sm:items-start sm:gap-6">
            <Avatar
              src={profile.photoURL || "/default-avatar.png"}
              size={100}
              className="mx-auto"
            />
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                {profile.name || "No Name"}
              </h2>
              <p className="text-sm text-gray-600">
                Contact: {profile.contact || "Not Provided"}
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
            name: profile.name,
            photoURL: profile.photoURL,
            contact: profile.contact || "",
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
              loading={isLoading}
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

export default OrganizerProfile;
