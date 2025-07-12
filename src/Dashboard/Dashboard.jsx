import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import { AuthContext } from "../Provider/AuthProvider";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [role, setRole] = useState(null);
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        if (user?.email) {
          const res = await axiosSecure.get(`/users/role/${user.email}`);
          setRole(res.data?.role);

          // Redirect based on role
          if (res.data?.role === "user") {
            navigate("/dashboard/analytics");
          } else if (res.data?.role === "organizer") {
            navigate("/dashboard/add-camp");
          }
        }
      } catch (error) {
        console.error("Failed to fetch role:", error);
      }
    };

    fetchUserRole();
  }, [user?.email, axiosSecure, navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col sm:flex-row">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-full bg-blue-50 shadow-md transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 sm:translate-x-0 sm:relative sm:h-auto sm:z-0`}
      >
        <div className="h-full px-4 py-6 space-y-4">
          <h2 className="text-xl font-bold text-blue-600">Dashboard</h2>
          <nav className="space-y-2">
            {role === "organizer" && (
              <>
                <Link
                  to="add-camp"
                  className="block font-medium text-black hover:text-blue-600"
                >
                  Add A Camp
                </Link>
                <Link
                  to="manage-camps"
                  className="block font-medium text-black hover:text-blue-600"
                >
                  Manage Camps
                </Link>
                <Link
                  to="manage-registered-camps"
                  className="block font-medium text-black hover:text-blue-600"
                >
                  Manage Registered Camps
                </Link>
              </>
            )}

            {role === "user" && (
              <>
                <Link
                  to="analytics"
                  className="block font-medium text-black hover:text-blue-600"
                >
                  Analytics
                </Link>
                <Link
                  to="participant-profile"
                  className="block font-medium text-black hover:text-blue-600"
                >
                  Participant Profile
                </Link>
                <Link
                  to="registered-camps"
                  className="block font-medium text-black hover:text-blue-600"
                >
                  Registered Camps
                </Link>
                <Link
                  to="payment-history"
                  className="block font-medium text-black hover:text-blue-600"
                >
                  Payment History
                </Link>
              </>
            )}
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
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
