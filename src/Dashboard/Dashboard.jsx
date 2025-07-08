import React, { useState } from "react";
import { Link } from "react-router";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col sm:flex-row">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-fit bg-red-300 lg:mt-15 shadow-md transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 sm:translate-x-0`}
      >
        <div className="h-full px-4 py-6 space-y-4">
          <h2 className="text-xl font-bold text-blue-600">Dashboard</h2>
          <nav className="space-y-2">
            <Link
              to="dashboard/add-camp"
              className="block font-medium text-black hover:text-blue-600"
            >
              Add Medical Camp
            </Link>

            <a
              href="#"
              className="block font-medium text-black hover:text-blue-600"
            >
              My Camps
            </a>
            <a
              href="#"
              className="block font-medium text-black hover:text-blue-600"
            >
              Manage Users
            </a>
            <a
              href="#"
              className="block font-medium text-black hover:text-blue-600"
            >
              Back to Home
            </a>
          </nav>
        </div>
      </aside>

      {/* Header for mobile */}
      <div className="sm:hidden flex justify-between items-center p-4 shadow-md bg-white z-50">
        <h2 className="text-xl font-bold text-blue-600">Dashboard</h2>
        <button
          onClick={toggleSidebar}
          className="text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Main content */}
      <main className="flex-1 sm:ml-64 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="h-24 bg-gray-100 rounded-md flex justify-center items-center text-gray-500 text-xl">
            + Widget
          </div>
          <div className="h-24 bg-gray-100 rounded-md flex justify-center items-center text-gray-500 text-xl">
            + Widget
          </div>
          <div className="h-24 bg-gray-100 rounded-md flex justify-center items-center text-gray-500 text-xl">
            + Widget
          </div>
        </div>

        <div className="h-48 bg-gray-100 rounded-md flex justify-center items-center text-gray-500 text-xl mb-4">
          + Chart or Summary
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-28 bg-gray-100 rounded-md flex justify-center items-center text-gray-500 text-xl">
            + Data
          </div>
          <div className="h-28 bg-gray-100 rounded-md flex justify-center items-center text-gray-500 text-xl">
            + Data
          </div>
          <div className="h-28 bg-gray-100 rounded-md flex justify-center items-center text-gray-500 text-xl">
            + Data
          </div>
          <div className="h-28 bg-gray-100 rounded-md flex justify-center items-center text-gray-500 text-xl">
            + Data
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
