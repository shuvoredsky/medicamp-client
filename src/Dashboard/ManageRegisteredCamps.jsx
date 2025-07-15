import React, { useContext, useState } from "react";
import { Table, Tag, Button, Modal, Card, Grid, Input } from "antd";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { AuthContext } from "../Provider/AuthProvider";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";

const { useBreakpoint } = Grid;

const ManageRegisteredCamps = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: registered = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["registered-camps", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/registered-camps?email=${user?.email}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleCancelRegistration = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const confirmCancel = async () => {
    try {
      await axiosSecure.delete(`/cancel-registration/${selectedRecord._id}`);
      Swal.fire("Success", "Registration cancelled!", "success");
      setIsModalVisible(false);
      queryClient.refetchQueries(["registered-camps", user?.email]);
    } catch (error) {
      Swal.fire("Error", "Failed to cancel registration", "error");
    }
  };

  const handleConfirmPayment = async (record) => {
    try {
      await axiosSecure.patch(`/update-confirmation/${record._id}`, {
        confirmationStatus: "Confirmed",
      });
      Swal.fire("Success", "Payment confirmed!", "success");
      queryClient.refetchQueries(["registered-camps", user?.email]);
    } catch (error) {
      Swal.fire("Error", "Failed to confirm payment", "error");
    }
  };

  // Filter registered camps based on search term
  const filteredRegistered = registered.filter(
    (record) =>
      record.campName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.participantName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(record.fees)?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <p className="text-center py-10">Loading...</p>;
  if (error)
    return (
      <p className="text-center py-10 text-red-500">Error: {error.message}</p>
    );

  // Mobile Card View
  const renderMobileCards = () => (
    <div className="space-y-4">
      {filteredRegistered.map((record) => (
        <Card
          key={record._id}
          className="shadow-md"
          title={record.campName}
          extra={
            <Tag color={record.status === "paid" ? "green" : "red"}>
              {record.status}
            </Tag>
          }
        >
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Participant:</span>{" "}
              {record.participantName}
            </p>
            <p>
              <span className="font-semibold">Emergency Contact:</span>{" "}
              {record.emergencyContact}
            </p>
            <p>
              <span className="font-semibold">Fees:</span> ৳{record.fees}
            </p>
            <p>
              <span className="font-semibold">Confirmation:</span>{" "}
              <Tag
                color={
                  record.confirmationStatus === "Confirmed" ? "green" : "orange"
                }
              >
                {record.confirmationStatus}
              </Tag>
            </p>
            <div className="flex space-x-2 mt-2">
              {record.confirmationStatus !== "Confirmed" && (
                <Button
                  size="small"
                  onClick={() => handleConfirmPayment(record)}
                >
                  Confirm
                </Button>
              )}
              <Button
                size="small"
                disabled={
                  record.status === "paid" &&
                  record.confirmationStatus === "Confirmed"
                }
                onClick={() => handleCancelRegistration(record)}
                danger
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  // Desktop/Tablets Table View
  const renderDesktopTable = () => (
    <Table
      dataSource={filteredRegistered}
      columns={[
        { title: "Camp Name", dataIndex: "campName", key: "campName" },
        {
          title: "Participant",
          dataIndex: "participantName",
          key: "participantName",
        },
        {
          title: "Emergency Contact",
          dataIndex: "emergencyContact",
          key: "emergencyContact",
        },
        {
          title: "Fees",
          dataIndex: "fees",
          key: "fees",
          render: (fee) => `৳${fee}`,
        },
        {
          title: "Payment Status",
          dataIndex: "status",
          key: "status",
          render: (status) => (
            <Tag color={status === "paid" ? "green" : "red"}>{status}</Tag>
          ),
        },
        {
          title: "Confirmation Status",
          dataIndex: "confirmationStatus",
          key: "confirmationStatus",
          render: (status) => (
            <Tag color={status === "Confirmed" ? "green" : "orange"}>
              {status}
            </Tag>
          ),
        },
        {
          title: "Action",
          key: "action",
          render: (_, record) => (
            <>
              {record.confirmationStatus !== "Confirmed" && (
                <Button
                  onClick={() => handleConfirmPayment(record)}
                  style={{ marginRight: 8 }}
                >
                  Confirm
                </Button>
              )}
              <Button
                disabled={
                  record.status === "paid" &&
                  record.confirmationStatus === "Confirmed"
                }
                onClick={() => handleCancelRegistration(record)}
                danger
              >
                Cancel
              </Button>
            </>
          ),
        },
      ]}
      rowKey={(record) => record._id}
      bordered
      pagination={{ pageSize: 10 }}
      scroll={{ x: true }}
      className="shadow-lg rounded-lg"
    />
  );

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-xl font-bold text-blue-600 mb-4">
        Manage Registered Camps
      </h2>

      {/* Search Bar */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search by Camp Name, Participant, or Fees..."
          className="w-full sm:w-1/2 lg:w-1/3 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isMobile ? renderMobileCards() : renderDesktopTable()}
      <Modal
        title="Confirm Cancellation"
        open={isModalVisible}
        onOk={confirmCancel}
        onCancel={() => setIsModalVisible(false)}
      >
        <p>Are you sure you want to cancel this registration?</p>
      </Modal>
    </div>
  );
};

export default ManageRegisteredCamps;
