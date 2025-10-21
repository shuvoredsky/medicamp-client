import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router"; // Corrected import
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash, FaStethoscope } from "react-icons/fa";
import { toast } from "react-toastify";
import { AuthContext } from "../../Provider/AuthProvider";
import { imageUpload } from "../../api/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const SignUp = () => {
  const { createUser, updateUserProfile, signInWithGoogle, loading, setUser } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const [showPass, setShowPass] = useState(false);

  // Add user to DB
  const addUserToDB = useMutation({
    mutationFn: async (userInfo) => {
      const res = await axiosSecure.post("/users", userInfo);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
    onError: (error) => {
      console.error("Add User to DB Error:", error);
      toast.error("Failed to save user to database.");
    },
  });

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const image = form.image.files[0];

    if (!image) return toast.error("Please select a profile image!");

    try {
      const imageUrl = await imageUpload(image);

      const result = await createUser(email, password);
      const createdUser = result.user;

      await updateUserProfile(name, imageUrl);

      setUser({ ...createdUser, displayName: name, photoURL: imageUrl });

      // Save to DB
      const userInfo = {
        name,
        email,
        photoURL: imageUrl,
        role: "user",
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString(),
      };
      await addUserToDB.mutateAsync(userInfo);

      toast.success("Registration successful! Welcome to MediCamp."); // Toast on success
      navigate("/");
    } catch (err) {
      console.error("Signup Error:", err);
      toast.error(err?.message || "Signup failed. Please try again.");
    }
  };

  // Handle Google Signin
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      const userData = {
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        role: "user",
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString(),
      };
      await addUserToDB.mutateAsync(userData);

      toast.success("Google Signup successful! Welcome to MediCamp."); // Toast on success
      navigate("/");
    } catch (err) {
      console.error("Google Signup Error:", err);
      toast.error(err?.message || "Google Signup failed. Please try again.");
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-teal-50
    "
    >
      <div className="flex flex-col max-w-md w-full p-6 rounded-lg shadow-lg bg-white border border-blue-100 text-gray-800">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold text-teal-700">MediCamp Sign Up</h1>
          <p className="text-sm text-gray-600">Join our medical community</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              placeholder="Your Name"
              className="w-full px-4 py-2 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label
              htmlFor="image"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Profile Image
            </label>
            <input
              type="file"
              name="image"
              id="image"
              accept="image/*"
              required
              className="w-full bg-gray-100 cursor-pointer p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                id="password"
                required
                placeholder="*******"
                className="w-full px-4 py-2 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <span
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-teal-700 text-white font-medium py-2.5 rounded-md hover:bg-blue-700 transition duration-200 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <FaStethoscope className="animate-pulse text-xl" />
            ) : (
              "Register"
            )}
          </button>
        </form>

        <div className="flex items-center gap-2 my-4">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="text-sm text-gray-600">or continue with</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center w-full border border-gray-300 py-2.5 rounded-md gap-2 hover:bg-gray-50 transition duration-200"
        >
          <FcGoogle size={22} /> Continue with Google
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/sign-in" className="text-teal-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
