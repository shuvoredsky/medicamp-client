import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase/firebase-init";
import { AuthContext } from "../../Provider/AuthProvider";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FcGoogle } from "react-icons/fc";
import { Helmet } from "react-helmet-async";

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

  const handleRegister = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const photo = form.photo.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;

    if (name.length < 5) {
      setNameError("Name should be more than 5 characters");
      return;
    } else {
      setNameError("");
    }

    createUser(email, password)
      .then((currentUser) => {
        const newUser = currentUser.user;
        if (newUser) {
          toast.success("Register Success!");
          e.target.reset();
        }
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
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 pb-20 lg:pt-5">
      <Helmet>
        <title>WhereIsIt | Register</title>
      </Helmet>
      <ToastContainer />
      <div className="bg-base-100 border border-base-300 shadow-xl rounded-2xl p-8 w-full max-w-sm text-base-content">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        <form onSubmit={handleRegister} className="space-y-4" noValidate>
          <div>
            <label htmlFor="name" className="block mb-1 font-semibold">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Full Name"
              className="input input-bordered w-full"
              required
              minLength={5}
            />
            {nameError && (
              <p className="text-xs text-error mt-1">{nameError}</p>
            )}
          </div>

          <div>
            <label htmlFor="photo" className="block mb-1 font-semibold">
              Photo URL
            </label>
            <input
              id="photo"
              name="photo"
              type="url"
              placeholder="Photo URL"
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 font-semibold">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-semibold">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPass ? "text" : "password"}
                placeholder="Password"
                className="input input-bordered w-full pr-10"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="At least 8 characters, with uppercase, lowercase, and number"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-3 text-gray-500"
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Register
          </button>

          <button
            type="button"
            className="btn btn-outline w-full flex items-center justify-center gap-2"
            onClick={handleGoogleSignIn}
          >
            <FcGoogle size={24} /> Sign In with Google
          </button>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link to="/sign-in" className="link text-primary">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
