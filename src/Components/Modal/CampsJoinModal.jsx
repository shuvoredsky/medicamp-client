import React, { useState } from "react";
import { Modal, Input, Select } from "antd";
import { useForm, Controller } from "react-hook-form";
import Swal from "sweetalert2";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const { Option } = Select;

const CampsJoinModal = ({ visible, onClose, camp, onSubmit, user }) => {
  const { control, handleSubmit, reset } = useForm();
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOk = async (formData) => {
    setLoading(true);
    const { data } = await axiosSecure.post("/create-payment-intent", {
      amount: camp?.fees * 100, // cents
    });

    const clientSecret = data.clientSecret;

    const card = elements.getElement(CardElement);
    if (!card || !stripe) {
      setError("Stripe not loaded");
      setLoading(false);
      return;
    }

    const { paymentIntent, error: stripeError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: user?.displayName || "Unknown",
            email: user?.email || "Unknown",
          },
        },
      });

    if (stripeError) {
      setError(stripeError.message);
      setLoading(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      setError("");
      Swal.fire("Payment Successful", "You have joined the camp!", "success");
      // Send data to camps-join endpoint with organizerEmail and confirmationStatus
      await axiosSecure.post("/camps-join", {
        ...formData,
        status: "paid",
        campId: camp?._id,
        organizerEmail: camp?.organizerEmail,
        confirmationStatus: "Pending",
      });
      // Update participant count
      await axiosSecure.patch(`/camps-update-count/${camp?._id}`);
      onSubmit({ ...formData, status: "paid" });
      reset();
      onClose();
    } else {
      Swal.fire("Payment Failed", "Try again later", "error");
    }

    setLoading(false);
  };

  return (
    <Modal
      title="Join Medical Camp"
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit(handleOk)}
      okText={loading ? "Processing..." : "Join Now"}
      okButtonProps={{ disabled: loading }}
    >
      <form className="space-y-3">
        {/* Read-only fields */}
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

        {/* Participant Info */}
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

        {/* Stripe Payment Card Input */}
        <div className="p-2 border rounded-md">
          <CardElement />
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </Modal>
  );
};

export default CampsJoinModal;
