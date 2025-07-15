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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header for all devices */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center z-50">
        <button
          onClick={toggleSidebar}
          className="text-gray-600 md:hidden focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
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
      </header>

      {/* Sidebar */}
      <div className="flex flex-1">
        <aside
          className={`bg-blue-50 shadow-md transform transition-transform duration-300 ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          } w-64 fixed md:static top-0 left-0 h-full z-40 md:z-0`}
        >
          <div className="h-full px-4 py-6 space-y-4 overflow-y-auto">
            <h2 className="text-xl font-bold text-blue-600 hidden md:block">
              Dashboard
            </h2>
            <nav className="space-y-2">
              {role === "organizer" && (
                <>
                  <Link
                    to="add-camp"
                    className="block font-medium text-black hover:text-blue-600 py-2"
                  >
                    Add A Camp
                  </Link>
                  <Link
                    to="manage-camps"
                    className="block font-medium text-black hover:text-blue-600 py-2"
                  >
                    Manage Camps
                  </Link>
                  <Link
                    to="manage-registered-camps"
                    className="block font-medium text-black hover:text-blue-600 py-2"
                  >
                    Manage Registered Camps
                  </Link>
                </>
              )}

              {role === "user" && (
                <>
                  <Link
                    to="analytics"
                    className="block font-medium text-black hover:text-blue-600 py-2"
                  >
                    Analytics
                  </Link>
                  <Link
                    to="profile"
                    className="block font-medium text-black hover:text-blue-600 py-2"
                  >
                    Participant Profile
                  </Link>
                  <Link
                    to="registered-camps"
                    className="block font-medium text-black hover:text-blue-600 py-2"
                  >
                    Registered Camps
                  </Link>
                  <Link
                    to="payment-history"
                    className="block font-medium text-black hover:text-blue-600 py-2"
                  >
                    Payment History
                  </Link>
                </>
              )}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
