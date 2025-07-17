import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { AuthContext } from "../../Provider/AuthProvider";
import { toast } from "react-toastify";
import { Avatar, Button, Dropdown, Menu, Layout, Space } from "antd";
import { UserOutlined, LogoutOutlined, LoginOutlined } from "@ant-design/icons";
import useUserRole from "../../Hooks/useUserRole";

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

  const menu = (
    <Menu>
      <Menu.Item key="1" disabled>
        {user?.displayName || "User"}
      </Menu.Item>
      <Menu.Item key="2" onClick={() => navigate("/dashboard")}>
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
    `transition duration-200 ${
      pathname === path
        ? "text-blue-800 font-semibold "
        : "text-gray-700 hover:text-blue-600"
    }`;

  return (
    <Header className="!bg-white shadow-sm px-4 flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}
      <div
        className="cursor-pointer text-xl font-bold text-blue-600"
        onClick={() => navigate("/")}
      >
        MediCamp
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-6">
        <Link to="/" className={navLinkClass("/")}>
          Home
        </Link>
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
      </div>

      {/* Auth buttons */}
      <div className="flex items-center gap-4">
        {user ? (
          <Dropdown overlay={menu} placement="bottomRight">
            <Avatar
              src={user.photoURL}
              icon={<UserOutlined />}
              className="cursor-pointer hover:shadow-md"
            />
          </Dropdown>
        ) : (
          <Space>
            <Button
              type={pathname === "/sign-in" ? "primary" : "default"}
              onClick={() => navigate("/sign-in")}
              icon={<LoginOutlined />}
            >
              Sign In
            </Button>
            <Button
              type={pathname === "/sign-up" ? "primary" : "default"}
              onClick={() => navigate("/sign-up")}
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
