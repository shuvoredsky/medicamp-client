import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { AuthContext } from "../../Provider/AuthProvider";
import { toast } from "react-toastify";
import { Avatar, Button, Dropdown, Menu, Layout, Space } from "antd";
import { UserOutlined, LogoutOutlined, LoginOutlined } from "@ant-design/icons";
import useUserRole from "../../Hooks/useUserRole";
import logo from "../../assets/logo.png";

const { Header } = Layout;

const Navbar = () => {
  const { role } = useUserRole();
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogOut = () => {
    logOut()
      .then(() => toast.success("Sign out successfully"))
      .catch((error) => toast.error(error.message));
  };

  const handleDashboardNavigate = () => {
    if (role === "user") {
      navigate("/dashboard/analytics");
    } else {
      navigate("/dashboard/organizer-profile");
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" disabled>
        {user?.displayName || "User"}
      </Menu.Item>
      <Menu.Item key="2" onClick={handleDashboardNavigate}>
        Dashboard
      </Menu.Item>
      <Menu.Item
        key="3"
        danger
        icon={<LogoutOutlined />}
        onClick={handleLogOut}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  const navLinkClass = (path) =>
    `px-3 py-1 rounded-md transition duration-200 ${
      pathname === path
        ? "bg-white text-teal-700 font-semibold"
        : "text-white hover:bg-teal-700/80"
    }`;

  return (
    <Header className="bg-gradient-to-r from-teal-600 to-teal-700 shadow-md px-4 flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}
      <div
        className="cursor-pointer flex items-center gap-2"
        onClick={() => navigate("/")}
      >
        <img className="h-10 w-10 rounded-full" src={logo} alt="MediCamp" />
        <span className="text-xl font-bold text-white">MediCamp</span>
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-4">
        <Link to="/" className={navLinkClass("/")}>
          Home
        </Link>
        <div>
          {role === "user" ? (
            <div>
              <Link
                to="/dashboard/profile"
                className={navLinkClass("/dashboard/profile")}
              >
                Profile
              </Link>
              <Link
                to="/dashboard/registered-camps"
                className={navLinkClass("/dashboard/registered-camps")}
              >
                My Registered Camps
              </Link>
            </div>
          ) : role === "organizer" ? (
            <div>
              <Link
                to="/dashboard/organizer-profile"
                className={navLinkClass("/dashboard/organizer-profile")}
              >
                Profile
              </Link>
              <Link
                to="/dashboard/add-camp"
                className={navLinkClass("/dashboard/add-camp")}
              >
                Add a Camp
              </Link>
            </div>
          ) : (
            ""
          )}
        </div>
        {user && (
          <Link
            to="/available-camps"
            className={navLinkClass("/available-camps")}
          >
            Available Camps
          </Link>
        )}
        {!user && (
          <div>
            <Link to="/sign-in" className={navLinkClass("/sign-in")}>
              Join Us
            </Link>
          </div>
        )}
        <Link to="/contact-us" className={navLinkClass("/contact-us")}>
          Contact Us
        </Link>
      </div>

      {/* Auth buttons */}
      <div className="flex items-center gap-4">
        {user ? (
          <Dropdown overlay={menu} placement="bottomRight">
            <Avatar
              src={user.photoURL}
              icon={<UserOutlined />}
              className="cursor-pointer hover:ring-2 hover:ring-white transition"
            />
          </Dropdown>
        ) : (
          <Space>
            <Button
              type={pathname === "/sign-in" ? "primary" : "default"}
              onClick={() => navigate("/sign-in")}
              icon={<LoginOutlined />}
              className="rounded-lg"
            >
              Sign In
            </Button>
            <Button
              type={pathname === "/sign-up" ? "primary" : "default"}
              onClick={() => navigate("/sign-up")}
              className="rounded-lg"
            >
              Sign Up
            </Button>
          </Space>
        )}
      </div>
    </Header>
  );
};

export default Navbar;
