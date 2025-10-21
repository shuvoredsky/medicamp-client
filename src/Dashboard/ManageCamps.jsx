import React, { useState } from "react";
import { Table, Button, Popconfirm, message, Input } from "antd";
import { Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const ManageCamps = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch camps using TanStack Query
  const { data: camps = [], isLoading } = useQuery({
    queryKey: ["camps"],
    queryFn: async () => {
      const res = await axiosSecure.get("/camps");
      return res.data;
    },
  });

  // ✅ Mutation for deleting a camp
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(`/delete-camp/${id}`);
    },
    onSuccess: () => {
      message.success("Camp deleted successfully!");
      queryClient.invalidateQueries(["camps"]);
    },
    onError: () => {
      message.error("Failed to delete the camp.");
    },
  });

  // ✅ Filter camps based on search term
  const filteredCamps = camps.filter(
    (camp) =>
      camp.campName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      camp.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      camp.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      camp.dateTime?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Table Columns
  const columns = [
    {
      title: "Camp Name",
      dataIndex: "campName",
      key: "campName",
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "Date & Time",
      dataIndex: "dateTime",
      key: "dateTime",
      responsive: ["sm", "md", "lg"],
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      responsive: ["md", "lg"],
    },
    {
      title: "Doctor",
      dataIndex: "doctorName",
      key: "doctorName",
      responsive: ["md", "lg"],
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      render: (text, record) => (
        <div className="flex flex-wrap gap-2">
          <Link to={`/dashboard/update-camp/${record._id}`}>
            <Button type="primary" size="small">
              Update
            </Button>
          </Link>

          <Popconfirm
            title="Are you sure to delete this camp?"
            onConfirm={() => deleteMutation.mutate(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger size="small">
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  if (isLoading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-teal-700 text-center sm:text-left">
        Manage Camps
      </h2>

      {/* Search Bar */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search by Camp Name, Doctor, Location, or Date..."
          className="w-full sm:w-1/2 lg:w-1/3 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <Table
          dataSource={filteredCamps}
          columns={columns}
          rowKey={(record) => record._id}
          bordered
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
          className="shadow-lg rounded-lg"
        />
      </div>
    </div>
  );
};

export default ManageCamps;
