import React, { useContext, useState } from "react";
import { Button, Card } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import CampsJoinModal from "../../Components/Modal/CampsJoinModal";
import { AuthContext } from "../../Provider/AuthProvider";
import Swal from "sweetalert2";

const CampDetails = () => {
  const [insertedId, setInsertedId] = useState(null);

  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useContext(AuthContext);

  const { data: camp = {}, isLoading } = useQuery({
    queryKey: ["campDetails", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/available-camps/${id}`);
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (participantData) => {
      const res = await axiosSecure.post("/camps-join", participantData);
      const inserted = res.data.insertedId;
      setInsertedId(inserted);
      await axiosSecure.patch(`/camps-update-count/${camp._id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["campDetails", id]);
    },
  });

  const handleJoin = (formData) => {
    mutation.mutate({
      ...formData,
      campId: camp._id,
    });
  };

  if (isLoading) return <p>Loading...</p>;

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
          disabled={!!insertedId}
        >
          {insertedId ? "Already Joined" : "Join Camp"}
        </Button>
      </Card>

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
