import React from "react";
import { Modal, Input, Select } from "antd";
import { useForm, Controller } from "react-hook-form";
import Swal from "sweetalert2";

const { Option } = Select;

const CampsJoinModal = ({ visible, onClose, camp, onSubmit, user }) => {
  const { control, handleSubmit, reset } = useForm();

  const handleOk = (data, e) => {
    e.preventDefault();
    onSubmit(data);
    reset();
    Swal.fire("you are joined");
    console.log(data);
    onClose();
  };

  return (
    <Modal
      title="Join Medical Camp"
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit(handleOk)}
      okText="Submit"
    >
      <form className="space-y-3">
        {/* Read-only fields */}
        <Controller
          name="campName"
          control={control}
          defaultValue={camp?.campName}
          render={({ field }) => <Input {...field} disabled />}
        />
        <Controller
          name="fees"
          control={control}
          defaultValue={camp?.fees}
          render={({ field }) => <Input {...field} disabled />}
        />
        <Controller
          name="location"
          control={control}
          defaultValue={camp?.location}
          render={({ field }) => <Input {...field} disabled />}
        />
        <Controller
          name="doctorName"
          control={control}
          defaultValue={camp?.doctorName}
          render={({ field }) => <Input {...field} disabled />}
        />

        {/* Participant Info */}
        <Controller
          name="participantName"
          control={control}
          defaultValue={user?.displayName}
          render={({ field }) => (
            <Input {...field} readOnly placeholder="Your Name" />
          )}
        />
        <Controller
          name="email"
          control={control}
          defaultValue={user?.email}
          render={({ field }) => (
            <Input {...field} readOnly placeholder="Your Email" />
          )}
        />
        <Controller
          name="age"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input {...field} placeholder="Age" type="number" />
          )}
        />
        <Controller
          name="phone"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input {...field} placeholder="Phone Number" />
          )}
        />
        <Controller
          name="gender"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Select {...field} placeholder="Gender">
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
              <Option value="Other">Other</Option>
            </Select>
          )}
        />
        <Controller
          name="emergencyContact"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input {...field} placeholder="Emergency Contact" type="number" />
          )}
        />
      </form>
    </Modal>
  );
};

export default CampsJoinModal;
