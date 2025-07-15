import React, { useState, useContext } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Typography,
  Card,
  Row,
  Col,
} from "antd";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import Swal from "sweetalert2";

import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { AuthContext } from "../../Provider/AuthProvider";

const { Title } = Typography;

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

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { cardDetails: "", rating: "", comment: "" },
  });

  const updatePaymentMutation = useMutation({
    mutationFn: async (data) =>
      axiosSecure.patch(`/update-payment-status/${selectedCamp._id}`, data),
    onSuccess: () => {
      refetch();
      setIsModalOpen(false);
    },
    onError: (error) =>
      Swal.fire("Error", error.message || "Payment failed", "error"),
  });

  const cancelRegistrationMutation = useMutation({
    mutationFn: async (campId) =>
      axiosSecure.delete(`/cancel-registration/${campId}`),
    onSuccess: () => {
      refetch();
      Swal.fire("Cancelled", "Registration cancelled.", "success");
    },
    onError: (error) =>
      Swal.fire("Error", error.message || "Cancellation failed", "error"),
  });

  const submitFeedbackMutation = useMutation({
    mutationFn: async (data) =>
      axiosSecure.post("/submit-feedback", {
        campId: selectedCamp._id,
        participantEmail: user?.email,
        ...data,
      }),
    onSuccess: () => {
      Swal.fire("Success", "Feedback submitted!", "success");
      refetch();
      setIsFeedbackModalOpen(false);
    },
    onError: (error) =>
      Swal.fire("Error", error.message || "Feedback failed", "error"),
  });

  const handlePay = (camp) => {
    if (camp.status !== "unpaid") {
      Swal.fire("Error", "This camp is already paid!", "error");
      return;
    }
    setSelectedCamp(camp);
    setIsModalOpen(true);
  };

  const onFinish = async () => {
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
      Swal.fire("Error", "Card details not found", "error");
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

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <Title level={3} className="text-center mb-6">
        Registered Camps
      </Title>

      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <Row gutter={[16, 16]}>
          {registeredCamps.map((camp) => (
            <Col xs={24} sm={12} lg={8} key={camp._id}>
              <Card
                title={camp.campName}
                bordered
                className="h-full"
                extra={<span className="font-semibold">৳{camp.fees}</span>}
              >
                <p className="mb-1">
                  <strong>Participant:</strong> {camp.participantName}
                </p>
                <p className="mb-1">
                  <strong>Status:</strong> {camp.status}
                </p>
                <p className="mb-3">
                  <strong>Confirmation:</strong> {camp.confirmationStatus}
                </p>
                <div className="flex flex-wrap gap-2">
                  {camp.status === "unpaid" ? (
                    <>
                      <Button type="primary" onClick={() => handlePay(camp)}>
                        Pay
                      </Button>
                      <Button danger onClick={() => handleCancel(camp)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => handleFeedback(camp)}>
                      Feedback
                    </Button>
                  )}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        title="Pay for Camp"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        width={400}
      >
        <Form layout="vertical" onFinish={handleSubmit(onFinish)}>
          <p>
            <strong>Camp:</strong> {selectedCamp?.campName}
          </p>
          <p>
            <strong>Fees:</strong> ৳{selectedCamp?.fees}
          </p>
          <Form.Item
            label="Card Details"
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
            block
            loading={updatePaymentMutation.isPending}
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
        centered
        width={400}
      >
        <Form layout="vertical" onFinish={handleSubmit(onFeedbackSubmit)}>
          <Form.Item
            label="Rating (1-5)"
            validateStatus={errors.rating ? "error" : ""}
            help={errors.rating?.message}
          >
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  min={1}
                  max={5}
                  placeholder="Enter rating"
                />
              )}
            />
          </Form.Item>
          <Form.Item label="Comment">
            <Controller
              name="comment"
              control={control}
              render={({ field }) => (
                <Input.TextArea {...field} placeholder="Enter comment" />
              )}
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={submitFeedbackMutation.isPending}
          >
            Submit Feedback
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default RegisteredCamps;
