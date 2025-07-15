import React, { useContext, useState } from "react";
import { Button, Card, Spin } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import CampsJoinModal from "../../Components/Modal/CampsJoinModal";
import { AuthContext } from "../../Provider/AuthProvider";
import Swal from "sweetalert2";

const CampDetails = () => {
  const [insertedId, setInsertedId] = useState(null);
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Fetch camp details
  const { data: camp = {}, isLoading: campLoading } = useQuery({
    queryKey: ["campDetails", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/available-camps/${id}`);
      return res.data;
    },
  });

  // ✅ Fetch user role using TanStack Query only (no useEffect)
  const { data: userRole, isLoading: roleLoading } = useQuery({
    queryKey: ["userRole", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/role/${user?.email}`);
      return res.data; // should return { role: 'participant' | 'organizer' | 'admin' }
    },
    enabled: !!user?.email,
  });

  // ✅ Join camp mutation
  const mutation = useMutation({
    mutationFn: async (participantData) => {
      const res = await axiosSecure.post("/camps-join", participantData);
      const inserted = res.data.insertedId;
      setInsertedId(inserted);
      await axiosSecure.patch(`/camps-update-count/${camp._id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["campDetails", id]);
      Swal.fire(
        "Success",
        "Registration successful! Please pay to confirm.",
        "success"
      );
    },
    onError: () => {
      Swal.fire("Error", "Registration failed", "error");
    },
  });

  const handleJoin = (formData) => {
    mutation.mutate({
      ...formData,
      campId: camp._id,
      organizerEmail: camp.organizerEmail,
    });
  };

  // ✅ Show loader while fetching
  if (campLoading || roleLoading) {
    return (
      <div className="text-center py-10">
        <Spin size="large" />
      </div>
    );
  }

  // ✅ Disable button if already joined or user is organizer
  const isOrganizer = userRole?.role === "organizer";
  const isDisabled = !!insertedId || isOrganizer;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card
        title={camp.campName}
        cover={<img src={camp.image} alt="camp" />}
        bordered={false}
      >
        <p>
          <strong>Fees:</strong> ${camp.fees}
        </p>
        <p>
          <strong>Date:</strong> {camp.dateTime}
        </p>
        <p>
          <strong>Location:</strong> {camp.location}
        </p>
        <p>
          <strong>Doctor:</strong> {camp.doctorName}
        </p>
        <p>
          <strong>Participants:</strong> {camp.participants}
        </p>
        <p>
          <strong>Description:</strong> {camp.description}
        </p>

        <Button
          type="primary"
          className="mt-4"
          onClick={() => setIsModalOpen(true)}
          disabled={isDisabled}
        >
          {insertedId
            ? "Already Joined"
            : isOrganizer
            ? "Organizer cannot join"
            : "Join Camp"}
        </Button>
      </Card>

      {/* ✅ Join Modal */}
      <CampsJoinModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        camp={camp}
        user={user}
        onSubmit={handleJoin}
      />
    </div>
  );
};

export default CampDetails;
