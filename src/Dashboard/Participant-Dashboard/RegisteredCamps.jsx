import React, { useState, useContext } from "react";
import { Table, Button, Modal, Form, Input } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { AuthContext } from "../../Provider/AuthProvider";
import Swal from "sweetalert2";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useForm, Controller } from "react-hook-form";

const RegisteredCamps = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const stripe = useStripe();
  const elements = useElements();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedCamp, setSelectedCamp] = useState(null);

  const {
    data: registeredCamps = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["registered-camps", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/user-registered-camps?email=${user?.email}`
      );
      return res.data.map((camp) => ({
        ...camp,
        confirmationStatus: camp.confirmationStatus || "Pending",
      }));
    },
    enabled: !!user?.email,
  });

  const updatePaymentMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosSecure.patch(
        `/update-payment-status/${selectedCamp._id}`,
        data
      );
      return res.data;
    },
    onSuccess: () => {
      refetch();
      setIsModalOpen(false);
    },
    onError: (error) => {
      Swal.fire("Error", error.message || "Payment failed", "error");
    },
  });

  const cancelRegistrationMutation = useMutation({
    mutationFn: async (campId) => {
      const res = await axiosSecure.delete(`/cancel-registration/${campId}`);
      return res.data;
    },
    onSuccess: () => {
      refetch();
      Swal.fire("Cancelled", "Registration cancelled.", "success");
    },
    onError: (error) => {
      Swal.fire("Error", error.message || "Cancellation failed", "error");
    },
  });

  const submitFeedbackMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosSecure.post("/submit-feedback", {
        campId: selectedCamp._id,
        participantEmail: user?.email,
        ...data,
      });
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Success", "Feedback submitted!", "success");
      refetch();
      setIsFeedbackModalOpen(false);
    },
    onError: (error) => {
      Swal.fire(
        "Error",
        error.message || "Feedback submission failed",
        "error"
      );
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { cardDetails: "", rating: "", comment: "" },
  });

  const handlePay = (camp) => {
    if (camp.status !== "unpaid") {
      Swal.fire("Error", "This camp is already paid!", "error");
      return;
    }
    setSelectedCamp(camp);
    setIsModalOpen(true);
  };

  const onFinish = async (formData) => {
    if (!stripe || !elements) {
      Swal.fire("Error", "Stripe failed to load", "error");
      return;
    }

    const { data: paymentIntentData } = await axiosSecure.post(
      "/create-payment-intent",
      {
        amount: selectedCamp.fees * 100,
      }
    );

    const clientSecret = paymentIntentData.clientSecret;
    const card = elements.getElement(CardElement);

    if (!card) {
      Swal.fire("Error", "Card details not provided", "error");
      return;
    }

    const { paymentIntent, error } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card,
          billing_details: {
            name: user?.displayName || "Unknown",
            email: user?.email || "Unknown",
          },
        },
      }
    );

    if (error) {
      Swal.fire("Error", error.message, "error");
    } else if (paymentIntent.status === "succeeded") {
      await updatePaymentMutation.mutate({
        status: "paid",
        transactionId: paymentIntent.id,
        confirmationStatus: "Confirmed",
      });
      Swal.fire(
        "Success",
        `Payment successful! Transaction ID: ${paymentIntent.id}`,
        "success"
      );
    }
  };

  const handleCancel = (camp) => {
    if (camp.status === "paid") {
      Swal.fire("Error", "Cannot cancel a paid camp!", "error");
      return;
    }
    cancelRegistrationMutation.mutate(camp._id);
  };

  const handleFeedback = (camp) => {
    if (camp.status !== "paid") {
      Swal.fire("Error", "Payment required to submit feedback!", "error");
      return;
    }
    setSelectedCamp(camp);
    setIsFeedbackModalOpen(true);
  };

  const onFeedbackSubmit = (formData) => {
    submitFeedbackMutation.mutate(formData);
  };

  const columns = [
    { title: "Camp Name", dataIndex: "campName", key: "campName" },
    { title: "Fees", dataIndex: "fees", key: "fees" },
    {
      title: "Participant",
      dataIndex: "participantName",
      key: "participantName",
    },
    { title: "Payment Status", dataIndex: "status", key: "status" },
    {
      title: "Confirmation Status",
      dataIndex: "confirmationStatus",
      key: "confirmationStatus",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          {record.status === "unpaid" ? (
            <Button
              type="primary"
              style={{ backgroundColor: "green", borderColor: "green" }}
              onClick={() => handlePay(record)}
            >
              Pay
            </Button>
          ) : (
            <span style={{ color: "green" }}>Paid</span>
          )}
          {record.status === "unpaid" ? (
            <Button
              danger
              style={{ marginLeft: "8px" }}
              onClick={() => handleCancel(record)}
            >
              Cancel
            </Button>
          ) : (
            <Button
              type="default"
              style={{ marginLeft: "8px" }}
              onClick={() => handleFeedback(record)}
            >
              Feedback
            </Button>
          )}
        </>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Registered Camps</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Table
          dataSource={registeredCamps}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      )}
      <Modal
        title="Pay for Camp"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleSubmit(onFinish)}>
          <p>Camp: {selectedCamp?.campName}</p>
          <p>Fees: ${selectedCamp?.fees || 0}</p>
          <Form.Item
            label="Card Details"
            name="cardDetails"
            validateStatus={errors.cardDetails ? "error" : ""}
            help={errors.cardDetails?.message}
          >
            <Controller
              name="cardDetails"
              control={control}
              render={({ field }) => <CardElement {...field} />}
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={updatePaymentMutation.isLoading}
            block
          >
            Pay Now
          </Button>
        </Form>
      </Modal>
      <Modal
        title="Submit Feedback"
        open={isFeedbackModalOpen}
        onCancel={() => setIsFeedbackModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleSubmit(onFeedbackSubmit)}>
          <Form.Item
            label="Rating (1-5)"
            name="rating"
            rules={[
              //   { required: true, message: "Rating is required" },
              { min: 1, max: 5, message: "Rating must be between 1 and 5" },
            ]}
          >
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  min={1}
                  max={5}
                  {...field}
                  placeholder="Enter rating (1-5)"
                />
              )}
            />
          </Form.Item>
          <Form.Item
            label="Comment"
            name="comment"
            // rules={[{ required: true, message: "Comment is required" }]}
          >
            <Controller
              name="comment"
              control={control}
              render={({ field }) => (
                <Input.TextArea {...field} placeholder="Enter your feedback" />
              )}
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitFeedbackMutation.isLoading}
            block
          >
            Submit Feedback
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default RegisteredCamps;
