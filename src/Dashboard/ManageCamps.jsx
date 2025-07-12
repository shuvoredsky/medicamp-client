import React from "react";
import { Table, Button, Popconfirm, message } from "antd";
import { Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const ManageCamps = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

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
    <div className="p-4 sm:p-6 md:p-10">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-blue-700 text-center sm:text-left">
        Manage Camps
      </h2>
      <div className="overflow-x-auto">
        <Table
          dataSource={camps}
          columns={columns}
          rowKey={(record) => record._id}
          bordered
          pagination={{ pageSize: 6 }}
          scroll={{ x: "max-content" }}
        />
      </div>
    </div>
  );
};

export default ManageCamps;
