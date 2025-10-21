import React from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";
import { FaStethoscope } from "react-icons/fa";
import { toast } from "react-toastify";
import useAuth from "../../Hooks/useAuth";
import { Form, Input, Button, Card, Typography } from "antd";

const { Title, Text } = Typography;

const SignIn = () => {
  const { signIn, signInWithGoogle, loading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/";
  if (user) return <Navigate to={from} replace={true} />;

  // Handle form submit
  const handleSubmit = async (values) => {
    const { email, password } = values;

    try {
      // User Login
      const result = await signIn(email, password); // Result is used to ensure success
      console.log("Login Result:", result); // Debug to verify result
      toast.success("Login Successful! Welcome to MediCamp."); // Toast on success
      navigate(from, { replace: true });
    } catch (err) {
      console.log("Login Error:", err);
      toast.error(err?.message || "Login failed. Please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      console.log("Google Login Result:", result);
      toast.success("Login Successful! Welcome to MediCamp.");
      navigate(from, { replace: true });
    } catch (err) {
      console.log("Google Login Error:", err);
      toast.error(err?.message || "Google Login failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-teal-50">
      <Card className="w-full max-w-md p-6 rounded-lg shadow-lg bg-white border border-blue-100">
        <div className="mb-6 text-center">
          <Title level={2} className="text-blue-700">
            Medicamp Sign In
          </Title>
          <Text className="text-sm text-gray-600">
            Access your medical account
          </Text>
        </div>
        <Form
          name="login_form"
          onFinish={handleSubmit}
          layout="vertical"
          className="space-y-6"
          requiredMark={false}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              placeholder="Enter your email"
              className="w-full py-2 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password
              placeholder="Enter your password"
              className="w-full py-2 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              className="bg-blue-600 hover:bg-blue-700"
              loading={loading}
            >
              {loading ? (
                <FaStethoscope className="animate-pulse text-lg" />
              ) : (
                "Login"
              )}
            </Button>
          </Form.Item>
        </Form>

        <div className="flex items-center gap-2 my-4">
          <div className="flex-grow h-px bg-gray-300"></div>
          <Text className="text-sm text-gray-600">or continue with</Text>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>
        <Button
          type="default"
          block
          icon={<FcGoogle size={20} />}
          onClick={handleGoogleSignIn}
          className="border-gray-300 hover:border-gray-400"
        >
          Continue with Google
        </Button>
        <Text className="text-center text-sm text-gray-600 mt-4 block">
          Don’t have an account?{" "}
          <Link to="/sign-up" className="text-blue-600 hover:underline">
            Register
          </Link>
        </Text>
      </Card>
    </div>
  );
};

export default SignIn;
