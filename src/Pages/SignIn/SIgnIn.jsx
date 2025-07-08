import React, { useRef, useState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../Provider/AuthProvider";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/firebase-init";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet-async";
import { Form, Input, Button, Typography, Card } from "antd";

const { Title, Text } = Typography;

const SignIn = () => {
  const [error, setError] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const emailRef = useRef();
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = (values) => {
    const { email, password } = values;

    signIn(email, password)
      .then(() => {
        toast.success("User Login Successful!");
        navigate("/");
      })
      .catch((error) => {
        setError(error.code);
      });
  };

  const handleForgetPass = () => {
    const email = emailRef.current.input.value.trim();
    setErrorMsg("");
    if (!email) {
      setErrorMsg("Please enter your email address first.");
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast.success("A password reset email has been sent!");
      })
      .catch((error) => {
        setErrorMsg(error.message);
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

        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Enter a valid email!" },
            ]}
          >
            <Input ref={emailRef} placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <div className="text-right mb-2">
            <Button type="link" onClick={handleForgetPass}>
              Forgot password?
            </Button>
          </div>

          {(error || errorMsg) && (
            <Text type="danger" className="block text-center mb-2">
              {error || errorMsg}
            </Text>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>

          <Text type="secondary" className="block text-center">
            Don’t have an account?{" "}
            <Link to="/sign-up">
              <Button type="link">Register</Button>
            </Link>
          </Text>
        </Form>
      </Card>

      <ToastContainer autoClose={3000} position="top-right" theme="colored" />
    </div>
  );
};

export default SignIn;
