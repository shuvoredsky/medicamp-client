import React from "react";
import { Link } from "react-router";
import Lottie from "lottie-react";
import errorLottie from "../../assets/lottie/error.json";

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 px-4 py-10 text-base-content">
      <div className="max-w-xl w-full bg-base-200 shadow-xl rounded-2xl p-8 text-center border border-primary/20">
        <Lottie
          animationData={errorLottie}
          loop={true}
          className="w-64 mx-auto mb-6"
        />
        <h1 className="text-6xl font-extrabold text-primary mb-2">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="opacity-70 mb-6">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="btn btn-primary rounded-full px-8 py-2 font-medium"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
