import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase/firebase-init";
import { AuthContext } from "../../Provider/AuthProvider";
import { toast, ToastContainer } from "react-toastify";
import { Helmet } from "react-helmet-async";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FormProvider, useForm } from "react-hook-form";
import { Input, Button, Card, Typography } from "antd";
import axios from "axios";

const { Title, Text } = Typography;

const SignUp = () => {
  const { createUser, setUser, updateUser } = useContext(AuthContext);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  const methods = useForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = (data) => {
    const { name, photo, email, password } = data;

    createUser(email, password)
      .then((result) => {
        const newUser = result.user;
        toast.success("Register Success!");

        // Update user profile
        return updateUser(newUser, { displayName: name, photoURL: photo });
      })
      .then(() => {
        const newUserInfo = {
          email: email,
          name: name,
          photoURL: photo,
        };
        setUser(newUserInfo);

        // Save user to database
        const userInfo = {
          email: email,
          name: name,
          photoURL: photo,
          role: "user",
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
        };

        return axios.post("http://localhost:3000/users", userInfo);
      })
      .then(() => {
        toast.success("User saved to database!");
        navigate("/sign-in");
      })
      .catch((error) => {
        if (error.message.includes("database")) {
          toast.warn("User registered, but DB save failed.");
          navigate("/sign-in");
        } else {
          toast.error(error.message);
        }
      });
  };

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);

        // Save to database
        const userInfo = {
          email: result.user.email,
          name: result.user.displayName,
          photoURL: result.user.photoURL,
          role: "user",
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
        };

        axios.post("http://localhost:3000/users", userInfo).catch(() => {});

        toast.success("Google Sign In Successful!");
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className="flex items-center justify-center px-4 my-5">
      <Helmet>
        <title>MCMS | Register</title>
      </Helmet>
      <ToastContainer />

      <Card className="w-full max-w-sm shadow-lg">
        <Title level={3} style={{ textAlign: "center" }}>
          Register
        </Title>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block mb-1">Full Name</label>
              <Input
                {...register("name", {
                  required: "Full name is required",
                  minLength: {
                    value: 5,
                    message: "Name must be at least 5 characters",
                  },
                })}
                placeholder="Your Name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-1">Photo URL</label>
              <Input
                {...register("photo", { required: "Photo URL is required" })}
                placeholder="Your Photo URL"
              />
              {errors.photo && (
                <p className="text-red-500 text-sm">{errors.photo.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-1">Email</label>
              <Input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Enter a valid email address",
                  },
                })}
                placeholder="Your Email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-1">Password</label>
              <Input
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/,
                    message:
                      "At least 8 characters, including uppercase, lowercase, and number",
                  },
                })}
                type={showPass ? "text" : "password"}
                placeholder="Password"
                suffix={
                  <span onClick={() => setShowPass(!showPass)}>
                    {showPass ? <FaEyeSlash /> : <FaEye />}
                  </span>
                }
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="primary" htmlType="submit" block className="mb-2">
              Register
            </Button>

            <Button
              type="default"
              block
              icon={<FcGoogle size={20} />}
              onClick={handleGoogleSignIn}
              className="mb-2"
            >
              Sign In with Google
            </Button>

            <Text type="secondary" className="block text-center">
              Already have an account?{" "}
              <Link to="/sign-in">
                <Button type="link">Login</Button>
              </Link>
            </Text>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
};

export default SignUp;
