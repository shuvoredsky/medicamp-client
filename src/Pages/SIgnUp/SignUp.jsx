import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase/firebase-init";
import { AuthContext } from "../../Provider/AuthProvider";
import { toast, ToastContainer } from "react-toastify";
import { Helmet } from "react-helmet-async";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { Form, Input, Button, Card, Typography, Space, Tooltip } from "antd";

const { Title, Text } = Typography;

const SignUp = () => {
  const { createUser, setUser, updateUser } = useContext(AuthContext);
  const [nameError, setNameError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
        toast.success("Google Sign In Successful!");
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleRegister = (values) => {
    const { name, photo, email, password } = values;

    if (name.length < 5) {
      setNameError("Name should be more than 5 characters");
      return;
    } else {
      setNameError("");
    }

    createUser(email, password)
      .then((currentUser) => {
        const newUser = currentUser.user;
        toast.success("Register Success!");

        updateUser({ displayName: name, photoURL: photo })
          .then(() => {
            setUser({ ...newUser, displayName: name, photoURL: photo });
            navigate("/sign-in");
          })
          .catch(() => {
            toast.warn("User updated partially!");
            setUser(newUser);
          });
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className=" flex items-center justify-center px-4 my-5">
      <Helmet>
        <title>MCMS | Register</title>
      </Helmet>
      <ToastContainer />

      <Card className="w-full  max-w-sm shadow-lg">
        <Title level={3} style={{ textAlign: "center" }}>
          Register
        </Title>

        <Form layout="vertical" onFinish={handleRegister} requiredMark={false}>
          <Form.Item
            label="Full Name"
            name="name"
            rules={[
              { required: true, message: "Please enter your full name!" },
              { min: 5, message: "Name must be at least 5 characters." },
            ]}
          >
            <Input placeholder="Your Name" />
          </Form.Item>

          <Form.Item label="Photo URL" name="photo">
            <Input placeholder="Your Photo URL" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Enter a valid email address!" },
            ]}
          >
            <Input placeholder="Your Email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please enter your password!",
              },
              {
                pattern: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/,
                message:
                  "At least 8 characters, including uppercase, lowercase, and number.",
              },
            ]}
          >
            <Input.Password
              placeholder="Password"
              iconRender={(visible) => (visible ? <FaEyeSlash /> : <FaEye />)}
              visibilityToggle={{
                visible: showPass,
                onVisibleChange: setShowPass,
              }}
            />
          </Form.Item>

          {nameError && (
            <Text type="danger" className="block text-center mb-2">
              {nameError}
            </Text>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Register
            </Button>
          </Form.Item>

          <Form.Item>
            <Button
              type="default"
              block
              icon={<FcGoogle size={20} />}
              onClick={handleGoogleSignIn}
            >
              Sign In with Google
            </Button>
          </Form.Item>

          <Text type="secondary" className="block text-center">
            Already have an account?{" "}
            <Link to="/sign-in">
              <Button type="link">Login</Button>
            </Link>
          </Text>
        </Form>
      </Card>
    </div>
  );
};

export default SignUp;
