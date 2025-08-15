import React, { useState, useEffect } from "react";
import { Modal, Input, Select } from "antd";
import { useForm, Controller } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const { Option } = Select;

const CampsJoinModal = ({ visible, onClose, camp, onSubmit, user }) => {
  const { control, handleSubmit, reset } = useForm();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  // Check if user has already joined this camp
  useEffect(() => {
    const checkJoinStatus = async () => {
      if (user?.email && camp?._id) {
        try {
          const res = await axiosSecure.get(
            `/check-join-status?email=${user.email}&campId=${camp._id}`
          );
          setHasJoined(res.data.joined);
        } catch (error) {
          console.log("Error checking join status:", error);
          setHasJoined(false);
        }
      }
    };
    if (visible) checkJoinStatus();
  }, [user?.email, camp?._id, visible, axiosSecure]);

  const handleOk = async (formData) => {
    if (loading || hasJoined) return;
    setLoading(true);

    try {
      const response = await axiosSecure.post("/camps-join", {
        ...formData,
        status: "unpaid",
        campId: camp?._id,
        organizerEmail: camp?.organizerEmail,
        confirmationStatus: "Pending",
      });

      if (response.data.success) {
        Swal.fire(
          "Success",
          "Registration successful! Please pay to confirm.",
          "success"
        );
        setHasJoined(true);
        onSubmit({ ...formData, status: "unpaid" }); // Notify parent to refresh camp data
        reset();
        onClose();
      }
    } catch (error) {
      if (
        error.response?.data?.message ===
        "You have already registered for this camp"
      ) {
        setHasJoined(true);
        Swal.fire(
          "Warning",
          "You have already registered for this camp",
          "warning"
        );
      } else {
        console.error("Registration error:", error);
        Swal.fire("Error", "Registration failed", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Join Medical Camp"
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit(handleOk)}
      okText={loading ? "Processing..." : "Join Now"}
      okButtonProps={{
        disabled: loading || hasJoined,
        loading,
      }}
      centered
    >
      <form className="space-y-3">
        <Controller
          name="campName"
          control={control}
          defaultValue={camp?.campName}
          render={({ field }) => <Input {...field} disabled />}
        />
        <Controller
          name="fees"
          control={control}
          defaultValue={camp?.fees}
          render={({ field }) => <Input {...field} disabled />}
        />
        <Controller
          name="location"
          control={control}
          defaultValue={camp?.location}
          render={({ field }) => <Input {...field} disabled />}
        />
        <Controller
          name="doctorName"
          control={control}
          defaultValue={camp?.doctorName}
          render={({ field }) => <Input {...field} disabled />}
        />
        <Controller
          name="participantName"
          control={control}
          defaultValue={user?.displayName}
          render={({ field }) => (
            <Input {...field} readOnly placeholder="Your Name" />
          )}
        />
        <Controller
          name="email"
          control={control}
          defaultValue={user?.email}
          render={({ field }) => (
            <Input {...field} readOnly placeholder="Your Email" />
          )}
        />
        <Controller
          name="age"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input {...field} placeholder="Age" type="number" />
          )}
        />
        <Controller
          name="phone"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input {...field} placeholder="Phone Number" />
          )}
        />
        <Controller
          name="gender"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Select {...field} placeholder="Gender">
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
              <Option value="Other">Other</Option>
            </Select>
          )}
        />
        <Controller
          name="emergencyContact"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input {...field} placeholder="Emergency Contact" type="number" />
          )}
        />
      </form>
    </Modal>
  );
};

export default CampsJoinModal;
