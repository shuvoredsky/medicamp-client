import React from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../../Hooks/useAuth";
import { Card, Input, Button, Typography } from "antd";
import { Helmet } from "react-helmet-async";

const { Title, Text } = Typography;

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";

  const onSubmit = async (data) => {
    const { email, password } = data;

    try {
      await signIn(email, password); // Call signIn function
      navigate(from, { replace: true }); // Redirect on success
    } catch (error) {
      console.error("Login error:", error.message);
      // Set custom error message for UI
      if (error.message.includes("Invalid credentials")) {
        errors.email = { message: "Invalid email or password" }; // Custom error for invalid credentials
      } else {
        errors.email = { message: error.message }; // General error
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] px-4">
      <Helmet>
        <title>MCMS | Login</title>
      </Helmet>

      <Card className="w-full max-w-sm shadow-lg" bordered>
        <Title level={3} style={{ textAlign: "center" }}>
          Please Login
        </Title>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email Field */}
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <Input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Please enter a valid email",
                },
              })}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="block mb-1">Password</label>
            <Input.Password
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="text-right mb-4">
            <a className="text-sm text-blue-500 hover:underline" href="#">
              Forgot password?
            </a>
          </div>

          <Button type="primary" htmlType="submit" block>
            Login
          </Button>

          <Text type="secondary" className="block text-center mt-3">
            Don’t have an account?{" "}
            <Link to="/sign-up">
              <Button type="link" size="small">
                Register
              </Button>
            </Link>
          </Text>
        </form>
      </Card>
    </div>
  );
};

export default SignIn;
