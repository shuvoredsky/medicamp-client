import React, { useContext, useState } from "react";
import { Table, Spin } from "antd";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { AuthContext } from "../../Provider/AuthProvider";

const PaymentHistory = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");

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

  // Filter payment history based on search term
  const filteredPaymentHistory = paymentHistory.filter(
    (payment) =>
      payment.campName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.dateTime?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.doctorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: "Camp Name",
      dataIndex: "campName",
      key: "campName",
    },
    {
      title: "Date",
      dataIndex: "dateTime",
      key: "dateTime",
    },
    {
      title: "Healthcare Professional",
      dataIndex: "doctorName",
      key: "doctorName",
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
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Payment History
      </h2>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by Camp Name"
          className="w-full md:w-1/2 lg:w-1/3 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Table
        dataSource={filteredPaymentHistory}
        columns={columns}
        rowKey={(record) => record._id || Math.random()} // Use _id if available
        pagination={{ pageSize: 5 }}
        className="shadow-lg rounded-lg"
        scroll={{ x: true }} // Enable horizontal scroll for small screens
      />
    </div>
  );
};

export default PaymentHistory;
