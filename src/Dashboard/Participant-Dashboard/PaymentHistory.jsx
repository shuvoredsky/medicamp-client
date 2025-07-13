import React, { useContext } from "react";
import { Table, Spin } from "antd";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { AuthContext } from "../../Provider/AuthProvider";

const PaymentHistory = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const {
    data: paymentHistory = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["payment-history", user?.email],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get(
          `/payment-history?email=${user?.email}`
        );
        console.log("Payment History Data:", res.data);
        return res.data || [];
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

  const columns = [
    {
      title: "Camp Name",
      dataIndex: "campName",
      key: "campName",
    },
    {
      title: "Fees",
      dataIndex: "fees",
      key: "fees",
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
    },
    {
      title: "Confirmation Status",
      dataIndex: "confirmationStatus",
      key: "confirmationStatus",
    },
  ];

  if (isLoading) return <Spin size="large" className="text-center py-10" />;
  if (error && error.response?.status === 404) {
    return (
      <p className="text-center py-10 text-red-500">
        No payment history found.
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
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Payment History
      </h2>
      <Table
        dataSource={paymentHistory}
        columns={columns}
        rowKey={(record) => record._id || Math.random()} // Use _id if available, otherwise random key
        pagination={{ pageSize: 5 }}
        className="shadow-lg rounded-lg"
      />
    </div>
  );
};

export default PaymentHistory;
