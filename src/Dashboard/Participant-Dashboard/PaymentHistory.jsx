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
    refetch,
  } = useQuery({
    queryKey: ["payment-history", user?.email],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get(
          `/payment-history?email=${user?.email}`
        );
        console.log("Raw API Response:", res.data); // Debug raw response
        return res.data || [];
      } catch (err) {
        console.error("Query Error Details:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
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

  // Debug filtered data
  console.log("Filtered Payment History:", paymentHistory);

  // Filter payment history based on search term and ensure status is "paid" (case insensitive)
  const filteredPaymentHistory = paymentHistory.filter(
    (payment) =>
      payment.status?.toLowerCase() === "paid" && // Case insensitive check
      (payment.campName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.registeredAt
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        payment.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  console.log("After Filtering:", filteredPaymentHistory); // Debug after filtering

  const columns = [
    {
      title: "Camp Name",
      dataIndex: "campName",
      key: "campName",
      sorter: (a, b) => a.campName.localeCompare(b.campName),
    },
    {
      title: "Date",
      dataIndex: "registeredAt",
      key: "registeredAt",
      render: (text) => new Date(text).toLocaleDateString(),
      sorter: (a, b) => new Date(a.registeredAt) - new Date(b.registeredAt),
    },
    {
      title: "Healthcare Professional",
      dataIndex: "doctorName",
      key: "doctorName",
      sorter: (a, b) => a.doctorName.localeCompare(b.doctorName),
    },
    {
      title: "Fees",
      dataIndex: "fees",
      key: "fees",
      sorter: (a, b) => a.fees - b.fees,
    },
    { title: "Payment Status", dataIndex: "status", key: "status" },
    {
      title: "Confirmation Status",
      dataIndex: "confirmationStatus",
      key: "confirmationStatus",
    },
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
    },
  ];

  if (isLoading) return <Spin size="large" className="text-center py-10" />;
  if (error && error.response?.status === 404) {
    return (
      <div className="text-center py-10 text-red-500">
        <p>No payment history found.</p>
        <button
          onClick={() => refetch()}
          className="mt-2 text-blue-500 underline"
        >
          Refresh
        </button>
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        <p>Error: {error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-2 text-blue-500 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center text-gray-800">
        Payment History
      </h2>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by Camp Name, Date, or Doctor"
          className="w-full md:w-1/2 lg:w-1/3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Table
        dataSource={filteredPaymentHistory}
        columns={columns}
        rowKey={(record) => record._id || Math.random()} // Ensure unique key
        pagination={{ pageSize: 5, showSizeChanger: true }}
        className="shadow-lg rounded-lg"
        scroll={{ x: 800 }}
        bordered
      />
    </div>
  );
};

export default PaymentHistory;
