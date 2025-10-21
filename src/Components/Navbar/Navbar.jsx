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

  // ✨ Updated NavLink Style
  const navLinkClass = (path) =>
    `relative px-3 py-1 transition duration-300 
     ${
       pathname === path
         ? "text-green-400 font-semibold after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-green-400"
         : "text-white hover:text-green-400 hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:w-full hover:after:h-[2px] hover:after:bg-green-400"
     }`;

  return (
    <Header className="[&]:bg-black bg-black shadow-md px-4 flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}
      <div
        className="cursor-pointer flex items-center gap-2"
        onClick={() => navigate("/")}
      >
        <img className="h-10 w-10 rounded-full" src={logo} alt="MediCamp" />
        <span className="text-xl font-bold text-white">MediCamp</span>
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-6">
        <Link to="/" className={navLinkClass("/")}>
          Home
        </Link>
        {role === "user" && (
          <>
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
          </>
        )}
        {role === "organizer" && (
          <>
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
          </>
        )}
        {user && (
          <Link
            to="/available-camps"
            className={navLinkClass("/available-camps")}
          >
            Available Camps
          </Link>
        )}
        {!user && (
          <Link to="/sign-in" className={navLinkClass("/sign-in")}>
            Join Us
          </Link>
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
              className="rounded-lg bg-green-500 text-black hover:bg-white border-none"
            >
              Sign In
            </Button>
            <Button
              type={pathname === "/sign-up" ? "primary" : "default"}
              onClick={() => navigate("/sign-up")}
              className="rounded-lg bg-white text-black hover:bg-white border-none"
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
