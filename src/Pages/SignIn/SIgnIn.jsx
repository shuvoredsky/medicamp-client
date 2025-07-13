import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../Provider/AuthProvider";
import { toast, ToastContainer } from "react-toastify";
import { Helmet } from "react-helmet-async";
import { FormProvider, useForm } from "react-hook-form";
import { Input, Button, Card, Typography } from "antd";

const { Title, Text } = Typography;

const SignIn = () => {
  const { signIn } = useContext(AuthContext);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const methods = useForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = (data) => {
    const { email, password } = data;

    signIn(email, password)
      .then(() => {
        toast.success("User Login Successful!");
        navigate("/");
      })
      .catch((error) => {
        setError(error.message); // Set error message instead of code
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#f0f2f5]">
      <Helmet>
        <title>MCMS | Login</title>
      </Helmet>

      <Card className="w-full max-w-sm shadow-lg" bordered>
        <Title level={3} style={{ textAlign: "center" }}>
          Login to Your Account
        </Title>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block mb-1">Email</label>
              <Input
                {...register("email", {
                  required: "Please enter your email!",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Enter a valid email!",
                  },
                })}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-1">Password</label>
              <Input.Password
                {...register("password", {
                  required: "Please enter your password!",
                })}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {error && (
              <Text type="danger" className="block text-center mb-2">
                {error}
              </Text>
            )}

            <Button type="primary" htmlType="submit" block className="mb-2">
              Login
            </Button>

            <Text type="secondary" className="block text-center">
              Don’t have an account?{" "}
              <Link to="/sign-up">
                <Button type="link">Register</Button>
              </Link>
            </Text>
          </form>
        </FormProvider>
      </Card>

      <ToastContainer autoClose={3000} position="top-right" theme="colored" />
    </div>
  );
};

export default SignIn;
