import React, { useContext } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import { AuthContext } from "../../Provider/AuthProvider";
import { toast } from "react-toastify";
import { FaMapMarkerAlt, FaUser } from "react-icons/fa";
import DarkModeToggle from "./DarkModeToggle";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogOut = () => {
    logOut()
      .then(() => toast.success("Sign out successfully"))
      .catch((error) => toast.error(error.message));
  };

  const navLinks = [["Home", "/"]];

  const activeClass = "border-b-2 border-primary text-primary font-semibold";

  return (
    <header className="sticky top-0 z-50 shadow-md bg-base-100 text-base-content">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="cursor-pointer" onClick={() => navigate("/")}>
            <span className="text-2xl flex items-center font-bold text-primary ml-2">
              WhereIs
              <FaMapMarkerAlt className="ml-1 text-error" />t
            </span>
          </div>

          <nav className="hidden md:flex space-x-6 items-center">
            {navLinks.map(([label, path]) => (
              <NavLink
                key={label}
                to={path}
                className={({ isActive }) =>
                  `text-md px-2 py-1 transition duration-200 ${
                    isActive
                      ? activeClass
                      : "hover:border-b-2 hover:border-secondary"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            {!user ? (
              <NavLink
                to={"/sign-in"}
                className={({ isActive }) =>
                  `text-md px-2 py-1 transition duration-200 ${
                    isActive
                      ? activeClass
                      : "hover:border-b-2 hover:border-secondary"
                  }`
                }
              >
                Join Us
              </NavLink>
            ) : (
              ""
            )}
            {user ? (
              <NavLink
                to={`/my-items/${user?.email}`}
                className={({ isActive }) =>
                  `text-md px-2 py-1 transition duration-200 ${
                    isActive
                      ? activeClass
                      : "hover:border-b-2 hover:border-secondary"
                  }`
                }
              >
                Available Camps
              </NavLink>
            ) : (
              ""
            )}
          </nav>

          <DarkModeToggle />

          {user ? (
            <div className="hidden md:flex items-center space-x-4">
              <details className="dropdown dropdown-end relative">
                <summary className="cursor-pointer list-none">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="User"
                      title={user.displayName || "User"}
                      className="w-10 h-10 rounded-full border-2 border-base-content object-cover hover:scale-105 transition"
                    />
                  ) : (
                    <FaUser size={28} className="text-base-content" />
                  )}
                </summary>
              </details>

              <button
                onClick={handleLogOut}
                className="text-sm  px-3 py-2 font-bold text-white bg-primary hover:bg-error/80 rounded transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => navigate("/sign-in")}
                className={`text-sm ${
                  pathname === "/sign-in"
                    ? "text-primary font-semibold"
                    : "text-base-content"
                }`}
              >
                Sign in
              </button>
              <button
                onClick={() => navigate("/sign-up")}
                className={`text-sm ${
                  pathname === "/sign-up"
                    ? "text-primary font-semibold"
                    : "text-base-content"
                }`}
              >
                Sign up
              </button>
            </div>
          )}

          <div className="md:hidden flex items-center space-x-2">
            {user ? (
              <details className="dropdown dropdown-end relative">
                <summary className="cursor-pointer list-none">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="User"
                      className="w-10 h-10 rounded-full border-2 border-base-content object-cover"
                    />
                  ) : (
                    <FaUser size={24} className="text-base-content" />
                  )}
                </summary>
                <ul className="absolute right-0 top-12 w-48 bg-base-200 shadow-md rounded-md mt-2 divide-y divide-base-content/10 z-50 text-sm">
                  <li>
                    <Link
                      to={"/"}
                      className="block px-4 py-2 hover:bg-base-300"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate("/add-lost-found")}
                      className="block w-full text-left px-4 py-2 hover:bg-base-300"
                    >
                      Add Lost Found
                    </button>
                  </li>
                  <li>
                    <Link
                      to={`/my-items/${user?.email}`}
                      className="block px-4 py-2 hover:bg-base-300"
                    >
                      My Items
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/allRecovered"}
                      className="block px-4 py-2 hover:bg-base-300"
                    >
                      Recovered
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/allItems"}
                      className="block px-4 py-2 hover:bg-base-300"
                    >
                      All Lost & Found Items
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogOut}
                      className="block w-full text-left px-4 py-2 hover:bg-error/20 text-error"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </details>
            ) : (
              <>
                <button
                  onClick={() => navigate("/sign-in")}
                  className={`text-sm ${
                    pathname === "/sign-in"
                      ? "text-primary font-semibold"
                      : "text-base-content"
                  }`}
                >
                  Sign in
                </button>
                <button
                  onClick={() => navigate("/sign-up")}
                  className={`text-sm ${
                    pathname === "/sign-up"
                      ? "text-primary font-semibold"
                      : "text-base-content"
                  }`}
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
